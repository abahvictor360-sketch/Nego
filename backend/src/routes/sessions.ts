import { Router } from 'express';
import { createSession, sendMessage, getSession, listSessions } from '../controllers/sessionController';
import { apiKeyAuth } from '../middleware/apiKeyAuth';

const router = Router();

router.use(apiKeyAuth);

router.get('/', listSessions);
router.post('/', createSession);
router.get('/:id', getSession);
router.post('/:id/message', sendMessage);

export default router;
