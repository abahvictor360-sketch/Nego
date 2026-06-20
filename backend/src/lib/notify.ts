import { prisma } from './prisma';

type NotificationType =
  | 'ticket_reply'
  | 'new_ticket'
  | 'plan_changed'
  | 'account_suspended'
  | 'account_restored'
  | 'system';

interface NotifyInput {
  merchantId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
}

/** Create an in-app notification. Never throws — notifications are best-effort. */
export async function notify(input: NotifyInput): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        merchantId: input.merchantId,
        type: input.type,
        title: input.title,
        body: input.body,
        link: input.link,
      },
    });
  } catch (err) {
    console.error('[NOTIFY] failed:', (err as Error).message);
  }
}

/** Notify every admin (used for platform-wide events like a new support ticket). */
export async function notifyAdmins(input: Omit<NotifyInput, 'merchantId'>): Promise<void> {
  try {
    const admins = await prisma.merchant.findMany({ where: { role: 'admin' }, select: { id: true } });
    await prisma.notification.createMany({
      data: admins.map(a => ({
        merchantId: a.id,
        type: input.type,
        title: input.title,
        body: input.body,
        link: input.link,
      })),
    });
  } catch (err) {
    console.error('[NOTIFY] admin notify failed:', (err as Error).message);
  }
}
