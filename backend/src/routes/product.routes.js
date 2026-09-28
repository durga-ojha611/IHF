import express from 'express';
import {
  getAllProducts,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);

export default router;
