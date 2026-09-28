import express from 'express';
import { getDynamicFilters } from '../controllers/filter.controller.js';

const router = express.Router();

router.get('/', getDynamicFilters);

export default router;
