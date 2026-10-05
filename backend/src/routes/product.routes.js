import express from 'express';
import {
  getAllProducts,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  addProductReview
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);
router.post('/:id/reviews', addProductReview);

export default router;

