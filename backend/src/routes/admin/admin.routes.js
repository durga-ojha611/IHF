import express from 'express';

import { protect, authorize } from '../../middlewares/auth.middleware.js';
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
router.use(authorize('admin', 'staff'));

// ---------------------------------------------
// 1. User & Staff Management (`/api/admin/users`)
// ---------------------------------------------
router.get('/users', userCtrl.adminGetAllUsers);
router.get('/users/:id', userCtrl.adminGetUserById);
router.patch('/users/:id/role', authorize('admin'), userCtrl.adminUpdateUserRole);
router.delete('/users/:id', authorize('admin'), userCtrl.adminSoftDeleteUser);
router.patch('/users/:id/restore', authorize('admin'), userCtrl.adminRestoreUser);

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
router.post('/products', prodCtrl.adminCreateProduct);
router.patch('/products/:id', prodCtrl.adminUpdateProduct);
router.delete('/products/:id', checkProductCanBeDeleted, prodCtrl.adminDeleteProduct);
router.patch('/products/:id/restore', prodCtrl.adminRestoreProduct);

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
router.patch('/swatch-orders/:id/status', swatchCtrl.adminUpdateSwatchOrderStatus);

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
router.patch('/orders/:id/fulfillment', orderCtrl.adminUpdateFulfillmentStatus);
router.delete('/orders/:id', orderCtrl.adminSoftDeleteOrder);

export default router;
