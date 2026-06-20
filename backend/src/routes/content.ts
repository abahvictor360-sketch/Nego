import { Router } from 'express';
import { getContent, updateContent } from '../controllers/contentController';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

// Public: anyone (the landing site) can read content + SEO.
router.get('/', getContent);

// Admin only: edit all website text + SEO.
router.put('/', apiKeyAuth, adminAuth, updateContent);

export default router;
