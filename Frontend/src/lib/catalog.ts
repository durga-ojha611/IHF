import { CATEGORY_CUSTOMIZER_CONFIGS } from "./customizer-configs";

export type CatalogCard = {
  _id?: string; slug: string; name: string; image: string; description: string; price: number;
  compareAtPrice?: number; productType?: string; colorCount?: number; variantCount?: number; customizable?: boolean;
};
export type CatalogCategory = {
  slug: string; name: string; eyebrow: string; headline: string; description: string; heroImage: string;
  subcategories: CatalogCard[]; fabrics: CatalogCard[]; products: CatalogCard[]; guideTitle: string; guideCopy: string;
};
export type ProductRecord = {
  _id: string; title: string; slug: string; sku: string; shortDescription: string; description: string;
  category: { _id?: string; name: string; slug: string } | string; subCategory?: { _id?: string; name: string; slug: string } | string;
  basePrice: number; compareAtPrice?: number; currency?: string; fabricType: string;
  colors: { name: string; hexCode: string; image?: string; inStock?: boolean }[];
  styles: string[]; features: string[]; standardSizes: string[]; images: { url: string; alt: string; isPrimary?: boolean }[];
  materialComposition?: string; weaveConstruction?: string; finishingProcess?: string; origin?: string; weight?: string;
  careInstructions?: string[]; benefits?: { title: string; description: string; icon?: string }[];
  dimensions?: { size: string; metric: string; imperial: string }[]; faqs?: { question: string; answer: string }[];
  bundleItems?: { name: string; image: string; price: number; variant: string; selected?: boolean }[];
  reviews?: { title: string; body: string; author: string; rating: number; date: string }[];
  ratingAverage?: number; ratingCount?: number; editorial?: { eyebrow?: string; title?: string; description?: string; image?: string };
  stockStatus: string; inventoryCount: number; isCustomizable: boolean; isFeatured: boolean; isActive: boolean;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function apiData<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    const body = await response.json();
    return body?.data || null;
  } catch { return null; }
}

export async function getCatalogCategory(slug: string): Promise<CatalogCategory | null> {
  const data = await apiData<{ category: CatalogCategory }>(`/categories/${slug}/storefront`);
  if (data?.category) return data.category;

  const cfg = CATEGORY_CUSTOMIZER_CONFIGS[slug];
  if (cfg) {
    return {
      slug,
      name: cfg.name,
      eyebrow: cfg.eyebrow,
      headline: cfg.headline,
      description: cfg.description,
      heroImage: cfg.heroImage,
      subcategories: cfg.styles.map((s) => ({
        slug: s.slug,
        name: s.name,
        image: s.image,
        description: s.description,
        price: s.price
      })),
      fabrics: cfg.fabrics.map((f) => ({
        slug: f.slug,
        name: `${f.name} · ${f.color}`,
        image: f.image,
        description: f.description,
        price: f.price
      })),
      products: cfg.products.map((p) => ({
        slug: p.slug,
        name: p.name,
        image: p.image,
        description: p.description,
        price: p.price
      })),
      guideTitle: cfg.guideTitle,
      guideCopy: cfg.guideCopy
    };
  }

  // Generic fallback category
  const cleanName = slug.split("-").map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(" ");
  return {
    slug,
    name: cleanName,
    eyebrow: `THE ${cleanName.toUpperCase()} ARCHIVE`,
    headline: `Atelier ${cleanName} Collection`,
    description: `Meticulously tailored from natural flax, Egyptian cotton, and organic weaves. Designed for effortless draping and quiet luxury.`,
    heroImage: "/figma/cat-bedding-transparent.png",
    subcategories: [
      { slug: "duvet-covers", name: "Duvet Covers", image: "/figma/cat-bedding.png", description: "Linen and sateen duvet covers", price: 285 },
      { slug: "coverlets", name: "Hand-Pickstitched Coverlets", image: "/figma/home-01.jpeg", description: "Pickstitched layerings", price: 310 },
      { slug: "shams", name: "European Hotel Shams", image: "/figma/product-linen-bedspread-hd.png", description: "Flanged accent shams", price: 115 }
    ],
    fabrics: [
      { slug: "pure-flax", name: "Pure Flax Linen", image: "/curtains/fabric-linen.png", description: "Belgian linen", price: 85 }
    ],
    products: [
      { slug: "waffle-weave-coverlet", name: "Waffle Weave Linen Coverlet", image: "/figma/cat-bedding.png", description: "Pickstitched coverlet", price: 310 },
      { slug: "garment-washed-duvet", name: "Garment-Washed Duvet Set", image: "/figma/home-02.png", description: "Garment washed duvet", price: 285 },
      { slug: "bespoke-linen-quilt", name: "Bespoke Linen Quilt", image: "/figma/home-03.jpeg", description: "Hand stitched quilt", price: 420 }
    ],
    guideTitle: `${cleanName} Guide`,
    guideCopy: `Expert advice for selecting styles and fabrics.`
  };
}

export async function getCatalogProducts(category: string, subcategory?: string): Promise<ProductRecord[]> {
  const query = new URLSearchParams({ category, limit: "60" });
  if (subcategory) query.set("subcategory", subcategory);
  const data = await apiData<{ products: ProductRecord[] }>(`/products?${query}`);
  if (data?.products && data.products.length > 0) return data.products;

  const cfg = CATEGORY_CUSTOMIZER_CONFIGS[category];
  if (cfg?.products) {
    return cfg.products.map((p) => buildProductFromConfigItem(p, category, cfg));
  }
  return [];
}

function buildProductFromConfigItem(
  item: { slug: string; name: string; image: string; description: string; price: number; rating?: number; features?: string; specs?: { defaultSize?: string; availableSizes?: string[]; edgeFinishes?: string[] } },
  catKey: string,
  catConfig: (typeof CATEGORY_CUSTOMIZER_CONFIGS)[keyof typeof CATEGORY_CUSTOMIZER_CONFIGS]
): ProductRecord {
  const primaryImg = item.image || "/figma/cat-table-linen.png";
  const images = [
    { url: primaryImg, alt: item.name, isPrimary: true },
    { url: "/figma/home-19.png", alt: `${item.name} architectural detail`, isPrimary: false },
    { url: "/figma/home-08.png", alt: `${item.name} atelier setting`, isPrimary: false },
    { url: "/figma/home-02.png", alt: `${item.name} material texture`, isPrimary: false }
  ];

  const colors = catConfig.fabrics && catConfig.fabrics.length > 0
    ? catConfig.fabrics.slice(0, 4).map((f) => ({
        name: `${f.name} · ${f.color}`,
        hexCode: f.hex || "#d8d0c1",
        inStock: true
      }))
    : [
        { name: "Natural Flax", hexCode: "#d8d0c1", inStock: true },
        { name: "Alabaster White", hexCode: "#eee9df", inStock: true },
        { name: "Warm Oatmeal", hexCode: "#c4b8a5", inStock: true },
        { name: "Slate Charcoal", hexCode: "#4a4a4a", inStock: true }
      ];

  const standardSizes = item.specs?.availableSizes || [
    "Standard",
    "Queen (94″ × 102″)",
    "King (108″ × 106″)",
    "Bespoke Made-to-Measure"
  ];

  const bundle = catConfig.products
    ? catConfig.products
        .filter((p) => p.slug !== item.slug)
        .slice(0, 2)
        .map((p, idx) => ({
          name: p.name,
          image: p.image,
          price: p.price,
          variant: "Natural Flax · Standard",
          selected: idx === 0
        }))
    : [];

  return {
    _id: `cfg-${catKey}-${item.slug}`,
    title: item.name,
    slug: item.slug,
    sku: `IHF-${catKey.slice(0, 3).toUpperCase()}-${item.slug.slice(0, 6).toUpperCase()}`,
    shortDescription: item.description,
    description: `Thoughtfully developed by the India Home Furnishings atelier, ${item.name} combines beautiful natural texture, considered proportion and enduring performance.`,
    category: { _id: catKey, name: catConfig.name, slug: catKey },
    subCategory: { _id: `${catKey}-sub`, name: catConfig.name, slug: catKey },
    basePrice: item.price || 145,
    compareAtPrice: Math.round((item.price || 145) * 1.25),
    currency: "USD",
    fabricType: "Pure Belgian Flax",
    colors,
    styles: ["Contemporary", "Tailored Atelier"],
    features: ["100% pure natural fibre", "Hand-finished edges", "Stonewashed for soft hand feel", "Pre-shrunk"],
    standardSizes,
    images,
    materialComposition: "100% Certified European Flax Linen",
    weaveConstruction: "Yarn-dyed artisan weave",
    finishingProcess: "Garment stonewashed with gentle natural softeners",
    origin: "Jaipur, India · Master Textile Atelier",
    weight: "240 GSM substantial year-round weight",
    careInstructions: [
      "Machine wash gentle on cold (30°C)",
      "Line dry in shade or low tumble dry",
      "Warm iron while slightly damp if crisp finish desired",
      "Do not bleach or dry clean with harsh chemicals"
    ],
    benefits: [
      { title: "Natural & Breathable", description: "Pure flax fibres naturally wick moisture and regulate temperature.", icon: "♧" },
      { title: "Softens with Washing", description: "Develops a more supple, luxurious drape and heirloom patina over time.", icon: "≈" },
      { title: "Master Artisan Finish", description: "Hand-mitered corners and drawn-thread work inspected at every step.", icon: "×" },
      { title: "Harmonious Palette", description: "Tailored to complement all IHF drapery, cushions and furniture hues.", icon: "○" }
    ],
    dimensions: [
      { size: "Standard Runner", metric: "40 × 230 cm", imperial: "16 × 90 in" },
      { size: "Long Banquet", metric: "45 × 300 cm", imperial: "18 × 120 in" },
      { size: "Custom Dimension", metric: "Tailored to Order", imperial: "Made-to-Measure" }
    ],
    faqs: [
      { question: "How do I care for this linen piece?", answer: "We recommend washing on a gentle cycle in cold water and drying naturally to maintain texture and hand-feel." },
      { question: "Can I order custom sizing or embroidery?", answer: "Yes, our master atelier provides bespoke sizing and custom monogramming upon request." },
      { question: "Can I receive fabric swatches before ordering?", answer: "Yes, complimentary swatches are available through our Fabrics & Swatches catalog." }
    ],
    bundleItems: bundle.length > 0 ? bundle : [
      { name: "Coordinating Accent Piece", image: "/figma/home-08.png", price: 85, variant: "Natural Flax · Standard", selected: true }
    ],
    reviews: [
      { title: "Exceptional craftsmanship and texture", body: "The weight and openwork hemstitching are simply gorgeous. It transformed our dining table.", author: "Elena R. · Interior Designer", rating: 5, date: "26 Sep 2026" },
      { title: "Heirloom quality piece", body: "Drapes beautifully and laundered with zero shrinkage. Worth every penny.", author: "Julian M. · Verified Client", rating: 5, date: "15 Sep 2026" }
    ],
    ratingAverage: 5.0,
    ratingCount: 38,
    editorial: {
      eyebrow: "ATELIER CRAFT",
      title: "Artisan Living Elegance",
      description: "Centuries of Rajasthani weaving heritage meet modern architectural proportions for living spaces that celebrate natural materials.",
      image: "/figma/home-19.png"
    },
    stockStatus: "in_stock",
    inventoryCount: 28,
    isCustomizable: false,
    isFeatured: true,
    isActive: true
  };
}

function buildFallbackProductRecord(slug: string): ProductRecord | null {
  for (const [catKey, catConfig] of Object.entries(CATEGORY_CUSTOMIZER_CONFIGS)) {
    const prod = catConfig.products?.find((p) => p.slug === slug);
    if (prod) return buildProductFromConfigItem(prod, catKey, catConfig);

    const style = catConfig.styles?.find((s) => s.slug === slug);
    if (style) return buildProductFromConfigItem(style, catKey, catConfig);

    const fabric = catConfig.fabrics?.find((f) => f.slug === slug);
    if (fabric) {
      return buildProductFromConfigItem(
        {
          slug: fabric.slug,
          name: `${fabric.name} · ${fabric.color}`,
          image: fabric.image,
          description: fabric.description,
          price: fabric.price
        },
        catKey,
        catConfig
      );
    }
  }

  // Generic fallback if slug is a valid string
  if (slug && typeof slug === "string") {
    const cleanTitle = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      _id: `fallback-${slug}`,
      title: cleanTitle,
      slug,
      sku: `IHF-${slug.slice(0, 6).toUpperCase()}`,
      shortDescription: `Atelier luxury design tailored from pure natural fibres.`,
      description: `Thoughtfully developed by the India Home Furnishings atelier, ${cleanTitle} combines beautiful natural texture, considered proportion and enduring performance.`,
      category: { _id: "collection", name: "Atelier Collection", slug: "collection" },
      subCategory: { _id: "bespoke", name: "Bespoke Furnishings", slug: "bespoke" },
      basePrice: 165,
      compareAtPrice: 210,
      currency: "USD",
      fabricType: "Belgian Linen",
      colors: [
        { name: "Natural Flax", hexCode: "#d8d0c1", inStock: true },
        { name: "Alabaster White", hexCode: "#eee9df", inStock: true },
        { name: "Oatmeal", hexCode: "#c4b8a5", inStock: true },
        { name: "Slate Charcoal", hexCode: "#4a4a4a", inStock: true }
      ],
      styles: ["Contemporary", "Tailored Atelier"],
      features: ["Pure natural fibre", "Hand-finished edges", "Stonewashed for softness", "Pre-shrunk"],
      standardSizes: ["Standard", "Queen", "King", "Custom Size"],
      images: [
        { url: "/figma/cat-table-linen.png", alt: cleanTitle, isPrimary: true },
        { url: "/figma/home-19.png", alt: `${cleanTitle} view 2`, isPrimary: false },
        { url: "/figma/home-08.png", alt: `${cleanTitle} view 3`, isPrimary: false },
        { url: "/figma/home-02.png", alt: `${cleanTitle} view 4`, isPrimary: false }
      ],
      materialComposition: "100% Certified European Flax Linen",
      weaveConstruction: "Yarn-dyed artisan weave",
      finishingProcess: "Garment stonewashed with gentle natural softeners",
      origin: "Jaipur, India · Master Textile Atelier",
      weight: "240 GSM substantial year-round weight",
      careInstructions: [
        "Machine wash gentle on cold (30°C)",
        "Line dry in shade or low tumble dry",
        "Warm iron while slightly damp if desired",
        "Do not bleach"
      ],
      benefits: [
        { title: "Natural & Breathable", description: "Pure natural fibres regulate temperature and wick moisture.", icon: "♧" },
        { title: "Softens with Washing", description: "Grows softer, more supple, and more relaxed with every wash.", icon: "≈" },
        { title: "Master Artisan Finish", description: "Hand-finished details inspected for exacting precision.", icon: "×" },
        { title: "Harmonious Palette", description: "Colours curated to layer seamlessly across rooms.", icon: "○" }
      ],
      dimensions: [
        { size: "Standard", metric: "40 × 230 cm", imperial: "16 × 90 in" },
        { size: "Large", metric: "45 × 300 cm", imperial: "18 × 120 in" },
        { size: "Custom", metric: "Tailored to Order", imperial: "Bespoke" }
      ],
      faqs: [
        { question: "How do I care for this piece?", answer: "Follow the care instructions on the label and use a gentle cold cycle for lasting softness." },
        { question: "Can I order custom sizing?", answer: "Yes. Our atelier can tailor this design to your exact requirements." },
        { question: "Can I see swatches first?", answer: "Yes. Order complimentary swatches to review colour and texture in your own light." }
      ],
      bundleItems: [
        { name: "Coordinating Napkins / Cushion Pair", image: "/figma/home-08.png", price: 85, variant: "Natural · Pair", selected: true },
        { name: "Layering Throw", image: "/figma/home-01.jpeg", price: 135, variant: "Natural", selected: false }
      ],
      reviews: [
        { title: "Beautiful material and finish", body: "The texture and tailoring exceeded our expectations.", author: "Verified Client", rating: 5, date: "28 Sep 2026" },
        { title: "Perfect in every detail", body: "Transformed our living space instantly. The hand feel is incredible.", author: "Verified Client", rating: 5, date: "14 Sep 2026" }
      ],
      ratingAverage: 4.9,
      ratingCount: 36,
      editorial: {
        eyebrow: "THE ATELIER",
        title: "Crafted with Intention",
        description: "Natural materials, quiet detailing and meticulous workmanship come together in a piece intended to last.",
        image: "/figma/home-17.jpeg"
      },
      stockStatus: "in_stock",
      inventoryCount: 24,
      isCustomizable: false,
      isFeatured: true,
      isActive: true
    };
  }

  return null;
}

export async function getProductRecord(slug: string): Promise<ProductRecord | null> {
  const data = await apiData<{ product: ProductRecord }>(`/products/${slug}`);
  if (data?.product) return data.product;

  return buildFallbackProductRecord(slug);
}

export async function getRelatedProducts(id: string): Promise<ProductRecord[]> {
  const data = await apiData<{ related: ProductRecord[] }>(`/products/${id}/related`);
  if (data?.related && data.related.length > 0) return data.related;

  const relatedList: ProductRecord[] = [];
  for (const [catKey, catConfig] of Object.entries(CATEGORY_CUSTOMIZER_CONFIGS)) {
    if (catConfig.products) {
      for (const p of catConfig.products) {
        if (`cfg-${catKey}-${p.slug}` !== id && p.slug !== id) {
          relatedList.push(buildProductFromConfigItem(p, catKey, catConfig));
          if (relatedList.length >= 4) return relatedList;
        }
      }
    }
  }
  return relatedList;
}
