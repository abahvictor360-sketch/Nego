import { Router } from 'express';
import { createMerchant, getMerchantProfile, loginMerchant } from '../controllers/merchantController';
import { apiKeyAuth } from '../middleware/apiKeyAuth';

const router = Router();

// Public: register a new merchant (returns API key once)
router.post('/', createMerchant);

// Public: login — returns merchant info + apiKey
router.post('/login', loginMerchant);

// Protected: view your own profile
router.get('/me', apiKeyAuth, getMerchantProfile);

export default router;
