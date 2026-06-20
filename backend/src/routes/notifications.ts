import { Router } from 'express';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { listNotifications, unreadCount, markRead, markAllRead } from '../controllers/notificationController';

const router = Router();

// Works for both merchants and admins (notifications are per-account).
router.use(apiKeyAuth);

router.get('/', listNotifications);
router.get('/unread-count', unreadCount);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);

export default router;
