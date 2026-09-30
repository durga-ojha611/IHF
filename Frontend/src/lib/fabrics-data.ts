export interface FabricItem {
  _id?: string;
  name: string;
  slug?: string;
  collectionType: string;
  materialGroup: string;
  materialDescription?: string;
  priceGroup: "A" | "B" | "C" | "D";
  fromPrice: number;
  color: {
    name: string;
    hexCode?: string;
  };
  image: string;
  closeupImage?: string;
  specs?: {
    composition?: string;
    weight?: string;
    durability?: string;
    lightFiltering?: string;
    care?: string;
  };
  isPopular?: boolean;
}

export interface MaterialSection {
  groupName: string;
  priceGroup: string;
  fromPrice: number;
  description: string;
  fabrics: FabricItem[];
}

export const FABRIC_COLLECTIONS = [
  "LINENS",
  "SHEERS",
  "WOOLS + BLENDS",
  "COTTONS",
  "SILKS",
  "SOLIDS",
  "PATTERNS",
  "KIDS",
  "DESIGNERS",
  "SUNBRELLA",
  "MOST POPULAR"
];

export const ALL_FABRICS: FabricItem[] = [
  {
    _id: "fab-1",
    name: "White Linen",
    slug: "white-linen",
    collectionType: "LINENS",
    materialGroup: "LINENS & NATURAL WEAVES",
    materialDescription: "Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.",
    priceGroup: "A",
    fromPrice: 545,
    color: { name: "White", hexCode: "#F5F5F0" },
    image: "/figma/home-02.png",
    closeupImage: "/figma/home-02.png",
    isPopular: true,
    specs: {
      composition: "100% Belgian Flax Linen",
      weight: "320 GSM (Heavyweight Architectural Drape)",
      durability: "30,000 Martindale Rubs (Commercial Grade)",
      lightFiltering: "Semi-Sheer to Light Filtering (Soft Glow)",
      care: "Professional dry clean or steam in situ."
    }
  },
  {
    _id: "fab-2",
    name: "Clay Linen",
    slug: "clay-linen",
    collectionType: "LINENS",
    materialGroup: "LINENS & NATURAL WEAVES",
    materialDescription: "Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.",
    priceGroup: "A",
    fromPrice: 545,
    color: { name: "Clay", hexCode: "#D2B48C" },
    image: "/figma/home-18.jpeg",
    closeupImage: "/figma/home-18.jpeg",
    isPopular: true,
    specs: {
      composition: "100% Belgian Flax Linen",
      weight: "320 GSM (Heavyweight Architectural Drape)",
      durability: "30,000 Martindale Rubs (Commercial Grade)",
      lightFiltering: "Light Filtering to Privacy (Warm Amber)",
      care: "Professional dry clean or steam in situ."
    }
  },
  {
    _id: "fab-3",
    name: "Slate Wool",
    slug: "slate-wool",
    collectionType: "WOOLS + BLENDS",
    materialGroup: "WOOL & BLENDS",
    materialDescription: "Finely spun virgin wool blend creating substantial drape with acoustic sound-dampening qualities and thermal insulation.",
    priceGroup: "B",
    fromPrice: 620,
    color: { name: "Slate", hexCode: "#708090" },
    image: "/figma/home-07.jpeg",
    closeupImage: "/figma/home-07.jpeg",
    isPopular: false,
    specs: {
      composition: "70% Wool, 30% Fine Cashmere Blend",
      weight: "440 GSM (Substantial Acoustic Weave)",
      durability: "45,000 Martindale Rubs (High Residential)",
      lightFiltering: "Dimout to Room Darkening",
      care: "Strictly professional dry clean only."
    }
  },
  {
    _id: "fab-4",
    name: "Oatmeal Linen",
    slug: "oatmeal-linen",
    collectionType: "LINENS",
    materialGroup: "LINENS & NATURAL WEAVES",
    materialDescription: "A classic Belgian flax linen in a warm oatmeal hue, woven with a rich slub texture and soft fluid drape. Breathable, durable, and naturally elegant — designed for timeless interiors with effortless light filtering.",
    priceGroup: "A",
    fromPrice: 545,
    color: { name: "Oatmeal", hexCode: "#E6D7B9" },
    image: "/figma/home-03.jpeg",
    closeupImage: "/figma/home-03.jpeg",
    isPopular: true,
    specs: {
      composition: "100% Belgian Flax Linen",
      weight: "320 GSM (Heavyweight Architectural Drape)",
      durability: "35,000 Martindale Rubs (Commercial Grade)",
      lightFiltering: "Semi-Sheer to Light Filtering (Soft Glow)",
      care: "Professional dry clean or steam in situ."
    }
  },
  {
    _id: "fab-5",
    name: "Sand Wool Blend",
    slug: "sand-wool-blend",
    collectionType: "WOOLS + BLENDS",
    materialGroup: "WOOL & BLENDS",
    materialDescription: "Finely spun virgin wool blend creating substantial drape with acoustic sound-dampening qualities and thermal insulation.",
    priceGroup: "B",
    fromPrice: 620,
    color: { name: "Sand", hexCode: "#C2B280" },
    image: "/figma/home-04.jpeg",
    closeupImage: "/figma/home-04.jpeg",
    isPopular: true,
    specs: {
      composition: "75% Merino Wool, 25% Organic Cotton",
      weight: "410 GSM (Thermal Insulation Drape)",
      durability: "40,000 Martindale Rubs",
      lightFiltering: "Room Darkening with Soft Warm Tone",
      care: "Professional dry clean."
    }
  },
  {
    _id: "fab-6",
    name: "Sky Cotton",
    slug: "sky-cotton",
    collectionType: "SHEERS",
    materialGroup: "SHEERS & AIRY WEAVES",
    materialDescription: "Delicate, light-filtering sheers that soften daylight while maintaining open architectural views.",
    priceGroup: "A",
    fromPrice: 510,
    color: { name: "Sky", hexCode: "#87CEEB" },
    image: "/figma/home-19.png",
    closeupImage: "/figma/home-19.png",
    isPopular: false,
    specs: {
      composition: "100% Combed Long-Staple Cotton",
      weight: "180 GSM (Airy Sheer Diffuser)",
      durability: "25,000 Martindale Rubs",
      lightFiltering: "Ultra Sheer (Preserves Outdoor Vista)",
      care: "Gentle hand wash or delicate cycle."
    }
  },
  {
    _id: "fab-7",
    name: "Terracotta Cotton",
    slug: "terracotta-cotton",
    collectionType: "COTTONS",
    materialGroup: "COTTON & BLENDS",
    materialDescription: "Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic and contemporary interiors.",
    priceGroup: "A",
    fromPrice: 545,
    color: { name: "Terracotta", hexCode: "#E2725B" },
    image: "/figma/home-08.png",
    closeupImage: "/figma/home-08.png",
    isPopular: true,
    specs: {
      composition: "100% Organic Cotton Sateen",
      weight: "340 GSM (Durable Mid-Weight)",
      durability: "35,000 Double Rubs",
      lightFiltering: "Medium Privacy Light Filter",
      care: "Dry clean or warm machine cycle."
    }
  },
  {
    _id: "fab-8",
    name: "Sage Linen",
    slug: "sage-linen",
    collectionType: "LINENS",
    materialGroup: "LINENS & NATURAL WEAVES",
    materialDescription: "Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.",
    priceGroup: "A",
    fromPrice: 545,
    color: { name: "Sage", hexCode: "#9CAF88" },
    image: "/figma/home-13.png",
    closeupImage: "/figma/home-13.png",
    isPopular: true,
    specs: {
      composition: "100% Belgian Flax Linen",
      weight: "320 GSM",
      durability: "32,000 Martindale Rubs",
      lightFiltering: "Semi-Sheer to Privacy",
      care: "Dry clean recommended."
    }
  },
  {
    _id: "fab-9",
    name: "Forest Velvet",
    slug: "forest-velvet",
    collectionType: "SILKS",
    materialGroup: "SILKS & VELVETS",
    materialDescription: "Dense cotton-silk pile capturing the light with deep, luminous color variation and exceptional acoustic insulation.",
    priceGroup: "C",
    fromPrice: 850,
    color: { name: "Forest", hexCode: "#228B22" },
    image: "/figma/home-12.jpeg",
    closeupImage: "/figma/home-12.jpeg",
    isPopular: true,
    specs: {
      composition: "80% Combed Cotton, 20% Mulberry Silk",
      weight: "480 GSM (Luxe Heavy Pile)",
      durability: "50,000 Martindale Rubs",
      lightFiltering: "Substantial Blackout Depth",
      care: "Strictly professional dry clean only."
    }
  },
  {
    _id: "fab-10",
    name: "Charcoal Velvet",
    slug: "charcoal-velvet",
    collectionType: "SILKS",
    materialGroup: "SILKS & VELVETS",
    materialDescription: "Dense cotton-silk pile capturing the light with deep, luminous color variation and exceptional acoustic insulation.",
    priceGroup: "C",
    fromPrice: 850,
    color: { name: "Charcoal", hexCode: "#36454F" },
    image: "/figma/home-16.png",
    closeupImage: "/figma/home-16.png",
    isPopular: true,
    specs: {
      composition: "80% Combed Cotton, 20% Mulberry Silk",
      weight: "480 GSM (Luxe Heavy Pile)",
      durability: "50,000 Martindale Rubs",
      lightFiltering: "Substantial Blackout Depth",
      care: "Strictly professional dry clean only."
    }
  }
];
