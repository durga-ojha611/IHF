export interface CustomizerStyleConfig {
  id: string;
  slug: string;
  name: string;
  kicker: string;
  description: string;
  price: number;
  image: string;
  features: string;
  specs: {
    defaultSize?: string;
    availableSizes?: string[];
    mountTypes?: string[];
    liningOptions?: string[];
    controlOptions?: string[];
    insertOptions?: string[];
    hardwareFinishes?: string[];
    edgeFinishes?: string[];
    closureTypes?: string[];
  };
}

export interface CustomizerFabricConfig {
  slug: string;
  name: string;
  color: string;
  hex: string;
  image: string;
  description: string;
  price: number;
  priceGroup: "A" | "B" | "C" | "D";
}

export interface CategoryCustomizerConfig {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  description: string;
  heroImage: string;
  guideImage?: string;
  customizerHeadline: string;
  customizerSubhead: string;
  craftPillars: { title: string; desc: string }[];
  guideTitle: string;
  guideCopy: string;
  guideSteps: { title: string; desc: string }[];
  styles: CustomizerStyleConfig[];
  fabrics: CustomizerFabricConfig[];
  products: {
    slug: string;
    name: string;
    image: string;
    description: string;
    price: number;
    rating?: number;
  }[];
}

export const CATEGORY_CUSTOMIZER_CONFIGS: Record<string, CategoryCustomizerConfig> = {
  // 1. DRAPERY
  drapery: {
    slug: "drapery",
    name: "Drapery",
    eyebrow: "MADE TO MEASURE",
    headline: "Drapery, made for your space.",
    description: "Choose your fabric, heading, lining and finish. Every panel is tailored to your measurements and finished by hand.",
    heroImage: "/figma/home-01.jpeg",
    customizerHeadline: "Choose Your Drapery Style",
    customizerSubhead: "Handcrafted over precision header systems, tailored with crisp architectural folds, seamless linings, and whisper-quiet control options.",
    craftPillars: [
      { title: "Flush Mount Precision", desc: "Engineered for millimeter ceiling clearances and effortless wall transitions." },
      { title: "Symmetrical Fold Memory", desc: "Specialty interlining ensures permanent, graceful drape memory without sagging." },
      { title: "Certified Best for Kids®", desc: "Cordless and motorization options engineered for absolute safety and quiet glide." }
    ],
    guideTitle: "The Atelier Drapery Guide",
    guideCopy: "Expert advice for choosing heading styles, fabrics, fullness, and track clearances.",
    guideSteps: [
      { title: "Choose the Right Heading", desc: "Ripple Fold offers modern simplicity, while French Pinch Pleats bring timeless architectural presence." },
      { title: "Measure with Confidence", desc: "Follow our simple atelier measurement guide for finished width and drop, down to 1/8 inch." },
      { title: "Layer with Intention", desc: "Pair privacy or blackout lining with sheer panels for versatile, around-the-clock light control." }
    ],
    styles: [
      {
        id: "ripple-fold",
        slug: "ripple-fold-drapery",
        name: "Ripple Fold Drapery",
        kicker: "BEAUTY MEETS FUNCTIONALITY",
        description: "Adored by interior designers everywhere, our Ripple Fold Drapery is an elegant blend of simplicity and style.",
        price: 545,
        image: "/figma/home-hero-hd.png",
        features: "Sophisticated and modern · Functional and easy to operate · Glides easily along included architectural track",
        specs: {
          defaultSize: "Pair · 96″ L × 48″ W",
          availableSizes: ["84″ Drop", "96″ Drop", "108″ Drop", "120″ Soaring Drop", "Custom Millimeter"],
          mountTypes: ["Ceiling Track Recessed", "Wall-Mount Architectural Rod", "Flush Window Casing"],
          liningOptions: ["Unlined Sheer", "Privacy Twill (50% Filter)", "Thermal Blackout (100%)"],
          controlOptions: ["Baton Draw (Pair)", "Whisper Motorized Smart Hub", "Continuous Cordless Track"]
        }
      },
      {
        id: "tailored-pleat",
        slug: "tailored-pleat-drapery",
        name: "Tailored Pleat Drapery",
        kicker: "REFINED AND STRUCTURED",
        description: "A modern take on traditional pleating, offering a crisp waterfall effect that maintains its structure beautifully.",
        price: 585,
        image: "/figma/home-15.jpeg",
        features: "Crisp, uniform waterfall pleats · Ideal for both casual and formal settings · Operates smoothly on rings or traversing hardware",
        specs: {
          defaultSize: "Pair · 96″ L × 50″ W",
          availableSizes: ["84″ Drop", "96″ Drop", "108″ Drop", "120″ Soaring Drop", "Custom Millimeter"],
          mountTypes: ["Rings on Decorative Rod", "Traversing Architectural Track", "Concealed Wall Cleat"],
          liningOptions: ["Privacy Twill", "Blackout Interlining", "Thermal Flannel Core"],
          controlOptions: ["Wand Baton", "Somfy Smart Motor", "Manual Ring Slide"]
        }
      },
      {
        id: "pinch-pleat",
        slug: "pinch-pleat-drapery",
        name: "Pinch Pleat Drapery",
        kicker: "CLASSIC TRADITION",
        description: "The timeless standard for custom drapery, featuring hand-sewn, permanent folds that create a full, elegant appearance.",
        price: 620,
        image: "/figma/home-11.png",
        features: "Three-finger hand-pinched pleats · Maximum fullness and thermal insulation · Classic luxury for dining and living suites",
        specs: {
          defaultSize: "Pair · 96″ L × 50″ W",
          availableSizes: ["84″ Drop", "96″ Drop", "108″ Drop", "120″ Soaring Drop", "Custom Millimeter"],
          mountTypes: ["Drapery Rings & Rod", "Traversing Track", "French Return Cleat"],
          liningOptions: ["Heavyweight Blackout", "Acoustic Flannel Lined", "Cotton Sateen Privacy"],
          controlOptions: ["Double Wand Draw", "Somfy Motorized", "Hand Traverse"]
        }
      },
      {
        id: "grommet",
        slug: "grommet-drapery",
        name: "Grommet Drapery",
        kicker: "CONTEMPORARY & CASUAL",
        description: "A popular choice for a modern, relaxed aesthetic with metal rings sliding effortlessly over a decorative rod.",
        price: 510,
        image: "/figma/home-10.jpeg",
        features: "Precision metal eyelets in 4 finishes · Deep S-folds that stack compactly · Effortless hand slide for daily living",
        specs: {
          defaultSize: "Pair · 96″ L × 48″ W",
          availableSizes: ["84″ Drop", "96″ Drop", "108″ Drop", "Custom Drop"],
          mountTypes: ["Wall Mount Rod (1.25″ Diameter)", "Wall Mount Rod (1.5″ Heavy)"],
          liningOptions: ["Unlined Light Filter", "Cotton Twill Lining", "Blackout Core"],
          controlOptions: ["Manual Hand Glide", "Baton Assisted"]
        }
      },
      {
        id: "inverted-pleat",
        slug: "inverted-pleat-drapery",
        name: "Inverted Pleat Drapery",
        kicker: "SLEEK AND MINIMALIST",
        description: "Also known as a reverse box pleat, this style hides fullness at the back, presenting a clean, flat header to the room.",
        price: 560,
        image: "/figma/home-04.jpeg",
        features: "Architectural flat facade · Pleats concealed on reverse side · Modern bespoke look for tailored master bedrooms",
        specs: {
          defaultSize: "Pair · 96″ L × 48″ W",
          availableSizes: ["84″ Drop", "96″ Drop", "108″ Drop", "120″ Drop"],
          mountTypes: ["Recessed Ceiling Track", "Under-Cornice Mount", "Decorative Pole with Hidden Rings"],
          liningOptions: ["Thermal Blackout", "Sateen Privacy", "Unlined Flax"],
          controlOptions: ["Motorized Remote", "Baton Draw"]
        }
      }
    ],
    fabrics: [
      { slug: "belgian-flax", name: "Belgian Flax Linen", color: "Oatmeal", hex: "#D6CEBF", image: "/figma/home-02.png", description: "100% Belgian flax with natural fluid drape.", price: 650, priceGroup: "A" },
      { slug: "organic-cotton", name: "Organic Combed Cotton", color: "Warm Alabaster", hex: "#ECE7DE", image: "/figma/home-03.jpeg", description: "Crisp matte combed sateen weave with soft hand.", price: 580, priceGroup: "B" },
      { slug: "royal-velvet", name: "Royal Silk Velvet", color: "Sable Bronze", hex: "#4B3E36", image: "/figma/home-12.jpeg", description: "Dense cotton-silk pile with acoustic depth.", price: 850, priceGroup: "C" },
      { slug: "wool-blend", name: "Alpine Wool Blend", color: "Muted Flannel Grey", hex: "#A8A49C", image: "/figma/home-04.jpeg", description: "Thermal, acoustic sound-softening architectural drape.", price: 720, priceGroup: "D" }
    ],
    products: [
      { slug: "signature-ripple-fold-drapery", name: "Signature Ripple Fold Drapery", image: "/figma/home-hero-hd.png", description: "Tailored in pure Belgian linen with fluid S-curve folds and smooth ceiling-track glide.", price: 545, rating: 5 },
      { slug: "heritage-ripple-fold-drapery", name: "Heritage Ripple Fold Drapery", image: "/figma/home-03.jpeg", description: "Heavyweight textured linen with blackout interlining for luxurious bedroom retreats.", price: 620, rating: 5 },
      { slug: "signature-tailored-pleat-drapery", name: "Signature Tailored Pleat Drapery", image: "/figma/home-15.jpeg", description: "Crisp architectural waterfall folds tailored to maintain proportion on tall ceilings.", price: 585, rating: 5 },
      { slug: "heritage-pinch-pleat-drapery", name: "Heritage Pinch Pleat Drapery", image: "/figma/home-01.jpeg", description: "Classic hand-stitched triple pleats delivering timeless full-bodied elegance.", price: 650, rating: 5 }
    ]
  },

  // 2. SHADES
  shades: {
    slug: "shades",
    name: "Shades",
    eyebrow: "THE SHADES COLLECTION",
    headline: "Shape the Light",
    description: "Hand-tailored Roman shades engineered for smooth cordless operation, clean stacking, and precise light management.",
    heroImage: "/figma/cat-shades-new.png",
    customizerHeadline: "Choose Your Roman Shade Silhouette",
    customizerSubhead: "Every shade is bench-crafted to 1/8″ accuracy in our atelier. Choose from sculptural flat folds, graceful relaxed swoops, or structured cascade ribs.",
    craftPillars: [
      { title: "Zero Sag Hand-Tensioning", desc: "Reinforced bottom battens and concealed weight bars ensure perfectly horizontal fold alignment." },
      { title: "Concealed Rear Cording", desc: "Internal shroud rings and concealed cord channels prevent light leaks and tangled cords." },
      { title: "Smart Motorized Lift", desc: "Whisper-quiet rechargeable motors compatible with Apple HomeKit, Alexa, and Google Home." }
    ],
    guideTitle: "The Roman Shade Measurement Guide",
    guideCopy: "How to measure inside casing depth, outside wall overlap, and select the right opacity.",
    guideSteps: [
      { title: "Inside vs. Outside Mount", desc: "Inside mount provides a flush, clean built-in look; outside mount maximizes glass exposure and blocks side light." },
      { title: "Measure Depth & Casing", desc: "Ensure at least 1.5″ of flat casing depth for inside mount brackets or select our low-profile cassette." },
      { title: "Selecting Your Lining", desc: "Light-filtering preserves ambient daylight while blackout guarantees complete darkness for bedrooms." }
    ],
    styles: [
      {
        id: "flat-roman",
        slug: "flat-roman-shade",
        name: "Flat Fold Roman Shade",
        kicker: "SEAMLESS ARCHITECTURAL PURITY",
        description: "A continuous, uninterrupted face of bespoke fabric that stacks in neat, tailored horizontal pleats when raised.",
        price: 385,
        image: "/figma/cat-shades-new.png",
        features: "Ideal for showing pattern or rich fabric textures · Clean modern aesthetic · Minimal stack height",
        specs: {
          defaultSize: "36″ W × 64″ H",
          availableSizes: ["24″–48″ W Standard", "49″–72″ W Large", "73″–96″ W Extra-Wide", "Custom to 1/8″"],
          mountTypes: ["Inside Window Casing (Flush)", "Outside Wall Mount (Overlap)"],
          liningOptions: ["Unlined Semi-Sheer", "Cotton Privacy Lining", "Thermal Blackout Foam Core"],
          controlOptions: ["Cordless Spring Lift", "Precision Metal Chain Loop", "Rechargeable Motorized Hub"]
        }
      },
      {
        id: "relaxed-roman",
        slug: "relaxed-roman-shade",
        name: "Relaxed Roman Shade",
        kicker: "EFFORTLESS GENTLE CURVE",
        description: "Features a soft, gentle curve at the hem that swoops naturally, creating a romantic, casual yet tailored ambiance.",
        price: 415,
        image: "/figma/cat-shades.png",
        features: "Graceful center smile fold · Softens sharp window frames · Hand-dressed bottom weight bar",
        specs: {
          defaultSize: "36″ W × 64″ H",
          availableSizes: ["24″–48″ W Standard", "49″–72″ W Large", "73″–96″ W Extra-Wide", "Custom to 1/8″"],
          mountTypes: ["Inside Window Casing", "Outside Wall Mount"],
          liningOptions: ["Cotton Privacy Twill", "Blackout Interlining"],
          controlOptions: ["Cordless Lift", "Somfy Smart Motor"]
        }
      },
      {
        id: "cascade-roman",
        slug: "cascade-roman-shade",
        name: "Cascade Ribbed Shade",
        kicker: "TAILORED STRUCTURAL ACCENTS",
        description: "Sewn-in horizontal structural ribs on the face create crisp, tailored horizontal bands for geometric definition.",
        price: 435,
        image: "/figma/home-06.jpeg",
        features: "Hand-stitched front rod pockets · Distinctive architectural lines · Folds with razor-sharp symmetry",
        specs: {
          defaultSize: "36″ W × 64″ H",
          availableSizes: ["24″–48″ W Standard", "49″–72″ W Large", "73″–96″ W Extra-Wide", "Custom to 1/8″"],
          mountTypes: ["Inside Window Casing", "Outside Wall Mount"],
          liningOptions: ["Light Filtering Cotton", "100% Thermal Blackout"],
          controlOptions: ["Cordless Spring", "Continuous Beaded Chain", "Smart Motorized"]
        }
      },
      {
        id: "classic-pleated-shade",
        slug: "classic-pleated-roman-shade",
        name: "Classic Pleated Shade",
        kicker: "TIMELESS BESPOKE FOLDS",
        description: "Permanent horizontal pleats that stay neatly dressed even when lowered, creating depth and shadow play.",
        price: 450,
        image: "/figma/home-18.jpeg",
        features: "Deep 6″ folds that stay in place · Thermal and sound deadening · Elegant for dining and master suites",
        specs: {
          defaultSize: "36″ W × 64″ H",
          availableSizes: ["24″–48″ W Standard", "49″–72″ W Large", "Custom to 1/8″"],
          mountTypes: ["Inside Casing", "Outside Wall"],
          liningOptions: ["Heavy Blackout", "Sateen Privacy"],
          controlOptions: ["Cordless", "Motorized Smart Hub"]
        }
      }
    ],
    fabrics: [
      { slug: "raw-belgian-linen", name: "Pure Belgian Flax", color: "Natural Oatmeal", hex: "#D8D0C2", image: "/figma/home-04.jpeg", description: "Heavy slub linen with organic drape and light diffusion.", price: 385, priceGroup: "A" },
      { slug: "combed-cotton-twill", name: "Combed Cotton Twill", color: "Warm Sand", hex: "#E4DEC8", image: "/figma/home-03.jpeg", description: "Matte tight weave with supreme durability and clean pleat memory.", price: 410, priceGroup: "B" },
      { slug: "velvet-matte", name: "Brushed Silk Velvet", color: "Midnight Noir", hex: "#222222", image: "/figma/home-12.jpeg", description: "Deep pile light-blocking velvet with opulent texture.", price: 485, priceGroup: "C" },
      { slug: "gossamer-sheer", name: "Gossamer Sheer Weave", color: "Soft Bone", hex: "#F3EFE6", image: "/figma/home-18.jpeg", description: "Airy translucent weave that bathes interiors in filtered glow.", price: 395, priceGroup: "D" }
    ],
    products: [
      { slug: "flat-belgian-linen-shade", name: "Pure Belgian Flax Flat Roman Shade", image: "/figma/cat-shades-new.png", description: "Seamless flat linen Roman shade with cordless tensioning and concealed cord shroud.", price: 385, rating: 5 },
      { slug: "relaxed-organic-cotton-shade", name: "Relaxed Combed Cotton Shade", image: "/figma/cat-shades.png", description: "Gently curved center fold tailored in heavyweight combed cotton with blackout core.", price: 415, rating: 5 },
      { slug: "cascade-ribbed-roman-shade", name: "Cascade Architectural Shade", image: "/figma/home-06.jpeg", description: "Structured horizontal front ribs delivering crisp, tailored shadow lines.", price: 435, rating: 5 },
      { slug: "blackout-silk-velvet-shade", name: "Monaco Velvet Blackout Shade", image: "/figma/home-12.jpeg", description: "Opulent silk velvet shade with thermal core blocking 100% of intrusive light.", price: 485, rating: 5 }
    ]
  },

  // 3. VALANCES
  valances: {
    slug: "valances",
    name: "Valances & Cornices",
    eyebrow: "THE VALANCES COLLECTION",
    headline: "Complete the Window",
    description: "Handcrafted upholstered cornices, tailored pelmets, and soft board-mounted valances designed to conceal hardware and frame architecture.",
    heroImage: "/figma/home-18.jpeg",
    customizerHeadline: "Choose Your Valance & Cornice Silhouette",
    customizerSubhead: "Elevate your window architecture. Each piece is constructed over solid kiln-dried hardwood boards and hand-upholstered in our atelier.",
    craftPillars: [
      { title: "Kiln-Dried Birch Core", desc: "Structural 5/8″ birch boards precision-cut to prevent warping over decades." },
      { title: "French Cleat Flush Mounting", desc: "Engineered concealed mounting brackets provide a flush, gap-free fit against any wall." },
      { title: "Mitered Edge Piping", desc: "Continuous hand-turned self-piping or contrasting cord trims along all perimeter edges." }
    ],
    guideTitle: "The Valance & Cornice Styling Guide",
    guideCopy: "How to balance ceiling heights, determine cornice returns, and pair with under-drapery.",
    guideSteps: [
      { title: "Proportion & Height", desc: "A valance should generally measure 1/5th of the overall window height to maintain perfect aesthetic balance." },
      { title: "Return Depths", desc: "Select 3.5″ return for standalone treatments or 5.5″–7″ return to clear under-mounted drapery tracks." },
      { title: "Mounting Heights", desc: "Mounting right below the ceiling crown molding visually lengthens the window and elongates the room." }
    ],
    styles: [
      {
        id: "tailored-box-valance",
        slug: "tailored-box-pleat-valance",
        name: "Tailored Box Pleat Valance",
        kicker: "CRISP ARCHITECTURAL FINISH",
        description: "Features deep inverted box pleats positioned at calculated intervals, accented with internal fabric inserts.",
        price: 280,
        image: "/figma/home-18.jpeg",
        features: "Pre-mounted on dust board · Clean architectural lines · Pairs seamlessly with sheer drapery",
        specs: {
          defaultSize: "48″ W × 16″ H (3.5″ Return)",
          availableSizes: ["36″–60″ Standard", "61″–90″ Wide", "91″–120″ Grand", "Custom Width"],
          mountTypes: ["Board Mount (3.5″ Return)", "Board Mount (5.5″ Deep Return)", "Ceiling Flush Cleat"],
          edgeFinishes: ["Self-Piped Top & Bottom", "Contrast Velvet Banding (1.5″)", "Clean Knife Edge"],
          liningOptions: ["Lined with Sateen", "Interlined with Heavy Bump"]
        }
      },
      {
        id: "scalloped-pelmet",
        slug: "scalloped-hem-valance",
        name: "Scalloped Arch Valance",
        kicker: "GRACEFUL SCULPTED CONTOURS",
        description: "A continuous curved bottom profile with elegant scallop repetitions, finished with hand-applied contrast gimp cord.",
        price: 310,
        image: "/figma/home-04.jpeg",
        features: "Hand-sculpted wooden template · Soft classical presence · Hand-tied bottom cord detail",
        specs: {
          defaultSize: "48″ W × 16″ H",
          availableSizes: ["36″–60″", "61″–90″", "91″–120″", "Custom Width"],
          mountTypes: ["Board Mount (3.5″ Return)", "Board Mount (5.5″ Return)"],
          edgeFinishes: ["Satin Gimp Trim", "Self Piping", "Brush Fringe"],
          liningOptions: ["Bump Interlined", "Standard Sateen"]
        }
      },
      {
        id: "upholstered-cornice",
        slug: "upholstered-architectural-cornice",
        name: "Upholstered Hard Cornice",
        kicker: "SOLID HARDWOOD FOUNDATION",
        description: "Padded with high-density furniture foam and hand-stretched with Belgian linen over a structural wooden frame.",
        price: 440,
        image: "/figma/home-15.jpeg",
        features: "Structural furniture-grade construction · Completely conceals motors and tracks · Absolute zero light leak at header",
        specs: {
          defaultSize: "54″ W × 14″ H (6″ Return)",
          availableSizes: ["36″–60″", "61″–90″", "91″–140″ Grand Scale"],
          mountTypes: ["Heavy-Duty French Cleat", "Ceiling Anchor Brackets"],
          edgeFinishes: ["Self-Welt Border", "Decorative Nailhead Trim", "Clean Upholstered Face"],
          liningOptions: ["Fully Enclosed Dust Cap Included"]
        }
      }
    ],
    fabrics: [
      { slug: "raw-linen-valance", name: "Belgian Flax Canvas", color: "Oatmeal", hex: "#D6CEBF", image: "/figma/home-02.png", description: "Heavyweight structured linen ideal for crisp box pleats.", price: 280, priceGroup: "A" },
      { slug: "velvet-valance", name: "Royal Silk Velvet", color: "Espresso", hex: "#3A2E2B", image: "/figma/home-12.jpeg", description: "Lustrous velvet providing rich depth to upholstered cornices.", price: 340, priceGroup: "B" },
      { slug: "cotton-sateen-valance", name: "Combed Sateen", color: "Ivory", hex: "#F5F2EB", image: "/figma/home-03.jpeg", description: "Smooth matte cotton with pristine hand-turned piping.", price: 295, priceGroup: "C" }
    ],
    products: [
      { slug: "box-pleat-valance-oatmeal", name: "Atelier Tailored Box Pleat Valance", image: "/figma/home-18.jpeg", description: "Linen board-mounted valance with crisp inverted box pleats and 3.5″ return.", price: 280, rating: 5 },
      { slug: "upholstered-cornice-linen", name: "Upholstered Architectural Cornice", image: "/figma/home-15.jpeg", description: "Hand-padded birch frame upholstered in pure Belgian linen with French cleat mounting.", price: 440, rating: 5 },
      { slug: "scalloped-linen-valance", name: "French Scalloped Pelmet", image: "/figma/home-04.jpeg", description: "Graceful sculpted bottom silhouette with satin gimp rope trim.", price: 310, rating: 5 }
    ]
  },

  // 4. PILLOWS
  pillows: {
    slug: "pillows",
    name: "Pillows & Cushions",
    eyebrow: "THE PILLOWS & CUSHIONS COLLECTION",
    headline: "Comfort, Composed",
    description: "Handcrafted down-filled cushions and architectural bolsters tailored with hand-turned piping, mitered flanges, and concealed brass hardware.",
    heroImage: "/figma/pillow-hero-top.jpg",
    guideImage: "/figma/pillow-hero-lifestyle.jpg",
    customizerHeadline: "Customize Your Atelier Cushion",
    customizerSubhead: "Select your silhouette, dimensions, insert fill, and edge detailing. Bench-finished by our master seamstresses with concealed YKK zippers.",
    craftPillars: [
      { title: "90/10 Hungarian Goose Down", desc: "Generously overstuffed with RDS-certified white goose down for sink-in softness and perfect 'chop' retention." },
      { title: "Downproof Cotton Casing", desc: "Double-layered 300TC cotton cambric prevents feather quills from migrating through fabric." },
      { title: "Reinforced Brass Concealed Zipper", desc: "Hidden zipper garage along bottom seam ensures clean reversibility and easy laundering." }
    ],
    guideTitle: "The Cushion Styling & Sizing Guide",
    guideCopy: "How to arrange pillows on sofas, sectionals, and king beds with harmonious scales and textures.",
    guideSteps: [
      { title: "The 2:2:1 Sofa Formula", desc: "Layer two 22″ base squares, two 20″ complementary textured cushions, and one 14″×36″ center lumbar." },
      { title: "Insert Sizing Rule", desc: "We automatically size our inserts 2 inches larger than the cover to ensure luxurious, plump fullness." },
      { title: "Mixing Textures", desc: "Combine raw Belgian slub linen with smooth silk velvet and tactile boucle for dynamic tactile warmth." }
    ],
    styles: [
      {
        id: "french-piped-pillow",
        slug: "french-piped-cushion",
        name: "French Piped Cushion",
        kicker: "REFINED ATELIER TAILORING",
        description: "Accented with a slender 1/4″ self-piped or contrast-piped perimeter cord that frames each cushion with precision.",
        price: 135,
        image: "/figma/cushion-french-piped.jpg",
        features: "Precision hand-turned piping · Reversible dual-sided construction · Concealed bottom zipper",
        specs: {
          defaultSize: "22″ × 22″ Square",
          availableSizes: ["18″ × 18″", "20″ × 20″", "22″ × 22″", "24″ × 24″", "14″ × 36″ Lumbar", "Custom Size"],
          insertOptions: ["90/10 Goose Down & Feather (Ultra-Plump)", "Hypoallergenic Microfiber Down Alternative", "Cover Only"],
          edgeFinishes: ["Self-Fabric Piping", "Contrast Silk Velvet Piping", "Clean Tailored Edge"]
        }
      },
      {
        id: "knife-edge-pillow",
        slug: "knife-edge-cushion",
        name: "Knife-Edge Modern Cushion",
        kicker: "CLEAN MINIMALIST EDGES",
        description: "Seamless, razor-crisp seam edges providing a sleek, modern architectural aesthetic that showcases the fabric texture.",
        price: 115,
        image: "/figma/cat-cushions.png",
        features: "Ultra-clean modern silhouette · Hidden seam closure · Perfect for contemporary lounge seating",
        specs: {
          defaultSize: "20″ × 20″ Square",
          availableSizes: ["18″ × 18″", "20″ × 20″", "22″ × 22″", "16″ × 26″ Lumbar"],
          insertOptions: ["90/10 Goose Down & Feather", "Hypoallergenic Microfiber", "Cover Only"]
        }
      },
      {
        id: "architectural-lumbar",
        slug: "architectural-lumbar-cushion",
        name: "Long Architectural Lumbar",
        kicker: "STATEMENT BED & SOFA PIECE",
        description: "An elongated 14″×36″ or 14″×48″ statement cushion that spans the width of beds or anchors modern sectionals.",
        price: 165,
        image: "/figma/home-13.png",
        features: "Anchors king/queen beds in place of multiple shams · Heavy down-fill support · Ergonomic lumbar comfort",
        specs: {
          defaultSize: "14″ × 36″ Lumbar",
          availableSizes: ["12″ × 24″", "14″ × 36″", "14″ × 48″ Extra-Long"],
          insertOptions: ["High-Density Goose Down Core", "Hypoallergenic Feather-Free", "Cover Only"],
          edgeFinishes: ["Self Piped", "Raw Fringed Edge", "Tailored Flange"]
        }
      },
      {
        id: "bolster-roll",
        slug: "architectural-bolster-roll",
        name: "Cylindrical Bolster Roll",
        kicker: "SCULPTURAL COMFORT",
        description: "A tailored cylindrical bolster with gathered or flat circular ends, perfect for daybeds, chaise lounges, and primary suites.",
        price: 150,
        image: "/figma/home-03.jpeg",
        features: "Structural foam core wrapped in down · Button or pleated end cap · Elegant bed foundation",
        specs: {
          defaultSize: "8″ Diameter × 24″ Length",
          availableSizes: ["7″ × 20″", "8″ × 24″", "9″ × 32″"],
          insertOptions: ["Firm Resilience Foam + Down Wrap"],
          edgeFinishes: ["Gathered Rosette Ends", "Flat Self-Piped Round Ends"]
        }
      }
    ],
    fabrics: [
      { slug: "slub-linen-cushion", name: "Belgian Heavy Flax", color: "Oatmeal", hex: "#D6CEBF", image: "/figma/home-02.png", description: "Substantial tactile linen with rich organic texture.", price: 135, priceGroup: "A" },
      { slug: "silk-velvet-cushion", name: "Italian Silk Velvet", color: "Amber Ochre", hex: "#B8860B", image: "/figma/home-12.jpeg", description: "Luminous, tactile velvet that creates a luxurious focal point.", price: 175, priceGroup: "B" },
      { slug: "washed-boucle", name: "Alpine Textured Boucle", color: "Chalk White", hex: "#F2EFEB", image: "/figma/home-04.jpeg", description: "Cozy nubby wool-cotton boucle with modern designer appeal.", price: 160, priceGroup: "C" },
      { slug: "sateen-cotton-cushion", name: "Egyptian Combed Cotton", color: "Soft Sage", hex: "#A8B2A1", image: "/figma/home-03.jpeg", description: "Smooth sateen finish for crisp, cool lounging.", price: 120, priceGroup: "D" }
    ],
    products: [
      { slug: "signature-french-piped-pillow", name: "Signature French Piped Linen Cushion", image: "/figma/cushion-french-piped.jpg", description: "Belgian flax pillow finished with hand-turned self-piping and 90/10 goose down insert.", price: 135, rating: 5 },
      { slug: "silk-velvet-accent-pillow", name: "Chateau Silk Velvet Lumbar", image: "/figma/home-12.jpeg", description: "Elongated velvet lumbar cushion with rich tactile sheen and brass concealed closure.", price: 165, rating: 5 },
      { slug: "modern-knife-edge-cushion", name: "Atelier Knife-Edge Flax Pillow", image: "/figma/cat-cushions.png", description: "Clean modern profile tailored in pure washed flax linen.", price: 115, rating: 5 },
      { slug: "alpine-boucle-bolster", name: "Alpine Boucle Bolster Roll", image: "/figma/home-03.jpeg", description: "Sculptural cylindrical bolster wrapped in cozy tactile boucle with buttoned ends.", price: 150, rating: 5 }
    ]
  },

  // 5. BEDDING
  bedding: {
    slug: "bedding",
    name: "Bedding",
    eyebrow: "BEDDING",
    headline: "Elevate Your Bedroom",
    description: "Discover beautifully crafted bedding designed to bring comfort, texture and timeless style to your everyday space.",
    heroImage: "/figma/cat-bedding-hero-new.jpg",
    customizerHeadline: "Customize Your Atelier Bedding Suite",
    customizerSubhead: "Crafted from yarn-dyed European flax pre-washed for cloud-like softness that grows more supple with every laundering.",
    craftPillars: [
      { title: "Garment-Washed Belgian Flax", desc: "Enzyme washed without harsh chemicals for immediate lived-in softness and relaxed drape." },
      { title: "8-Point Interior Ties", desc: "Duvet covers feature interior corner and side twill ties to anchor duvet inserts firmly in place." },
      { title: "Natural Shell Button Closures", desc: "Concealed plackets fastened with sustainable mother-of-pearl or natural horn buttons." }
    ],
    guideTitle: "The Luxury Bedding Sizing & Fabric Guide",
    guideCopy: "How to choose between airy Belgian linen and crisp combed percale, plus mattress overhang tips.",
    guideSteps: [
      { title: "Linen vs. Percale", desc: "Belgian linen regulates temperature year-round and is naturally hypoallergenic; percale offers a crisp, cool hotel feel." },
      { title: "Duvet Overhang", desc: "Order our oversized King/Cal King sizing to ensure generous coverage down past mattress side rails." },
      { title: "Caring for Natural Linen", desc: "Wash on gentle in cool water and tumble dry low; linen embraces natural rumpled texture with zero ironing required." }
    ],
    styles: [
      {
        id: "linen-duvet-cover",
        slug: "belgian-linen-duvet-cover",
        name: "Belgian Linen Duvet Cover",
        kicker: "RELAXED LIVED-IN LUXURY",
        description: "Tailored in pure yarn-dyed flax with a concealed button placket and 8 internal anchoring corner ties.",
        price: 345,
        image: "/figma/product-linen-bedspread-hd.png",
        features: "Pre-washed for instant softness · Thermoregulating flax fibers · Natural mother-of-pearl buttons",
        specs: {
          defaultSize: "Queen (90″ × 92″)",
          availableSizes: ["Twin / Twin XL", "Full / Queen (90″ × 92″)", "King / Cal King (108″ × 92″)"],
          edgeFinishes: ["Clean Tailored Edge", "1″ Flanged Border", "Hand-Frayed Edge"],
          closureTypes: ["Concealed Mother-of-Pearl Buttons", "Hidden Zipper Closure"]
        }
      },
      {
        id: "pickstitched-coverlet",
        slug: "hand-pickstitched-coverlet",
        name: "Hand-Pickstitched Coverlet",
        kicker: "HAND-STITCHED ARTISANRY",
        description: "Quilted by hand with tonal pickstitching over a light cotton batting core, providing lightweight warmth for layering.",
        price: 395,
        image: "/figma/cat-bedding.png",
        features: "Hand-quilted by master artisans · Reversible tonal design · Ideal for warmer months or layered bedscapes",
        specs: {
          defaultSize: "Queen (92″ × 96″)",
          availableSizes: ["Queen (92″ × 96″)", "King (108″ × 96″)"],
          edgeFinishes: ["Self-Fabric Bound Edge", "Raw Pickstitched Edge"]
        }
      },
      {
        id: "european-pillow-sham",
        slug: "flanged-euro-sham-pair",
        name: "European Hotel Shams (Pair)",
        kicker: "ARCHITECTURAL BED HEADBOARD PIECES",
        description: "Generous 26″×26″ Euro shams with 2-inch mitered flanges and rear French envelope closures.",
        price: 145,
        image: "/figma/cat-bedding-mockup.png",
        features: "2″ crisp mitered flange · Deep envelope closure · Holds European down pillows firmly upright",
        specs: {
          defaultSize: "Pair of Euro Shams (26″ × 26″)",
          availableSizes: ["Standard Sham Pair (20″ × 26″)", "King Sham Pair (20″ × 36″)", "Euro Sham Pair (26″ × 26″)"]
        }
      }
    ],
    fabrics: [
      { slug: "vintage-washed-flax", name: "Pure Belgian Linen", color: "Warm Oatmeal", hex: "#D6CEBF", image: "/figma/home-02.png", description: "185 GSM pure flax with natural slub texture.", price: 345, priceGroup: "A" },
      { slug: "crisp-percale", name: "Organic Combed Percale", color: "Crisp Alabaster", hex: "#F7F5EE", image: "/figma/home-03.jpeg", description: "400TC long-staple organic cotton with cool matte touch.", price: 290, priceGroup: "B" },
      { slug: "sateen-luxe", name: "Long-Staple Sateen", color: "Muted Fog Grey", hex: "#D3D0CB", image: "/figma/home-04.jpeg", description: "Lustrous silky drape with ultra-soft hand feel.", price: 310, priceGroup: "C" }
    ],
    products: [
      { slug: "signature-linen-duvet", name: "Atelier Pure Belgian Linen Duvet", image: "/figma/product-linen-bedspread-hd.png", description: "Relaxed stonewashed linen duvet cover with internal corner ties and shell button placket.", price: 345, rating: 5 },
      { slug: "hand-stitched-coverlet", name: "Heritage Hand-Pickstitched Coverlet", image: "/figma/cat-bedding.png", description: "Artisan quilted coverlet with lightweight cotton batting core.", price: 395, rating: 5 },
      { slug: "flanged-euro-shams", name: "Belgian Linen Euro Shams (Set of 2)", image: "/figma/cat-bedding-mockup.png", description: "26″×26″ square shams with 2″ mitered flanges and deep envelope closure.", price: 145, rating: 5 }
    ]
  },

  // 6. TABLE LINEN
  "table-linen": {
    slug: "table-linen",
    name: "Table Linen",
    eyebrow: "THE TABLE LINEN COLLECTION",
    headline: "Set a Beautiful Table",
    description: "Bench-tailored Belgian linen tablecloths, mitered runners, and hemstitched napkin sets designed for memorable gatherings.",
    heroImage: "/figma/cat-table-linen.png",
    customizerHeadline: "Customize Your Bespoke Table Setting",
    customizerSubhead: "Cut and tailored to the exact length and drop of your dining or banquet table, finished with classic hand-drawn hemstitch or mitered corners.",
    craftPillars: [
      { title: "Generous 2″ Mitered Hems", desc: "Expertly folded 45-degree mitered corners give every tablecloth and runner substantial, weighted drape." },
      { title: "Drawn-Thread Hemstitching", desc: "Traditional openwork stitching crafted along borders by skilled atelier artisans." },
      { title: "Stain-Resistant Flax Longevity", desc: "Natural European flax fibers release stains naturally in cool washes, becoming softer with every feast." }
    ],
    guideTitle: "The Table Setting & Overhang Guide",
    guideCopy: "How to calculate the ideal drop for casual dinners vs. formal floor-length banquets.",
    guideSteps: [
      { title: "Calculating Drop Length", desc: "Casual dining looks best with an 8″–10″ drop; formal dinners look stunning with a 12″–15″ drop or full puddle." },
      { title: "Formula", desc: "Tablecloth Length = Table Length + (2 × Desired Drop). Tablecloth Width = Table Width + (2 × Desired Drop)." },
      { title: "Layering Table Runners", desc: "Place a 16″ wide contrasting runner down the center to anchor centerpieces and candle arrangements." }
    ],
    styles: [
      {
        id: "mitered-tablecloth",
        slug: "mitered-hem-tablecloth",
        name: "Bespoke Mitered Tablecloth",
        kicker: "TIMELESS DINING ELEGANCE",
        description: "Tailored to your specific tabletop measurements with weighted 2-inch mitered hems that drape with effortless grace.",
        price: 185,
        image: "/figma/cat-table-linen.png",
        features: "Custom dimensions for rectangle, round, or oval tables · Crisp weighted corners · Seamless single-panel up to 110″ wide",
        specs: {
          defaultSize: "70″ × 108″ Rectangle (Seats 6–8)",
          availableSizes: ["60″ × 90″ (Seats 4–6)", "70″ × 108″ (Seats 6–8)", "70″ × 126″ (Seats 8–10)", "90″ Round", "Custom Length & Width"],
          edgeFinishes: ["2″ Mitered Tailored Hem", "Hand-Drawn Hemstitch Border", "Contrasting Satin Stitch"]
        }
      },
      {
        id: "hemstitched-runner",
        slug: "hemstitched-linen-runner",
        name: "Classic Hemstitched Runner",
        kicker: "HAND-DRAWN THREAD WORK",
        description: "A continuous 16″ or 18″ wide linen runner featuring openwork hemstitching along both lengths and pointed or square ends.",
        price: 95,
        image: "/figma/home-19.png",
        features: "Traditional drawn-thread openwork · Accents bare wood or layers over full cloths · Mitered ends",
        specs: {
          defaultSize: "16″ × 90″ Runner",
          availableSizes: ["16″ × 72″", "16″ × 90″", "16″ × 108″", "18″ × 120″ Long Banquet", "Custom Length"],
          edgeFinishes: ["Hemstitch Detail", "Clean 1″ Mitered Border"]
        }
      },
      {
        id: "napkins-set",
        slug: "hemstitched-dinner-napkins",
        name: "Dinner Napkins (Set of 4)",
        kicker: "GENEROUS 20″ ENTERTAINING SCALE",
        description: "Four generously sized 20″×20″ Belgian flax napkins finished with mitered corners and washed for tactile softness.",
        price: 85,
        image: "/figma/home-08.png",
        features: "Set of 4 matching napkins · 20″×20″ generous bistro size · Pre-washed for soft hand feel",
        specs: {
          defaultSize: "Set of 4 (20″ × 20″)",
          availableSizes: ["Set of 4", "Set of 8", "Set of 12"],
          edgeFinishes: ["1″ Mitered Hem", "French Scalloped Edge", "Hand-Frayed Edge"]
        }
      }
    ],
    fabrics: [
      { slug: "heavy-linen-table", name: "Heavyweight Belgian Flax", color: "Natural Taupe", hex: "#C7BDAA", image: "/figma/home-02.png", description: "Substantial 240 GSM linen that lies flat and repels wrinkles.", price: 185, priceGroup: "A" },
      { slug: "white-flax-table", name: "Bleached Alabaster Flax", color: "Crisp Alabaster", hex: "#FAF8F5", image: "/figma/home-03.jpeg", description: "Pure celebratory white linen with timeless table presence.", price: 185, priceGroup: "B" },
      { slug: "striped-bistro", name: "Woven Ticking Stripe Linen", color: "Chalk & Charcoal", hex: "#4A4A4A", image: "/figma/home-04.jpeg", description: "Subtle woven stripe inspired by historic French country tables.", price: 210, priceGroup: "C" }
    ],
    products: [
      { slug: "signature-mitered-tablecloth", name: "Atelier Mitered Linen Tablecloth", image: "/figma/cat-table-linen.png", description: "Pure Belgian flax tablecloth with generous 2-inch mitered borders.", price: 185, rating: 5 },
      { slug: "hemstitched-runner-linen", name: "Heritage Hemstitched Table Runner", image: "/figma/home-19.png", description: "Hand-drawn thread openwork runner tailored for center tabletop styling.", price: 95, rating: 5 },
      { slug: "bistro-napkins-set", name: "Belgian Linen Napkins (Set of 4)", image: "/figma/home-08.png", description: "Four 20″×20″ pre-washed flax dinner napkins with mitered corners.", price: 85, rating: 5 }
    ]
  },

  // 7. FABRICS & SWATCHES
  fabrics: {
    slug: "fabrics",
    name: "Fabrics & Swatches",
    eyebrow: "THE TEXTILE ATELIER",
    headline: "Begin with the Fabric",
    description: "Explore our archive of certified organic flax, combed sateen, royal velvets, and sheer weaves. Order 8″×8″ complimentary swatches delivered to your door.",
    heroImage: "/figma/home-04.jpeg",
    customizerHeadline: "Order Your Curated Swatch Presentation Box",
    customizerSubhead: "Select up to 4 complimentary 8″×8″ fabric swatches finished with hand-serged edges and technical color reference cards.",
    craftPillars: [
      { title: "Complimentary Delivery", desc: "Your first 4 physical atelier swatches are completely free with express courier delivery." },
      { title: "8″ × 8″ Architectural Scale", desc: "Large generous swatches allow you to pin fabric up and view in both morning and evening light." },
      { title: "Full Millimeter Yardage", desc: "All fabrics are available by the continuous yard (54″ width) for custom upholstery and soft furnishings." }
    ],
    guideTitle: "The Textile Selection Guide",
    guideCopy: "How to judge drape, light filtration, rub count, and natural slub variation in your home.",
    guideSteps: [
      { title: "View in Your Own Room Light", desc: "Tape swatches to your window trim and inspect them at 9 AM, 2 PM, and 8 PM under lamps." },
      { title: "Assess Transparency", desc: "Hold fabrics up to the window to see how much view is preserved vs. privacy provided." },
      { title: "Fabric Martindale Abrasion", desc: "For high-traffic cushions, choose fabrics rated at 30,000+ double rubs like our Belgian canvas." }
    ],
    styles: [
      {
        id: "swatch-box-4",
        slug: "complimentary-swatch-box",
        name: "Curated 4-Swatch Presentation Box",
        kicker: "COMPLIMENTARY · FREE SHIPPING",
        description: "Choose any 4 fabrics from our archive. Hand-packed in our presentation gift box with sample binder rings.",
        price: 0,
        image: "/figma/home-04.jpeg",
        features: "4 large 8″×8″ samples · Hand-serged fray-resistant edges · Color temperature guide included",
        specs: {
          defaultSize: "4 Swatches Included ($0)",
          availableSizes: ["4 Swatches ($0)", "8 Swatches ($15)", "Complete Atelier Ring Book ($45)"]
        }
      },
      {
        id: "cut-yardage",
        slug: "continuous-cut-yardage",
        name: "Continuous Yardage by the Yard",
        kicker: "54″ WIDTH · ATELIER DIRECT",
        description: "Continuous running yardage cut directly from our heritage mills for custom interior projects, upholstery, and accessories.",
        price: 68,
        image: "/figma/home-02.png",
        features: "Full 54″ standard width · Continuous cut length · In stock for fast atelier dispatch",
        specs: {
          defaultSize: "1 Yard (54″ W × 36″ L)",
          availableSizes: ["1 Yard", "2 Yards", "3 Yards", "5 Yards", "10+ Bolt Wholesale"]
        }
      }
    ],
    fabrics: [
      { slug: "belgian-flax-swatch", name: "Pure Belgian Flax Linen", color: "Oatmeal", hex: "#D6CEBF", image: "/figma/home-02.png", description: "100% Belgian flax with slub texture.", price: 68, priceGroup: "A" },
      { slug: "organic-cotton-swatch", name: "Combed Organic Sateen", color: "Warm Alabaster", hex: "#ECE7DE", image: "/figma/home-03.jpeg", description: "Silky matte organic cotton sateen.", price: 58, priceGroup: "B" },
      { slug: "silk-velvet-swatch", name: "Royal Silk Velvet", color: "Sable Bronze", hex: "#4B3E36", image: "/figma/home-12.jpeg", description: "Plush cotton-silk pile with acoustic depth.", price: 85, priceGroup: "C" },
      { slug: "alpine-wool-swatch", name: "Alpine Wool Blend", color: "Flannel Grey", hex: "#A8A49C", image: "/figma/home-04.jpeg", description: "Thermal, sound-dampening architectural weave.", price: 72, priceGroup: "D" }
    ],
    products: [
      { slug: "presentation-swatch-box", name: "Complimentary 4-Piece Swatch Kit", image: "/figma/home-04.jpeg", description: "Curated 8″×8″ samples cut and serged by hand, shipped free.", price: 0, rating: 5 },
      { slug: "belgian-flax-yardage", name: "Belgian Flax Yardage (Per Yard)", image: "/figma/home-02.png", description: "Continuous 54″ width pure flax linen cut to order.", price: 68, rating: 5 },
      { slug: "silk-velvet-yardage", name: "Royal Silk Velvet Yardage", image: "/figma/home-12.jpeg", description: "Heavyweight 450 GSM velvet by the running yard.", price: 85, rating: 5 }
    ]
  },

  // 8. DECOR & MORE
  decor: {
    slug: "decor",
    name: "Decor & More",
    eyebrow: "THE HARDWARE & DECOR COLLECTION",
    headline: "Details Make the Room",
    description: "Solid cast brass hardware, hand-forged iron traversing rods, architecturally weighted tiebacks, and decorative atelier accents.",
    heroImage: "/figma/cat-decor.png",
    customizerHeadline: "Customize Your Architectural Hardware Suite",
    customizerSubhead: "Drapery hardware engineered to bear heavy drapery effortlessly without center sagging. Precision-machined in solid brass and hand-finished bronze.",
    craftPillars: [
      { title: "Solid Cast Metal", desc: "No hollow tubing. Our 1.25″ and 1.5″ diameter rods are solid heavy-gauge brass and forged iron." },
      { title: "Whisper-Glide Track Liners", desc: "Internal nylon ring inserts guarantee silent, frictionless motion along the entire rod length." },
      { title: "Concealed Wall Anchors", desc: "Mounting plates with concealed hex set screws offer maximum holding capacity in drywall or masonry." }
    ],
    guideTitle: "The Architectural Hardware Specification Guide",
    guideCopy: "How to specify rod diameters, bracket clearances, and ring spacing for flawless drape stack.",
    guideSteps: [
      { title: "Choosing Rod Diameter", desc: "Use 1″ rods for short windows up to 60″; use 1.25″ or 1.5″ rods for soaring 96″+ ceilings to avoid visual thinness." },
      { title: "Bracket Projection", desc: "Standard 3.5″ projection clears window molding; 5.5″ projection allows double rods for layering sheer and blackout drapes." },
      { title: "Finial Proportions", desc: "Ensure at least 4″ of clear wall space on each side of the window frame for decorative finials." }
    ],
    styles: [
      {
        id: "cast-brass-rod-set",
        slug: "solid-brass-curtain-rod",
        name: "Solid Cast Brass Drapery Pole Set",
        kicker: "HEAVY-GAUGE SOLID BRASS",
        description: "Includes continuous solid brass pole, end brackets, decorative finials, and matching quiet glide rings.",
        price: 245,
        image: "/figma/cat-decor.png",
        features: "1.25″ heavy diameter · Hand-rubbed antique patina · Includes 14 quiet nylon-lined rings",
        specs: {
          defaultSize: "48″–84″ Adjustable Pole",
          availableSizes: ["36″–60″ Pole", "48″–84″ Pole", "84″–120″ Pole", "120″–168″ Grand Traversing"],
          hardwareFinishes: ["Aged Antique Brass", "Matte Blackened Bronze", "Brushed Satin Nickel", "Polished Unlacquered Brass"]
        }
      },
      {
        id: "french-return-rod",
        slug: "french-return-blackout-rod",
        name: "French Return Seamless Rod",
        kicker: "SEAMLESS WALL WRAPAROUND",
        description: "Curves 90 degrees back to the wall at both ends, allowing drapery to wrap flush and block 100% of side light leaks.",
        price: 215,
        image: "/figma/home-10.jpeg",
        features: "Ideal for bedrooms and home theaters · Blocks light leaks · Sleek uninterrupted curve",
        specs: {
          defaultSize: "48″–84″ Length (3.5″ Projection)",
          availableSizes: ["36″–60″", "48″–84″", "84″–120″"],
          hardwareFinishes: ["Matte Blackened Iron", "Aged Brass", "Warm Pewter"]
        }
      },
      {
        id: "architectural-tiebacks",
        slug: "cast-brass-wall-holdbacks",
        name: "Cast Brass Architectural Tiebacks (Pair)",
        kicker: "SOLID WALL-MOUNT HOLDBACKS",
        description: "Heavy solid brass U-shaped holdbacks that keep tailored drapery panels gathered with effortless architectural dignity.",
        price: 110,
        image: "/figma/home-18.jpeg",
        features: "Pair of 2 holdbacks · Heavy cast brass · Concealed mounting hardware included",
        specs: {
          defaultSize: "Pair (4.5″ Projection × 6″ Length)",
          availableSizes: ["Pair Standard", "Pair Deep Projection (6.5″)"],
          hardwareFinishes: ["Aged Antique Brass", "Matte Black", "Brushed Nickel"]
        }
      }
    ],
    fabrics: [
      { slug: "brass-finish-sample", name: "Aged Antique Brass", color: "Warm Gold", hex: "#C5A059", image: "/figma/home-18.jpeg", description: "Hand-relieved warm brass with living wax patina.", price: 245, priceGroup: "A" },
      { slug: "iron-finish-sample", name: "Matte Blackened Iron", color: "Deep Charcoal", hex: "#2B2B2B", image: "/figma/home-10.jpeg", description: "Architectural satin powdercoat with enduring rust resistance.", price: 215, priceGroup: "B" },
      { slug: "nickel-finish-sample", name: "Brushed Satin Nickel", color: "Soft Silver", hex: "#C0C0C0", image: "/figma/home-04.jpeg", description: "Silky hand-brushed nickel with subtle warm undertones.", price: 235, priceGroup: "C" }
    ],
    products: [
      { slug: "solid-brass-pole-kit", name: "Solid Brass Architectural Rod Set", image: "/figma/cat-decor.png", description: "Solid brass 1.25″ rod with finials, brackets, and quiet nylon-lined rings.", price: 245, rating: 5 },
      { slug: "french-return-curtain-rod", name: "French Return Blackout Curtain Pole", image: "/figma/home-10.jpeg", description: "Continuous 90-degree curved rod wrapping drapery flush against wall.", price: 215, rating: 5 },
      { slug: "cast-brass-tiebacks", name: "Architectural Cast Tiebacks (Pair)", image: "/figma/home-18.jpeg", description: "Solid brass drapery holdbacks with concealed wall anchors.", price: 110, rating: 5 }
    ]
  },

  // 9. RESOURCES
  resources: {
    slug: "resources",
    name: "Design & Measurement Resources",
    eyebrow: "THE ATELIER RESOURCE ARCHIVE",
    headline: "A Guide to Considered Interiors",
    description: "Measurement calculators, drapery fullness worksheets, fabric care manuals, and installation diagrams curated by our master craftsmen.",
    heroImage: "/figma/home-18.jpeg",
    customizerHeadline: "Explore Our Interactive Atelier Guides",
    customizerSubhead: "Precision planning tools to calculate yardage, finished lengths, track clearances, and hardware specifications.",
    craftPillars: [
      { title: "Complimentary Design Assistance", desc: "Book a 1-on-1 virtual measurement review with our senior window treatment specialists." },
      { title: "Millimeter Precision Worksheets", desc: "Downloadable PDF measurement templates with step-by-step illustrations for any window type." },
      { title: "Lifetime Atelier Support", desc: "Every order is verified by a human artisan before cutting begins to ensure zero measurement errors." }
    ],
    guideTitle: "The Comprehensive Atelier Guide",
    guideCopy: "Everything you need to measure, specify, and install bespoke home furnishings.",
    guideSteps: [
      { title: "How to Measure Windows", desc: "Step-by-step guide for bay windows, French doors, corner windows, and ceiling-height openings." },
      { title: "Drapery Fullness Explained", desc: "Understand the difference between 200% standard fullness and 250% architectural luxury fullness." },
      { title: "Fabric Care & Steaming", desc: "Best practices for steaming natural flax linen and maintaining silk velvet without water spots." }
    ],
    styles: [
      {
        id: "virtual-design-consult",
        slug: "virtual-design-consultation",
        name: "Virtual 1-on-1 Design Consultation",
        kicker: "COMPLIMENTARY · 30 MINUTES",
        description: "Meet with an atelier designer via video to review photos of your room, verify measurements, and select fabric swatches.",
        price: 0,
        image: "/figma/home-13.png",
        features: "Video room review · Fabric recommendation · Complete custom quote generated during call",
        specs: {
          defaultSize: "30-Minute Video Session ($0)",
          availableSizes: ["30-Minute Video Session", "60-Minute Comprehensive Whole-Home Session"]
        }
      },
      {
        id: "measurement-spec-packet",
        slug: "atelier-measurement-packet",
        name: "Architectural Measurement Guide & Kit",
        kicker: "DOWNLOADABLE & PRINTED KIT",
        description: "Includes physical steel measuring tape, magnetic level, measurement worksheet, and return postage envelope.",
        price: 0,
        image: "/figma/home-18.jpeg",
        features: "Comprehensive PDF download · High-precision steel tape mailed upon request · Free returns",
        specs: {
          defaultSize: "Instant PDF Download ($0)",
          availableSizes: ["Instant PDF", "Physical Measure Kit Mailed Free"]
        }
      }
    ],
    fabrics: [
      { slug: "linen-care", name: "Pure Linen Care Guide", color: "Natural Flax", hex: "#D6CEBF", image: "/figma/home-02.png", description: "Steaming, laundering and stain removal handbook.", price: 0, priceGroup: "A" },
      { slug: "motor-integration", name: "Smart Motor Integration Manual", color: "Technical Ivory", hex: "#ECE7DE", image: "/figma/home-03.jpeg", description: "Wiring diagrams and Zigbee / Matter hub connection guide.", price: 0, priceGroup: "B" }
    ],
    products: [
      { slug: "virtual-design-service", name: "Complimentary Virtual Atelier Consultation", image: "/figma/home-13.png", description: "Book 30 minutes with our master window treatment designers.", price: 0, rating: 5 },
      { slug: "precision-measure-guide", name: "The Atelier Window Measurement Guide", image: "/figma/home-18.jpeg", description: "Step-by-step illustrated manual for measuring drops, widths, and clearances.", price: 0, rating: 5 }
    ]
  }
};
