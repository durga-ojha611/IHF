import express from 'express';
import {
  getActiveRules,
  calculatePrice
} from '../controllers/customizer.controller.js';

const router = express.Router();

router.get('/rules', getActiveRules);
router.post('/calculate-price', calculatePrice);

export default router;
