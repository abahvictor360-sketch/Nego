import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { apiKeyAuth } from '../middleware/apiKeyAuth';

const router = Router();

// All product routes require a valid merchant API key
router.use(apiKeyAuth);

router.get('/', listProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
