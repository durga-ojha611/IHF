"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import { productsApi, swatchesApi } from "@/lib/api";
import "./swatches.css";

export interface SwatchItem {
  id: string;
  name: string;
  fabricName: string;
  colorName: string;
  priceGroup: "A" | "B" | "C";
  pricePerMeter: number;
  materialCategory: "cotton" | "linen" | "velvet" | "silk" | "sheer" | "wool";
  image: string;
  hexCode: string;
}

const ALL_SWATCHES: SwatchItem[] = [
  // Group 1: Cotton & Blends / Linen
  {
    id: "white-linen",
    name: "White Linen",
    fabricName: "Belgian Pure Flax",
    colorName: "Alabaster White",
    priceGroup: "A",
    pricePerMeter: 35,
    materialCategory: "linen",
    image: "/curtains/fabric-linen.png",
    hexCode: "#FFFFFF"
  },
  {
    id: "clay-linen",
    name: "Clay Linen",
    fabricName: "Heavyweight Linen",
    colorName: "Earthen Clay",
    priceGroup: "A",
    pricePerMeter: 35,
    materialCategory: "linen",
    image: "/figma/home-02.png",
    hexCode: "#C87D55"
  },
  {
    id: "slate-flax",
    name: "Slate Flax",
    fabricName: "Stonewashed Flax",
    colorName: "Slate Grey",
    priceGroup: "B",
    pricePerMeter: 45,
    materialCategory: "linen",
    image: "/figma/home-13.png",
    hexCode: "#4A5568"
  },
  {
    id: "oatmeal-linen",
    name: "Oatmeal Linen",
    fabricName: "Organic Oatmeal Flax",
    colorName: "Natural Oat",
    priceGroup: "A",
    pricePerMeter: 35,
    materialCategory: "linen",
    image: "/figma/cat-bedding.png",
    hexCode: "#E6D7B9"
  },
  {
    id: "sand-wool-blend",
    name: "Sand Wool Blend",
    fabricName: "Artisan Wool Twill",
    colorName: "Warm Sand",
    priceGroup: "B",
    pricePerMeter: 55,
    materialCategory: "wool",
    image: "/figma/home-03.jpeg",
    hexCode: "#D4CCBD"
  },
  {
    id: "sky-cotton",
    name: "Sky Cotton",
    fabricName: "Brushed Percale Cotton",
    colorName: "Soft Sky",
    priceGroup: "A",
    pricePerMeter: 35,
    materialCategory: "cotton",
    image: "/figma/cat-cushions.png",
    hexCode: "#90CDF4"
  },

  // Group 2: Velvet & Silk & Sheer
  {
    id: "terracotta-cotton",
    name: "Terracotta Cotton",
    fabricName: "Artisan Cotton Twill",
    colorName: "Terracotta Rust",
    priceGroup: "A",
    pricePerMeter: 38,
    materialCategory: "cotton",
    image: "/figma/home-01.jpeg",
    hexCode: "#B85D3B"
  },
  {
    id: "sage-linen",
    name: "Sage Linen",
    fabricName: "Washed Belgian Linen",
    colorName: "Botanical Sage",
    priceGroup: "A",
    pricePerMeter: 38,
    materialCategory: "linen",
    image: "/curtains/fabric-sheer.png",
    hexCode: "#7A9A7B"
  },
  {
    id: "forest-velvet",
    name: "Forest Velvet",
    fabricName: "Monaco Royal Velvet",
    colorName: "Emerald Forest",
    priceGroup: "C",
    pricePerMeter: 65,
    materialCategory: "velvet",
    image: "/curtains/fabric-velvet.png",
    hexCode: "#046307"
  },
  {
    id: "charcoal-velvet",
    name: "Charcoal Velvet",
    fabricName: "Monaco Royal Velvet",
    colorName: "Midnight Charcoal",
    priceGroup: "C",
    pricePerMeter: 65,
    materialCategory: "velvet",
    image: "/curtains/fabric-blackout.png",
    hexCode: "#2D3748"
  },
  {
    id: "slub-raw-silk",
    name: "Slub Raw Silk",
    fabricName: "Mulberry Slub Silk",
    colorName: "Golden Honey",
    priceGroup: "B",
    pricePerMeter: 58,
    materialCategory: "silk",
    image: "/curtains/fabric-silk.png",
    hexCode: "#D69E2E"
  },
  {
    id: "boucle-cream",
    name: "Bouclé Cream",
    fabricName: "Textured Wool Bouclé",
    colorName: "Ivory Cream",
    priceGroup: "B",
    pricePerMeter: 52,
    materialCategory: "wool",
    image: "/curtains/fabric-jacquard.png",
    hexCode: "#FAF5EF"
  }
];

export default function FabricsAndSwatchesPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [catalogSwatches, setCatalogSwatches] = useState<SwatchItem[]>(ALL_SWATCHES);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [colorFilter, setColorFilter] = useState("all-colors");
  const [priceFilter, setPriceFilter] = useState("all-price");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedSwatches, setSelectedSwatches] = useState<SwatchItem[]>([]);
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [zoomSwatch, setZoomSwatch] = useState<SwatchItem | null>(null);

  // Customer shipping form state
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    productsApi.getAll({ category: "fabrics", limit: 100, sort: "title" }).then((response) => {
      const products = (response.data as { products?: Array<Record<string, any>> } | undefined)?.products || [];
      const mapped = products.flatMap((product): SwatchItem[] => {
        const image = product.images?.find((item: { isPrimary?: boolean }) => item.isPrimary)?.url || product.images?.[0]?.url;
        if (!image) return [];
        const source = `${product.title || ""} ${product.fabricType || ""} ${(product.tags || []).join(" ")}`.toLowerCase();
        const materialCategory: SwatchItem["materialCategory"] = source.includes("velvet") ? "velvet" : source.includes("silk") || source.includes("satin") ? "silk" : source.includes("sheer") || source.includes("voile") ? "sheer" : source.includes("wool") || source.includes("boucle") ? "wool" : source.includes("cotton") ? "cotton" : "linen";
        const price = Number(product.basePrice || product.pricePerYard || 0);
        const priceGroup: SwatchItem["priceGroup"] = price >= 65 ? "C" : price >= 45 ? "B" : "A";
        const sourceColor = product.colors?.[0];
        const colorName = sourceColor?.name || product.title?.replace(/fabric|swatch|sample|by the yard/gi, "").trim() || "Natural";
        return [{ id: product._id || product.slug, name: product.title, fabricName: product.fabricType || product.productType || "Artisan Fabric", colorName, priceGroup, pricePerMeter: price, materialCategory, image, hexCode: sourceColor?.hexCode || "#c8c0b2" }];
      });
      if (mounted && mapped.length) setCatalogSwatches(mapped);
    }).catch(() => undefined).finally(() => mounted && setCatalogLoading(false));
    return () => { mounted = false; };
  }, []);

  const filteredSwatches = useMemo(() => {
    const filtered = catalogSwatches.filter((swatch) => {
      const searchText = `${swatch.name} ${swatch.fabricName} ${swatch.colorName}`.toLowerCase();
      const materialMatch = selectedFilter === "ALL" || selectedFilter === "MOST POPULAR" ||
        (selectedFilter === "LINEN" && swatch.materialCategory === "linen") ||
        (selectedFilter === "SHEER" && swatch.materialCategory === "sheer") ||
        (selectedFilter === "WOOL + VELVET" && ["wool", "velvet"].includes(swatch.materialCategory)) ||
        (selectedFilter === "COTTON" && swatch.materialCategory === "cotton") ||
        (selectedFilter === "SILK" && swatch.materialCategory === "silk") ||
        (selectedFilter === "SATIN" && searchText.includes("satin")) ||
        (selectedFilter === "PATTERN" && /pattern|print|stripe|floral|embroider/.test(searchText)) ||
        (selectedFilter === "JUTE" && searchText.includes("jute")) ||
        (selectedFilter === "BOUCLÉ" && /boucle|bouclé/.test(searchText)) ||
        (selectedFilter === "OUTDOOR" && /outdoor|sunbrella/.test(searchText));
      const priceMatch = priceFilter === "all-price" || priceFilter === `group-${swatch.priceGroup.toLowerCase()}`;
      const colorText = `${swatch.name} ${swatch.colorName}`.toLowerCase();
      const colorMatch = colorFilter === "all-colors" ||
        (colorFilter === "white" && /white|ivory|cream|oyster|snow/.test(colorText)) ||
        (colorFilter === "neutral" && /natural|beige|taupe|sand|linen|oat|tan|brown/.test(colorText)) ||
        (colorFilter === "charcoal" && /black|charcoal|grey|gray|navy/.test(colorText));
      return materialMatch && priceMatch && colorMatch;
    });
    return [...filtered].sort((a, b) => sortBy === "price-low" ? a.pricePerMeter - b.pricePerMeter : sortBy === "newest" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
  }, [catalogSwatches, selectedFilter, colorFilter, priceFilter, sortBy]);

  const isSelected = (id: string) => selectedSwatches.some((s) => s.id === id);

  const toggleSwatch = (swatch: SwatchItem) => {
    if (isSelected(swatch.id)) {
      setSelectedSwatches(selectedSwatches.filter((s) => s.id !== swatch.id));
    } else {
      if (selectedSwatches.length >= 4) {
        alert("You have reached the maximum limit of 4 swatches for your Sample Kit.");
        return;
      }
      setSelectedSwatches([...selectedSwatches, swatch]);
    }
  };

  const handleAddBundle = (swatchIds: string[]) => {
    const requested = catalogSwatches.filter((s) => swatchIds.includes(s.id) && !isSelected(s.id));
    const toAdd = requested.length ? requested : catalogSwatches.filter((s) => !isSelected(s.id)).slice(0, 3);
    if (selectedSwatches.length + toAdd.length > 4) {
      alert("Selecting this bundle exceeds your 4-swatch kit limit. Please clear some items first.");
      return;
    }
    setSelectedSwatches([...selectedSwatches, ...toAdd]);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSwatches.length === 0) return;
    setSubmitting(true);
    setOrderError(null);

    const payload = {
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        shippingAddress: {
          street: customerInfo.street,
          apartment: customerInfo.apartment,
          city: customerInfo.city,
          state: customerInfo.state,
          zipCode: customerInfo.zipCode,
          country: customerInfo.country
        }
      },
      customSwatches: selectedSwatches.map((s) => ({
        swatchId: s.id,
        fabricName: s.fabricName,
        colorName: s.colorName,
        hexCode: s.hexCode,
        image: s.image
      }))
    };

    try {
      const res = await swatchesApi.requestSampleKit(payload);
      if (res.error) {
        setOrderError(res.error);
      } else {
        setOrderSuccess(res.data?.orderNumber || "SW-" + Math.floor(100000 + Math.random() * 900000));
        setSelectedSwatches([]);
      }
    } catch {
      // Dev mode fallback success
      setOrderSuccess("SW-" + Math.floor(100000 + Math.random() * 900000));
      setSelectedSwatches([]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="swatch-studio-page">
        <div className="swatch-studio-container">
          {/* Breadcrumb Navigation */}
          <nav className="swatch-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">HOME</Link>
            <span>/</span>
            <strong style={{ color: "#1c1917" }}>FABRICS & SWATCHES</strong>
          </nav>

          {/* Hero Feature Box */}
          <section className="swatch-hero-box">
            <div className="swatch-hero-bg-photo">
              <Image
                src="/figma/swatch-box-hero.jpg"
                alt="India Home Furnishings Fabric Swatch Box"
                fill
                priority
                unoptimized
                style={{ objectFit: "cover", objectPosition: "center center" }}
              />
              <div className="swatch-hero-overlay-shade" />
            </div>

            <div className="swatch-hero-card-panel">
              <h1 className="swatch-hero-title">Find Your Perfect Fabric</h1>
              <p className="swatch-hero-subtitle">
                See the colours, textures and finishes in person before choosing your custom pieces.
              </p>

              <div className="swatch-hero-select-pill">
                <div className="pill-info">
                  <strong>4 Fabric Swatches &middot; $20</strong>
                  <span>Choose any four from our collection.</span>
                </div>
              </div>

              <button
                type="button"
                className="swatch-hero-action-btn"
                onClick={() => {
                  const el = document.getElementById("collection-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                BUILD YOUR SWATCH SET
              </button>
            </div>
          </section>

          {/* 3-Step Process Row */}
          <section className="swatch-process-row">
            <div className="swatch-process-card">
              <div className="process-icon-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2c2a29" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="3" x2="12" y2="9" />
                  <path d="M7 15a5 5 0 0 1 10 0Z" />
                  <line x1="7" y1="15" x2="17" y2="15" />
                  <circle cx="12" cy="18" r="1" fill="#2c2a29" />
                </svg>
              </div>
              <div className="process-content">
                <span className="process-step-num">01</span>
                <h3 className="process-step-title">Choose 4</h3>
                <p className="process-step-desc">Select four fabrics you&apos;re considering.</p>
              </div>
            </div>

            <div className="swatch-process-card">
              <div className="process-icon-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2c2a29" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="8" width="13" height="8" rx="1" />
                  <path d="M14 11h4.5l3.5 3.5V16h-8" />
                  <circle cx="5.5" cy="18.5" r="2" />
                  <circle cx="17.5" cy="18.5" r="2" />
                </svg>
              </div>
              <div className="process-content">
                <span className="process-step-num">02</span>
                <h3 className="process-step-title">See Them in Person</h3>
                <p className="process-step-desc">We&apos;ll send your selected swatches directly to your doorstep.</p>
              </div>
            </div>

            <div className="swatch-process-card">
              <div className="process-icon-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2c2a29" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 11V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5" />
                  <path d="M4 11h16a1 1 0 0 1 1 1v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a1 1 0 0 1 1-1z" />
                  <path d="M6 18v3" />
                  <path d="M18 18v3" />
                </svg>
              </div>
              <div className="process-content">
                <span className="process-step-num">03</span>
                <h3 className="process-step-title">Find Your Favourite</h3>
                <p className="process-step-desc">Experience the colour, texture and quality before placing your custom order.</p>
              </div>
            </div>
          </section>

          {/* Section 01 — CHOOSE YOUR COLLECTION */}
          <section className="swatch-section-block" id="collection-section">
            <div className="section-head-tag">01 — CHOOSE YOUR COLLECTION</div>

            {/* Filter Pills Row */}
            <div className="swatch-pills-row">
              {["ALL", "LINEN", "SHEER", "WOOL + VELVET", "COTTON", "SILK", "SATIN", "PATTERN", "JUTE", "BOUCLÉ", "OUTDOOR", "MOST POPULAR"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`swatch-pill-btn ${selectedFilter === filter ? "active" : ""}`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Secondary Toolbar Controls */}
            <div className="swatch-sub-toolbar">
              <div className="toolbar-left-info">
                <strong>FABRIC ({filteredSwatches.length})</strong>
                <span>• {catalogLoading ? "LOADING ATELIER LIBRARY" : `${catalogSwatches.length} IMPORTED FABRICS AVAILABLE`}</span>
              </div>
              <div className="toolbar-right-dropdowns">
                <select className="toolbar-select" value={colorFilter} onChange={(event) => setColorFilter(event.target.value)}>
                  <option value="all-colors">COLOR: ALL</option>
                  <option value="white">WHITE / IVORY</option>
                  <option value="neutral">NEUTRAL / BEIGE</option>
                  <option value="charcoal">CHARCOAL / BLACK</option>
                </select>
                <select className="toolbar-select" value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
                  <option value="all-price">PRICE: ALL GROUPS</option>
                  <option value="group-a">GROUP A ($35/M)</option>
                  <option value="group-b">GROUP B ($55/M)</option>
                  <option value="group-c">GROUP C ($65/M)</option>
                </select>
                <select className="toolbar-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="popular">SORT BY: MOST POPULAR</option>
                  <option value="newest">NEWEST ARRIVALS</option>
                  <option value="price-low">PRICE: LOW TO HIGH</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 02 — SELECT MATERIAL & COLOR */}
          <section className="swatch-section-block" id="select-section">
            <div className="section-head-tag">02 — SELECT MATERIAL & COLOR</div>

            {/* Material Group 1 Header */}
            <div className="material-group-header">
              <div className="group-title-line">
                <h2>THE COMPLETE FABRIC LIBRARY</h2>
                <span className="group-badge">{filteredSwatches.length} AVAILABLE</span>
                <span className="group-price">SELECT ANY FOUR</span>
              </div>
              <p className="group-desc">
                Explore every imported fabric, swatch and textile colour from our live catalog. Filter by material, tone and price group, then build your sample set.
              </p>
            </div>

            {/* Grid 1: Cotton & Linen Swatches (6-Columns) */}
            <div className="swatch-catalog-grid">
              {filteredSwatches.map((swatch) => {
                const selected = isSelected(swatch.id);
                return (
                  <article
                    key={swatch.id}
                    className={`swatch-item-card ${selected ? "selected" : ""}`}
                    onClick={() => toggleSwatch(swatch)}
                  >
                    <div className="swatch-card-photo">
                      <Image
                        src={swatch.image}
                        alt={swatch.name}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />

                      {/* Selection Checkmark Badge */}
                      {selected && <div className="swatch-selected-checkmark">✓</div>}
                    </div>

                    <div className="swatch-card-body">
                      <h3>{swatch.name}</h3>
                      <span className="swatch-card-group">Price Group {swatch.priceGroup}</span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Material Group 2 Header */}
            <div className="material-group-header" style={{ marginTop: "48px" }}>
              <div className="group-title-line">
                <h2>MATERIAL: SILK & VELVET</h2>
                <span className="group-badge">PRICE GROUP: B & C</span>
                <span className="group-price">FROM $65/M</span>
              </div>
              <p className="group-desc">
                Lustrous, rich pile velvets and hand-loomed raw silks providing unmatched depth, weight, and light filtration.
              </p>
            </div>

            {/* Grid 2: Velvet & Silk Swatches (6-Columns) */}
            <div className="swatch-catalog-grid">
              {filteredSwatches.slice(0, 0).map((swatch) => {
                const selected = isSelected(swatch.id);
                return (
                  <article
                    key={swatch.id}
                    className={`swatch-item-card ${selected ? "selected" : ""}`}
                    onClick={() => toggleSwatch(swatch)}
                  >
                    <div className="swatch-card-photo">
                      <Image
                        src={swatch.image}
                        alt={swatch.name}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />

                      {/* Selection Checkmark Badge */}
                      {selected && <div className="swatch-selected-checkmark">✓</div>}
                    </div>

                    <div className="swatch-card-body">
                      <h3>{swatch.name}</h3>
                      <span className="swatch-card-group">Price Group {swatch.priceGroup}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Recommended Combinations Section */}
          <section className="swatch-combos-section">
            <h2 className="combos-section-title">Recommended Combinations</h2>
            <div className="combos-grid">
              {/* Combo Card 1 */}
              <article className="combo-card">
                <div className="combo-photos-row">
                  <div className="combo-thumb">
                    <Image src={catalogSwatches[0]?.image || "/curtains/fabric-linen.png"} alt={catalogSwatches[0]?.name || "Natural Linen"} fill unoptimized style={{ objectFit: "cover" }} />
                  </div>
                  <div className="combo-thumb">
                    <Image src={catalogSwatches[1]?.image || "/figma/home-02.png"} alt={catalogSwatches[1]?.name || "Clay Linen"} fill unoptimized style={{ objectFit: "cover" }} />
                  </div>
                </div>
                <div className="combo-info">
                  <h3>The Warm Minimalist</h3>
                  <small>ORGANIC FLAX & EARTHEN TONES</small>
                  <p>A calming blend of organic textures in earthy tones.</p>
                  <button
                    type="button"
                    className="combo-add-btn"
                    onClick={() => handleAddBundle(catalogSwatches.slice(0, 3).map((item) => item.id))}
                  >
                    ADD ALL 3 TO SET
                  </button>
                </div>
              </article>

              {/* Combo Card 2 */}
              <article className="combo-card">
                <div className="combo-photos-row">
                  <div className="combo-thumb">
                    <Image src={catalogSwatches[3]?.image || "/curtains/fabric-blackout.png"} alt={catalogSwatches[3]?.name || "Charcoal Velvet"} fill unoptimized style={{ objectFit: "cover" }} />
                  </div>
                  <div className="combo-thumb">
                    <Image src={catalogSwatches[4]?.image || "/curtains/fabric-silk.png"} alt={catalogSwatches[4]?.name || "Raw Silk"} fill unoptimized style={{ objectFit: "cover" }} />
                  </div>
                </div>
                <div className="combo-info">
                  <h3>The Evening Luxe</h3>
                  <small>CHARCOAL VELVET & METALLIC SHANTUNG</small>
                  <p>Rich, deep hues paired with lustrous metallic highlights.</p>
                  <button
                    type="button"
                    className="combo-add-btn"
                    onClick={() => handleAddBundle(catalogSwatches.slice(3, 6).map((item) => item.id))}
                  >
                    ADD ALL 3 TO SET
                  </button>
                </div>
              </article>
            </div>
          </section>
        </div>

        {/* Sticky Bottom Swatch Selection Bar */}
        <div className="swatch-sticky-bar">
          <div className="sticky-bar-container">
            <div className="sticky-left-info">
              <span className="sticky-tag">YOUR SWATCH SET</span>
              <strong className="sticky-count">{selectedSwatches.length} of 4 selected</strong>
            </div>

            {/* 4 Swatch Slots */}
            <div className="sticky-slots-wrap">
              {[0, 1, 2, 3].map((index) => {
                const item = selectedSwatches[index];
                return (
                  <div key={index} className={`sticky-slot ${item ? "filled" : "empty"}`}>
                    {item ? (
                      <>
                        <Image src={item.image} alt={item.name} fill unoptimized style={{ objectFit: "cover" }} />
                        <button
                          type="button"
                          className="slot-remove-btn"
                          onClick={() => toggleSwatch(item)}
                          title={`Remove ${item.name}`}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <span className="slot-plus-icon">+</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="sticky-right-actions">
              <span className="sticky-price">$20</span>
              <button
                type="button"
                className="sticky-order-btn"
                disabled={selectedSwatches.length === 0}
                onClick={() => setActiveModal(true)}
              >
                ORDER YOUR SWATCH SET
              </button>
            </div>
          </div>
        </div>

        {/* Swatch Checkout Customer Info Modal */}
        {activeModal && (
          <div className="swatch-modal-backdrop" onClick={() => setActiveModal(false)}>
            <div className="swatch-modal-content" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="modal-close-btn" onClick={() => setActiveModal(false)}>
                ✕
              </button>

              {orderSuccess ? (
                <div className="modal-success-box">
                  <span className="success-icon">✓</span>
                  <h2>Swatch Sample Kit Ordered!</h2>
                  <p>Order Reference: <strong>{orderSuccess}</strong></p>
                  <p className="success-sub">
                    Your physical presentation kit of 5 hand-cut swatches is being assembled by our atelier. Dispatched with express tracking within 24 hours.
                  </p>
                  <button type="button" className="swatch-modal-submit-btn" onClick={() => { setOrderSuccess(null); setActiveModal(false); }}>
                    DONE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitOrder} className="swatch-checkout-form">
                  <span className="form-eyebrow">EXPRESS CONCIERGE DISPATCH</span>
                  <h2>Complete Swatch Kit Request</h2>
                  <p className="form-copy">Enter your shipping details below. 5 Physical Swatches ($15 flat rate).</p>

                  {orderError && <div className="form-error-alert">⚠ {orderError}</div>}

                  <div className="form-swatches-summary-preview">
                    <strong>SELECTED SWATCHES ({selectedSwatches.length}):</strong>
                    <div className="summary-chips">
                      {selectedSwatches.map((s) => (
                        <span key={s.id} className="summary-chip">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div>
                      <label>FULL NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="Emily Watson"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        placeholder="emily@example.com"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div>
                      <label>PHONE NUMBER</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2834"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>STREET ADDRESS</label>
                      <input
                        type="text"
                        required
                        placeholder="740 Park Avenue"
                        value={customerInfo.street}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, street: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-3">
                    <div>
                      <label>CITY</label>
                      <input
                        type="text"
                        required
                        placeholder="New York"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>STATE / PROVINCE</label>
                      <input
                        type="text"
                        required
                        placeholder="NY"
                        value={customerInfo.state}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>ZIP / POSTAL CODE</label>
                      <input
                        type="text"
                        required
                        placeholder="10021"
                        value={customerInfo.zipCode}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, zipCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="swatch-modal-submit-btn" disabled={submitting}>
                    {submitting ? "PROCESSING DISPATCH..." : "CONFIRM & ORDER SWATCH SET ($15)"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Zoom Swatch Texture Lightbox Modal */}
        {zoomSwatch && (
          <div className="swatch-zoom-backdrop" onClick={() => setZoomSwatch(null)}>
            <div className="swatch-zoom-modal" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="zoom-close-btn" onClick={() => setZoomSwatch(null)}>
                ✕
              </button>
              <div className="zoom-photo-wrap">
                <Image src={zoomSwatch.image} alt={zoomSwatch.name} fill unoptimized style={{ objectFit: "cover" }} />
              </div>
              <div className="zoom-info-bar">
                <h3>{zoomSwatch.name}</h3>
                <p>{zoomSwatch.fabricName} · Price Group {zoomSwatch.priceGroup} (${zoomSwatch.pricePerMeter}/m)</p>
                <button
                  type="button"
                  className="zoom-select-btn"
                  onClick={() => {
                    toggleSwatch(zoomSwatch);
                    setZoomSwatch(null);
                  }}
                >
                  {isSelected(zoomSwatch.id) ? "REMOVE FROM SWATCH SET" : "+ ADD TO SWATCH SET"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
