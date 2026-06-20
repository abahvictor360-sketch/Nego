import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/apiKeyAuth';
import { notify, notifyAdmins } from '../lib/notify';

const createTicketSchema = z.object({
  subject: z.string().min(3).max(150),
  message: z.string().min(1).max(5000),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
});

// User: create a ticket (with first message)
export async function createTicket(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = createTicketSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }
  const { subject, message, priority } = result.data;

  const ticket = await prisma.supportTicket.create({
    data: {
      merchantId: req.merchant!.id,
      subject,
      priority,
      messages: { create: { authorRole: 'merchant', body: message } },
    },
    include: { messages: true },
  });

  // Alert all admins that a new ticket was opened.
  await notifyAdmins({
    type: 'new_ticket',
    title: 'New support ticket',
    body: `${req.merchant!.name}: ${subject}`,
    link: '/admin/dashboard/support',
  });

  res.status(201).json(ticket);
}

// User: list own tickets
export async function listMyTickets(req: AuthenticatedRequest, res: Response): Promise<void> {
  const tickets = await prisma.supportTicket.findMany({
    where: { merchantId: req.merchant!.id },
    orderBy: { updatedAt: 'desc' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  res.json(tickets);
}

// Admin: list all tickets
export async function listAllTickets(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const tickets = await prisma.supportTicket.findMany({
    orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    include: {
      merchant: { select: { name: true, email: true, plan: true } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });
  res.json(tickets);
}

// Shared: get a single ticket. Admins see any; users see only their own.
export async function getTicket(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = req.params.id as string;
  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      merchant: { select: { id: true, name: true, email: true, plan: true } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }
  if (req.merchant!.role !== 'admin' && ticket.merchantId !== req.merchant!.id) {
    res.status(403).json({ error: 'Not your ticket' });
    return;
  }
  res.json(ticket);
}

const replySchema = z.object({ body: z.string().min(1).max(5000) });

// Shared: post a reply. Author role is derived from the authenticated account.
export async function replyToTicket(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = req.params.id as string;
  const result = replySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Message body is required' });
    return;
  }

  const ticket = await prisma.supportTicket.findUnique({ where: { id }, select: { merchantId: true } });
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  const isAdmin = req.merchant!.role === 'admin';
  if (!isAdmin && ticket.merchantId !== req.merchant!.id) {
    res.status(403).json({ error: 'Not your ticket' });
    return;
  }

  // An admin reply moves it to "pending" (awaiting user); a user reply re-opens it.
  await prisma.ticketMessage.create({
    data: { ticketId: id, authorRole: isAdmin ? 'admin' : 'merchant', body: result.data.body },
  });
  const updated = await prisma.supportTicket.update({
    where: { id },
    data: { status: isAdmin ? 'pending' : 'open' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  // An admin reply notifies the merchant; a merchant reply notifies admins.
  if (isAdmin) {
    await notify({
      merchantId: ticket.merchantId,
      type: 'ticket_reply',
      title: 'Support replied to your ticket',
      body: result.data.body.slice(0, 120),
      link: '/dashboard/support',
    });
  } else {
    await notifyAdmins({
      type: 'ticket_reply',
      title: 'New reply on a ticket',
      body: `${req.merchant!.name} replied`,
      link: '/admin/dashboard/support',
    });
  }

  res.json(updated);
}

const statusSchema = z.object({ status: z.enum(['open', 'pending', 'closed']) });

// Admin: change ticket status (e.g. close it)
export async function updateTicketStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = req.params.id as string;
  const result = statusSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }
  const updated = await prisma.supportTicket.update({
    where: { id },
    data: { status: result.data.status },
  });
  res.json(updated);
}
