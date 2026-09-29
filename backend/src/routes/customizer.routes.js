import express from 'express';
import {
  getActiveRules,
  calculatePrice,
  getCustomizerFabrics,
  getCustomizerFilters,
  adminCreateFabricOption
} from '../controllers/customizer.controller.js';

const router = express.Router();

router.get('/rules', getActiveRules);
router.post('/calculate-price', calculatePrice);
router.get('/fabrics', getCustomizerFabrics);
router.get('/filters', getCustomizerFilters);
router.post('/fabrics', adminCreateFabricOption);

export default router;
