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
import CustomizerFlow from '../src/models/CustomizerFlow.js';
import CustomizerStep from '../src/models/CustomizerStep.js';
import OptionLayer from '../src/models/OptionLayer.js';
import Order from '../src/models/Order.js';
import FabricOption from '../src/models/FabricOption.js';
import ActivityLog from '../src/models/ActivityLog.js';

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
  customizerFlows: [],
  customizerSteps: [],
  optionLayers: [],
  orders: [],
  fabricOptions: [],
  activityLogs: []
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
            if (key === 'collectionType' && item.collectionType !== query[key]) return false;
            if (key === 'priceGroup' && item.priceGroup !== query[key]) return false;
            if (key === 'isPopular' && item.isPopular !== query[key]) return false;
            if (key === 'materialGroup') {
              if (query[key] instanceof RegExp && !query[key].test(item.materialGroup)) return false;
              if (typeof query[key] === 'string' && item.materialGroup !== query[key]) return false;
            }
            if (key === 'flowRef' && item.flowRef?.toString() !== query[key]?.toString()) return false;
            if (key === 'stepRef' && item.stepRef?.toString() !== query[key]?.toString()) return false;
            if (key === 'status' && item.status !== query[key]) return false;
            if (key === 'isEnabled' && item.isEnabled !== query[key]) return false;
            if (key === 'isArchived') {
              if (query[key] && typeof query[key] === 'object' && query[key].$ne !== undefined) {
                if (item.isArchived === query[key].$ne) return false;
              } else if (Boolean(item.isArchived) !== Boolean(query[key])) {
                return false;
              }
            }
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

  sort(criteria) {
    if (Array.isArray(this._data) && criteria && typeof criteria === 'object') {
      const field = Object.keys(criteria)[0];
      const direction = criteria[field];
      this._data = [...this._data].sort((a, b) => {
        if (a[field] < b[field]) return direction === -1 ? 1 : -1;
        if (a[field] > b[field]) return direction === -1 ? -1 : 1;
        return 0;
      });
    }
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
  if (!user.refreshTokens) user.refreshTokens = [];
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

  const flowId = '660000000000000000000050';
  db.customizerFlows = [
    {
      _id: flowId,
      name: 'Drapery configurator',
      slug: 'drapery-configurator',
      description: 'Primary made-to-measure bespoke draperies flow',
      status: 'published',
      version: 8,
      totalSteps: 9,
      totalOptions: 42,
      totalRules: 12,
      isDefault: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    }
  ];

  db.customizerSteps = [
    {
      _id: '660000000000000000000051',
      flowRef: flowId,
      internalName: 'Choose style',
      stepNumber: '01',
      displayOrder: 1,
      heading: 'Choose Your Drapery Style',
      description: 'Select heading pleat and tailoring silhouette.',
      stepType: 'style',
      isEnabled: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000052',
      flowRef: flowId,
      internalName: 'Select fabric',
      stepNumber: '02',
      displayOrder: 2,
      heading: 'Select Atelier Fabric',
      description: 'Choose from Belgian flax linen, silk dupioni, or wool weaves.',
      stepType: 'fabric',
      isEnabled: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000053',
      flowRef: flowId,
      internalName: 'Measurements',
      stepNumber: '03',
      displayOrder: 3,
      heading: 'Tell Us About Your Window',
      description: 'Guide the customer with concise, reassuring atelier expertise.',
      stepType: 'dimensions',
      isEnabled: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000054',
      flowRef: flowId,
      internalName: 'Mount & position',
      stepNumber: '04',
      displayOrder: 4,
      heading: 'Mounting & Position',
      description: 'Determine ceiling vs wall mount placement.',
      stepType: 'mount',
      isEnabled: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000055',
      flowRef: flowId,
      internalName: 'Lining',
      stepNumber: '05',
      displayOrder: 5,
      heading: 'Select Luxury Lining',
      description: 'Choose privacy, room darkening blackout, or thermal interlining.',
      stepType: 'lining',
      isEnabled: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000056',
      flowRef: flowId,
      internalName: 'Control system',
      stepNumber: '06',
      displayOrder: 6,
      heading: 'Control System',
      description: 'Select manual baton, cord traverse, or motorized system.',
      stepType: 'control',
      isEnabled: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000057',
      flowRef: flowId,
      internalName: 'Hardware',
      stepNumber: '07',
      displayOrder: 7,
      heading: 'Atelier Hardware & Rods',
      description: 'French return rod or architectural concealed ceiling track.',
      stepType: 'hardware',
      isEnabled: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000058',
      flowRef: flowId,
      internalName: 'Finishing details',
      stepNumber: '08',
      displayOrder: 8,
      heading: 'Finishing Touches',
      description: 'Custom memory shaping, lead corner weights, matching tiebacks.',
      stepType: 'finishing',
      isEnabled: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000059',
      flowRef: flowId,
      internalName: 'Review',
      stepNumber: '09',
      displayOrder: 9,
      heading: 'Review Your Commission',
      description: 'Inspect exact custom dimensions, fabrics, and production timeline.',
      stepType: 'review',
      isEnabled: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    }
  ];

  db.optionLayers = [
    {
      _id: '660000000000000000000060',
      stepRef: '660000000000000000000053',
      flowRef: flowId,
      layerName: 'Primary selection',
      layerType: 'dimensions',
      displayOrder: 1,
      visibilityCondition: {
        type: 'always',
        description: 'Always visible'
      },
      optionsArray: [
        { id: 'custom-width', label: 'Finished Drapery Width (Inches)', value: 'width_input', isDefault: true, priceAddon: 0 },
        { id: 'custom-height', label: 'Finished Drapery Length / Height (Inches)', value: 'height_input', isDefault: true, priceAddon: 0 }
      ],
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000061',
      stepRef: '660000000000000000000053',
      flowRef: flowId,
      layerName: 'Conditional additions',
      layerType: 'selection',
      displayOrder: 2,
      visibilityCondition: {
        type: 'conditional',
        ruleExpression: { ifField: 'width', operator: 'greater_than', value: 120 },
        description: 'Shown when rules match'
      },
      optionsArray: [
        { id: 'heavy-duty-bracket', label: 'Heavy-Duty Center Support Bracket', value: 'bracket_center', priceAddon: 45, isDefault: true },
        { id: 'split-draw', label: 'Two-Way Center Split Draw', value: 'pair_split', priceAddon: 0, isDefault: true }
      ],
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
    },
    {
      _id: '660000000000000000000062',
      stepRef: '660000000000000000000053',
      flowRef: flowId,
      layerName: 'Help & measurement guidance',
      layerType: 'guidance',
      displayOrder: 3,
      visibilityCondition: {
        type: 'always',
        description: 'Always visible'
      },
      optionsArray: [
        { id: 'puddle-guide', label: 'Puddle Allowance Guide (0" to +3")', value: 'puddle_note', priceAddon: 0 }
      ],
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () { return this; }
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
    } else if (query && query['refreshTokens.tokenHash']) {
      result = db.users.find(
        (u) => (u.refreshTokens || []).some((t) => t.tokenHash === query['refreshTokens.tokenHash']) && !u.isDeleted
      );
    }
    const q = new QueryMock(hydrateUser(result));
    q.select = () => q;
    return q;
  };

  User.updateOne = async (filter, update) => {
    let user = null;
    if (filter['refreshTokens.tokenHash']) {
      user = db.users.find((u) => (u.refreshTokens || []).some((t) => t.tokenHash === filter['refreshTokens.tokenHash']));
      if (user && update.$pull && update.$pull.refreshTokens) {
        user.refreshTokens = user.refreshTokens.filter(
          (t) => t.tokenHash !== update.$pull.refreshTokens.tokenHash
        );
      }
    }
    return { acknowledged: true, modifiedCount: user ? 1 : 0 };
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
  // Mock CustomizerFlow Model Methods
  // ----------------------------------------------------
  CustomizerFlow.find = (query) => {
    let items = db.customizerFlows.filter((f) => !f.isArchived);
    if (query) {
      if (query.includeArchived) items = [...db.customizerFlows];
      if (query.status) items = items.filter((f) => f.status === query.status);
    }
    return new QueryMock(items);
  };
  CustomizerFlow.findOne = (query) => {
    let item = null;
    if (query) {
      if (query.slug) item = db.customizerFlows.find((f) => f.slug === query.slug && !f.isArchived);
      else if (query.status && query.isDefault) item = db.customizerFlows.find((f) => f.status === query.status && f.isDefault && !f.isArchived);
      else if (query.status) item = db.customizerFlows.find((f) => f.status === query.status && !f.isArchived);
      else item = db.customizerFlows.find((f) => !f.isArchived);
    } else {
      item = db.customizerFlows.find((f) => !f.isArchived);
    }
    return new QueryMock(item);
  };
  CustomizerFlow.findById = (id) => new QueryMock(db.customizerFlows.find((f) => f._id.toString() === id.toString()));
  CustomizerFlow.create = async (data) => {
    const item = {
      _id: `6600000000000000000000f${db.customizerFlows.length + 1}`,
      version: 1,
      status: 'draft',
      totalSteps: 0,
      totalOptions: 0,
      totalRules: 0,
      isDefault: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
      save: async function () { return this; }
    };
    db.customizerFlows.push(item);
    return item;
  };
  CustomizerFlow.findByIdAndUpdate = async (id, update) => {
    const item = db.customizerFlows.find((f) => f._id.toString() === id.toString());
    if (item) {
      Object.assign(item, update);
      item.updatedAt = new Date();
    }
    return item;
  };
  CustomizerFlow.countDocuments = async (query) => {
    if (query && query.isArchived) return db.customizerFlows.filter((f) => !f.isArchived).length;
    return db.customizerFlows.length;
  };

  // ----------------------------------------------------
  // Mock CustomizerStep Model Methods
  // ----------------------------------------------------
  CustomizerStep.find = (query) => {
    let items = db.customizerSteps.filter((s) => !s.isArchived);
    if (query) {
      if (query.flowRef) items = items.filter((s) => s.flowRef.toString() === query.flowRef.toString());
      if (query.isEnabled !== undefined) items = items.filter((s) => s.isEnabled === query.isEnabled);
    }
    return new QueryMock(items);
  };
  CustomizerStep.findOne = (query) => {
    let items = db.customizerSteps.filter((s) => !s.isArchived);
    if (query && query.flowRef) items = items.filter((s) => s.flowRef.toString() === query.flowRef.toString());
    return new QueryMock(items[0] || null);
  };
  CustomizerStep.findById = (id) => new QueryMock(db.customizerSteps.find((s) => s._id.toString() === id.toString()));
  CustomizerStep.create = async (data) => {
    const item = {
      _id: `6600000000000000000000s${db.customizerSteps.length + 1}`,
      displayOrder: db.customizerSteps.length + 1,
      isEnabled: true,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
      save: async function () { return this; }
    };
    db.customizerSteps.push(item);
    return item;
  };
  CustomizerStep.findByIdAndUpdate = async (id, update) => {
    const item = db.customizerSteps.find((s) => s._id.toString() === id.toString());
    if (item) {
      Object.assign(item, update);
      item.updatedAt = new Date();
    }
    return item;
  };
  CustomizerStep.updateMany = async (query, update) => {
    let count = 0;
    db.customizerSteps.forEach((s) => {
      if (!query || (query.flowRef && s.flowRef.toString() === query.flowRef.toString())) {
        Object.assign(s, update);
        count++;
      }
    });
    return { modifiedCount: count };
  };
  CustomizerStep.countDocuments = async (query) => {
    let items = db.customizerSteps.filter((s) => !s.isArchived);
    if (query && query.flowRef) items = items.filter((s) => s.flowRef.toString() === query.flowRef.toString());
    return items.length;
  };

  // ----------------------------------------------------
  // Mock OptionLayer Model Methods
  // ----------------------------------------------------
  OptionLayer.find = (query) => {
    let items = db.optionLayers.filter((l) => !l.isArchived);
    if (query) {
      if (query.stepRef) items = items.filter((l) => l.stepRef.toString() === query.stepRef.toString());
      if (query.flowRef) items = items.filter((l) => l.flowRef.toString() === query.flowRef.toString());
    }
    return new QueryMock(items);
  };
  OptionLayer.findOne = (query) => {
    let items = db.optionLayers.filter((l) => !l.isArchived);
    if (query && query.stepRef) items = items.filter((l) => l.stepRef.toString() === query.stepRef.toString());
    return new QueryMock(items[0] || null);
  };
  OptionLayer.findById = (id) => new QueryMock(db.optionLayers.find((l) => l._id.toString() === id.toString()));
  OptionLayer.create = async (data) => {
    const item = {
      _id: `6600000000000000000000l${db.optionLayers.length + 1}`,
      displayOrder: db.optionLayers.length + 1,
      optionsArray: [],
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
      save: async function () { return this; }
    };
    db.optionLayers.push(item);
    return item;
  };
  OptionLayer.findByIdAndUpdate = async (id, update) => {
    const item = db.optionLayers.find((l) => l._id.toString() === id.toString());
    if (item) {
      Object.assign(item, update);
      item.updatedAt = new Date();
    }
    return item;
  };
  OptionLayer.updateMany = async (query, update) => {
    let count = 0;
    db.optionLayers.forEach((l) => {
      if (!query || (query.flowRef && l.flowRef.toString() === query.flowRef.toString()) || (query.stepRef && l.stepRef.toString() === query.stepRef.toString())) {
        Object.assign(l, update);
        count++;
      }
    });
    return { modifiedCount: count };
  };
  OptionLayer.countDocuments = async (query) => {
    let items = db.optionLayers.filter((l) => !l.isArchived);
    if (query && query.flowRef) items = items.filter((l) => l.flowRef.toString() === query.flowRef.toString());
    if (query && query.stepRef) items = items.filter((l) => l.stepRef.toString() === query.stepRef.toString());
    return items.length;
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

  // ----------------------------------------------------
  // Mock FabricOption Model Methods & Data
  // ----------------------------------------------------
  db.fabricOptions = [
    {
      _id: '6600000000000000000000a1',
      name: 'White Linen',
      slug: 'white-linen',
      collectionType: 'LINENS',
      materialGroup: 'LINENS & NATURAL WEAVES',
      materialDescription: 'Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.',
      priceGroup: 'A',
      fromPrice: 650,
      color: { name: 'White', hexCode: '#F5F5F0' },
      image: '/figma/home-02.png',
      specs: {
        composition: '100% Belgian Flax Linen',
        weight: '320 GSM (Heavyweight Architectural Drape)',
        durability: '30,000 Martindale Rubs (Commercial Grade)',
        lightFiltering: 'Semi-Sheer to Light Filtering (Soft Glow)',
        care: 'Professional dry clean or steam in situ.'
      },
      isPopular: true,
      displayOrder: 1,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000a2',
      name: 'Clay Linen',
      slug: 'clay-linen',
      collectionType: 'LINENS',
      materialGroup: 'LINENS & NATURAL WEAVES',
      materialDescription: 'Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.',
      priceGroup: 'A',
      fromPrice: 650,
      color: { name: 'Clay', hexCode: '#D2B48C' },
      image: '/figma/home-18.jpeg',
      specs: {
        composition: '100% Belgian Flax Linen',
        weight: '320 GSM (Heavyweight Architectural Drape)',
        durability: '30,000 Martindale Rubs (Commercial Grade)',
        lightFiltering: 'Light Filtering to Privacy (Warm Amber)',
        care: 'Professional dry clean or steam in situ.'
      },
      isPopular: true,
      displayOrder: 2,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000a3',
      name: 'Slate Wool',
      slug: 'slate-wool',
      collectionType: 'WOOLS + BLENDS',
      materialGroup: 'WOOL & BLENDS',
      materialDescription: 'Finely spun virgin wool blend creating substantial drape with acoustic sound-dampening qualities and thermal insulation.',
      priceGroup: 'B',
      fromPrice: 720,
      color: { name: 'Slate', hexCode: '#708090' },
      image: '/figma/home-07.jpeg',
      specs: {
        composition: '70% Wool, 30% Fine Cashmere Blend',
        weight: '440 GSM (Substantial Acoustic Weave)',
        durability: '45,000 Martindale Rubs (High Residential)',
        lightFiltering: 'Dimout to Room Darkening',
        care: 'Strictly professional dry clean only.'
      },
      isPopular: false,
      displayOrder: 3,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000a4',
      name: 'Oatmeal Linen',
      slug: 'oatmeal-linen',
      collectionType: 'LINENS',
      materialGroup: 'LINENS & NATURAL WEAVES',
      materialDescription: 'Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.',
      priceGroup: 'A',
      fromPrice: 650,
      color: { name: 'Oatmeal', hexCode: '#E6D7B9' },
      image: '/figma/home-03.jpeg',
      closeupImage: '/figma/home-03.jpeg',
      specs: {
        composition: '100% Belgian Flax Linen',
        weight: '320 GSM (Heavyweight Architectural Drape)',
        durability: '30,000 Martindale Rubs (Commercial Grade)',
        lightFiltering: 'Semi-Sheer to Light Filtering (Soft Glow)',
        care: 'Professional dry clean or steam in situ.'
      },
      isPopular: true,
      displayOrder: 4,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000a5',
      name: 'Sand Wool Blend',
      slug: 'sand-wool-blend',
      collectionType: 'WOOLS + BLENDS',
      materialGroup: 'WOOL & BLENDS',
      materialDescription: 'Finely spun virgin wool blend creating substantial drape with acoustic sound-dampening qualities and thermal insulation.',
      priceGroup: 'B',
      fromPrice: 720,
      color: { name: 'Sand', hexCode: '#C2B280' },
      image: '/figma/home-04.jpeg',
      specs: {
        composition: '75% Merino Wool, 25% Organic Cotton',
        weight: '410 GSM (Thermal Insulation Drape)',
        durability: '40,000 Martindale Rubs',
        lightFiltering: 'Room Darkening with Soft Warm Tone',
        care: 'Professional dry clean.'
      },
      isPopular: true,
      displayOrder: 5,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000a6',
      name: 'Sky Cotton',
      slug: 'sky-cotton',
      collectionType: 'COTTONS',
      materialGroup: 'COTTON & BLENDS',
      materialDescription: 'Crisp, matte organic cotton sateen with fluid hand and smooth contemporary finish for modern homes.',
      priceGroup: 'A',
      fromPrice: 650,
      color: { name: 'Sky', hexCode: '#87CEEB' },
      image: '/figma/home-17.jpeg',
      specs: {
        composition: '100% Long-Staple Pima Cotton',
        weight: '290 GSM (Tailored Crisp Fold)',
        durability: '35,000 Martindale Rubs',
        lightFiltering: 'Light Filtering to Privacy',
        care: 'Dry clean or gentle spot wash.'
      },
      isPopular: false,
      displayOrder: 6,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000a7',
      name: 'Terracotta Cotton',
      slug: 'terracotta-cotton',
      collectionType: 'COTTONS',
      materialGroup: 'COTTON & BLENDS',
      materialDescription: 'Crisp, matte organic cotton sateen with fluid hand and smooth contemporary finish for modern homes.',
      priceGroup: 'A',
      fromPrice: 650,
      color: { name: 'Terracotta', hexCode: '#E2725B' },
      image: '/figma/home-12.jpeg',
      specs: {
        composition: '100% Organic Washed Cotton Canvas',
        weight: '310 GSM (Substantial Casual Hang)',
        durability: '38,000 Martindale Rubs',
        lightFiltering: 'Medium Privacy Diffusion',
        care: 'Machine wash delicate or dry clean.'
      },
      isPopular: true,
      displayOrder: 7,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000a8',
      name: 'Sage Linen',
      slug: 'sage-linen',
      collectionType: 'LINENS',
      materialGroup: 'LINENS & NATURAL WEAVES',
      materialDescription: 'Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.',
      priceGroup: 'A',
      fromPrice: 650,
      color: { name: 'Sage', hexCode: '#9DC183' },
      image: '/figma/home-15.jpeg',
      specs: {
        composition: '100% French Natural Flax',
        weight: '330 GSM (Fluid Architectonic Fall)',
        durability: '32,000 Martindale Rubs',
        lightFiltering: 'Semi-Sheer to Light Filtering',
        care: 'Professional dry clean or steam in situ.'
      },
      isPopular: true,
      displayOrder: 8,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000a9',
      name: 'Forest Velvet',
      slug: 'forest-velvet',
      collectionType: 'SOLIDS',
      materialGroup: 'LUXURY VELVET',
      materialDescription: 'Ultra-luxurious dense cotton-silk velvet pile offering extraordinary light extinction, thermal noise cancellation, and rich opulence.',
      priceGroup: 'C',
      fromPrice: 850,
      color: { name: 'Forest', hexCode: '#228B22' },
      image: '/figma/home-13.png',
      specs: {
        composition: '80% Cotton Velvet, 20% Natural Silk',
        weight: '540 GSM (Master Estate Velvet)',
        durability: '50,000 Martindale Rubs (Contract Grade)',
        lightFiltering: 'Full Eclipse Blackout Compatible',
        care: 'Specialist velvet dry clean only.'
      },
      isPopular: true,
      displayOrder: 9,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000aa',
      name: 'Charcoal Velvet',
      slug: 'charcoal-velvet',
      collectionType: 'SOLIDS',
      materialGroup: 'LUXURY VELVET',
      materialDescription: 'Ultra-luxurious dense cotton-silk velvet pile offering extraordinary light extinction, thermal noise cancellation, and rich opulence.',
      priceGroup: 'C',
      fromPrice: 850,
      color: { name: 'Charcoal', hexCode: '#36454F' },
      image: '/figma/home-06.jpeg',
      specs: {
        composition: '80% Cotton Velvet, 20% Natural Silk',
        weight: '540 GSM (Master Estate Velvet)',
        durability: '50,000 Martindale Rubs (Contract Grade)',
        lightFiltering: 'Full Eclipse Blackout Compatible',
        care: 'Specialist velvet dry clean only.'
      },
      isPopular: true,
      displayOrder: 10,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000ab',
      name: 'Airy Voile Sheer',
      slug: 'airy-voile-sheer',
      collectionType: 'SHEERS',
      materialGroup: 'ARCHITECTURAL SHEERS',
      materialDescription: 'Ethereal sheer open weave that gracefully floods spaces with natural light while softening glare and preserving panoramic views.',
      priceGroup: 'A',
      fromPrice: 550,
      color: { name: 'Ivory White', hexCode: '#FFFFF0' },
      image: '/figma/home-11.png',
      specs: {
        composition: '100% Fine Spun Linen Voile',
        weight: '160 GSM (Float Drape)',
        durability: '25,000 Martindale Rubs',
        lightFiltering: 'Maximum Daylight Transmittance',
        care: 'Gentle hand steam or dry clean.'
      },
      isPopular: true,
      displayOrder: 11,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000ac',
      name: 'Oyster Dupioni Silk',
      slug: 'oyster-dupioni-silk',
      collectionType: 'SILKS',
      materialGroup: 'NATURAL RAW SILKS',
      materialDescription: 'Hand-reeled mulberry silk with characteristic irregular slub texture that shimmers with multi-dimensional luster under sunlight.',
      priceGroup: 'C',
      fromPrice: 890,
      color: { name: 'Oyster', hexCode: '#EAE6DF' },
      image: '/figma/home-05.png',
      specs: {
        composition: '100% Pure Hand-Spun Mulberry Silk',
        weight: '260 GSM (Lustrous Crisp Hang)',
        durability: '30,000 Martindale Rubs',
        lightFiltering: 'Requires Interlining for Sun Protection',
        care: 'Dry clean only.'
      },
      isPopular: true,
      displayOrder: 12,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000ad',
      name: 'Botanical Toile Linen',
      slug: 'botanical-toile-linen',
      collectionType: 'PATTERNS',
      materialGroup: 'ARTISAN PATTERNS',
      materialDescription: 'Hand-screened floral and architectural toile on rustic linen ground, tailored for statement library and salon treatments.',
      priceGroup: 'B',
      fromPrice: 750,
      color: { name: 'Clay', hexCode: '#D2B48C' },
      image: '/figma/home-18.jpeg',
      specs: {
        composition: '100% Pure French Linen',
        weight: '340 GSM',
        durability: '35,000 Martindale Rubs',
        lightFiltering: 'Privacy & Light Diffusion',
        care: 'Dry clean only.'
      },
      isPopular: false,
      displayOrder: 13,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000ae',
      name: 'Pastel Cloud Cotton',
      slug: 'pastel-cloud-cotton',
      collectionType: 'KIDS',
      materialGroup: 'COTTON & BLENDS',
      materialDescription: 'OEKO-TEX certified chemical-free nursery and children drapery cotton with hypo-allergenic finish.',
      priceGroup: 'A',
      fromPrice: 580,
      color: { name: 'White', hexCode: '#F5F5F0' },
      image: '/figma/home-02.png',
      specs: {
        composition: '100% Organic Combed Cotton',
        weight: '280 GSM',
        durability: '40,000 Martindale Rubs',
        lightFiltering: 'Pairs perfectly with 100% Blackout Lining',
        care: 'Machine washable on cold gentle cycle.'
      },
      isPopular: false,
      displayOrder: 14,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000af',
      name: 'Heritage Bouclé Drape',
      slug: 'heritage-boucle-drape',
      collectionType: 'DESIGNERS',
      materialGroup: 'DESIGNER COUTURE',
      materialDescription: 'Architectural heavy looped yarn bouclé bringing high-fashion runway tactile depth to modern interior windows.',
      priceGroup: 'C',
      fromPrice: 920,
      color: { name: 'Sand', hexCode: '#C2B280' },
      image: '/figma/home-04.jpeg',
      specs: {
        composition: '65% Alpaca Wool, 35% Textured Cotton Bouclé',
        weight: '560 GSM (Heavyweight Couture Weight)',
        durability: '45,000 Martindale Rubs',
        lightFiltering: 'Heavy Light Dimout',
        care: 'Professional dry clean only.'
      },
      isPopular: true,
      displayOrder: 15,
      isActive: true,
      isDeleted: false
    },
    {
      _id: '6600000000000000000000b0',
      name: 'Sunbrella Sailcloth Salt',
      slug: 'sunbrella-sailcloth-salt',
      collectionType: 'SUNBRELLA',
      materialGroup: 'PERFORMANCE SUNBRELLA',
      materialDescription: 'Bleach-cleanable, fade-proof solution-dyed acrylic fabric built for sunrooms, coastal estates, and high-UV exposure.',
      priceGroup: 'B',
      fromPrice: 710,
      color: { name: 'Oatmeal', hexCode: '#E6D7B9' },
      image: '/figma/home-03.jpeg',
      specs: {
        composition: '100% Solution-Dyed Acrylic',
        weight: '380 GSM',
        durability: '50,000 Double Rubs (Heavy Duty)',
        lightFiltering: 'UV 98% Blockage / Light Filtering',
        care: 'Bleach cleanable & water repellent.'
      },
      isPopular: true,
      displayOrder: 16,
      isActive: true,
      isDeleted: false
    }
  ];

  FabricOption.find = (query) => {
    let items = db.fabricOptions.filter((f) => !f.isDeleted);
    if (query) {
      if (query.collectionType) {
        items = items.filter((f) => f.collectionType === query.collectionType);
      }
      if (query.priceGroup) {
        items = items.filter((f) => f.priceGroup === query.priceGroup);
      }
      if (query.isPopular !== undefined) {
        items = items.filter((f) => f.isPopular === query.isPopular);
      }
      if (query.materialGroup) {
        if (query.materialGroup instanceof RegExp) {
          items = items.filter((f) => query.materialGroup.test(f.materialGroup));
        } else if (typeof query.materialGroup === 'string') {
          items = items.filter((f) => f.materialGroup === query.materialGroup);
        }
      }
      if (query.isActive !== undefined) {
        items = items.filter((f) => f.isActive === query.isActive);
      }
    }
    return new QueryMock(items);
  };
  FabricOption.findById = (id) => new QueryMock(db.fabricOptions.find((f) => f._id.toString() === id.toString()));
  FabricOption.create = async (data) => {
    const item = {
      _id: `6600000000000000000000c${db.fabricOptions.length + 1}`,
      isActive: true,
      isDeleted: false,
      ...data
    };
    db.fabricOptions.push(item);
    return item;
  };
  FabricOption.findByIdAndUpdate = async (id, update) => {
    const item = db.fabricOptions.find((f) => f._id.toString() === id.toString());
    if (item) Object.assign(item, update);
    return item;
  };
  FabricOption.countDocuments = async () => db.fabricOptions.filter((f) => !f.isDeleted).length;

  ActivityLog.find = (query) => {
    let items = [...db.activityLogs];
    if (query) {
      if (query.action) items = items.filter((l) => l.action === query.action);
      if (query.resource) items = items.filter((l) => l.resource === query.resource);
      if (query.user) items = items.filter((l) => l.user?.toString() === query.user.toString());
    }
    return new QueryMock(items);
  };
  ActivityLog.findById = (id) => new QueryMock(db.activityLogs.find((l) => l._id.toString() === id.toString()));
  ActivityLog.create = async (data) => {
    const item = {
      _id: `6600000000000000000000d${db.activityLogs.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    };
    db.activityLogs.push(item);
    return item;
  };
  ActivityLog.countDocuments = async () => db.activityLogs.length;
}

export default {
  db,
  setupMockDatabase
};
