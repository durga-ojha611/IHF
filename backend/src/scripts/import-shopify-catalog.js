import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const STORE_URL = (process.env.SHOPIFY_SOURCE_URL || 'https://indiahomefurnishings.com').replace(/\/$/, '');
const PAGE_SIZE = 250;

const categoryDefinitions = {
  drapery: { name: 'Drapery', order: 1, description: 'Custom curtains, drapes and made-to-measure panels.' },
  shades: { name: 'Shades', order: 2, description: 'Custom Roman shades and tailored window treatments.' },
  valances: { name: 'Valances', order: 3, description: 'Decorative top treatments and architectural valances.' },
  pillows: { name: 'Pillows', order: 4, description: 'Handcrafted decorative pillows and covers.' },
  bedding: { name: 'Bedding', order: 5, description: 'Duvet covers, quilts, coverlets and bed textiles.' },
  'table-linen': { name: 'Table Linen', order: 6, description: 'Table runners, placemats and decorative table covers.' },
  fabrics: { name: 'Fabrics & Swatches', order: 7, description: 'Fabric by the yard and large material swatches.' },
  decor: { name: 'Decor & More', order: 8, description: 'Tie backs, trims, fringes and finishing details.' },
};

const colorHex = {
  white: '#f4f1e9', ivory: '#e8dfca', cream: '#eee3cf', natural: '#c7b394', beige: '#cbbb9f', sand: '#c9ad82', gold: '#b89445',
  yellow: '#d2b34f', orange: '#c8753f', rust: '#a65332', red: '#9a3030', burgundy: '#6d2837', wine: '#6b2835', pink: '#d7a4ac', blush: '#d7aaa4',
  purple: '#69537b', lavender: '#a395bd', blue: '#587a98', navy: '#263a59', teal: '#397277', green: '#607a55', sage: '#8c9c7d', olive: '#77764a',
  grey: '#858585', gray: '#858585', silver: '#aaa9a5', charcoal: '#454545', black: '#242424', brown: '#74543e', copper: '#a96f4c', taupe: '#93806e',
};

function stripHtml(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>|<\/li>|<\/div>|<\/h\d>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

function classify(product) {
  const text = `${product.title} ${product.product_type} ${(product.tags || []).join(' ')}`.toLowerCase();
  if (/swatch|fabric by|fabric$|fabric yard/.test(text)) return 'fabrics';
  if (/roman shade|roman blind|shade/.test(text)) return 'shades';
  if (/duvet|bedspread|bedding|quilt|coverlet|bed runner/.test(text)) return 'bedding';
  if (/pillow|cushion/.test(text)) return 'pillows';
  if (/table|placemat/.test(text)) return 'table-linen';
  if (/tie back|tieback|trim|fringe|tassel/.test(text)) return 'decor';
  if (/valance|cornice/.test(text)) return 'valances';
  return 'drapery';
}

function fabricType(product) {
  const text = `${product.title} ${product.product_type} ${(product.tags || []).join(' ')}`.toLowerCase();
  for (const value of ['dupioni silk', 'faux silk', 'linen', 'velvet', 'sheer voile', 'cotton', 'blackout', 'silk']) if (text.includes(value)) return value;
  return (product.product_type || 'artisan textile').toLowerCase();
}

function inferHex(name = '') {
  const lower = name.toLowerCase();
  const key = Object.keys(colorHex).find((candidate) => lower.includes(candidate));
  return key ? colorHex[key] : '#c8c0b2';
}

function variantOptions(product, variant) {
  return (product.options || []).map((option, index) => ({ name: option.name, value: variant[`option${index + 1}`] || '' })).filter((item) => item.value);
}

function sourceColors(product) {
  const option = (product.options || []).find((item) => /colou?r/i.test(item.name));
  if (!option) return [];
  return [...new Set(option.values || [])].map((name) => ({ name, hexCode: inferHex(name), inStock: product.variants.some((variant) => variant.available && variantOptions(product, variant).some((item) => item.name === option.name && item.value === name)) }));
}

function sourceSizes(product) {
  const values = (product.options || []).filter((item) => !/colou?r|fabric/i.test(item.name)).flatMap((item) => item.values || []);
  return [...new Set(values)].slice(0, 100);
}

function catalogDescription(product, categorySlug) {
  const material = fabricType(product).replace(/\b\w/g, (letter) => letter.toUpperCase());
  const copy = {
    drapery: `Tailored ${material} drapery with a considered fall and refined finish.`,
    shades: `Made-to-measure ${material} shades for softly filtered, beautifully balanced light.`,
    valances: `An architectural ${material} finishing layer, tailored for a polished window.`,
    pillows: `A tactile ${material} accent, finished for effortless layering.`,
    bedding: `A softly finished ${material} layer designed for calm, collected bedrooms.`,
    'table-linen': `Refined ${material} table linen for relaxed everyday entertaining.`,
    fabrics: `${material} from our textile library, available for sampling and custom projects.`,
    decor: `A hand-finished ${material} detail for a tailored, complete interior.`,
  };
  return copy[categorySlug] || `A considered ${material} piece from the India Home Furnishings collection.`;
}

function mapProduct(product, category, subCategory) {
  const prices = product.variants.map((variant) => Number(variant.price)).filter(Number.isFinite);
  const comparePrices = product.variants.map((variant) => Number(variant.compare_at_price)).filter((value) => Number.isFinite(value) && value > 0);
  const description = stripHtml(product.body_html);
  const availableVariants = product.variants.filter((variant) => variant.available).length;
  return {
    title: product.title,
    slug: product.handle,
    sku: product.variants.find((variant) => variant.sku)?.sku || `SHOPIFY-${product.id}`,
    shortDescription: catalogDescription(product, category.slug),
    description: description || product.title,
    bodyHtml: product.body_html || '',
    vendor: product.vendor || '',
    productType: product.product_type || '',
    tags: product.tags || [],
    sourceOptions: (product.options || []).map((option) => ({ name: option.name, position: option.position, values: option.values || [] })),
    variants: product.variants.map((variant) => ({
      externalId: String(variant.id), title: variant.title || '', sku: variant.sku || '', options: variantOptions(product, variant),
      price: Number(variant.price) || 0, compareAtPrice: variant.compare_at_price ? Number(variant.compare_at_price) : null,
      available: Boolean(variant.available), requiresShipping: Boolean(variant.requires_shipping), taxable: Boolean(variant.taxable),
      grams: Number(variant.grams) || 0, position: variant.position || 0,
      featuredImage: variant.featured_image?.src || variant.featured_image || '', sourceCreatedAt: variant.created_at || null, sourceUpdatedAt: variant.updated_at || null,
    })),
    category: category._id,
    subCategory: subCategory?._id || null,
    basePrice: prices.length ? Math.min(...prices) : 0,
    compareAtPrice: comparePrices.length ? Math.min(...comparePrices) : null,
    currency: 'USD',
    pricePerYard: prices.length ? Math.min(...prices) : 0,
    fabricType: fabricType(product),
    colors: sourceColors(product),
    styles: [...new Set((product.tags || []).filter((tag) => /drape|curtain|shade|pillow|runner|cover/i.test(tag)).map((tag) => tag.toLowerCase()))],
    features: (product.tags || []).map((tag) => tag.toLowerCase()),
    standardSizes: sourceSizes(product),
    images: (product.images || []).map((image, index) => ({ externalId: String(image.id), url: image.src, alt: `${product.title}${index ? ` view ${index + 1}` : ''}`, isPrimary: index === 0, width: image.width || null, height: image.height || null, variantIds: (image.variant_ids || []).map(String) })),
    stockStatus: availableVariants ? 'in_stock' : 'out_of_stock',
    inventoryCount: availableVariants,
    isCustomizable: ['drapery', 'shades', 'valances'].includes(category.slug),
    isFeatured: false,
    isActive: Boolean(product.published_at),
    isArchived: false,
    isDeleted: false,
    deletedAt: null,
    source: { platform: 'shopify', externalId: String(product.id), handle: product.handle, url: `${STORE_URL}/products/${product.handle}`, publishedAt: product.published_at || null, createdAt: product.created_at || null, updatedAt: product.updated_at || null, syncedAt: new Date() },
  };
}

async function fetchCatalog() {
  const products = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(`${STORE_URL}/products.json?limit=${PAGE_SIZE}&page=${page}`);
    if (!response.ok) throw new Error(`Shopify catalog request failed (${response.status}) on page ${page}`);
    const batch = (await response.json()).products || [];
    products.push(...batch);
    console.log(`[Shopify] page ${page}: ${batch.length} products`);
    if (batch.length < PAGE_SIZE) break;
  }
  return products;
}

async function upsertCategory(slug, definition, parentCategory = null) {
  return Category.findOneAndUpdate(
    { slug },
    { $set: { name: definition.name, slug, description: definition.description || '', parentCategory, displayOrder: definition.order || 0, isActive: true, isArchived: false, isDeleted: false, deletedAt: null } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
}

async function run() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`[MongoDB] connected: ${mongoose.connection.host}`);
  const products = await fetchCatalog();
  if (process.argv.includes('--archive-existing')) {
    const result = await Product.updateMany(
      { 'source.platform': { $ne: 'shopify' }, isActive: true },
      { $set: { isActive: false, isArchived: true } }
    );
    console.log(`[Import] archived ${result.modifiedCount} existing non-Shopify products before canonical catalog restore`);
  }
  const parents = {};
  for (const [slug, definition] of Object.entries(categoryDefinitions)) parents[slug] = await upsertCategory(slug, definition);
  const subcategories = new Map();
  let created = 0;
  let updated = 0;
  for (const [index, sourceProduct] of products.entries()) {
    const parentSlug = classify(sourceProduct);
    const parent = parents[parentSlug];
    const typeName = sourceProduct.product_type || categoryDefinitions[parentSlug].name;
    const subSlug = `${parentSlug}-${typeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
    if (!subcategories.has(subSlug)) subcategories.set(subSlug, await upsertCategory(subSlug, { name: typeName, description: `${typeName} collection imported from India Home Furnishings.` }, parent._id));
    const payload = mapProduct(sourceProduct, parent, subcategories.get(subSlug));
    const existing = await Product.findOne({ 'source.platform': 'shopify', 'source.externalId': String(sourceProduct.id) });
    await Product.findOneAndUpdate(
      { 'source.platform': 'shopify', 'source.externalId': String(sourceProduct.id) },
      { $set: payload },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    existing ? updated += 1 : created += 1;
    if ((index + 1) % 25 === 0 || index + 1 === products.length) console.log(`[Import] ${index + 1}/${products.length}`);
  }
  console.log(JSON.stringify({ sourceProducts: products.length, created, updated, variants: products.reduce((sum, product) => sum + product.variants.length, 0), images: products.reduce((sum, product) => sum + product.images.length, 0), categories: Object.keys(parents).length, subcategories: subcategories.size }, null, 2));
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
