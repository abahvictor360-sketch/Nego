import { Router } from 'express';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { createTicket, listMyTickets, getTicket, replyToTicket } from '../controllers/ticketController';

const router = Router();

// Merchant-facing support tickets. Requires a valid API key.
router.use(apiKeyAuth);

router.post('/', createTicket);
router.get('/', listMyTickets);
router.get('/:id', getTicket);
router.post('/:id/reply', replyToTicket);

export default router;
