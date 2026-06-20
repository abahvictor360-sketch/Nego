import { Router } from 'express';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { adminAuth } from '../middleware/adminAuth';
import { listUsers, updateUser, billingOverview } from '../controllers/adminController';
import { listAllTickets, getTicket, replyToTicket, updateTicketStatus } from '../controllers/ticketController';
import { getEmailSettings, updateEmailSettings, sendTestEmail } from '../controllers/settingsController';

const router = Router();

// All admin routes require a valid API key AND admin role.
router.use(apiKeyAuth, adminAuth);

// Users
router.get('/users', listUsers);
router.patch('/users/:id', updateUser); // { plan?, status? }

// Billing
router.get('/billing', billingOverview);

// Support tickets (admin view)
router.get('/tickets', listAllTickets);
router.get('/tickets/:id', getTicket);
router.post('/tickets/:id/reply', replyToTicket);
router.patch('/tickets/:id/status', updateTicketStatus);

// Email / SMTP settings
router.get('/email-settings', getEmailSettings);
router.put('/email-settings', updateEmailSettings);
router.post('/email-settings/test', sendTestEmail);

export default router;
