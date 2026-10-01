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
import Consultation from '../src/models/Consultation.js';

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
  activityLogs: [],
  consultations: []
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
            if (key === '$or') {
              const matches = query.$or.some((clause) => Object.entries(clause).some(([field, expected]) => {
                const actual = item[field]?.toString();
                if (expected?.$in) return expected.$in.some(value => value?.toString() === actual);
                return expected?.toString() === actual;
              }));
              if (!matches) return false;
              continue;
            }
            if (key === 'isActive' && item.isActive !== query[key]) return false;
            if (key === 'isDeleted' && (item.isDeleted || false) !== (query[key] || false)) return false;
            if (key === 'isPublished' && item.isPublished !== query[key]) return false;
            if (key === 'parent' && item.parent !== query[key]) return false;
            if (key === 'parentCategory' && item.parentCategory?.toString() !== query[key]?.toString()) return false;
            if (key === 'subCategory' && item.subCategory?.toString() !== query[key]?.toString()) return false;
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

  lean() {
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

  db.categories.push(...[
    ['drapery','Drapery','Frame Every View','/figma/home-hero-hd.png'],
    ['shades','Shades','Shape the Light','/figma/cat-shades-new.png'],
    ['valances','Valances & Cornices','Complete the Window','/figma/home-18.jpeg'],
    ['pillows','Pillows','Comfort, Composed','/figma/cat-cushions-new.png'],
    ['bedding','Bedding','Elevate Your Bedroom','/figma/product-linen-bedspread-hd.png'],
    ['table-linen','Table Linen','Set a Beautiful Table','/figma/cat-table-linen.png'],
    ['decor','Decor & More','Details Make the Room','/figma/cat-decor.png'],
    ['fabrics','Fabrics & Swatches','Begin with the Fabric','/figma/home-04.jpeg']
  ].map(([slug,name,headline,heroImage],index)=>({
    _id:`67000000000000000000000${index}`, name, slug, description:`Complete ${name.toLowerCase()} storefront collection.`,
    parentCategory:null, displayOrder:index+1, isActive:true, isDeleted:false,
    image:{url:heroImage,alt:name}, storefront:{eyebrow:`THE ${name.toUpperCase()} COLLECTION`,headline,heroImage,guideTitle:`The ${name} Guide`,guideCopy:`Expert advice for choosing ${name.toLowerCase()}.`,materialCards:['Belgian Linen','Organic Cotton','Silk Velvet','Wool Blend'].map((material,materialIndex)=>({name:material,slug:material.toLowerCase().replaceAll(' ','-'),description:'Natural texture with lasting performance.',image:['/figma/home-04.jpeg','/figma/home-03.jpeg','/figma/home-12.jpeg','/figma/home-18.jpeg'][materialIndex],price:95+materialIndex*40}))},
    subcategories:[], save:async function(){return this;}
  })));

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

  const childSets = {
    drapery:['Ripple Fold Drapery','Tailored Pleat Drapery','Pinch Pleat Drapery','Grommet Drapery','Inverted Pleat Drapery'],
    shades:['Flat Roman Shades','Relaxed Roman Shades','Cascade Shades','Woven Shades','Blackout Shades'],
    valances:['Upholstered Cornices','Soft Valances','Board-Mounted Valances','Swags & Cascades','Custom Pelmets'],
    pillows:['Decorative Pillows','Lumbar Pillows','Bolsters','Euro Shams','Outdoor Pillows'],
    bedding:['Duvet Covers','Quilts & Coverlets','Comforters','Sheets','Blankets & Throws'],
    'table-linen':['Tablecloths','Table Runners','Napkins','Placemats','Cocktail Linens'],
    decor:['Throws','Decorative Objects','Baskets','Wall Decor','Hardware & Trims'],
    fabrics:['Linen Swatches','Cotton Swatches','Velvet Swatches','Sheers','Trims & Passementerie']
  };
  const productImages=['/figma/product-linen-bedspread-hd.png','/figma/home-15.jpeg','/figma/home-11.png','/figma/home-10.jpeg','/figma/home-01.jpeg','/figma/home-17.jpeg','/figma/home-12.jpeg','/figma/home-18.jpeg'];
  const slugifyLocal = value => value.toLowerCase().replaceAll('&','and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  Object.entries(childSets).forEach(([parentSlug, names], categoryIndex) => {
    const parent = db.categories.find(category => category.slug === parentSlug);
    names.forEach((name, childIndex) => {
      const subId = `68${String(categoryIndex).padStart(2,'0')}${String(childIndex).padStart(2,'0')}000000000000000000`;
      const slug = slugifyLocal(name);
      db.categories.push({_id:subId,name,slug,description:`Explore our atelier collection of ${name.toLowerCase()}.`,parentCategory:parent._id,displayOrder:childIndex+1,isActive:true,isDeleted:false,image:{url:productImages[(categoryIndex+childIndex)%productImages.length],alt:name},save:async function(){return this;}});
      [0,1].forEach(variant => {
        const title = `${variant ? 'Heritage' : 'Signature'} ${name}`;
        db.products.push({
          _id:`69${String(categoryIndex).padStart(2,'0')}${String(childIndex).padStart(2,'0')}${variant}00000000000000000`, title, slug:slugifyLocal(title), sku:`IHF-${categoryIndex}${childIndex}${variant}`, shortDescription:`A refined ${name.toLowerCase()} design in premium natural fibres.`,
          description:`Thoughtfully developed by the India Home Furnishings atelier, ${title} combines beautiful natural texture, considered proportion and enduring performance.`, category:parent._id, subCategory:subId,
          basePrice:145+categoryIndex*25+childIndex*18+variant*55, compareAtPrice:null, currency:'USD', pricePerYard:68, fabricType:variant?'organic cotton':'linen',
          colors:[{name:'Natural',hexCode:'#d8d0c1',inStock:true},{name:'Ivory',hexCode:'#eee9df',inStock:true},{name:'Slate',hexCode:'#777b78',inStock:true}], styles:['contemporary','tailored'], features:['natural-fibre','hand-finished'], standardSizes:['Twin','Double','Queen','King','Custom Size'],
          images:[0,1,2,3].map((offset)=>({url:productImages[(categoryIndex+childIndex+offset)%productImages.length],alt:`${title} view ${offset+1}`,isPrimary:offset===0})),
          materialComposition:variant?'100% long-staple organic cotton':'100% European flax linen',weaveConstruction:'Yarn-dyed atelier weave',finishingProcess:'Garment washed for immediate softness',origin:'Jaipur, India · Master Atelier',weight:'260 GSM balanced year-round weight',
          careInstructions:['Machine wash cold','Low tumble dry','Warm iron if desired','Do not bleach'], benefits:[{title:'Breathable',description:'Naturally regulates temperature for year-round comfort.',icon:'♧'},{title:'Softer Over Time',description:'Grows softer and more supple with every wash.',icon:'≈'},{title:'Impeccably Finished',description:'Hand-finished details created for longevity.',icon:'×'},{title:'Effortless Layering',description:'A balanced weight designed to layer beautifully.',icon:'○'}],
          dimensions:[{size:'King',metric:'275 × 270 cm',imperial:'108 × 106 in'},{size:'Queen',metric:'240 × 260 cm',imperial:'94 × 102 in'},{size:'Double',metric:'220 × 240 cm',imperial:'87 × 94 in'}],
          faqs:[{question:'How should I care for this piece?',answer:'Follow the care label and use a gentle cold cycle for lasting softness.'},{question:'Can I order a custom size?',answer:'Yes. Our atelier can tailor this design to your exact requirements.'},{question:'Can I see the material first?',answer:'Yes. Order a swatch to review colour and texture in your own light.'}],
          bundleItems:[{name:'Coordinating Pillow Pair',image:productImages[(categoryIndex+2)%productImages.length],price:95,variant:'Natural · Pair',selected:true},{name:'Layering Throw',image:productImages[(categoryIndex+3)%productImages.length],price:135,variant:'Natural',selected:false}],
          reviews:[{title:'Beautiful material and finish',body:'The texture and tailoring exceeded our expectations.',author:'Verified Client',rating:5,date:'28 Sep 2026'},{title:'Perfectly considered',body:'It changed the entire feeling of the room.',author:'Verified Client',rating:5,date:'14 Sep 2026'}],ratingAverage:4.9,ratingCount:42,
          editorial:{eyebrow:'THE ATELIER',title:'Crafted with Intention',description:'Natural materials, quiet detailing and meticulous workmanship come together in a piece intended to last.',image:productImages[(categoryIndex+4)%productImages.length]},
          stockStatus:'in_stock',inventoryCount:24+childIndex,isCustomizable:parentSlug==='drapery'||parentSlug==='shades',isFeatured:childIndex<2,isActive:true,isDeleted:false,save:async function(){return this;}
        });
      });
    });
  });

  const extraCatalogProducts = [
    { slug: "signature-ripple-fold-drapery", name: "Signature Ripple Fold Drapery", image: "/figma/home-hero-hd.png", description: "Tailored in pure Belgian linen with fluid S-curve folds and smooth ceiling-track glide.", price: 545, cat: "drapery" },
    { slug: "heritage-ripple-fold-drapery", name: "Heritage Ripple Fold Drapery", image: "/figma/home-03.jpeg", description: "Heavyweight textured linen with blackout interlining for luxurious bedroom retreats.", price: 620, cat: "drapery" },
    { slug: "signature-tailored-pleat-drapery", name: "Signature Tailored Pleat Drapery", image: "/figma/home-15.jpeg", description: "Crisp architectural waterfall folds tailored to maintain proportion on tall ceilings.", price: 585, cat: "drapery" },
    { slug: "heritage-pinch-pleat-drapery", name: "Heritage Pinch Pleat Drapery", image: "/figma/home-01.jpeg", description: "Classic hand-stitched triple pleats delivering timeless full-bodied elegance.", price: 650, cat: "drapery" },
    { slug: "flat-belgian-linen-shade", name: "Pure Belgian Flax Flat Roman Shade", image: "/figma/cat-shades-new.png", description: "Seamless flat linen Roman shade with cordless tensioning and concealed cord shroud.", price: 385, cat: "shades" },
    { slug: "relaxed-organic-cotton-shade", name: "Relaxed Combed Cotton Shade", image: "/figma/cat-shades.png", description: "Gently curved center fold tailored in heavyweight combed cotton with blackout core.", price: 415, cat: "shades" },
    { slug: "cascade-ribbed-roman-shade", name: "Cascade Architectural Shade", image: "/figma/home-06.jpeg", description: "Structured horizontal front ribs delivering crisp, tailored shadow lines.", price: 435, cat: "shades" },
    { slug: "blackout-silk-velvet-shade", name: "Monaco Velvet Blackout Shade", image: "/figma/home-12.jpeg", description: "Opulent silk velvet shade with thermal core blocking 100% of intrusive light.", price: 485, cat: "shades" },
    { slug: "box-pleat-valance-oatmeal", name: "Atelier Tailored Box Pleat Valance", image: "/figma/home-18.jpeg", description: "Linen board-mounted valance with crisp inverted box pleats and 3.5″ return.", price: 280, cat: "valances" },
    { slug: "upholstered-cornice-linen", name: "Upholstered Architectural Cornice", image: "/figma/home-15.jpeg", description: "Hand-padded birch frame upholstered in pure Belgian linen with French cleat mounting.", price: 440, cat: "valances" },
    { slug: "scalloped-linen-valance", name: "French Scalloped Pelmet", image: "/figma/home-04.jpeg", description: "Graceful sculpted bottom silhouette with satin gimp rope trim.", price: 310, cat: "valances" },
    { slug: "signature-french-piped-pillow", name: "Signature French Piped Linen Cushion", image: "/figma/cushion-french-piped.jpg", description: "Belgian flax pillow finished with hand-turned self-piping and 90/10 goose down insert.", price: 135, cat: "pillows" },
    { slug: "silk-velvet-accent-pillow", name: "Chateau Silk Velvet Lumbar", image: "/figma/home-12.jpeg", description: "Elongated velvet lumbar cushion with rich tactile sheen and brass concealed closure.", price: 165, cat: "pillows" },
    { slug: "modern-knife-edge-cushion", name: "Atelier Knife-Edge Flax Pillow", image: "/figma/cat-cushions.png", description: "Clean modern profile tailored in pure washed flax linen.", price: 115, cat: "pillows" },
    { slug: "alpine-boucle-bolster", name: "Alpine Boucle Bolster Roll", image: "/figma/home-03.jpeg", description: "Sculptural cylindrical bolster wrapped in cozy tactile boucle with buttoned ends.", price: 150, cat: "pillows" },
    { slug: "signature-linen-duvet", name: "Atelier Pure Belgian Linen Duvet", image: "/figma/product-linen-bedspread-hd.png", description: "Relaxed stonewashed linen duvet cover with internal corner ties and shell button placket.", price: 345, cat: "bedding" },
    { slug: "hand-stitched-coverlet", name: "Heritage Hand-Pickstitched Coverlet", image: "/figma/cat-bedding.png", description: "Artisan quilted coverlet with lightweight cotton batting core.", price: 395, cat: "bedding" },
    { slug: "flanged-euro-shams", name: "Belgian Linen Euro Shams (Set of 2)", image: "/figma/cat-bedding-mockup.png", description: "26″×26″ square shams with 2″ mitered flanges and deep envelope closure.", price: 145, cat: "bedding" },
    { slug: "signature-mitered-tablecloth", name: "Atelier Mitered Linen Tablecloth", image: "/figma/cat-table-linen.png", description: "Pure Belgian flax tablecloth with generous 2-inch mitered borders.", price: 185, cat: "table-linen" },
    { slug: "hemstitched-runner-linen", name: "Heritage Hemstitched Table Runner", image: "/figma/home-19.png", description: "Hand-drawn thread openwork runner tailored for center tabletop styling.", price: 95, cat: "table-linen" },
    { slug: "bistro-napkins-set", name: "Belgian Linen Napkins (Set of 4)", image: "/figma/home-08.png", description: "Four 20″×20″ pre-washed flax dinner napkins with mitered corners.", price: 85, cat: "table-linen" },
    { slug: "presentation-swatch-box", name: "Complimentary 4-Piece Swatch Kit", image: "/figma/home-04.jpeg", description: "Curated 8″×8″ samples cut and serged by hand, shipped free.", price: 0, cat: "fabrics" },
    { slug: "belgian-flax-yardage", name: "Belgian Flax Yardage (Per Yard)", image: "/figma/home-02.png", description: "Continuous 54″ width pure flax linen cut to order.", price: 68, cat: "fabrics" },
    { slug: "silk-velvet-yardage", name: "Royal Silk Velvet Yardage", image: "/figma/home-12.jpeg", description: "Heavyweight 450 GSM velvet by the running yard.", price: 85, cat: "fabrics" },
    { slug: "solid-brass-pole-kit", name: "Solid Brass Architectural Rod Set", image: "/figma/cat-decor.png", description: "Solid brass 1.25″ rod with finials, brackets, and quiet nylon-lined rings.", price: 245, cat: "decor" },
    { slug: "french-return-curtain-rod", name: "French Return Blackout Curtain Pole", image: "/figma/home-10.jpeg", description: "Continuous 90-degree curved rod wrapping drapery flush against wall.", price: 215, cat: "decor" },
    { slug: "cast-brass-tiebacks", name: "Architectural Cast Tiebacks (Pair)", image: "/figma/home-18.jpeg", description: "Solid brass drapery holdbacks with concealed wall anchors.", price: 110, cat: "decor" },
    { slug: "virtual-design-service", name: "Complimentary Virtual Atelier Consultation", image: "/figma/home-13.png", description: "Book 30 minutes with our master window treatment designers.", price: 0, cat: "decor" },
    { slug: "precision-measure-guide", name: "The Atelier Window Measurement Guide", image: "/figma/home-18.jpeg", description: "Step-by-step illustrated manual for measuring drops, widths, and clearances.", price: 0, cat: "decor" }
  ];

  extraCatalogProducts.forEach((item, idx) => {
    if (db.products.some(p => p.slug === item.slug)) return;
    const parent = db.categories.find(c => c.slug === item.cat) || db.categories[0];
    db.products.push({
      _id: `6999990000000000000000${String(idx).padStart(2, '0')}`,
      title: item.name,
      slug: item.slug,
      sku: `IHF-CAT-${String(idx + 1).padStart(3, '0')}`,
      shortDescription: item.description,
      description: `Thoughtfully developed by the India Home Furnishings atelier, ${item.name} combines beautiful natural texture, considered proportion and enduring performance.`,
      category: parent ? parent._id : '670000000000000000000000',
      basePrice: item.price || 145,
      compareAtPrice: Math.round((item.price || 145) * 1.25),
      currency: 'USD',
      pricePerYard: 68,
      fabricType: 'Belgian Linen',
      colors: [
        { name: 'Natural Flax', hexCode: '#d8d0c1', inStock: true },
        { name: 'Alabaster White', hexCode: '#eee9df', inStock: true },
        { name: 'Warm Oatmeal', hexCode: '#c4b8a5', inStock: true },
        { name: 'Slate Charcoal', hexCode: '#777b78', inStock: true }
      ],
      styles: ['contemporary', 'tailored'],
      features: ['100% natural-fibre', 'hand-finished', 'pre-washed'],
      standardSizes: ['Standard', 'Queen', 'King', 'Custom Size'],
      images: [
        { url: item.image || '/figma/cat-table-linen.png', alt: `${item.name} view 1`, isPrimary: true },
        { url: '/figma/home-19.png', alt: `${item.name} view 2`, isPrimary: false },
        { url: '/figma/home-08.png', alt: `${item.name} view 3`, isPrimary: false },
        { url: '/figma/home-02.png', alt: `${item.name} view 4`, isPrimary: false }
      ],
      materialComposition: '100% European flax linen',
      weaveConstruction: 'Yarn-dyed atelier weave',
      finishingProcess: 'Garment washed for immediate softness',
      origin: 'Jaipur, India · Master Atelier',
      weight: '240 GSM balanced year-round weight',
      careInstructions: ['Machine wash cold', 'Low tumble dry', 'Warm iron if desired', 'Do not bleach'],
      benefits: [
        { title: 'Breathable', description: 'Naturally regulates temperature for year-round comfort.', icon: '♧' },
        { title: 'Softer Over Time', description: 'Grows softer and more supple with every wash.', icon: '≈' },
        { title: 'Impeccably Finished', description: 'Hand-finished details created for longevity.', icon: '×' },
        { title: 'Effortless Layering', description: 'A balanced weight designed to layer beautifully.', icon: '○' }
      ],
      dimensions: [
        { size: 'Standard', metric: '40 × 230 cm', imperial: '16 × 90 in' },
        { size: 'Large', metric: '45 × 300 cm', imperial: '18 × 120 in' },
        { size: 'Custom', metric: 'Tailored to Order', imperial: 'Made-to-Measure' }
      ],
      faqs: [
        { question: 'How should I care for this piece?', answer: 'Follow the care label and use a gentle cold cycle for lasting softness.' },
        { question: 'Can I order a custom size?', answer: 'Yes. Our atelier can tailor this design to your exact requirements.' },
        { question: 'Can I see the material first?', answer: 'Yes. Order a swatch to review colour and texture in your own light.' }
      ],
      bundleItems: [
        { name: 'Coordinating Accent Piece', image: '/figma/home-08.png', price: 85, variant: 'Natural · Standard', selected: true },
        { name: 'Layering Throw', image: '/figma/home-01.jpeg', price: 135, variant: 'Natural', selected: false }
      ],
      reviews: [
        { title: 'Exceptional craftsmanship and texture', body: 'The texture and tailoring exceeded our expectations.', author: 'Verified Client', rating: 5, date: '28 Sep 2026' },
        { title: 'Perfect in every detail', body: 'Transformed our room instantly.', author: 'Verified Client', rating: 5, date: '14 Sep 2026' }
      ],
      ratingAverage: 5.0,
      ratingCount: 38,
      editorial: {
        eyebrow: 'THE ATELIER',
        title: 'Crafted with Intention',
        description: 'Natural materials, quiet detailing and meticulous workmanship come together in a piece intended to last.',
        image: '/figma/home-19.png'
      },
      stockStatus: 'in_stock',
      inventoryCount: 28,
      isCustomizable: false,
      isFeatured: true,
      isActive: true,
      isDeleted: false,
      save: async function () { return this; }
    });
  });

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
  Category.find = (query = {}) => new QueryMock(db.categories.filter((c) => !c.isDeleted)).find(query);
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
  Product.find = (query = {}) => new QueryMock(db.products.filter((p) => !p.isDeleted)).find(query);
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

  // Consultation Mock Seed Data
  db.consultations = [
    {
      _id: '6600000000000000000000e1',
      consultationNumber: 'IHF-CON-1049',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98200 12345',
      room: 'Living Room',
      date: '2026-10-12',
      time: '10:00 AM - 12:00 PM',
      type: 'phone',
      notes: 'Two large floor-to-ceiling sliding windows, looking for sheer + blackout combination in off-white linen.',
      status: 'pending',
      isArchived: false,
      isDeleted: false,
      internalNotes: 'Client expressed interest in Belgian Flax Oatmeal Linen.',
      assignedDesigner: 'Aria - Senior Atelier Consultant',
      createdAt: new Date(Date.now() - 3600000 * 2),
      updatedAt: new Date(Date.now() - 3600000 * 2)
    },
    {
      _id: '6600000000000000000000e2',
      consultationNumber: 'IHF-CON-1048',
      name: 'Vikram Singhania',
      email: 'vikram.singhania@heritagehomes.in',
      phone: '+91 98111 88990',
      room: 'Master Bedroom',
      date: '2026-10-14',
      time: '02:00 PM - 05:00 PM',
      type: 'phone',
      notes: 'Heritage high ceiling double-height curtains with motorized French pinch pleats.',
      status: 'confirmed',
      isArchived: false,
      isDeleted: false,
      internalNotes: 'Scheduled telephone call for 2:30 PM with designer Kabir.',
      assignedDesigner: 'Kabir - Master Drapery Specialist',
      createdAt: new Date(Date.now() - 3600000 * 24),
      updatedAt: new Date(Date.now() - 3600000 * 12)
    },
    {
      _id: '6600000000000000000000e3',
      consultationNumber: 'IHF-CON-1045',
      name: 'Ananya Mehta',
      email: 'ananya@luxuryliving.com',
      phone: '+91 98765 43210',
      room: 'Dining Room',
      date: '2026-10-08',
      time: '12:00 PM - 02:00 PM',
      type: 'phone',
      notes: 'Looking for thermal interlining and bronze curtain hardware to match dining fixture.',
      status: 'completed',
      isArchived: false,
      isDeleted: false,
      internalNotes: 'Dimensions finalized: 120" width x 108" drop. Swatches dispatched.',
      assignedDesigner: 'Aria - Senior Atelier Consultant',
      createdAt: new Date(Date.now() - 3600000 * 72),
      updatedAt: new Date(Date.now() - 3600000 * 20)
    }
  ];

  Consultation.find = (query) => {
    let items = [...db.consultations];
    if (query) {
      if (query.status && query.status !== 'all') {
        items = items.filter((c) => c.status === query.status);
      }
      if (query.isArchived !== undefined) {
        if (typeof query.isArchived === 'object' && query.isArchived.$ne !== undefined) {
          items = items.filter((c) => c.isArchived !== query.isArchived.$ne);
        } else {
          items = items.filter((c) => Boolean(c.isArchived) === Boolean(query.isArchived));
        }
      }
      if (query.$or) {
        items = items.filter((item) => {
          return query.$or.some((clause) => {
            return Object.entries(clause).some(([field, regex]) => {
              const val = item[field];
              if (!val) return false;
              if (regex instanceof RegExp) return regex.test(val);
              return val.toString().toLowerCase().includes(regex.toString().toLowerCase());
            });
          });
        });
      }
    }
    return new QueryMock(items);
  };

  Consultation.findById = (id) => new QueryMock(db.consultations.find((c) => c._id.toString() === id.toString()));

  Consultation.findByIdAndUpdate = async (id, update, options) => {
    const item = db.consultations.find((c) => c._id.toString() === id.toString());
    if (item) {
      Object.assign(item, update);
      item.updatedAt = new Date();
    }
    return item;
  };

  Consultation.create = async (data) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const item = {
      _id: `6600000000000000000000e${db.consultations.length + 1}`,
      consultationNumber: data.consultationNumber || `IHF-CON-${randomSuffix}`,
      room: data.room || 'Living Room',
      time: data.time || '11:00 AM',
      type: 'phone',
      notes: data.notes || '',
      status: 'pending',
      isArchived: false,
      isDeleted: false,
      internalNotes: '',
      assignedDesigner: 'Atelier Senior Consultant',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    };
    db.consultations.unshift(item);
    return item;
  };

  Consultation.countDocuments = async (query) => {
    return db.consultations.filter((c) => !c.isArchived).length;
  };

  // Seed realistic luxury orders matching admin visual expectations
  db.orders = [
    {
      _id: '660000000000000000000f01',
      orderNumber: 'IHF-10432',
      orderType: 'Custom Drapery',
      customerInfo: {
        name: 'Priya Sharma',
        email: 'priya.sharma@luxuryestate.in',
        phone: '+91 98111 22334'
      },
      items: [
        {
          _id: '660000000000000000000f11',
          itemType: 'custom_curtain',
          title: 'Belgian Linen French Pinch Pleat Drapery',
          quantity: 2,
          unitPrice: 41000,
          totalPrice: 82000,
          customCurtainSpecs: {
            width: { raw: '96', decimal: 96, formatted: '96"' },
            height: { raw: '108', decimal: 108, formatted: '108"' },
            fullness: { id: 'deluxe', label: '2.5x Custom Deluxe Fullness', factor: 2.5 },
            lining: { id: 'blackout', name: 'Blackout Thermal Interlining', type: 'thermal_blackout' },
            pleatHeader: { id: 'pinch-pleat', name: 'Three-Finger French Pinch Pleat' },
            hardware: [{ id: 'hw-motor-somfy', name: 'Somfy RTS Motorized Track', price: 12500 }],
            color: { name: 'Oatmeal Heritage Linen', hexCode: '#DDD5C7' },
            fabricType: 'Belgian Heritage Linen',
            fabricName: 'Pure Belgian Heritage Linen',
            fabricCode: 'BHL-04',
            roomLabel: 'Master Bedroom Ocean Suite',
            motorization: 'Somfy RTS Motorized Smart Track',
            panelConfiguration: 'pair',
            priceBreakdown: {
              fabricCost: 48000,
              liningCost: 14000,
              pleatLaborCost: 8000,
              hardwareCost: 12000,
              calculatedUnitPrice: 41000
            }
          }
        }
      ],
      pricing: {
        subtotal: 82000,
        shipping: 0,
        tax: 2900,
        discount: 0,
        total: 84900
      },
      shippingAddress: {
        fullName: 'Priya Sharma',
        street: 'Penthouse 4B, The Magnolias, Golf Course Road',
        apartment: 'Tower 2',
        city: 'Gurugram',
        state: 'HR',
        zipCode: '122002',
        country: 'IN',
        phone: '+91 98111 22334'
      },
      paymentInfo: {
        stripePaymentIntentId: 'pi_mock_10432',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        paidAt: new Date(Date.now() - 3600000 * 48)
      },
      fulfillmentStatus: 'Delayed',
      carrier: 'BlueDart Luxury Express',
      trackingNumber: 'BD-IN-98734201',
      manufacturingNotes: 'Custom weaving delay in Belgian mill for Oatmeal batch. Expected dispatch in 3 days.',
      isArchived: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 3600000 * 48),
      updatedAt: new Date(Date.now() - 3600000 * 6)
    },
    {
      _id: '660000000000000000000f02',
      orderNumber: 'IHF-10431',
      orderType: 'Roman Shades',
      customerInfo: {
        name: 'Ananya Mehta',
        email: 'ananya@luxuryliving.com',
        phone: '+91 98765 43210'
      },
      items: [
        {
          _id: '660000000000000000000f12',
          itemType: 'custom_curtain',
          title: 'Flat Fold Waterfall Roman Shades',
          quantity: 2,
          unitPrice: 16000,
          totalPrice: 32000,
          customCurtainSpecs: {
            width: { raw: '52', decimal: 52, formatted: '52"' },
            height: { raw: '72', decimal: 72, formatted: '72"' },
            fullness: { id: 'flat', label: '1.5x Flat Tailored', factor: 1.5 },
            lining: { id: 'privacy', name: 'Privacy Sateen Lining', type: 'privacy' },
            pleatHeader: { id: 'flat-roman', name: 'Flat Waterfall Roman Fold' },
            hardware: [{ id: 'hw-cordless', name: 'Cordless Precision Spring Roller', price: 3200 }],
            color: { name: 'Earthy Sand Washed Silk', hexCode: '#C8B9A6' },
            fabricType: 'Raw Silk Slub',
            fabricName: 'Artisanal Raw Silk',
            fabricCode: 'ARS-12',
            roomLabel: 'Formal Dining Room East',
            motorization: 'Precision Cordless Spring Roller',
            panelConfiguration: 'single_panel',
            priceBreakdown: {
              fabricCost: 18000,
              liningCost: 6000,
              pleatLaborCost: 4000,
              hardwareCost: 4000,
              calculatedUnitPrice: 16000
            }
          }
        }
      ],
      pricing: {
        subtotal: 32000,
        shipping: 0,
        tax: 2200,
        discount: 0,
        total: 34200
      },
      shippingAddress: {
        fullName: 'Ananya Mehta',
        street: '14 Carmichael Road, Malabar Hill',
        apartment: 'Villa Sea Crest',
        city: 'Mumbai',
        state: 'MH',
        zipCode: '400026',
        country: 'IN',
        phone: '+91 98765 43210'
      },
      paymentInfo: {
        stripePaymentIntentId: 'pi_mock_10431',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        paidAt: new Date(Date.now() - 3600000 * 36)
      },
      fulfillmentStatus: 'Awaiting Fabric',
      carrier: 'FedEx Custom Freight',
      trackingNumber: '',
      manufacturingNotes: 'Awaiting raw silk roll delivery from Varanasi weaving workshop.',
      isArchived: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 3600000 * 36),
      updatedAt: new Date(Date.now() - 3600000 * 12)
    },
    {
      _id: '660000000000000000000f03',
      orderNumber: 'IHF-10429',
      orderType: 'Curtains & Drapes',
      customerInfo: {
        name: 'Rohan Kapoor',
        email: 'rohan.kapoor@atelier.com',
        phone: '+91 99200 11445'
      },
      items: [
        {
          _id: '660000000000000000000f13',
          itemType: 'custom_curtain',
          title: 'Royal Velvet Ripplefold Drapes',
          quantity: 2,
          unitPrice: 29000,
          totalPrice: 58000,
          customCurtainSpecs: {
            width: { raw: '110', decimal: 110, formatted: '110"' },
            height: { raw: '120', decimal: 120, formatted: '120"' },
            fullness: { id: 'ripplefold', label: '2.2x Ripplefold Wave', factor: 2.2 },
            lining: { id: 'thermal-sateen', name: 'Thermal Acoustic Sateen', type: 'thermal' },
            pleatHeader: { id: 'ripplefold', name: 'Contemporary Ripplefold Wave' },
            hardware: [{ id: 'hw-track', name: 'Ceiling Recessed Architectural Track', price: 8000 }],
            color: { name: 'Deep Midnight Sapphire', hexCode: '#1A2942' },
            fabricType: 'Heavy Weight Royal Velvet',
            fabricName: 'Atelier Royal Velvet',
            fabricCode: 'ARV-09',
            roomLabel: 'Formal Drawing Room',
            motorization: 'Manual Architectural Baton',
            panelConfiguration: 'pair'
          }
        }
      ],
      pricing: {
        subtotal: 58000,
        shipping: 0,
        tax: 3500,
        discount: 0,
        total: 61500
      },
      shippingAddress: {
        fullName: 'Rohan Kapoor',
        street: '88 Friends Colony West',
        apartment: '',
        city: 'New Delhi',
        state: 'DL',
        zipCode: '110065',
        country: 'IN',
        phone: '+91 99200 11445'
      },
      paymentInfo: {
        paymentStatus: 'paid',
        paymentMethod: 'wire',
        paidAt: new Date(Date.now() - 3600000 * 54)
      },
      fulfillmentStatus: 'Production Pending',
      carrier: 'FedEx Custom Freight',
      trackingNumber: '',
      manufacturingNotes: 'Measurements verified by Atelier representative. Ready to cut.',
      isArchived: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 3600000 * 54),
      updatedAt: new Date(Date.now() - 3600000 * 24)
    },
    {
      _id: '660000000000000000000f04',
      orderNumber: 'IHF-10427',
      orderType: 'Bedding Set',
      customerInfo: {
        name: 'Neha Verma',
        email: 'neha.verma@delhidesign.co',
        phone: '+91 98102 33445'
      },
      items: [
        {
          _id: '660000000000000000000f14',
          itemType: 'standard_product',
          title: 'Signature Mulberry Silk King Duvet & Pillow Suite',
          quantity: 1,
          unitPrice: 26500,
          totalPrice: 26500
        }
      ],
      pricing: {
        subtotal: 26500,
        shipping: 400,
        tax: 2000,
        discount: 0,
        total: 28900
      },
      shippingAddress: {
        fullName: 'Neha Verma',
        street: 'Flat 1204, DLF Camellias',
        apartment: 'Tower 6',
        city: 'Gurugram',
        state: 'HR',
        zipCode: '122009',
        country: 'IN',
        phone: '+91 98102 33445'
      },
      paymentInfo: {
        paymentStatus: 'pending',
        paymentMethod: 'manual_invoice'
      },
      fulfillmentStatus: 'Payment Pending',
      carrier: 'BlueDart Luxury Express',
      trackingNumber: '',
      manufacturingNotes: 'Awaiting client approval of proforma wire invoice.',
      isArchived: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 3600000 * 60),
      updatedAt: new Date(Date.now() - 3600000 * 30)
    },
    {
      _id: '660000000000000000000f05',
      orderNumber: 'IHF-10425',
      orderType: 'Custom Drapery',
      customerInfo: {
        name: 'Simran Kaur',
        email: 'simran.kaur@lifestyle.in',
        phone: '+91 97110 55667'
      },
      items: [
        {
          _id: '660000000000000000000f15',
          itemType: 'custom_curtain',
          title: 'Tussar Raw Silk Goblet Pleat Drapes',
          quantity: 2,
          unitPrice: 37000,
          totalPrice: 74000,
          customCurtainSpecs: {
            width: { raw: '104', decimal: 104, formatted: '104"' },
            height: { raw: '114', decimal: 114, formatted: '114"' },
            fullness: { id: 'goblet', label: '2.5x Goblet Classical Pleat', factor: 2.5 },
            lining: { id: 'blackout', name: 'Blackout Interlining', type: 'thermal_blackout' },
            pleatHeader: { id: 'goblet', name: 'Classical Goblet Pleat' },
            hardware: [{ id: 'hw-rod', name: 'Burnished Brass Decorative Finial Rod', price: 9500 }],
            color: { name: 'Alabaster Ivory Cream', hexCode: '#FDFBF7' },
            fabricType: 'Tussar Raw Silk',
            fabricName: 'Imperial Tussar Silk',
            fabricCode: 'ITS-01',
            roomLabel: 'Main Living Gallery',
            motorization: 'Manual Decorative Ring Pull',
            panelConfiguration: 'pair'
          }
        }
      ],
      pricing: {
        subtotal: 74000,
        shipping: 0,
        tax: 4300,
        discount: 0,
        total: 78300
      },
      shippingAddress: {
        fullName: 'Simran Kaur',
        street: 'Villa 18, Palm Meadows, Whitefield',
        apartment: '',
        city: 'Bengaluru',
        state: 'KA',
        zipCode: '560066',
        country: 'IN',
        phone: '+91 97110 55667'
      },
      paymentInfo: {
        paymentStatus: 'paid',
        paymentMethod: 'card',
        paidAt: new Date(Date.now() - 3600000 * 72)
      },
      fulfillmentStatus: 'Sizing Confirmation',
      carrier: 'FedEx Custom Freight',
      trackingNumber: '',
      manufacturingNotes: 'Consultant visiting site to verify drop allowance for marble floor molding.',
      isArchived: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 3600000 * 72),
      updatedAt: new Date(Date.now() - 3600000 * 40)
    }
  ];

  Order.find = (query) => {
    let items = [...db.orders];
    if (query) {
      if (query.isArchived !== undefined) {
        if (typeof query.isArchived === 'object' && query.isArchived.$ne !== undefined) {
          items = items.filter((o) => o.isArchived !== query.isArchived.$ne);
        } else {
          items = items.filter((o) => Boolean(o.isArchived) === Boolean(query.isArchived));
        }
      }
      if (query.fulfillmentStatus) {
        if (typeof query.fulfillmentStatus === 'object' && query.fulfillmentStatus.$nin) {
          items = items.filter((o) => !query.fulfillmentStatus.$nin.includes(o.fulfillmentStatus));
        } else if (query.fulfillmentStatus !== 'all') {
          items = items.filter((o) => o.fulfillmentStatus === query.fulfillmentStatus);
        }
      }
      if (query['paymentInfo.paymentStatus'] && query['paymentInfo.paymentStatus'] !== 'all') {
        items = items.filter((o) => o.paymentInfo?.paymentStatus === query['paymentInfo.paymentStatus']);
      }
      if (query.orderType && query.orderType !== 'all') {
        items = items.filter((o) => o.orderType === query.orderType);
      }
      if (query.user) {
        items = items.filter((o) => o.user?.toString() === query.user.toString());
      }
      if (query.$or) {
        items = items.filter((item) => {
          return query.$or.some((clause) => {
            return Object.entries(clause).some(([field, regex]) => {
              let val = null;
              if (field.includes('.')) {
                const parts = field.split('.');
                val = item[parts[0]]?.[parts[1]];
              } else {
                val = item[field];
              }
              if (!val) return false;
              if (regex instanceof RegExp) return regex.test(val);
              return val.toString().toLowerCase().includes(regex.toString().toLowerCase());
            });
          });
        });
      }
    }
    return new QueryMock(items);
  };

  Order.findById = (id) => new QueryMock(db.orders.find((o) => o._id?.toString() === id?.toString()));

  Order.findByIdAndUpdate = async (id, update, options) => {
    const item = db.orders.find((o) => o._id?.toString() === id?.toString());
    if (item) {
      Object.assign(item, update);
      item.updatedAt = new Date();
    }
    return item;
  };

  Order.findOneAndUpdate = async (filter, update, options) => {
    let item = null;
    if (filter['paymentInfo.stripePaymentIntentId']) {
      item = db.orders.find((o) => o.paymentInfo?.stripePaymentIntentId === filter['paymentInfo.stripePaymentIntentId']);
    } else if (filter._id) {
      item = db.orders.find((o) => o._id?.toString() === filter._id?.toString());
    }
    if (item) {
      Object.assign(item, update);
      item.updatedAt = new Date();
    }
    return item;
  };

  Order.create = async (data) => {
    const randSuffix = Math.floor(10000 + Math.random() * 90000);
    const item = {
      _id: `660000000000000000000f${db.orders.length + 10}`,
      orderNumber: data.orderNumber || `IHF-${randSuffix}`,
      orderType: data.orderType || 'Custom Drapery',
      items: data.items || [],
      pricing: data.pricing || { subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 },
      customerInfo: data.customerInfo || { name: 'Valued Client', email: 'client@atelier.com', phone: '' },
      shippingAddress: data.shippingAddress || {
        fullName: 'Valued Client',
        street: '1 Atelier Way',
        city: 'New Delhi',
        state: 'DL',
        zipCode: '110001',
        country: 'IN'
      },
      paymentInfo: data.paymentInfo || { paymentStatus: 'pending', paymentMethod: 'card' },
      fulfillmentStatus: data.fulfillmentStatus || 'Pending',
      carrier: data.carrier || 'FedEx Custom Freight',
      trackingNumber: data.trackingNumber || '',
      manufacturingNotes: data.manufacturingNotes || '',
      isArchived: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
      save: async function () {
        return this;
      }
    };
    db.orders.unshift(item);
    return item;
  };

  Order.countDocuments = async (query) => {
    if (!query) return db.orders.length;
    let list = [...db.orders];
    if (query.isArchived !== undefined) {
      if (typeof query.isArchived === 'object' && query.isArchived.$ne !== undefined) {
        list = list.filter((o) => o.isArchived !== query.isArchived.$ne);
      } else {
        list = list.filter((o) => Boolean(o.isArchived) === Boolean(query.isArchived));
      }
    }
    if (query.fulfillmentStatus) {
      if (typeof query.fulfillmentStatus === 'object' && query.fulfillmentStatus.$nin) {
        list = list.filter((o) => !query.fulfillmentStatus.$nin.includes(o.fulfillmentStatus));
      } else if (query.fulfillmentStatus !== 'all') {
        list = list.filter((o) => o.fulfillmentStatus === query.fulfillmentStatus);
      }
    }
    if (query['paymentInfo.paymentStatus']) {
      list = list.filter((o) => o.paymentInfo?.paymentStatus === query['paymentInfo.paymentStatus']);
    }
    return list.length;
  };
}

export default {
  db,
  setupMockDatabase
};
