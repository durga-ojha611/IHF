import express from 'express';
import {
  getPublishedBlogs,
  getBlogBySlug
} from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/', getPublishedBlogs);
router.get('/:slug', getBlogBySlug);

export default router;
