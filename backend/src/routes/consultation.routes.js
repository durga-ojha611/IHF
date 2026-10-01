import express from 'express';
import {
  createConsultation,
  adminGetConsultations,
  adminGetConsultationById,
  adminUpdateConsultation,
  adminSoftDeleteConsultation,
  adminRestoreConsultation
} from '../controllers/consultation.controller.js';

const router = express.Router();

// Storefront Public Consultation Booking
router.post('/', createConsultation);

// Direct / Storefront & Staff consultation access
router.get('/', adminGetConsultations);
router.get('/:id', adminGetConsultationById);
router.patch('/:id', adminUpdateConsultation);
router.delete('/:id', adminSoftDeleteConsultation);
router.patch('/:id/restore', adminRestoreConsultation);

export default router;
