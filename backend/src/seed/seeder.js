import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import FilterOption from '../models/FilterOption.js';
import Navigation from '../models/Navigation.js';
import Blog from '../models/Blog.js';
import Swatch from '../models/Swatch.js';
import CustomizerRule from '../models/CustomizerRule.js';
import FabricOption from '../models/FabricOption.js';

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seeder] Connected to MongoDB');

    // Clean existing data
    console.log('[Seeder] Purging old records...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      FilterOption.deleteMany({}),
      Navigation.deleteMany({}),
      Blog.deleteMany({}),
      Swatch.deleteMany({}),
      CustomizerRule.deleteMany({}),
      FabricOption.deleteMany({})
    ]);

    // 1. Seed Users
    console.log('[Seeder] Creating Admin and Customer users...');
    await User.create({
      name: 'IHF Master Administrator',
      email: 'admin@ihfluxury.com',
      password: 'Admin@123456',
      role: 'admin',
      phone: '+1 (800) 555-0199'
    });

    await User.create({
      name: 'Eleanor Vance',
      email: 'client@luxurydrapes.com',
      password: 'Client@123456',
      role: 'customer',
      phone: '+1 (212) 555-7821',
      addresses: [
        {
          label: 'Manhattan Penthouse',
          fullName: 'Eleanor Vance',
          street: '740 Park Avenue',
          apartment: 'Apt 14B',
          city: 'New York',
          state: 'NY',
          zipCode: '10021',
          country: 'US',
          phone: '+1 (212) 555-7821',
          isDefault: true
        }
      ]
    });

    // 2. Seed Customizer Rule
    console.log('[Seeder] Creating Customizer Rules & Pricing Matrices...');
    const draperyRule = await CustomizerRule.create({
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
        {
          id: 'standard',
          label: '2.0x Standard Custom Fullness',
          factor: 2.0,
          isDefault: true,
          description: 'Timeless tailored drape with balanced gathers.'
        },
        {
          id: 'deluxe',
          label: '2.5x Deluxe High-End Fullness',
          factor: 2.5,
          isDefault: false,
          description: 'Ultra-luxurious, deep artisan folds for grand estate windows.'
        }
      ],
      liningOptions: [
        {
          id: 'unlined',
          name: 'Unlined (Natural Light Filtering)',
          type: 'unlined',
          pricePerYardMultiplier: 0,
          flatPriceAddon: 0,
          description: 'Allows gentle sunlight diffusion while showcasing the natural slub texture.'
        },
        {
          id: 'privacy',
          name: 'Artisan Cotton Sateen Privacy Lining',
          type: 'privacy',
          pricePerYardMultiplier: 18,
          flatPriceAddon: 0,
          isDefault: true,
          description: 'Blocks outside view, protects face fabric from UV rays, and adds substantial weight.'
        },
        {
          id: 'blackout',
          name: '100% Total Eclipse Blackout Lining',
          type: 'blackout',
          pricePerYardMultiplier: 28,
          flatPriceAddon: 20,
          description: 'Multi-layer thermal foam seal for 100% light blockage in bedrooms and media rooms.'
        },
        {
          id: 'thermal-interlining',
          name: 'English Bump Flannel Interlining (Thermal & Acoustic)',
          type: 'thermal',
          pricePerYardMultiplier: 38,
          flatPriceAddon: 45,
          description: 'Heavy brushed fleece sandwiched between fabric and lining for acoustic insulation and draft prevention.'
        }
      ],
      pleatHeaders: [
        {
          id: 'pinch-pleat',
          name: 'Three-Finger French Pinch Pleat',
          pricePerPanel: 45,
          description: 'Classic handcrafted pleats stitched permanently at the base of the heading.',
          isDefault: true
        },
        {
          id: 'euro-pleat',
          name: 'Tailored Euro Pleat (Top Tack)',
          pricePerPanel: 45,
          description: 'Modern relaxed pleat tacked strictly at the top, allowing fabric to flow softly.'
        },
        {
          id: 'ripple-fold',
          name: 'Architectural S-Fold / Ripple Fold',
          pricePerPanel: 55,
          description: 'Continuous wave folds ideal for floor-to-ceiling modern glass walls and motorized tracks.'
        },
        {
          id: 'grommet',
          name: 'Hand-Pressed Heavy Metal Grommets',
          pricePerPanel: 35,
          description: 'Modern round eyelets sliding directly along contemporary metal rods.'
        }
      ],
      hardwareAddons: [
        {
          id: 'somfy-motor',
          name: 'Somfy Glydea Ultra Smart Motorized Track (120V / Zigbee)',
          category: 'motorization',
          price: 495,
          description: 'Whisper-quiet motorized track with Alexa, Google Home, and Control4 integration.',
          isMotorized: true
        },
        {
          id: 'french-brass-rod',
          name: 'French Return Solid Brass 1.5" Curtain Rod',
          category: 'rod',
          price: 185,
          description: 'Hand-finished brushed brass return rod eliminating side light gaps.'
        },
        {
          id: 'ceiling-recessed-track',
          name: 'Heavy Duty Architectural Ceiling Track',
          category: 'track',
          price: 135,
          description: 'Flush ceiling-mount track for seamless hotel-style drapery hangs.'
        }
      ],
      isActive: true
    });

    // 3. Seed Categories & Subcategories
    console.log('[Seeder] Creating Categories & Sub-Categories...');
    const catCurtains = await Category.create({
      name: 'Curtains & Drapes',
      slug: 'curtains-and-drapes',
      description: 'Handcrafted luxury window draperies custom-made to 1/8th inch precision.',
      image: {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Luxury Curtains & Drapes'
      },
      displayOrder: 1
    });

    const subPinchPleat = await Category.create({
      name: 'French Pinch Pleat Drapes',
      slug: 'french-pinch-pleat-drapes',
      description: 'Timeless tailored 3-finger pleats designed for luxury residences.',
      parentCategory: catCurtains._id,
      displayOrder: 1
    });

    const subRippleFold = await Category.create({
      name: 'Ripple Fold & S-Wave',
      slug: 'ripple-fold-and-s-wave',
      description: 'Architectural continuous wave drapery for modern floor-to-ceiling windows.',
      parentCategory: catCurtains._id,
      displayOrder: 2
    });

    await Category.create({
      name: 'Roman Drapes & Shades',
      slug: 'roman-drapes-and-shades',
      description: 'Custom cascading fabric shades combining the warmth of drapery with clean lines.',
      parentCategory: catCurtains._id,
      displayOrder: 3
    });

    await Category.create({
      name: 'Blinds & Shades',
      slug: 'blinds-and-shades',
      description: 'Precision engineered motorized and manual window shades.',
      image: {
        url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80',
        alt: 'Luxury Blinds and Shades'
      },
      displayOrder: 2
    });

    await Category.create({
      name: 'Fabric Swatches & Trims',
      slug: 'fabrics-and-trims',
      description: 'Order bespoke sample swatches delivered in luxury presentation boxes.',
      image: {
        url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&q=80',
        alt: 'Fabric Swatches and Trims'
      },
      displayOrder: 3
    });

    // Complete storefront taxonomy. These records drive both the header category
    // pages and the Categories editor in the admin application.
    const storefrontCategories = [
      ['drapery','Drapery','Frame Every View','/figma/home-hero-hd.png',['Ripple Fold Drapery','Tailored Pleat Drapery','Pinch Pleat Drapery','Grommet Drapery','Inverted Pleat Drapery']],
      ['shades','Shades','Shape the Light','/figma/cat-shades-new.png',['Flat Roman Shades','Relaxed Roman Shades','Cascade Shades','Woven Shades','Blackout Shades']],
      ['valances','Valances & Cornices','Complete the Window','/figma/home-18.jpeg',['Upholstered Cornices','Soft Valances','Board-Mounted Valances','Swags & Cascades','Custom Pelmets']],
      ['pillows','Pillows','Comfort, Composed','/figma/cat-cushions-new.png',['Decorative Pillows','Lumbar Pillows','Bolsters','Euro Shams','Outdoor Pillows']],
      ['bedding','Bedding','Elevate Your Bedroom','/figma/cat-bedding-hero-new.jpg',['Duvet Covers','Quilts & Coverlets','Comforters','Sheets','Blankets & Throws']],
      ['table-linen','Table Linen','Set a Beautiful Table','/figma/cat-table-linen.png',['Tablecloths','Table Runners','Napkins','Placemats','Cocktail Linens']],
      ['decor','Decor & More','Details Make the Room','/figma/cat-decor.png',['Throws','Decorative Objects','Baskets','Wall Decor','Hardware & Trims']],
      ['fabrics','Fabrics & Swatches','Begin with the Fabric','/figma/home-04.jpeg',['Linen Swatches','Cotton Swatches','Velvet Swatches','Sheers','Trims & Passementerie']]
    ];
    for (const [slug, name, headline, heroImage, children] of storefrontCategories) {
      const parent = await Category.create({
        name, slug, description: `Explore the complete ${name.toLowerCase()} collection, thoughtfully designed and finished by our atelier.`,
        image: { url: heroImage, alt: `${name} collection` }, displayOrder: storefrontCategories.findIndex(item => item[0] === slug) + 1,
        storefront: { eyebrow: `THE ${name.toUpperCase()} COLLECTION`, headline, heroImage, guideTitle: `The ${name} Guide`, guideCopy: `Expert advice for choosing, styling and caring for ${name.toLowerCase()}.`, materialCards: ['Belgian Linen','Organic Cotton','Silk Velvet','Wool Blend'].map((material, index) => ({ name: material, slug: material.toLowerCase().replaceAll(' ','-'), description: 'Natural texture with lasting performance.', image: ['/figma/home-04.jpeg','/figma/home-03.jpeg','/figma/home-12.jpeg','/figma/home-18.jpeg'][index], price: 95 + index * 40 })) }
      });
      const childDocs = await Category.insertMany(children.map((child, index) => ({ name: child, slug: child.toLowerCase().replaceAll('&','and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''), description: `Discover our atelier collection of ${child.toLowerCase()}.`, parentCategory: parent._id, image: { url: ['/figma/product-linen-bedspread-hd.png','/figma/home-15.jpeg','/figma/home-11.png','/figma/home-10.jpeg','/figma/home-01.jpeg'][index], alt: child }, displayOrder: index + 1 })));
      const catalogImages=['/figma/product-linen-bedspread-hd.png','/figma/home-15.jpeg','/figma/home-11.png','/figma/home-10.jpeg','/figma/home-01.jpeg','/figma/home-17.jpeg'];
      await Product.insertMany(childDocs.flatMap((child, childIndex) => [0,1].map(variant => ({
        title:`${variant?'Heritage':'Signature'} ${child.name}`,slug:`${variant?'heritage':'signature'}-${child.slug}`,sku:`IHF-${slug.slice(0,3).toUpperCase()}-${childIndex+1}${variant}`,
        shortDescription:`A refined ${child.name.toLowerCase()} design in premium natural fibres.`,description:`Thoughtfully developed by the India Home Furnishings atelier, this design combines natural texture, considered proportion and enduring performance.`,
        category:parent._id,subCategory:child._id,basePrice:145+childIndex*35+variant*55,pricePerYard:68,fabricType:variant?'organic cotton':'linen',
        colors:[{name:'Natural',hexCode:'#d8d0c1'},{name:'Ivory',hexCode:'#eee9df'},{name:'Slate',hexCode:'#777b78'}],styles:['contemporary','tailored'],features:['natural fibre','hand finished'],standardSizes:['Twin','Double','Queen','King','Custom Size'],
        images:[0,1,2,3].map(offset=>({url:catalogImages[(childIndex+offset)%catalogImages.length],alt:`${child.name} view ${offset+1}`,isPrimary:offset===0})),
        materialComposition:variant?'100% long-staple organic cotton':'100% European flax linen',weaveConstruction:'Yarn-dyed atelier weave',finishingProcess:'Garment washed for immediate softness',origin:'Jaipur, India · Master Atelier',weight:'260 GSM balanced year-round weight',
        careInstructions:['Machine wash cold','Low tumble dry','Warm iron if desired','Do not bleach'],benefits:[{title:'Breathable',description:'Naturally regulates temperature for year-round comfort.',icon:'♧'},{title:'Softer Over Time',description:'Grows softer with every wash.',icon:'≈'},{title:'Impeccably Finished',description:'Hand-finished for longevity.',icon:'×'},{title:'Effortless Layering',description:'A balanced weight that layers beautifully.',icon:'○'}],
        dimensions:[{size:'King',metric:'275 × 270 cm',imperial:'108 × 106 in'},{size:'Queen',metric:'240 × 260 cm',imperial:'94 × 102 in'},{size:'Double',metric:'220 × 240 cm',imperial:'87 × 94 in'}],
        faqs:[{question:'How should I care for this piece?',answer:'Use a gentle cold cycle and follow the care label.'},{question:'Can I order a custom size?',answer:'Yes. Our atelier can tailor this design to your requirements.'}],
        bundleItems:[{name:'Coordinating Pillow Pair',image:catalogImages[(childIndex+2)%catalogImages.length],price:95,variant:'Natural · Pair',selected:true},{name:'Layering Throw',image:catalogImages[(childIndex+3)%catalogImages.length],price:135,variant:'Natural'}],
        reviews:[{title:'Beautiful material and finish',body:'The texture and tailoring exceeded our expectations.',author:'Verified Client',rating:5,date:'28 Sep 2026'}],ratingAverage:4.9,ratingCount:42,
        editorial:{eyebrow:'THE ATELIER',title:'Crafted with Intention',description:'Natural materials, quiet detailing and meticulous workmanship come together in a piece intended to last.',image:catalogImages[(childIndex+4)%catalogImages.length]},
        stockStatus:'in_stock',inventoryCount:24+childIndex,isCustomizable:slug==='drapery'||slug==='shades',isFeatured:childIndex<2,isActive:true
      }))));
    }

    // 4. Seed Dynamic Filters
    console.log('[Seeder] Creating Filter Attributes...');
    await FilterOption.insertMany([
      { group: 'fabric', label: 'Belgian Linen', value: 'linen', displayOrder: 1 },
      { group: 'fabric', label: 'Silk Velvet', value: 'velvet', displayOrder: 2 },
      { group: 'fabric', label: 'Organic Cotton', value: 'cotton', displayOrder: 3 },
      { group: 'fabric', label: 'Textured Sheer', value: 'sheer', displayOrder: 4 },
      { group: 'fabric', label: 'Wool Blend', value: 'wool', displayOrder: 5 },

      { group: 'color', label: 'Ivory White', value: 'ivory-white', hexCode: '#FFFFF0', displayOrder: 1 },
      { group: 'color', label: 'Champagne Beige', value: 'champagne-beige', hexCode: '#F7E7CE', displayOrder: 2 },
      { group: 'color', label: 'Emerald Green', value: 'emerald-green', hexCode: '#046307', displayOrder: 3 },
      { group: 'color', label: 'Midnight Navy', value: 'midnight-navy', hexCode: '#002366', displayOrder: 4 },
      { group: 'color', label: 'Charcoal Slate', value: 'charcoal-slate', hexCode: '#36454F', displayOrder: 5 },
      { group: 'color', label: 'Terracotta Rust', value: 'terracotta-rust', hexCode: '#C46851', displayOrder: 6 },

      { group: 'style', label: 'French Pinch Pleat', value: 'pinch-pleat', displayOrder: 1 },
      { group: 'style', label: 'Ripple Fold', value: 'ripple-fold', displayOrder: 2 },
      { group: 'style', label: 'Tailored Euro Pleat', value: 'euro-pleat', displayOrder: 3 },
      { group: 'style', label: 'Modern Grommet', value: 'grommet', displayOrder: 4 },

      { group: 'feature', label: '100% Blackout', value: 'blackout', displayOrder: 1 },
      { group: 'feature', label: 'Motorized Compatible', value: 'motorized', displayOrder: 2 },
      { group: 'feature', label: 'Thermal Insulated', value: 'thermal-insulated', displayOrder: 3 },
      { group: 'feature', label: 'Acoustic Sound Dampening', value: 'acoustic', displayOrder: 4 },

      { group: 'collection', label: 'LINENS', value: 'linens', displayOrder: 1 },
      { group: 'collection', label: 'SHEERS', value: 'sheers', displayOrder: 2 },
      { group: 'collection', label: 'WOOLS + BLENDS', value: 'wools-blends', displayOrder: 3 },
      { group: 'collection', label: 'COTTONS', value: 'cottons', displayOrder: 4 },
      { group: 'collection', label: 'SILKS', value: 'silks', displayOrder: 5 },
      { group: 'collection', label: 'SOLIDS', value: 'solids', displayOrder: 6 },
      { group: 'collection', label: 'PATTERNS', value: 'patterns', displayOrder: 7 },
      { group: 'collection', label: 'KIDS', value: 'kids', displayOrder: 8 },
      { group: 'collection', label: 'DESIGNERS', value: 'designers', displayOrder: 9 },
      { group: 'collection', label: 'SUNBRELLA', value: 'sunbrella', displayOrder: 10 },
      { group: 'collection', label: 'MOST POPULAR', value: 'most-popular', displayOrder: 11 },

      { group: 'material', label: 'Linens & Natural Weaves', value: 'linens-natural-weaves', displayOrder: 1 },
      { group: 'material', label: 'Cotton & Blends', value: 'cotton-blends', displayOrder: 2 },
      { group: 'material', label: 'Wool & Blends', value: 'wool-blends', displayOrder: 3 },
      { group: 'material', label: 'Luxury Velvet', value: 'luxury-velvet', displayOrder: 4 },

      { group: 'price', label: 'Price Group A', value: 'a', displayOrder: 1 },
      { group: 'price', label: 'Price Group B', value: 'b', displayOrder: 2 },
      { group: 'price', label: 'Price Group C', value: 'c', displayOrder: 3 }
    ]);

    // 4b. Seed Fabric Options for Customizer
    console.log('[Seeder] Creating Customizer Fabric Catalog & Materials...');
    await FabricOption.insertMany([
      {
        name: 'White Linen',
        slug: 'white-linen',
        collectionType: 'LINENS',
        materialGroup: 'LINENS & NATURAL WEAVES',
        materialDescription: 'Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.',
        priceGroup: 'A',
        fromPrice: 650,
        color: { name: 'White', hexCode: '#F5F5F0' },
        image: '/figma/home-02.png',
        isPopular: true,
        displayOrder: 1
      },
      {
        name: 'Clay Linen',
        slug: 'clay-linen',
        collectionType: 'LINENS',
        materialGroup: 'LINENS & NATURAL WEAVES',
        materialDescription: 'Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.',
        priceGroup: 'A',
        fromPrice: 650,
        color: { name: 'Clay', hexCode: '#D2B48C' },
        image: '/figma/home-18.jpeg',
        isPopular: true,
        displayOrder: 2
      },
      {
        name: 'Slate Wool',
        slug: 'slate-wool',
        collectionType: 'WOOLS + BLENDS',
        materialGroup: 'WOOL & BLENDS',
        materialDescription: 'Finely spun virgin wool blend creating substantial drape with acoustic sound-dampening qualities and thermal insulation.',
        priceGroup: 'B',
        fromPrice: 720,
        color: { name: 'Slate', hexCode: '#708090' },
        image: '/figma/home-07.jpeg',
        isPopular: false,
        displayOrder: 3
      },
      {
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
        isPopular: true,
        displayOrder: 4
      },
      {
        name: 'Sand Wool Blend',
        slug: 'sand-wool-blend',
        collectionType: 'WOOLS + BLENDS',
        materialGroup: 'WOOL & BLENDS',
        materialDescription: 'Finely spun virgin wool blend creating substantial drape with acoustic sound-dampening qualities and thermal insulation.',
        priceGroup: 'B',
        fromPrice: 720,
        color: { name: 'Sand', hexCode: '#C2B280' },
        image: '/figma/home-04.jpeg',
        isPopular: true,
        displayOrder: 5
      },
      {
        name: 'Sky Cotton',
        slug: 'sky-cotton',
        collectionType: 'COTTONS',
        materialGroup: 'COTTON & BLENDS',
        materialDescription: 'Crisp, matte organic cotton sateen with fluid hand and smooth contemporary finish for modern homes.',
        priceGroup: 'A',
        fromPrice: 650,
        color: { name: 'Sky', hexCode: '#87CEEB' },
        image: '/figma/home-17.jpeg',
        isPopular: false,
        displayOrder: 6
      },
      {
        name: 'Terracotta Cotton',
        slug: 'terracotta-cotton',
        collectionType: 'COTTONS',
        materialGroup: 'COTTON & BLENDS',
        materialDescription: 'Crisp, matte organic cotton sateen with fluid hand and smooth contemporary finish for modern homes.',
        priceGroup: 'A',
        fromPrice: 650,
        color: { name: 'Terracotta', hexCode: '#E2725B' },
        image: '/figma/home-12.jpeg',
        isPopular: true,
        displayOrder: 7
      },
      {
        name: 'Sage Linen',
        slug: 'sage-linen',
        collectionType: 'LINENS',
        materialGroup: 'LINENS & NATURAL WEAVES',
        materialDescription: 'Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.',
        priceGroup: 'A',
        fromPrice: 650,
        color: { name: 'Sage', hexCode: '#9DC183' },
        image: '/figma/home-15.jpeg',
        isPopular: true,
        displayOrder: 8
      },
      {
        name: 'Forest Velvet',
        slug: 'forest-velvet',
        collectionType: 'SOLIDS',
        materialGroup: 'LUXURY VELVET',
        materialDescription: 'Ultra-luxurious dense cotton-silk velvet pile offering extraordinary light extinction, thermal noise cancellation, and rich opulence.',
        priceGroup: 'C',
        fromPrice: 850,
        color: { name: 'Forest', hexCode: '#228B22' },
        image: '/figma/home-13.png',
        isPopular: true,
        displayOrder: 9
      },
      {
        name: 'Charcoal Velvet',
        slug: 'charcoal-velvet',
        collectionType: 'SOLIDS',
        materialGroup: 'LUXURY VELVET',
        materialDescription: 'Ultra-luxurious dense cotton-silk velvet pile offering extraordinary light extinction, thermal noise cancellation, and rich opulence.',
        priceGroup: 'C',
        fromPrice: 850,
        color: { name: 'Charcoal', hexCode: '#36454F' },
        image: '/figma/home-06.jpeg',
        isPopular: true,
        displayOrder: 10
      },
      {
        name: 'Airy Voile Sheer',
        slug: 'airy-voile-sheer',
        collectionType: 'SHEERS',
        materialGroup: 'ARCHITECTURAL SHEERS',
        materialDescription: 'Ethereal sheer open weave that gracefully floods spaces with natural light while softening glare and preserving panoramic views.',
        priceGroup: 'A',
        fromPrice: 550,
        color: { name: 'Ivory White', hexCode: '#FFFFF0' },
        image: '/figma/home-11.png',
        isPopular: true,
        displayOrder: 11
      },
      {
        name: 'Oyster Dupioni Silk',
        slug: 'oyster-dupioni-silk',
        collectionType: 'SILKS',
        materialGroup: 'NATURAL RAW SILKS',
        materialDescription: 'Hand-reeled mulberry silk with characteristic irregular slub texture that shimmers with multi-dimensional luster under sunlight.',
        priceGroup: 'C',
        fromPrice: 890,
        color: { name: 'Oyster', hexCode: '#EAE6DF' },
        image: '/figma/home-05.png',
        isPopular: true,
        displayOrder: 12
      },
      {
        name: 'Botanical Toile Linen',
        slug: 'botanical-toile-linen',
        collectionType: 'PATTERNS',
        materialGroup: 'ARTISAN PATTERNS',
        materialDescription: 'Hand-screened floral and architectural toile on rustic linen ground, tailored for statement library and salon treatments.',
        priceGroup: 'B',
        fromPrice: 750,
        color: { name: 'Clay', hexCode: '#D2B48C' },
        image: '/figma/home-18.jpeg',
        isPopular: false,
        displayOrder: 13
      },
      {
        name: 'Pastel Cloud Cotton',
        slug: 'pastel-cloud-cotton',
        collectionType: 'KIDS',
        materialGroup: 'COTTON & BLENDS',
        materialDescription: 'OEKO-TEX certified chemical-free nursery and children drapery cotton with hypo-allergenic finish.',
        priceGroup: 'A',
        fromPrice: 580,
        color: { name: 'White', hexCode: '#F5F5F0' },
        image: '/figma/home-02.png',
        isPopular: false,
        displayOrder: 14
      },
      {
        name: 'Heritage Bouclé Drape',
        slug: 'heritage-boucle-drape',
        collectionType: 'DESIGNERS',
        materialGroup: 'DESIGNER COUTURE',
        materialDescription: 'Architectural heavy looped yarn bouclé bringing high-fashion runway tactile depth to modern interior windows.',
        priceGroup: 'C',
        fromPrice: 920,
        color: { name: 'Sand', hexCode: '#C2B280' },
        image: '/figma/home-04.jpeg',
        isPopular: true,
        displayOrder: 15
      },
      {
        name: 'Sunbrella Sailcloth Salt',
        slug: 'sunbrella-sailcloth-salt',
        collectionType: 'SUNBRELLA',
        materialGroup: 'PERFORMANCE SUNBRELLA',
        materialDescription: 'Bleach-cleanable, fade-proof solution-dyed acrylic fabric built for sunrooms, coastal estates, and high-UV exposure.',
        priceGroup: 'B',
        fromPrice: 710,
        color: { name: 'Oatmeal', hexCode: '#E6D7B9' },
        image: '/figma/home-03.jpeg',
        isPopular: true,
        displayOrder: 16
      }
    ]);

    // 5. Seed Swatches
    console.log('[Seeder] Creating Fabric Swatches Catalog...');
    await Swatch.insertMany([
      {
        fabricName: 'Belgian Flax Linen',
        colorName: 'Champagne Oat',
        hexCode: '#E6D7B9',
        material: '100% European Flax Linen',
        weightGsm: 420,
        texture: 'Rich Slub Textured Weave',
        price: 0,
        image: {
          url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=600&q=80',
          alt: 'Belgian Flax Linen Champagne Oat'
        },
        tags: ['linen', 'neutral', 'luxury']
      },
      {
        fabricName: 'Monaco Royal Velvet',
        colorName: 'Emerald Forest',
        hexCode: '#046307',
        material: 'Heavyweight Cotton Velvet',
        weightGsm: 540,
        texture: 'Ultra-Soft Matte Pile',
        price: 0,
        image: {
          url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
          alt: 'Monaco Royal Velvet Emerald'
        },
        tags: ['velvet', 'blackout', 'statement']
      },
      {
        fabricName: 'Monaco Royal Velvet',
        colorName: 'Midnight Navy',
        hexCode: '#002366',
        material: 'Heavyweight Cotton Velvet',
        weightGsm: 540,
        texture: 'Lustrous Deep Velvet Pile',
        price: 0,
        image: {
          url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80',
          alt: 'Monaco Royal Velvet Midnight Navy'
        },
        tags: ['velvet', 'dark', 'opulent']
      },
      {
        fabricName: 'Artisan Sheer Voile',
        colorName: 'Pure Ivory',
        hexCode: '#FFFFF0',
        material: '100% Fine Spun Linen Sheer',
        weightGsm: 180,
        texture: 'Airy Ethereal Open Weave',
        price: 0,
        image: {
          url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
          alt: 'Artisan Sheer Pure Ivory'
        },
        tags: ['sheer', 'light-filtering']
      }
    ]);

    // 6. Seed High-Ticket Products
    console.log('[Seeder] Creating Luxury Drapery Products...');
    await Product.insertMany([
      {
        title: 'The Chateau Pure Belgian Flax Linen Drapery',
        slug: 'chateau-pure-belgian-flax-linen-drapery',
        sku: 'IHF-LINEN-001',
        shortDescription: 'Tailored from certified 100% Belgian flax with rich natural slub texture and artisan pinch pleats.',
        description:
          'Experience true European luxury with our flagship Chateau Belgian Flax Linen. Woven by fifth-generation master weavers in Flanders, this heavyweight linen possesses exceptional natural body and subtle slub variation that filters daylight gracefully. Every custom panel is individually hand-cut, pattern-matched, and finished with double-turned 4-inch bottom hems weighted with lead corners for an impeccable hang.',
        category: catCurtains._id,
        subCategory: subPinchPleat._id,
        basePrice: 580,
        pricePerYard: 68,
        fabricType: 'linen',
        colors: [
          { name: 'Champagne Beige', hexCode: '#F7E7CE', inStock: true },
          { name: 'Ivory White', hexCode: '#FFFFF0', inStock: true },
          { name: 'Charcoal Slate', hexCode: '#36454F', inStock: true }
        ],
        styles: ['pinch-pleat', 'euro-pleat'],
        features: ['blackout', 'thermal-insulated', 'motorized'],
        standardSizes: ['50x84"', '50x96"', '50x108"', '100x96"', '100x108"'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
            alt: 'Chateau Belgian Linen Drapery Hanging in Grand Living Room',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
            alt: 'Close up of French Pinch Pleat Tailoring',
            isPrimary: false
          }
        ],
        stockStatus: 'in_stock',
        inventoryCount: 450,
        isCustomizable: true,
        customizerRule: draperyRule._id,
        isFeatured: true
      },
      {
        title: 'The Monaco Royal Silk Velvet Blackout Drapery',
        slug: 'monaco-royal-silk-velvet-blackout-drapery',
        sku: 'IHF-VELVET-002',
        shortDescription: 'Sumptuous, heavyweight velvet with 100% blackout eclipse lining and thermal noise dampening.',
        description:
          'Designed for grand estates and master bedroom suites, our Monaco Royal Velvet provides unrivaled richness and acoustic warmth. With a dense 540 GSM cotton-silk pile, it absorbs sound, retains winter heat, and completely shuts out light when paired with our blackout lining. Finished with blind-stitched side hems and reinforced header buckram.',
        category: catCurtains._id,
        subCategory: subPinchPleat._id,
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
        standardSizes: ['50x96"', '50x108"', '100x96"', '100x108"'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
            alt: 'Monaco Royal Velvet Emerald Green Drapes',
            isPrimary: true
          }
        ],
        stockStatus: 'in_stock',
        inventoryCount: 320,
        isCustomizable: true,
        customizerRule: draperyRule._id,
        isFeatured: true
      },
      {
        title: 'The Verona Architectural Ripple Fold Sheer',
        slug: 'verona-architectural-ripple-fold-sheer',
        sku: 'IHF-SHEER-003',
        shortDescription: 'Modern continuous S-wave ripple fold sheer drapery for floor-to-ceiling windows and motorized tracks.',
        description:
          'A celebration of contemporary architecture, the Verona Ripple Fold creates smooth, uniform wave folds from left to right without bunching. Crafted from airy open-weave linen blend voile, it casts soft dappled light across hardwood floors while preserving daytime garden and skyline views.',
        category: catCurtains._id,
        subCategory: subRippleFold._id,
        basePrice: 420,
        pricePerYard: 48,
        fabricType: 'sheer',
        colors: [
          { name: 'Ivory White', hexCode: '#FFFFF0', inStock: true },
          { name: 'Champagne Beige', hexCode: '#F7E7CE', inStock: true }
        ],
        styles: ['ripple-fold'],
        features: ['motorized'],
        standardSizes: ['50x84"', '50x96"', '100x96"'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80',
            alt: 'Verona Ripple Fold Sheer Curtain Waves',
            isPrimary: true
          }
        ],
        stockStatus: 'in_stock',
        inventoryCount: 600,
        isCustomizable: true,
        customizerRule: draperyRule._id,
        isFeatured: true
      }
    ]);

    // 7. Seed Navigation Tree
    console.log('[Seeder] Creating Site Navigation...');
    await Navigation.create([
      {
        title: 'Custom Curtains',
        path: '/products?category=curtains-and-drapes',
        type: 'mega_menu',
        displayOrder: 1,
        columns: [
          {
            title: 'By Style',
            items: [
              { title: 'French Pinch Pleat', path: '/products?styles=pinch-pleat' },
              { title: 'Ripple Fold / S-Wave', path: '/products?styles=ripple-fold' },
              { title: 'Tailored Euro Pleat', path: '/products?styles=euro-pleat' },
              { title: 'Modern Grommets', path: '/products?styles=grommet' }
            ]
          },
          {
            title: 'By Fabric Tier',
            items: [
              { title: 'Belgian Linen', path: '/products?fabrics=linen' },
              { title: 'Silk Velvet', path: '/products?fabrics=velvet' },
              { title: 'Airy Sheers', path: '/products?fabrics=sheer' }
            ]
          }
        ]
      },
      {
        title: 'Customizer Studio',
        path: '/customizer',
        type: 'link',
        badge: 'Interactive',
        displayOrder: 2
      },
      {
        title: 'Order Swatches',
        path: '/swatches',
        type: 'link',
        badge: 'Free Kit',
        displayOrder: 3
      },
      {
        title: 'Journal & Guides',
        path: '/journal',
        type: 'link',
        displayOrder: 4
      }
    ]);

    // 8. Seed Editorial Blogs
    console.log('[Seeder] Creating Editorial Blogs...');
    await Blog.create([
      {
        title: 'The Ultimate Guide to Measuring Custom Drapes to the 1/8th Inch',
        slug: 'measuring-custom-curtains-guide',
        excerpt: 'How interior designers calculate rod placement, stack-back width, and hem pooling for high-ceiling rooms.',
        content: `
          <h3>The Art of Floor-to-Ceiling Drapery</h3>
          <p>Mounting your drapery hardware 4 to 8 inches above the window molding—or directly beneath the crown molding—immediately elevates ceiling height perception.</p>
          <h3>Calculating Window Stack-Back</h3>
          <p>Stack-back is the amount of space the curtain occupies when completely drawn open. For full glass clearance, add 20% to 30% to your window frame width.</p>
        `,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
          alt: 'Luxury interior drapery measurement tutorial'
        },
        tags: ['measurement', 'interior-design', 'curtains'],
        metaTitle: 'How to Measure Custom Curtains Like an Interior Designer | IHF',
        metaDescription: 'Step-by-step measurement guide for custom draperies, rod heights, puddle hems, and stack-back clearance.'
      }
    ]);

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY (ESM Mode)!');
    console.log('👑 Admin Credentials:');
    console.log('   Email:    admin@ihfluxury.com');
    console.log('   Password: Admin@123456');
    console.log('👤 Customer Credentials:');
    console.log('   Email:    client@luxurydrapes.com');
    console.log('   Password: Client@123456');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedDatabase();
