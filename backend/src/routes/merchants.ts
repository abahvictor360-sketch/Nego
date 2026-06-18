import { Router } from 'express';
import { createMerchant, getMerchantProfile, loginMerchant, changePassword } from '../controllers/merchantController';
import { loginLimiter } from '../middleware/rateLimiter';
import { apiKeyAuth } from '../middleware/apiKeyAuth';

const router = Router();

// Public: register a new merchant (returns API key once)
router.post('/', createMerchant);

// Public: login — returns merchant info + apiKey
router.post('/login', loginLimiter, loginMerchant);

// Protected: view your own profile
router.get('/me', apiKeyAuth, getMerchantProfile);

// Protected: change password
router.patch('/me/password', apiKeyAuth, changePassword);

export default router;
