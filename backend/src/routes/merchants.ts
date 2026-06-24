import { Router } from 'express';
import { createMerchant, getMerchantProfile, updateMerchantProfile, listAllMerchants, loginMerchant, changePassword, forgotPassword, resetPassword } from '../controllers/merchantController';
import { loginLimiter } from '../middleware/rateLimiter';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

// Public: register a new merchant (returns API key once)
router.post('/', createMerchant);

// Public: login — returns merchant info + apiKey
router.post('/login', loginLimiter, loginMerchant);

// Public: password reset
router.post('/forgot-password', loginLimiter, forgotPassword);
router.post('/reset-password', loginLimiter, resetPassword);

// Protected: view your own profile
router.get('/me', apiKeyAuth, getMerchantProfile);

// Protected: update bot name / language
router.patch('/me', apiKeyAuth, updateMerchantProfile);

// Protected: change password
router.patch('/me/password', apiKeyAuth, changePassword);

// Admin only: list all merchants (role enforced by middleware + controller)
router.get('/all', apiKeyAuth, adminAuth, listAllMerchants);

export default router;
