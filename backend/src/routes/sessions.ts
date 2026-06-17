import { Router } from 'express';
import { createSession, sendMessage, getSession, listSessions } from '../controllers/sessionController';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { messageLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(apiKeyAuth);

router.get('/', listSessions);
router.post('/', createSession);
router.get('/:id', getSession);
router.post('/:id/message', messageLimiter, sendMessage);

export default router;
