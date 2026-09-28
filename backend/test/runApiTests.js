import dotenv from 'dotenv';
dotenv.config();
process.env.NODE_ENV = 'development';

import request from 'supertest';
import app from '../src/app.js';
import { setupMockDatabase, db } from './mockDb.js';

// Setup Mock DB
setupMockDatabase();

// Results Tracker
const testResults = [];

async function runTest({ name, category, method, path, headers = {}, body = null, expectedStatus, extractCookie = false }) {
  const startTime = Date.now();
  let response;
  let error = null;

  try {
    let req = request(app)[method.toLowerCase()](path);

    // Attach headers
    for (const [key, value] of Object.entries(headers)) {
      req = req.set(key, value);
    }

    // Attach body if present
    if (body) {
      req = req.send(body);
    }

    response = await req;
    const duration = Date.now() - startTime;

    const passed = response.status === expectedStatus;

    testResults.push({
      category,
      name,
      method: method.toUpperCase(),
      path,
      expectedStatus,
      actualStatus: response.status,
      passed,
      duration: `${duration}ms`,
      error: passed ? null : JSON.stringify(response.body),
      body: response.body,
      headers: response.headers
    });

    return response;
  } catch (err) {
    const duration = Date.now() - startTime;
    testResults.push({
      category,
      name,
      method: method.toUpperCase(),
      path,
      expectedStatus,
      actualStatus: 'ERR',
      passed: false,
      duration: `${duration}ms`,
      error: err.message
    });
    return null;
  }
}

async function executeTestSuite() {
  console.log('\n================================================================');
  console.log('🚀 EXECUTING AUTOMATED API TEST SUITE (IHF REST API ENGINE)');
  console.log('================================================================\n');

  // 1. HEALTH CHECK
  await runTest({
    category: 'System',
    name: 'Health Check Endpoint',
    method: 'GET',
    path: '/api/health',
    expectedStatus: 200
  });

  // 2. AUTHENTICATION FIRST
  const adminLoginRes = await runTest({
    category: 'Auth',
    name: 'Admin Login & Issue JWT',
    method: 'POST',
    path: '/api/auth/login',
    body: { email: 'admin@ihfluxury.com', password: 'Admin@123456' },
    expectedStatus: 200
  });

  const adminToken = adminLoginRes?.body?.token;
  const adminCookie = adminLoginRes?.headers['set-cookie'];
  const adminHeaders = {
    Authorization: `Bearer ${adminToken}`,
    Cookie: adminCookie ? adminCookie[0] : ''
  };

  const customerLoginRes = await runTest({
    category: 'Auth',
    name: 'Customer Login & Issue JWT',
    method: 'POST',
    path: '/api/auth/login',
    body: { email: 'client@luxurydrapes.com', password: 'Client@123456' },
    expectedStatus: 200
  });

  const customerToken = customerLoginRes?.body?.token;
  const customerCookie = customerLoginRes?.headers['set-cookie'];
  const customerHeaders = {
    Authorization: `Bearer ${customerToken}`,
    Cookie: customerCookie ? customerCookie[0] : ''
  };

  // 3. AUTH ENDPOINTS
  await runTest({
    category: 'Auth',
    name: 'Register Customer Account',
    method: 'POST',
    path: '/api/auth/register',
    body: {
      name: 'Victoria Belmont',
      email: 'victoria@belmont.com',
      password: 'Password@123',
      phone: '+1 (415) 555-0144'
    },
    expectedStatus: 201
  });

  await runTest({
    category: 'Auth',
    name: 'Get Current Authenticated Profile (/api/auth/me)',
    method: 'GET',
    path: '/api/auth/me',
    headers: customerHeaders,
    expectedStatus: 200
  });

  await runTest({
    category: 'Auth',
    name: 'Get Me Without Token (Assert 401 Unauthorized)',
    method: 'GET',
    path: '/api/auth/me',
    expectedStatus: 401
  });

  await runTest({
    category: 'Auth',
    name: 'Forgot Password Request',
    method: 'POST',
    path: '/api/auth/forgot-password',
    body: { email: 'client@luxurydrapes.com' },
    expectedStatus: 200
  });

  await runTest({
    category: 'Auth',
    name: 'User Logout (/api/auth/logout)',
    method: 'POST',
    path: '/api/auth/logout',
    expectedStatus: 200
  });

  // 4. USER PROFILE & ADDRESS BOOK
  await runTest({
    category: 'Users',
    name: 'Update Customer Profile',
    method: 'PATCH',
    path: '/api/users/update-me',
    headers: customerHeaders,
    body: { name: 'Eleanor Vance-Hastings', phone: '+1 (212) 555-9999' },
    expectedStatus: 200
  });

  await runTest({
    category: 'Users',
    name: 'Get Customer Address Book',
    method: 'GET',
    path: '/api/users/addresses',
    headers: customerHeaders,
    expectedStatus: 200
  });

  await runTest({
    category: 'Users',
    name: 'Add Address to Book',
    method: 'POST',
    path: '/api/users/addresses',
    headers: customerHeaders,
    body: {
      label: 'Hamptons Estate',
      fullName: 'Eleanor Vance',
      street: '42 Meadow Lane',
      city: 'Southampton',
      state: 'NY',
      zipCode: '11968',
      country: 'US'
    },
    expectedStatus: 201
  });

  // 5. DYNAMIC NAVIGATION
  await runTest({
    category: 'Navigation',
    name: 'Get Public Navigation Tree',
    method: 'GET',
    path: '/api/navigation',
    expectedStatus: 200
  });

  await runTest({
    category: 'Navigation',
    name: 'Admin: Get All Navigation Items',
    method: 'GET',
    path: '/api/admin/navigation',
    headers: adminHeaders,
    expectedStatus: 200
  });

  await runTest({
    category: 'Navigation',
    name: 'Admin: Create Navigation Link',
    method: 'POST',
    path: '/api/admin/navigation',
    headers: adminHeaders,
    body: {
      title: 'Motorized Drapery',
      path: '/products?features=motorized',
      type: 'link',
      displayOrder: 5
    },
    expectedStatus: 201
  });

  await runTest({
    category: 'Navigation',
    name: 'Admin: Reorder Navigation Items',
    method: 'PATCH',
    path: '/api/admin/navigation/reorder',
    headers: adminHeaders,
    body: {
      items: [{ id: '660000000000000000000009', displayOrder: 1 }]
    },
    expectedStatus: 200
  });

  // 6. CATEGORIES
  await runTest({
    category: 'Categories',
    name: 'Get Public Categories Tree',
    method: 'GET',
    path: '/api/categories',
    expectedStatus: 200
  });

  await runTest({
    category: 'Categories',
    name: 'Get Category By Slug (/api/categories/:slug)',
    method: 'GET',
    path: '/api/categories/curtains-and-drapes',
    expectedStatus: 200
  });

  await runTest({
    category: 'Categories',
    name: 'Admin: Get All Categories',
    method: 'GET',
    path: '/api/admin/categories',
    headers: adminHeaders,
    expectedStatus: 200
  });

  await runTest({
    category: 'Categories',
    name: 'Admin: Create Subcategory',
    method: 'POST',
    path: '/api/admin/categories',
    headers: adminHeaders,
    body: {
      name: 'Tailored Euro Pleat Drapes',
      parentCategory: '660000000000000000000003',
      displayOrder: 4
    },
    expectedStatus: 201
  });

  // 7. PRODUCTS CATALOG
  await runTest({
    category: 'Products',
    name: 'Get Products with Dynamic Filter Query',
    method: 'GET',
    path: '/api/products?fabric=linen&sort=-createdAt',
    expectedStatus: 200
  });

  await runTest({
    category: 'Products',
    name: 'Get Featured Luxury Products',
    method: 'GET',
    path: '/api/products/featured',
    expectedStatus: 200
  });

  await runTest({
    category: 'Products',
    name: 'Get Product Detail by Slug',
    method: 'GET',
    path: '/api/products/chateau-pure-belgian-flax-linen-drapery',
    expectedStatus: 200
  });

  await runTest({
    category: 'Products',
    name: 'Admin: Get All Catalog Products',
    method: 'GET',
    path: '/api/admin/products',
    headers: adminHeaders,
    expectedStatus: 200
  });

  await runTest({
    category: 'Products',
    name: 'Admin: Create Luxury Custom Base Product',
    method: 'POST',
    path: '/api/admin/products',
    headers: adminHeaders,
    body: {
      title: 'Kashmir Cashmere Wool Drapery',
      category: '660000000000000000000003',
      basePrice: 920,
      pricePerYard: 125,
      fabricType: 'wool',
      description: 'Hand-loomed cashmere draperies from the Himalayas.',
      isCustomizable: true
    },
    expectedStatus: 201
  });

  // 8. DYNAMIC SIDEBAR FILTERS (With Dynamic Aggregation Counts)
  await runTest({
    category: 'Filters',
    name: 'Get Sidebar Filters With Real-Time Counts',
    method: 'GET',
    path: '/api/filters',
    expectedStatus: 200
  });

  await runTest({
    category: 'Filters',
    name: 'Admin: Get All Filter Options',
    method: 'GET',
    path: '/api/admin/filters',
    headers: adminHeaders,
    expectedStatus: 200
  });

  await runTest({
    category: 'Filters',
    name: 'Admin: Create Color Swatch Filter',
    method: 'POST',
    path: '/api/admin/filters',
    headers: adminHeaders,
    body: {
      group: 'color',
      label: 'Sapphire Royal Blue',
      value: 'sapphire-blue',
      hexCode: '#0F52BA',
      displayOrder: 7
    },
    expectedStatus: 201
  });

  // 9. EDITORIAL BLOGS
  await runTest({
    category: 'Blogs',
    name: 'Get Published Editorial Blogs',
    method: 'GET',
    path: '/api/blogs',
    expectedStatus: 200
  });

  await runTest({
    category: 'Blogs',
    name: 'Get Blog Post by Slug',
    method: 'GET',
    path: '/api/blogs/how-to-measure-custom-curtains',
    expectedStatus: 200
  });

  await runTest({
    category: 'Blogs',
    name: 'Admin: Get All Editorial Articles',
    method: 'GET',
    path: '/api/admin/blogs',
    headers: adminHeaders,
    expectedStatus: 200
  });

  await runTest({
    category: 'Blogs',
    name: 'Admin: Create New Blog Article',
    method: 'POST',
    path: '/api/admin/blogs',
    headers: adminHeaders,
    body: {
      title: 'Selecting the Perfect Lining for Luxury Drapery',
      excerpt: 'Privacy vs 100% eclipse blackout lining explained.',
      content: '<p>Lining selection transforms light diffusion and drape structure...</p>'
    },
    expectedStatus: 201
  });

  // 10. SWATCHES ENGINE
  await runTest({
    category: 'Swatches',
    name: 'Get Fabric Swatches Catalog',
    method: 'GET',
    path: '/api/swatches',
    expectedStatus: 200
  });

  await runTest({
    category: 'Swatches',
    name: 'Request Sample Swatch Kit',
    method: 'POST',
    path: '/api/swatches/request',
    headers: customerHeaders,
    body: {
      customerInfo: {
        name: 'Eleanor Vance',
        email: 'client@luxurydrapes.com',
        shippingAddress: {
          street: '740 Park Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10021'
        }
      },
      swatchIds: ['660000000000000000000007']
    },
    expectedStatus: 201
  });

  await runTest({
    category: 'Swatches',
    name: 'Admin: Get All Swatch Samples',
    method: 'GET',
    path: '/api/admin/swatches',
    headers: adminHeaders,
    expectedStatus: 200
  });

  await runTest({
    category: 'Swatches',
    name: 'Admin: Get Sample Kit Orders',
    method: 'GET',
    path: '/api/admin/swatch-orders',
    headers: adminHeaders,
    expectedStatus: 200
  });

  // 11. CUSTOMIZER ENGINE & RULES
  await runTest({
    category: 'Customizer',
    name: 'Get Active Customizer Constraints & Pricing Rules',
    method: 'GET',
    path: '/api/customizer/rules',
    expectedStatus: 200
  });

  await runTest({
    category: 'Customizer',
    name: 'Calculate Custom Curtain Price (Valid Fractional: 54 1/2" x 96")',
    method: 'POST',
    path: '/api/customizer/calculate-price',
    body: {
      productId: '660000000000000000000006',
      width: '54 1/2"',
      height: '96 1/4"',
      fullnessId: 'standard',
      liningId: 'privacy',
      pleatId: 'pinch-pleat',
      panelConfiguration: 'pair',
      quantity: 1
    },
    expectedStatus: 200
  });

  await runTest({
    category: 'Customizer',
    name: 'Calculate Price with Out-of-Bounds Dimension (Assert 400)',
    method: 'POST',
    path: '/api/customizer/calculate-price',
    body: {
      productId: '660000000000000000000006',
      width: '500"', // Exceeds 240" maximum constraint
      height: '96"'
    },
    expectedStatus: 400
  });

  await runTest({
    category: 'Customizer',
    name: 'Admin: Get All Customizer Rule Matrices',
    method: 'GET',
    path: '/api/admin/customizer',
    headers: adminHeaders,
    expectedStatus: 200
  });

  // 12. ORDERS & STRIPE PAYMENTS (Server-Side Price Recalculation)
  await runTest({
    category: 'Orders',
    name: 'Create Stripe PaymentIntent with Server-Recalculated Price',
    method: 'POST',
    path: '/api/orders/create-payment-intent',
    headers: customerHeaders,
    body: {
      items: [
        {
          itemType: 'custom_curtain',
          productId: '660000000000000000000006',
          width: '54 1/2"',
          height: '96 1/4"',
          quantity: 1
        }
      ]
    },
    expectedStatus: 200
  });

  await runTest({
    category: 'Orders',
    name: 'Place Customer Custom Order',
    method: 'POST',
    path: '/api/orders',
    headers: customerHeaders,
    body: {
      items: [
        {
          itemType: 'custom_curtain',
          productId: '660000000000000000000006',
          width: '54 1/2"',
          height: '96 1/4"',
          quantity: 1
        }
      ],
      shippingAddress: {
        fullName: 'Eleanor Vance',
        street: '740 Park Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10021'
      }
    },
    expectedStatus: 201
  });

  await runTest({
    category: 'Orders',
    name: 'Get Customer My Orders History',
    method: 'GET',
    path: '/api/orders/my-orders',
    headers: customerHeaders,
    expectedStatus: 200
  });

  await runTest({
    category: 'Orders',
    name: 'Admin: Get All High-Ticket Orders',
    method: 'GET',
    path: '/api/admin/orders',
    headers: adminHeaders,
    expectedStatus: 200
  });

  await runTest({
    category: 'Orders',
    name: 'Admin: Update Manufacturing Fulfillment Status',
    method: 'PATCH',
    path: '/api/admin/orders/660000000000000000000011/fulfillment',
    headers: adminHeaders,
    body: {
      fulfillmentStatus: 'Manufacturing',
      manufacturingNotes: 'Custom Belgian Flax cut and pinned for French pinch pleats.'
    },
    expectedStatus: 200
  });

  // 13. SECURITY & RBAC PERMISSION CHECKS
  await runTest({
    category: 'Security/RBAC',
    name: 'Customer Accessing Admin Users Route (Assert 403 Forbidden)',
    method: 'GET',
    path: '/api/admin/users',
    headers: customerHeaders,
    expectedStatus: 403
  });

  await runTest({
    category: 'Security/RBAC',
    name: 'Unauthenticated Request to Admin Route (Assert 401 Unauthorized)',
    method: 'GET',
    path: '/api/admin/users',
    expectedStatus: 401
  });

  await runTest({
    category: 'Security/RBAC',
    name: 'Admin Accessing Admin Users Route (Assert 200 OK)',
    method: 'GET',
    path: '/api/admin/users',
    headers: adminHeaders,
    expectedStatus: 200
  });

  // 14. 404 ROUTE NOT FOUND
  await runTest({
    category: 'Security/404',
    name: 'Non-Existent API Endpoint (Assert 404 Not Found)',
    method: 'GET',
    path: '/api/v1/invalid-route-xyz',
    expectedStatus: 404
  });

  // ================================================================
  // PRINT COMPREHENSIVE SUMMARY REPORT
  // ================================================================
  console.log('\n================================================================');
  console.log('📊 AUTOMATED API TEST RESULTS SUMMARY');
  console.log('================================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  console.log(
    'Status'.padEnd(8) +
    'Method'.padEnd(8) +
    'Code'.padEnd(7) +
    'Time'.padEnd(8) +
    'Route / Description'.padEnd(45) +
    'Category'
  );
  console.log('-'.repeat(90));

  for (const t of testResults) {
    const symbol = t.passed ? '✅ PASS' : '❌ FAIL';
    if (t.passed) passedCount++;
    else failedCount++;

    const codeStr = `${t.actualStatus}/${t.expectedStatus}`.padEnd(7);
    const desc = `${t.path} (${t.name})`.slice(0, 43).padEnd(45);

    console.log(
      symbol.padEnd(8) +
      t.method.padEnd(8) +
      codeStr +
      t.duration.padEnd(8) +
      desc +
      t.category
    );

    if (!t.passed && t.error) {
      console.log(`   ⚠️  ERROR: ${t.error}`);
    }
  }

  console.log('\n' + '='.repeat(90));
  console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('='.repeat(90) + '\n');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

executeTestSuite();
