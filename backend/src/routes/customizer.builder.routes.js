import express from 'express';
import { protect, verifyRoles } from '../middlewares/auth.middleware.js';
import { logAdminActivity } from '../middlewares/security.middleware.js';
import {
  adminGetAllFlows,
  adminCreateFlow,
  adminGetFlowById,
  adminUpdateFlow,
  adminSoftDeleteFlow,
  adminGetStepsByFlow,
  adminCreateStep,
  adminReorderSteps,
  adminUpdateStep,
  adminSoftDeleteStep,
  adminCreateOptionLayer,
  adminUpdateOptionLayer,
  adminSoftDeleteOptionLayer,
  clientGetLivePreview
} from '../controllers/customizer.builder.controller.js';

const router = express.Router();

// ============================================================================
// PUBLIC / CLIENT ENDPOINTS
// ============================================================================
// Live Preview synchronization for real-time mobile/desktop customizer rendering
router.get('/client/live-preview/:flowId', clientGetLivePreview);
router.get('/live-preview/:flowId', clientGetLivePreview);

// ============================================================================
// ADMIN / ATELIER BUILDER ENDPOINTS (Strict RBAC Protected)
// ============================================================================
router.use(protect);
router.use(verifyRoles('superadmin', 'admin', 'staff'));

// 1. Flow Pipelines
router
  .route('/flows')
  .get(adminGetAllFlows)
  .post(
    verifyRoles('superadmin', 'admin'),
    logAdminActivity('CREATE_CUSTOMIZER_FLOW', 'CustomizerFlow'),
    adminCreateFlow
  );

router
  .route('/flows/:id')
  .get(adminGetFlowById)
  .put(
    verifyRoles('superadmin', 'admin'),
    logAdminActivity('UPDATE_CUSTOMIZER_FLOW', 'CustomizerFlow'),
    adminUpdateFlow
  )
  .delete(
    verifyRoles('superadmin', 'admin'),
    logAdminActivity('ARCHIVE_CUSTOMIZER_FLOW', 'CustomizerFlow'),
    adminSoftDeleteFlow
  );

// 2. Step Navigation & Drag-and-Drop Ordering
router.get('/steps/:flowId', adminGetStepsByFlow);

router.post(
  '/steps',
  verifyRoles('superadmin', 'admin'),
  logAdminActivity('CREATE_CUSTOMIZER_STEP', 'CustomizerStep'),
  adminCreateStep
);

router.put(
  '/steps/reorder',
  verifyRoles('superadmin', 'admin'),
  logAdminActivity('REORDER_CUSTOMIZER_STEPS', 'CustomizerStep'),
  adminReorderSteps
);

router
  .route('/steps/:stepId')
  .put(
    verifyRoles('superadmin', 'admin'),
    logAdminActivity('UPDATE_CUSTOMIZER_STEP', 'CustomizerStep'),
    adminUpdateStep
  )
  .delete(
    verifyRoles('superadmin', 'admin'),
    logAdminActivity('ARCHIVE_CUSTOMIZER_STEP', 'CustomizerStep'),
    adminSoftDeleteStep
  );

// 3. Option Layers & Conditional Rules
router.post(
  '/layers',
  verifyRoles('superadmin', 'admin'),
  logAdminActivity('CREATE_OPTION_LAYER', 'OptionLayer'),
  adminCreateOptionLayer
);

router
  .route('/layers/:layerId')
  .put(
    verifyRoles('superadmin', 'admin'),
    logAdminActivity('UPDATE_OPTION_LAYER', 'OptionLayer'),
    adminUpdateOptionLayer
  )
  .delete(
    verifyRoles('superadmin', 'admin'),
    logAdminActivity('ARCHIVE_OPTION_LAYER', 'OptionLayer'),
    adminSoftDeleteOptionLayer
  );

export default router;
