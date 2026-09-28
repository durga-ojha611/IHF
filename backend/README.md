# 🛡️ IHF Luxury Draperies — Backend REST API Engine

A high-ticket, enterprise-grade Node.js/Express.js + MongoDB REST API backend built for luxury custom curtains, draperies, fabric swatches, and bespoke window furnishings ($500 to $4,000+ per order). Built 100% with native **ES Modules (`import` / `export`)**.

---

## 🏗️ Architecture & Core Modules

The backend architecture is structured around 8 core modules:

```
src/
├── config/
│   ├── db.js                 # MongoDB connection with retry & timeout handling
│   └── stripe.js             # Stripe SDK initialization with dev fallback
├── controllers/
│   ├── auth.controller.js        # JWT httpOnly cookies, password reset workflow
│   ├── user.controller.js        # Profile CRUD, address book, Admin User Management suite
│   ├── navigation.controller.js  # Dynamic navbar links, mega menus & reordering
│   ├── category.controller.js    # Hierarchy (Curtains -> Pinch Pleat, Ripple Fold, etc.)
│   ├── product.controller.js     # High-ticket catalog, dynamic filters, cross-sells
│   ├── filter.controller.js      # Sidebar filters with real-time aggregation counts
│   ├── blog.controller.js        # Editorial journal with SEO meta tags & publishing states
│   ├── swatch.controller.js      # High-res sample swatches & sample kit orders
│   ├── customizer.controller.js  # Custom curtain rules & dynamic server pricing engine
│   └── order.controller.js       # Stripe PaymentIntents, webhooks, fulfillment tracking
├── middlewares/
│   ├── auth.middleware.js        # JWT protect & role-based access control (RBAC)
│   ├── error.middleware.js       # Standardized operational error handling
│   └── safety.middleware.js      # Cascading safety checks (prevent deleting active entities)
├── models/
│   ├── User.js                   # Customer & Admin accounts with soft delete
│   ├── Category.js               # Hierarchical categories & subcategories
│   ├── Product.js                # Custom base models with fabric pricing per yard
│   ├── FilterOption.js           # Fabrics, Colors with Hex, Styles, Features
│   ├── Navigation.js             # Dynamic navbar, mega menus, ordering
│   ├── Blog.js                   # SEO editorial articles
│   ├── Swatch.js                 # Sample swatches with GSM, texture, hex codes
│   ├── SwatchOrder.js            # Sample kit warehouse fulfillment tracking
│   ├── CustomizerRule.js         # Interactive measurement constraints & pricing matrices
│   └── Order.js                  # Complete manufacturing specs snapshot & fulfillment
├── routes/
│   ├── admin/
│   │   └── admin.routes.js       # Unified Admin CRUD routes (/api/admin/*)
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── navigation.routes.js
│   ├── category.routes.js
│   ├── product.routes.js
│   ├── filter.routes.js
│   ├── blog.routes.js
│   ├── swatch.routes.js
│   ├── customizer.routes.js
│   ├── order.routes.js
│   └── index.js                  # Central router (/api/health + mounted modules)
├── services/
│   ├── customizer.service.js     # Precision dimension parser & textile pricing formula
│   ├── stripe.service.js         # 100% Backend price re-calculation & PaymentIntents
│   └── email.service.js          # Password reset and customer notification dispatcher
├── utils/
│   ├── apiFeatures.js            # Reusable search, filter, sort, paginate utility
│   ├── appError.js               # Centralized operational error class
│   ├── catchAsync.js             # Async error wrapper
│   └── dimensionParser.js        # Precision US fractional inch parser (54 1/2", 108 3/8)
├── seed/
│   └── seeder.js                 # Rich luxury demo catalog and admin seed script
├── app.js                        # Express app, Helmet, CORS, Rate Limit, Mongo Sanitize
└── server.js                     # HTTP listener & process lifecycle handling
```

---

## 🔒 Security & Data Integrity Rules

1. **Server-Side Price Re-Validation:** Client prices are **never** trusted during checkout. When creating a Stripe `PaymentIntent`, the backend recalculates yardage, fabric costs, lining multipliers, pleat labor, and hardware add-ons based on database-backed rules.
2. **Precision Fractional Dimension Parser:** Supports raw inputs like `54 1/2"`, `96 3/8`, and enforces valid US drapery fraction intervals (1/8, 1/4, 3/8, 1/2, 5/8, 3/4, 7/8).
3. **Data Preservation (Soft Deletes):** Uses `isDeleted: true` for user profiles, products, categories, and orders to preserve historical tax, legal, and order fulfillment records.
4. **Cascading Safety Checks:** Custom middleware prevents deleting categories, products, or filter attributes if active/pending customer orders or child entities depend on them.
5. **Cookie Security:** JWT tokens are issued strictly with `httpOnly`, `secure`, `sameSite` flags.
6. **NoSQL Injection & Rate Limiting:** All endpoints are protected with `express-mongo-sanitize`, `helmet`, and `express-rate-limit`.

---

## 🚀 Getting Started

### 1. Configure Environment
Copy `.env.example` to `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/ihf_luxury_curtains
JWT_SECRET=super_secret_jwt_key_ihf_luxury_drapes_2026_secure_key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Database
Seeds Admin, Customer, Categories, Customizer Rules, Filters with Hex Codes, Swatches, High-Ticket Draperies, and Mega Navigation:
```bash
npm run seed
```

**Default Seed Credentials:**
* **Admin:** `admin@ihfluxury.com` / `Admin@123456`
* **Customer:** `client@luxurydrapes.com` / `Client@123456`

### 4. Start Development Server
```bash
npm run dev
# or production mode
npm start
```

---

## 📡 REST API Endpoint Summary

### 1. Health & Status
* `GET /api/health` — System status and server timestamp.

### 2. User & Auth (`/api/auth` & `/api/users`)
* `POST /api/auth/register` — Register customer account.
* `POST /api/auth/login` — Login and receive `httpOnly` JWT cookie.
* `POST /api/auth/logout` — Clear session cookie.
* `GET /api/auth/me` — Get current logged-in profile.
* `POST /api/auth/forgot-password` — Generate 15-minute expiring hashed reset token.
* `POST /api/auth/reset-password/:token` — Reset password.
* `PATCH /api/users/update-me` — Update personal profile details.
* `DELETE /api/users/delete-me` — Customer soft-deletion.
* `GET /api/users/addresses` — Customer address book.
* `POST /api/users/addresses` — Add shipping address.
* `PATCH /api/users/addresses/:addressId` — Update shipping address.
* `DELETE /api/users/addresses/:addressId` — Delete shipping address.

### 3. Dynamic Navigation (`/api/navigation`)
* `GET /api/navigation` — Public site menu tree with subcategories and mega menus.

### 4. Products & Categories (`/api/products` & `/api/categories`)
* `GET /api/categories` — Category hierarchy.
* `GET /api/categories/:slug` — Single category with subcategories.
* `GET /api/products` — Filter products by category, fabrics, styles, features, price range, search, sort, pagination.
* `GET /api/products/featured` — Featured luxury products.
* `GET /api/products/:slug` — Product detail page data.
* `GET /api/products/:id/related` — Cross-sell "Complete the Look" products.

### 5. Dynamic Sidebar Filters (`/api/filters`)
* `GET /api/filters` — Returns multi-select filter groups with **real-time product inventory counts** calculated dynamically via MongoDB aggregation.

### 6. Editorial Blogs (`/api/blogs`)
* `GET /api/blogs` — List published articles with tag filter.
* `GET /api/blogs/:slug` — Single article with SEO meta tags.

### 7. Swatches & Swatch Orders (`/api/swatches`)
* `GET /api/swatches` — Swatch catalog with GSM, texture, and hex codes.
* `POST /api/swatches/request` — Request sample fabric kit (up to 10 swatches).

### 8. Customizer Engine Rules & Pricing (`/api/customizer`)
* `GET /api/customizer/rules` — Measurement limits, fullness factors, lining multipliers, pleat styles, and hardware add-ons.
* `POST /api/customizer/calculate-price` — Server-side calculation accepting width & height (supports fractions like `54 1/2"`), returning verified price breakdown and required fabric yardage.

### 9. Orders & Checkout (`/api/orders`)
* `POST /api/orders/create-payment-intent` — Server verifies item pricing and creates Stripe PaymentIntent.
* `POST /api/orders` — Finalizes order placement.
* `GET /api/orders/my-orders` — Customer order history.
* `GET /api/orders/:id` — Single order inspection.
* `POST /api/orders/webhook` — Stripe webhook listener for `payment_intent.succeeded`.

---

## 👑 100% Dynamic Admin Management Suite (`/api/admin/*`)
*(Protected by JWT Authentication and Admin/Staff RBAC)*

* **Users (`/api/admin/users`):** Full list, user detail + order history, role updates, soft-delete, and account restoration.
* **Navigation (`/api/admin/navigation`):** Create, update, delete, and reorder navbar links and mega menus.
* **Categories (`/api/admin/categories`):** Create, update, and soft-delete categories (guarded by cascading safety check).
* **Products (`/api/admin/products`):** Full catalog CRUD, pricing per yard, fabric options, soft-delete, and restoration (guarded by order safety check).
* **Filters (`/api/admin/filters`):** Add/edit/delete dynamic sidebar filter options with hex colors and groups.
* **Blogs (`/api/admin/blogs`):** Full CRUD for SEO-optimized articles.
* **Swatches (`/api/admin/swatches` & `/api/admin/swatch-orders`):** Fabric swatch CRUD and warehouse sample kit fulfillment tracking.
* **Customizer Rules (`/api/admin/customizer`):** Dynamic configuration for width/height constraints, lining pricing multipliers, pleat headers, and hardware add-ons without code changes.
* **Orders & Fulfillment (`/api/admin/orders`):** Inspect full manufacturing snapshots (exact 1/8th inch dimensions, lining, pleats, hardware), update fulfillment status (`Pending`, `Manufacturing`, `Shipped`, `Delivered`), add tracking numbers, and manufacturing notes.
