import express from 'express';
import { getPublicNavigation } from '../controllers/navigation.controller.js';

const router = express.Router();

router.get('/', getPublicNavigation);

export default router;
