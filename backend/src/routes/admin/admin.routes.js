import express from 'express';

import { protect, authorize, verifyRoles } from '../../middlewares/auth.middleware.js';
import { logAdminActivity } from '../../middlewares/security.middleware.js';
import ActivityLog from '../../models/ActivityLog.js';
import {
  checkCategoryCanBeDeleted,
  checkProductCanBeDeleted,
  checkFilterCanBeDeleted
} from '../../middlewares/safety.middleware.js';

// Controllers
import * as userCtrl from '../../controllers/user.controller.js';
import * as navCtrl from '../../controllers/navigation.controller.js';
import * as catCtrl from '../../controllers/category.controller.js';
import * as prodCtrl from '../../controllers/product.controller.js';
import * as filterCtrl from '../../controllers/filter.controller.js';
import * as blogCtrl from '../../controllers/blog.controller.js';
import * as swatchCtrl from '../../controllers/swatch.controller.js';
import * as customizerCtrl from '../../controllers/customizer.controller.js';
import * as orderCtrl from '../../controllers/order.controller.js';

const router = express.Router();

// Enforce authentication & RBAC for all Admin endpoints
router.use(protect);
router.use(verifyRoles('admin', 'staff', 'superadmin'));

// ---------------------------------------------
// 1. User & Staff Management (`/api/admin/users`)
// ---------------------------------------------
router.get('/users', userCtrl.adminGetAllUsers);
router.get('/users/:id', userCtrl.adminGetUserById);
router.patch('/users/:id/role', verifyRoles('admin', 'superadmin'), logAdminActivity('ROLE_CHANGE', 'User'), userCtrl.adminUpdateUserRole);
router.delete('/users/:id', verifyRoles('admin', 'superadmin'), logAdminActivity('DELETE_RESOURCE', 'User'), userCtrl.adminSoftDeleteUser);
router.patch('/users/:id/restore', verifyRoles('admin', 'superadmin'), logAdminActivity('UPDATE_RESOURCE', 'User'), userCtrl.adminRestoreUser);

// ---------------------------------------------
// 2. Dynamic Navigation (`/api/admin/navigation`)
// ---------------------------------------------
router.get('/navigation', navCtrl.adminGetNavigation);
router.post('/navigation', navCtrl.adminCreateNavigation);
router.patch('/navigation/reorder', navCtrl.adminReorderNavigation);
router.patch('/navigation/:id', navCtrl.adminUpdateNavigation);
router.delete('/navigation/:id', navCtrl.adminDeleteNavigation);

// ---------------------------------------------
// 3. Categories Management (`/api/admin/categories`)
// ---------------------------------------------
router.get('/categories', catCtrl.adminGetAllCategories);
router.post('/categories', catCtrl.adminCreateCategory);
router.patch('/categories/:id', catCtrl.adminUpdateCategory);
router.delete('/categories/:id', checkCategoryCanBeDeleted, catCtrl.adminDeleteCategory);

// ---------------------------------------------
// 4. Products Catalog Management (`/api/admin/products`)
// ---------------------------------------------
router.get('/products', prodCtrl.adminGetAllProducts);
router.get('/products/:id', prodCtrl.adminGetProductById);
router.post('/products', logAdminActivity('CREATE_RESOURCE', 'Product'), prodCtrl.adminCreateProduct);
router.patch('/products/:id', logAdminActivity('PRICE_UPDATE', 'Product'), prodCtrl.adminUpdateProduct);
router.delete('/products/:id', checkProductCanBeDeleted, logAdminActivity('DELETE_RESOURCE', 'Product'), prodCtrl.adminDeleteProduct);
router.patch('/products/:id/restore', logAdminActivity('UPDATE_RESOURCE', 'Product'), prodCtrl.adminRestoreProduct);

// ---------------------------------------------
// 5. Dynamic Sidebar Filters (`/api/admin/filters`)
// ---------------------------------------------
router.get('/filters', filterCtrl.adminGetAllFilters);
router.post('/filters', filterCtrl.adminCreateFilter);
router.patch('/filters/:id', filterCtrl.adminUpdateFilter);
router.delete('/filters/:id', checkFilterCanBeDeleted, filterCtrl.adminDeleteFilter);

// ---------------------------------------------
// 6. Editorial Blogs Management (`/api/admin/blogs`)
// ---------------------------------------------
router.get('/blogs', blogCtrl.adminGetAllBlogs);
router.post('/blogs', blogCtrl.adminCreateBlog);
router.patch('/blogs/:id', blogCtrl.adminUpdateBlog);
router.delete('/blogs/:id', blogCtrl.adminDeleteBlog);

// ---------------------------------------------
// 7. Swatches Engine & Orders (`/api/admin/swatches`, `/api/admin/swatch-orders`)
// ---------------------------------------------
router.get('/swatches', swatchCtrl.adminGetAllSwatches);
router.post('/swatches', swatchCtrl.adminCreateSwatch);
router.patch('/swatches/:id', swatchCtrl.adminUpdateSwatch);
router.delete('/swatches/:id', swatchCtrl.adminDeleteSwatch);
router.get('/swatch-orders', swatchCtrl.adminGetSwatchOrders);
router.patch('/swatch-orders/:id/status', logAdminActivity('ORDER_STATUS_UPDATE', 'SwatchOrder'), swatchCtrl.adminUpdateSwatchOrderStatus);

// ---------------------------------------------
// 8. Customizer Engine Rules (`/api/admin/customizer`)
// ---------------------------------------------
router.get('/customizer', customizerCtrl.adminGetAllRules);
router.get('/customizer/:id', customizerCtrl.adminGetRuleById);
router.post('/customizer', customizerCtrl.adminCreateRule);
router.patch('/customizer/:id', customizerCtrl.adminUpdateRule);
router.delete('/customizer/:id', customizerCtrl.adminDeleteRule);

// ---------------------------------------------
// 9. Orders & Manufacturing Fulfillment (`/api/admin/orders`)
// ---------------------------------------------
router.get('/orders', orderCtrl.adminGetAllOrders);
router.get('/orders/:id', orderCtrl.adminGetOrderById);
router.patch('/orders/:id/fulfillment', logAdminActivity('ORDER_STATUS_UPDATE', 'Order'), orderCtrl.adminUpdateFulfillmentStatus);
router.delete('/orders/:id', logAdminActivity('DELETE_RESOURCE', 'Order'), orderCtrl.adminSoftDeleteOrder);

// ---------------------------------------------
// 10. Security Audit Activity Logs (`/api/admin/activity-logs`)
// ---------------------------------------------
router.get('/activity-logs', verifyRoles('admin', 'superadmin'), async (req, res) => {
  const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: {
      logs
    }
  });
});

export default router;
