import { Router } from 'express';
import { getContent, updateContent } from '../controllers/contentController';
import { apiKeyAuth } from '../middleware/apiKeyAuth';

const router = Router();

router.get('/', getContent);
router.put('/', apiKeyAuth, updateContent);

export default router;
