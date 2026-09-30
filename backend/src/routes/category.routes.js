import express from 'express';
import {
  getPublicCategories,
  getCategoryBySlug,
  getCategoryStorefront
} from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', getPublicCategories);
router.get('/:slug/storefront', getCategoryStorefront);
router.get('/:slug', getCategoryBySlug);

export default router;
