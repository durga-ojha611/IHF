import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import FilterOption from '../src/models/FilterOption.js';
import Navigation from '../src/models/Navigation.js';
import Blog from '../src/models/Blog.js';
import Swatch from '../src/models/Swatch.js';
import SwatchOrder from '../src/models/SwatchOrder.js';
import CustomizerRule from '../src/models/CustomizerRule.js';
import Order from '../src/models/Order.js';

// In-Memory Data Store
export const db = {
  users: [],
  categories: [],
  products: [],
  filterOptions: [],
  navigation: [],
  blogs: [],
  swatches: [],
  swatchOrders: [],
  customizerRules: [],
  orders: []
};

// Helper: Chainable Query Mock
class QueryMock {
  constructor(data) {
    this._data = data;
  }

  find(query) {
    if (Array.isArray(this._data)) {
      if (query && typeof query === 'object') {
        this._data = this._data.filter((item) => {
          for (const key of Object.keys(query)) {
            if (key === 'isActive' && item.isActive !== query[key]) return false;
            if (key === 'isDeleted' && (item.isDeleted || false) !== (query[key] || false)) return false;
            if (key === 'isPublished' && item.isPublished !== query[key]) return false;
            if (key === 'parent' && item.parent !== query[key]) return false;
            if (key === 'parentCategory' && item.parentCategory !== query[key]) return false;
            if (key === 'fabricType' && item.fabricType !== query[key]) return false;
            if (key === 'category' && item.category?.toString() !== query[key]?.toString()) return false;
            if (key === 'isFeatured' && item.isFeatured !== query[key]) return false;
          }
          return true;
        });
      }
    }
    return this;
  }

  populate() {
    return this;
  }

  sort() {
    return this;
  }

  select() {
    return this;
  }

  skip(n) {
    if (Array.isArray(this._data)) {
      this._data = this._data.slice(n);
    }
    return this;
  }

  limit(n) {
    if (Array.isArray(this._data)) {
      this._data = this._data.slice(0, n);
    }
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve(this._data).then(resolve, reject);
  }

  catch(reject) {
    return Promise.resolve(this._data).catch(reject);
  }
}

// Attach User instance methods to in-memory user documents
function hydrateUser(userDoc) {
  if (!userDoc) return null;
  const user = { ...userDoc };
  user.id = user._id ? user._id.toString() : '';

  user.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, user.password);
  };

  user.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
  };

  user.save = async function () {
    const idx = db.users.findIndex((u) => u._id.toString() === user._id.toString());
    if (idx !== -1) {
      db.users[idx] = user;
    }
    return user;
  };

  if (!user.addresses) user.addresses = [];
  user.addresses.id = function (id) {
    if (!id) return null;
    return user.addresses.find((a) => a._id.toString() === id.toString());
  };

  return user;
}

export function setupMockDatabase() {
  const adminId = '660000000000000000000001';
  const customerId = '660000000000000000000002';
  const catId = '660000000000000000000003';
  const subCatId = '660000000000000000000004';
  const ruleId = '660000000000000000000005';
  const prodId = '660000000000000000000006';
  const swatchId = '660000000000000000000007';
  const filterId = '660000000000000000000008';
  const navId = '660000000000000000000009';
  const blogId = '660000000000000000000010';
  const orderId = '660000000000000000000011';

  // Seed default admin password hash: Admin@123456
  const adminSalt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('Admin@123456', adminSalt);

  // Seed default customer password hash: Client@123456
  const custSalt = bcrypt.genSaltSync(10);
  const custHash = bcrypt.hashSync('Client@123456', custSalt);

  db.users = [
    {
      _id: adminId,
      name: 'IHF Master Administrator',
      email: 'admin@ihfluxury.com',
      password: adminHash,
      role: 'admin',
      phone: '+1 (800) 555-0199',
      isDeleted: false,
      addresses: []
    },
    {
      _id: customerId,
      name: 'Eleanor Vance',
      email: 'client@luxurydrapes.com',
      password: custHash,
      role: 'customer',
      phone: '+1 (212) 555-7821',
      isDeleted: false,
      addresses: [
        {
          _id: '660000000000000000000099',
          label: 'Manhattan Penthouse',
          fullName: 'Eleanor Vance',
          street: '740 Park Avenue',
          apartment: 'Apt 14B',
          city: 'New York',
          state: 'NY',
          zipCode: '10021',
          country: 'US',
          phone: '+1 (212) 555-7821',
          isDefault: true,
          set: function (data) { Object.assign(this, data); },
          deleteOne: function () {}
        }
      ]
    }
  ];

  db.customizerRules = [
    {
      _id: ruleId,
      key: 'standard-drapery-rules',
      name: 'Master Luxury Drapery Customizer Configuration',
      description: 'Comprehensive matrix for custom width, height, pleat headers, lining multipliers, and motorization',
      constraints: {
        minWidthInches: 24,
        maxWidthInches: 240,
        minHeightInches: 36,
        maxHeightInches: 200,
        allowedFractions: ['', '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8']
      },
      fabricRollWidthInches: 54,
      hemAllowanceInches: 16,
      laborBaseFee: 95,
      fullnessOptions: [
        { id: 'standard', label: '2.0x Standard Custom Fullness', factor: 2.0, isDefault: true }
      ],
      liningOptions: [
        { id: 'unlined', name: 'Unlined', type: 'unlined', pricePerYardMultiplier: 0, flatPriceAddon: 0 },
        { id: 'privacy', name: 'Cotton Privacy Lining', type: 'privacy', pricePerYardMultiplier: 18, flatPriceAddon: 0, isDefault: true }
      ],
      pleatHeaders: [
        { id: 'pinch-pleat', name: 'Three-Finger French Pinch Pleat', pricePerPanel: 45, isDefault: true }
      ],
      hardwareAddons: [
        { id: 'somfy-motor', name: 'Somfy Motorized Track', price: 495, isMotorized: true }
      ],
      isActive: true,
      isDeleted: false
    }
  ];

  db.categories = [
    {
      _id: catId,
      name: 'Curtains & Drapes',
      slug: 'curtains-and-drapes',
      parentCategory: null,
      displayOrder: 1,
      isActive: true,
      isDeleted: false,
      save: async function () { return this; }
    },
    {
      _id: subCatId,
      name: 'French Pinch Pleat Drapes',
      slug: 'french-pinch-pleat-drapes',
      parentCategory: catId,
      displayOrder: 1,
      isActive: true,
      isDeleted: false,
      save: async function () { return this; }
    }
  ];

  db.products = [
    {
      _id: prodId,
      title: 'The Chateau Pure Belgian Flax Linen Drapery',
      slug: 'chateau-pure-belgian-flax-linen-drapery',
      sku: 'IHF-LINEN-001',
      shortDescription: 'Tailored from certified 100% Belgian flax with rich natural slub texture and artisan pinch pleats.',
      description: 'Handcrafted luxury custom linen drapery made from finest European flax.',
      category: catId,
      subCategory: subCatId,
      basePrice: 580,
      pricePerYard: 68,
      fabricType: 'linen',
      colors: [
        { name: 'Champagne Beige', hexCode: '#F7E7CE', inStock: true },
        { name: 'Ivory White', hexCode: '#FFFFF0', inStock: true },
        { name: 'Charcoal Slate', hexCode: '#36454F', inStock: true }
      ],
      styles: ['pinch-pleat', 'euro-pleat'],
      features: ['blackout', 'motorized'],
      images: [
        { url: '/figma/home-01.jpeg', alt: 'Chateau Pure Belgian Flax Linen Drapery', isPrimary: true },
        { url: '/figma/home-05.png', alt: 'Chateau Linen Detail', isPrimary: false }
      ],
      customizerRule: ruleId,
      stockStatus: 'in_stock',
      inventoryCount: 450,
      isCustomizable: true,
      isFeatured: true,
      isActive: true,
      isDeleted: false,
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000062',
      title: 'The Monaco Royal Silk Velvet Blackout Drapery',
      slug: 'monaco-royal-silk-velvet-blackout-drapery',
      sku: 'IHF-VELVET-002',
      shortDescription: 'Sumptuous, heavyweight velvet with 100% blackout eclipse lining and thermal noise dampening.',
      description: 'Sumptuous, heavyweight velvet with 100% blackout eclipse lining and thermal noise dampening.',
      category: catId,
      subCategory: subCatId,
      basePrice: 780,
      pricePerYard: 95,
      fabricType: 'velvet',
      colors: [
        { name: 'Emerald Green', hexCode: '#046307', inStock: true },
        { name: 'Midnight Navy', hexCode: '#002366', inStock: true },
        { name: 'Terracotta Rust', hexCode: '#C46851', inStock: true }
      ],
      styles: ['pinch-pleat', 'ripple-fold'],
      features: ['blackout', 'thermal-insulated', 'acoustic'],
      images: [
        { url: '/figma/home-06.jpeg', alt: 'Monaco Royal Silk Velvet Drapery', isPrimary: true },
        { url: '/figma/home-13.png', alt: 'Monaco Velvet Detail', isPrimary: false }
      ],
      customizerRule: ruleId,
      stockStatus: 'in_stock',
      inventoryCount: 320,
      isCustomizable: true,
      isFeatured: true,
      isActive: true,
      isDeleted: false,
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000063',
      title: 'The Verona Architectural Ripple Fold Sheer',
      slug: 'verona-architectural-ripple-fold-sheer',
      sku: 'IHF-SHEER-003',
      shortDescription: 'Modern continuous S-wave ripple fold sheer drapery for floor-to-ceiling windows.',
      description: 'Modern continuous S-wave ripple fold sheer drapery for floor-to-ceiling windows.',
      category: catId,
      subCategory: subCatId,
      basePrice: 420,
      pricePerYard: 48,
      fabricType: 'sheer',
      colors: [
        { name: 'Ivory White', hexCode: '#FFFFF0', inStock: true },
        { name: 'Champagne Beige', hexCode: '#F7E7CE', inStock: true }
      ],
      styles: ['ripple-fold'],
      features: ['motorized'],
      images: [
        { url: '/figma/home-11.png', alt: 'Verona Architectural Ripple Fold Sheer', isPrimary: true },
        { url: '/figma/home-17.jpeg', alt: 'Verona Sheer Detail', isPrimary: false }
      ],
      customizerRule: ruleId,
      stockStatus: 'in_stock',
      inventoryCount: 600,
      isCustomizable: true,
      isFeatured: true,
      isActive: true,
      isDeleted: false,
      save: async function () { return this; }
    }
  ];

  db.filterOptions = [
    {
      _id: filterId,
      group: 'fabric',
      label: 'Belgian Linen',
      value: 'linen',
      displayOrder: 1,
      isActive: true,
      isDeleted: false,
      deleteOne: async function () {}
    },
    {
      _id: '660000000000000000000082',
      group: 'fabric',
      label: 'Silk Velvet',
      value: 'velvet',
      displayOrder: 2,
      isActive: true,
      isDeleted: false,
      deleteOne: async function () {}
    },
    {
      _id: '660000000000000000000083',
      group: 'fabric',
      label: 'Airy Sheers',
      value: 'sheer',
      displayOrder: 3,
      isActive: true,
      isDeleted: false,
      deleteOne: async function () {}
    }
  ];

  db.swatches = [
    {
      _id: swatchId,
      fabricName: 'Belgian Flax Linen',
      colorName: 'Champagne Oat',
      hexCode: '#E6D7B9',
      material: '100% European Flax Linen',
      weightGsm: 420,
      texture: 'Rich Slub Textured Weave',
      price: 0,
      inStock: true,
      image: { url: '/figma/home-02.png', alt: 'Belgian Flax Linen Champagne Oat' },
      isDeleted: false
    },
    {
      _id: '660000000000000000000072',
      fabricName: 'Monaco Royal Velvet',
      colorName: 'Emerald Forest',
      hexCode: '#046307',
      material: 'Heavyweight Cotton Velvet',
      weightGsm: 540,
      texture: 'Ultra-Soft Matte Pile',
      price: 0,
      inStock: true,
      image: { url: '/figma/home-13.png', alt: 'Monaco Royal Velvet Emerald' },
      isDeleted: false
    },
    {
      _id: '660000000000000000000073',
      fabricName: 'Monaco Royal Velvet',
      colorName: 'Midnight Navy',
      hexCode: '#002366',
      material: 'Heavyweight Cotton Velvet',
      weightGsm: 540,
      texture: 'Lustrous Deep Velvet Pile',
      price: 0,
      inStock: true,
      image: { url: '/figma/home-06.jpeg', alt: 'Monaco Royal Velvet Midnight Navy' },
      isDeleted: false
    },
    {
      _id: '660000000000000000000074',
      fabricName: 'Artisan Sheer Voile',
      colorName: 'Pure Ivory',
      hexCode: '#FFFFF0',
      material: '100% Fine Spun Linen Sheer',
      weightGsm: 180,
      texture: 'Airy Ethereal Open Weave',
      price: 0,
      inStock: true,
      image: { url: '/figma/home-17.jpeg', alt: 'Artisan Sheer Pure Ivory' },
      isDeleted: false
    }
  ];

  db.navigation = [
    {
      _id: navId,
      title: 'Custom Curtains',
      path: '/products?category=curtains-and-drapes',
      type: 'link',
      parent: null,
      displayOrder: 1,
      isActive: true,
      isDeleted: false
    }
  ];

  db.blogs = [
    {
      _id: blogId,
      title: 'How to Measure Custom Curtains',
      slug: 'how-to-measure-custom-curtains',
      excerpt: 'Guide to measuring draperies',
      content: 'Measurement tutorial...',
      isPublished: true,
      isDeleted: false
    }
  ];

  db.orders = [
    {
      _id: orderId,
      orderNumber: 'IHF-2026-999999',
      user: customerId,
      customerInfo: { name: 'Eleanor Vance', email: 'client@luxurydrapes.com' },
      items: [],
      pricing: { subtotal: 580, shipping: 0, tax: 43.5, total: 623.5 },
      fulfillmentStatus: 'Pending',
      paymentInfo: { paymentStatus: 'pending' },
      isDeleted: false,
      save: async function () { return this; }
    }
  ];

  // ----------------------------------------------------
  // Mock User Model Methods
  // ----------------------------------------------------
  User.findOne = (query) => {
    let result = null;
    if (query && query.email) {
      result = db.users.find((u) => u.email.toLowerCase() === query.email.toLowerCase() && !u.isDeleted);
    } else if (query && query.resetPasswordToken) {
      result = db.users.find((u) => u.resetPasswordToken === query.resetPasswordToken);
    }
    const q = new QueryMock(hydrateUser(result));
    q.select = () => q;
    return q;
  };

  User.findById = (id) => {
    if (!id) return new QueryMock(null);
    const user = db.users.find((u) => u._id.toString() === id.toString() && !u.isDeleted);
    return new QueryMock(hydrateUser(user));
  };

  User.create = async (userData) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userData.password, salt);
    const newUser = {
      _id: `6600000000000000000000${db.users.length + 10}`,
      ...userData,
      password: hash,
      isDeleted: false,
      addresses: []
    };
    db.users.push(newUser);
    return hydrateUser(newUser);
  };

  User.findByIdAndUpdate = async (id, update) => {
    if (!id) return null;
    const user = db.users.find((u) => u._id.toString() === id.toString());
    if (user) {
      Object.assign(user, update);
      return hydrateUser(user);
    }
    return null;
  };

  User.find = () => new QueryMock(db.users.filter((u) => !u.isDeleted).map(hydrateUser));
  User.countDocuments = async () => db.users.filter((u) => !u.isDeleted).length;

  // ----------------------------------------------------
  // Mock Category Model Methods
  // ----------------------------------------------------
  Category.find = () => new QueryMock(db.categories.filter((c) => !c.isDeleted));
  Category.findOne = (query) => {
    const cat = db.categories.find((c) => c.slug === query?.slug && !c.isDeleted);
    return new QueryMock(cat);
  };
  Category.findById = (id) => new QueryMock(db.categories.find((c) => c._id.toString() === id.toString()));
  Category.create = async (data) => {
    const cat = {
      _id: `6600000000000000000001${db.categories.length + 10}`,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      isDeleted: false,
      isActive: true,
      ...data,
      save: async function () { return this; }
    };
    db.categories.push(cat);
    return cat;
  };
  Category.findByIdAndUpdate = async (id, update) => {
    const cat = db.categories.find((c) => c._id.toString() === id.toString());
    if (cat) Object.assign(cat, update);
    return cat;
  };
  Category.countDocuments = async () => db.categories.filter((c) => !c.isDeleted).length;

  // ----------------------------------------------------
  // Mock Product Model Methods
  // ----------------------------------------------------
  Product.find = () => new QueryMock(db.products.filter((p) => !p.isDeleted));
  Product.findOne = (query) => {
    const prod = db.products.find((p) => p.slug === query?.slug && !p.isDeleted);
    return new QueryMock(prod);
  };
  Product.findById = (id) => new QueryMock(db.products.find((p) => p._id.toString() === id.toString()));
  Product.create = async (data) => {
    const prod = {
      _id: `6600000000000000000002${db.products.length + 10}`,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      isDeleted: false,
      isActive: true,
      ...data,
      save: async function () { return this; }
    };
    db.products.push(prod);
    return prod;
  };
  Product.findByIdAndUpdate = async (id, update) => {
    const prod = db.products.find((p) => p._id.toString() === id.toString());
    if (prod) Object.assign(prod, update);
    return prod;
  };
  Product.countDocuments = async () => db.products.filter((p) => !p.isDeleted).length;
  Product.aggregate = async () => [
    { _id: 'linen', count: 1 },
    { _id: 'pinch-pleat', count: 1 },
    { _id: 'blackout', count: 1 },
    { _id: 'champagne beige', count: 1 }
  ];

  // ----------------------------------------------------
  // Mock FilterOption Model Methods
  // ----------------------------------------------------
  FilterOption.find = () => new QueryMock(db.filterOptions.filter((f) => !f.isDeleted));
  FilterOption.findById = (id) => new QueryMock(db.filterOptions.find((f) => f._id.toString() === id.toString()));
  FilterOption.create = async (data) => {
    const item = {
      _id: `6600000000000000000003${db.filterOptions.length + 10}`,
      isDeleted: false,
      isActive: true,
      ...data,
      deleteOne: async function () {}
    };
    db.filterOptions.push(item);
    return item;
  };
  FilterOption.findByIdAndUpdate = async (id, update) => {
    const item = db.filterOptions.find((f) => f._id.toString() === id.toString());
    if (item) Object.assign(item, update);
    return item;
  };

  // ----------------------------------------------------
  // Mock Navigation Model Methods
  // ----------------------------------------------------
  Navigation.find = () => new QueryMock(db.navigation.filter((n) => !n.isDeleted));
  Navigation.findById = (id) => new QueryMock(db.navigation.find((n) => n._id.toString() === id.toString()));
  Navigation.create = async (data) => {
    const item = {
      _id: `6600000000000000000004${db.navigation.length + 10}`,
      isDeleted: false,
      isActive: true,
      ...data
    };
    db.navigation.push(item);
    return item;
  };
  Navigation.findByIdAndUpdate = async (id, update) => {
    const item = db.navigation.find((n) => n._id.toString() === id.toString());
    if (item) Object.assign(item, update);
    return item;
  };
  Navigation.updateMany = async () => ({ acknowledged: true });

  // ----------------------------------------------------
  // Mock Blog Model Methods
  // ----------------------------------------------------
  Blog.find = () => new QueryMock(db.blogs.filter((b) => !b.isDeleted));
  Blog.findOne = (query) => {
    const blog = db.blogs.find((b) => b.slug === query?.slug && !b.isDeleted);
    return new QueryMock(blog);
  };
  Blog.findById = (id) => new QueryMock(db.blogs.find((b) => b._id.toString() === id.toString()));
  Blog.create = async (data) => {
    const item = {
      _id: `6600000000000000000005${db.blogs.length + 10}`,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      isDeleted: false,
      isPublished: true,
      ...data
    };
    db.blogs.push(item);
    return item;
  };
  Blog.findByIdAndUpdate = async (id, update) => {
    const item = db.blogs.find((b) => b._id.toString() === id.toString());
    if (item) Object.assign(item, update);
    return item;
  };
  Blog.countDocuments = async () => db.blogs.filter((b) => !b.isDeleted).length;

  // ----------------------------------------------------
  // Mock Swatch Model Methods
  // ----------------------------------------------------
  Swatch.find = () => new QueryMock(db.swatches.filter((s) => !s.isDeleted));
  Swatch.findById = (id) => new QueryMock(db.swatches.find((s) => s._id.toString() === id.toString()));
  Swatch.create = async (data) => {
    const item = {
      _id: `6600000000000000000006${db.swatches.length + 10}`,
      isDeleted: false,
      ...data
    };
    db.swatches.push(item);
    return item;
  };
  Swatch.findByIdAndUpdate = async (id, update) => {
    const item = db.swatches.find((s) => s._id.toString() === id.toString());
    if (item) Object.assign(item, update);
    return item;
  };
  Swatch.countDocuments = async () => db.swatches.filter((s) => !s.isDeleted).length;

  // ----------------------------------------------------
  // Mock SwatchOrder Model Methods
  // ----------------------------------------------------
  SwatchOrder.create = async (data) => {
    const item = {
      _id: `6600000000000000000007${db.swatchOrders.length + 10}`,
      orderNumber: `SW-${Date.now().toString().slice(-6)}`,
      status: 'pending',
      ...data,
      save: async function () { return this; }
    };
    db.swatchOrders.push(item);
    return item;
  };
  SwatchOrder.find = () => new QueryMock(db.swatchOrders);
  SwatchOrder.findById = (id) => new QueryMock(db.swatchOrders.find((s) => s._id.toString() === id.toString()));
  SwatchOrder.countDocuments = async () => db.swatchOrders.length;

  // ----------------------------------------------------
  // Mock CustomizerRule Model Methods
  // ----------------------------------------------------
  CustomizerRule.findOne = (query) => {
    let rule = null;
    if (query && query.key) {
      rule = db.customizerRules.find((r) => r.key === query.key && !r.isDeleted);
    } else {
      rule = db.customizerRules.find((r) => r.isActive && !r.isDeleted);
    }
    return new QueryMock(rule);
  };
  CustomizerRule.findById = (id) => new QueryMock(db.customizerRules.find((r) => r._id.toString() === id.toString()));
  CustomizerRule.find = () => new QueryMock(db.customizerRules.filter((r) => !r.isDeleted));
  CustomizerRule.create = async (data) => {
    const item = {
      _id: `6600000000000000000008${db.customizerRules.length + 10}`,
      isActive: true,
      isDeleted: false,
      ...data
    };
    db.customizerRules.push(item);
    return item;
  };
  CustomizerRule.findByIdAndUpdate = async (id, update) => {
    const item = db.customizerRules.find((r) => r._id.toString() === id.toString());
    if (item) Object.assign(item, update);
    return item;
  };

  // ----------------------------------------------------
  // Mock Order Model Methods
  // ----------------------------------------------------
  Order.find = () => new QueryMock(db.orders.filter((o) => !o.isDeleted));
  Order.findById = (id) => new QueryMock(db.orders.find((o) => o._id.toString() === id.toString()));
  Order.create = async (data) => {
    const item = {
      _id: `6600000000000000000009${db.orders.length + 10}`,
      orderNumber: `IHF-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      fulfillmentStatus: 'Pending',
      isDeleted: false,
      ...data,
      save: async function () { return this; }
    };
    db.orders.push(item);
    return item;
  };
  Order.findOneAndUpdate = async (query, update) => {
    const item = db.orders[0];
    if (item) Object.assign(item, update);
    return item;
  };
  Order.findByIdAndUpdate = async (id, update) => {
    const item = db.orders.find((o) => o._id.toString() === id.toString());
    if (item) Object.assign(item, update);
    return item;
  };
  Order.countDocuments = async () => db.orders.filter((o) => !o.isDeleted).length;
}

export default {
  db,
  setupMockDatabase
};
