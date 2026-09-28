import express from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import navigationRoutes from './navigation.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import filterRoutes from './filter.routes.js';
import blogRoutes from './blog.routes.js';
import swatchRoutes from './swatch.routes.js';
import customizerRoutes from './customizer.routes.js';
import orderRoutes from './order.routes.js';
import adminRoutes from './admin/admin.routes.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'IHF Luxury Draperies Backend API is active and operational (ESM Engine)',
    timestamp: new Date().toISOString()
  });
});

// Mount Public / Customer Route Modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/navigation', navigationRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/filters', filterRoutes);
router.use('/blogs', blogRoutes);
router.use('/swatches', swatchRoutes);
router.use('/customizer', customizerRoutes);
router.use('/orders', orderRoutes);

// Mount Admin Management Suite
router.use('/admin', adminRoutes);

export default router;
