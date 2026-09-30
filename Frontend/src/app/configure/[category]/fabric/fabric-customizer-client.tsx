"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
import { useCommerce } from "@/components/commerce-context";
import { CategoryCustomizerConfig, CustomizerStyleConfig } from "@/lib/customizer-configs";
import { ALL_FABRICS, FABRIC_COLLECTIONS, FabricItem, MaterialSection } from "@/lib/fabrics-data";
import "@/app/drapery/configure/fabric/fabric.css";

interface Props {
  config: CategoryCustomizerConfig;
  initialStyleSlug?: string;
  initialFabricSlug?: string;
  category: string;
}

export default function CategoryFabricCustomizerClient({
  config,
  initialStyleSlug,
  initialFabricSlug,
  category
}: Props) {
  const { addToCart } = useCommerce();

  // Find style from query or fallback to first
  const activeStyle: CustomizerStyleConfig = useMemo(() => {
    return config.styles.find((s) => s.slug === initialStyleSlug) || config.styles[0];
  }, [config, initialStyleSlug]);

  const [selectedCollection, setSelectedCollection] = useState<string>("ALL");
  const [selectedColor, setSelectedColor] = useState<string>("ALL");
  const [selectedPriceGroup, setSelectedPriceGroup] = useState<string>("ALL");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Selected Fabric & Preview Modal
  const defaultFabric = ALL_FABRICS.find((f) => f.slug === initialFabricSlug) || ALL_FABRICS[3]; // Oatmeal Linen default
  const [selectedFabric, setSelectedFabric] = useState<FabricItem>(defaultFabric);
  const [modal, setModal] = useState<boolean>(false);
  const [previewFabric, setPreviewFabric] = useState<FabricItem>(defaultFabric);
  const [swatchNotice, setSwatchNotice] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter fabrics
  const filteredFabrics = useMemo(() => {
    let list = [...ALL_FABRICS];
    if (selectedCollection !== "ALL") {
      list = list.filter((f) => f.collectionType === selectedCollection);
    }
    if (selectedColor !== "ALL") {
      list = list.filter((f) => f.color.name.toLowerCase() === selectedColor.toLowerCase());
    }
    if (selectedPriceGroup !== "ALL") {
      list = list.filter((f) => f.priceGroup === selectedPriceGroup);
    }
    if (selectedMaterial !== "ALL") {
      list = list.filter((f) => f.materialGroup.toLowerCase().includes(selectedMaterial.toLowerCase()));
    }
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.fromPrice - b.fromPrice);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.fromPrice - a.fromPrice);
    }
    return list;
  }, [selectedCollection, selectedColor, selectedPriceGroup, selectedMaterial, sortBy]);

  // Group into material sections
  const materialSections: MaterialSection[] = useMemo(() => {
    const map = new Map<string, FabricItem[]>();
    for (const f of filteredFabrics) {
      if (!map.has(f.materialGroup)) {
        map.set(f.materialGroup, []);
      }
      map.get(f.materialGroup)!.push(f);
    }
    const result: MaterialSection[] = [];
    map.forEach((fabrics, groupName) => {
      const first = fabrics[0];
      result.push({
        groupName,
        priceGroup: first.priceGroup,
        fromPrice: activeStyle.price + (first.priceGroup === "C" ? 60 : first.priceGroup === "B" ? 30 : 0),
        description: first.materialDescription || "Natural fibers woven with lasting performance and fluid drape.",
        fabrics
      });
    });
    return result;
  }, [filteredFabrics, activeStyle]);

  // Live price
  const currentPrice = useMemo(() => {
    let p = activeStyle.price;
    if (selectedFabric.priceGroup === "B") p += 30;
    if (selectedFabric.priceGroup === "C") p += 60;
    if (selectedFabric.priceGroup === "D") p += 90;
    return p;
  }, [activeStyle, selectedFabric]);

  const handleSelectFabricInModal = () => {
    setSelectedFabric(previewFabric);
    setModal(false);
  };

  const handleAddSampleSwatch = (fabric: FabricItem) => {
    addToCart({
      id: `swatch-${fabric.slug}`,
      name: `Fabric Swatch: ${fabric.name} (8″ × 8″)`,
      price: 0,
      image: fabric.image,
      variant: `Complimentary Sample · ${fabric.color.name}`,
      quantity: 1
    });
    setSwatchNotice(`✓ Added 8″ × 8″ sample of ${fabric.name} ($0) to bag!`);
    setTimeout(() => setSwatchNotice(null), 4000);
  };

  return (
    <div className="fabric-step">
      <Header />

      <main>
        {/* Header matching Screen 2 */}
        <header>
          <span>CUSTOM {config.name.toUpperCase()}</span>
          <h1>{activeStyle.name}</h1>
        </header>

        {/* 01 — CHOOSE YOUR COLLECTION */}
        <section className="collection">
          <h2>01 — CHOOSE YOUR COLLECTION</h2>

          <div className="collection-buttons">
            <button
              className={selectedCollection === "ALL" ? "active" : ""}
              onClick={() => setSelectedCollection("ALL")}
              type="button"
            >
              ALL
            </button>
            {FABRIC_COLLECTIONS.map((colName) => {
              const isActive = selectedCollection === colName;
              return (
                <button
                  key={colName}
                  className={isActive ? "active" : ""}
                  onClick={() => setSelectedCollection(colName)}
                  type="button"
                >
                  {colName}
                </button>
              );
            })}
          </div>

          {/* Filter Dropdowns Navigation */}
          <nav className="filter-nav" ref={navRef}>
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-toggle-btn ${selectedCollection !== "ALL" ? "has-active" : ""}`}
                onClick={() => setOpenDropdown(openDropdown === "col" ? null : "col")}
              >
                <span>Collection</span>
                <span className="dropdown-chevron-wrapper">▾</span>
              </button>
              {openDropdown === "col" && (
                <div className="filter-dropdown-menu">
                  <button type="button" className="dropdown-item" onClick={() => { setSelectedCollection("ALL"); setOpenDropdown(null); }}>
                    All Collections
                  </button>
                  {FABRIC_COLLECTIONS.map((c) => (
                    <button key={c} type="button" className="dropdown-item" onClick={() => { setSelectedCollection(c); setOpenDropdown(null); }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-toggle-btn ${selectedColor !== "ALL" ? "has-active" : ""}`}
                onClick={() => setOpenDropdown(openDropdown === "color" ? null : "color")}
              >
                <span>Color</span>
                <span className="dropdown-chevron-wrapper">▾</span>
              </button>
              {openDropdown === "color" && (
                <div className="filter-dropdown-menu">
                  <button type="button" className="dropdown-item" onClick={() => { setSelectedColor("ALL"); setOpenDropdown(null); }}>
                    All Colors
                  </button>
                  {["White", "Clay", "Oatmeal", "Slate", "Sand", "Forest", "Terracotta", "Sage", "Charcoal"].map((c) => (
                    <button key={c} type="button" className="dropdown-item" onClick={() => { setSelectedColor(c); setOpenDropdown(null); }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-toggle-btn ${selectedPriceGroup !== "ALL" ? "has-active" : ""}`}
                onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
              >
                <span>Price</span>
                <span className="dropdown-chevron-wrapper">▾</span>
              </button>
              {openDropdown === "price" && (
                <div className="filter-dropdown-menu">
                  <button type="button" className="dropdown-item" onClick={() => { setSelectedPriceGroup("ALL"); setOpenDropdown(null); }}>
                    All Price Groups
                  </button>
                  {["A", "B", "C"].map((p) => (
                    <button key={p} type="button" className="dropdown-item" onClick={() => { setSelectedPriceGroup(p); setOpenDropdown(null); }}>
                      Price Group {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-toggle-btn ${selectedMaterial !== "ALL" ? "has-active" : ""}`}
                onClick={() => setOpenDropdown(openDropdown === "mat" ? null : "mat")}
              >
                <span>Material</span>
                <span className="dropdown-chevron-wrapper">▾</span>
              </button>
              {openDropdown === "mat" && (
                <div className="filter-dropdown-menu">
                  <button type="button" className="dropdown-item" onClick={() => { setSelectedMaterial("ALL"); setOpenDropdown(null); }}>
                    All Materials
                  </button>
                  {["Linen", "Wool", "Cotton", "Silk", "Velvet"].map((m) => (
                    <button key={m} type="button" className="dropdown-item" onClick={() => { setSelectedMaterial(m); setOpenDropdown(null); }}>
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-dropdown-wrapper" style={{ marginLeft: "auto" }}>
              <button
                type="button"
                className="filter-toggle-btn"
                onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
              >
                <span>Sort</span>
                <span className="dropdown-chevron-wrapper">▾</span>
              </button>
              {openDropdown === "sort" && (
                <div className="filter-dropdown-menu" style={{ right: 0, left: "auto" }}>
                  <button type="button" className="dropdown-item" onClick={() => { setSortBy("featured"); setOpenDropdown(null); }}>
                    Featured
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => { setSortBy("price-asc"); setOpenDropdown(null); }}>
                    Price: Low to High
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => { setSortBy("price-desc"); setOpenDropdown(null); }}>
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>
          </nav>
        </section>

        {/* 02 — SELECT MATERIAL & COLOR */}
        <section className="materials">
          <h2>02 — SELECT MATERIAL &amp; COLOR</h2>

          {materialSections.map((section) => (
            <div key={section.groupName} className="material-group">
              <div className="material-header">
                <h3>
                  MATERIAL: {section.groupName.toUpperCase()} &nbsp;|&nbsp; PRICE GROUP: {section.priceGroup} &nbsp;|&nbsp; FROM: ${section.fromPrice}
                </h3>
                <p>{section.description}</p>
              </div>

              <div className="swatches-grid">
                {section.fabrics.map((fabric) => {
                  const isSelected = selectedFabric._id === fabric._id || selectedFabric.slug === fabric.slug;
                  return (
                    <div
                      key={fabric._id || fabric.slug}
                      className={`swatch-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedFabric(fabric)}
                    >
                      <div className="swatch-image-container">
                        <Image
                          src={fabric.image}
                          alt={fabric.name}
                          width={140}
                          height={140}
                          className="swatch-image"
                        />
                        {/* Info/Zoom button triggering modal (Screen 3) */}
                        <button
                          type="button"
                          className="swatch-info-btn"
                          aria-label={`View details for ${fabric.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewFabric(fabric);
                            setModal(true);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                        </button>
                      </div>

                      <div className="swatch-meta">
                        <h4>{fabric.name}</h4>
                        <span>Price Group {fabric.priceGroup}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Screen 3: Fabric Detail Modal */}
      {modal && previewFabric && (
        <div className="fabric-modal-overlay" onClick={() => setModal(false)}>
          <div className="fabric-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setModal(false)}
              aria-label="Close"
              type="button"
            >
              ✕
            </button>

            <div className="modal-grid">
              <div className="modal-image-col">
                <Image
                  src={previewFabric.closeupImage || previewFabric.image}
                  alt={previewFabric.name}
                  width={500}
                  height={500}
                  className="modal-closeup-img"
                  priority
                />
              </div>

              <div className="modal-info-col">
                <span className="modal-price-group">
                  PRICE GROUP: {previewFabric.priceGroup}
                </span>
                <h2>{previewFabric.name}</h2>
                <p className="modal-description">
                  {previewFabric.materialDescription ||
                    "A classic Belgian flax linen with a textured, slubbed weave with a soft, supple hand and rich visual interest. Breathable, durable, and naturally elegant — designed for timeless interiors with ultra-gentle light filtering."}
                </p>

                <div className="modal-specs">
                  <h3>TECHNICAL SPECIFICATIONS</h3>
                  <dl>
                    <div>
                      <dt>Composition</dt>
                      <dd>{previewFabric.specs?.composition || "100% Belgian Flax Linen"}</dd>
                    </div>
                    <div>
                      <dt>Weight</dt>
                      <dd>{previewFabric.specs?.weight || "320 GSM Heavyweight Architectural Drape"}</dd>
                    </div>
                    <div>
                      <dt>Durability</dt>
                      <dd>{previewFabric.specs?.durability || "35,000 Martindale Rubs (Commercial Grade)"}</dd>
                    </div>
                    <div>
                      <dt>Light Filtering</dt>
                      <dd>{previewFabric.specs?.lightFiltering || "Semi-Opaque / Soft Filtering (50% Blockout)"}</dd>
                    </div>
                    <div>
                      <dt>Care</dt>
                      <dd>{previewFabric.specs?.care || "Dry Clean Recommended"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="modal-actions">
                  <button
                    className="modal-select-btn"
                    onClick={handleSelectFabricInModal}
                    type="button"
                  >
                    SELECT THIS FABRIC →
                  </button>
                  <button
                    className="modal-swatch-btn"
                    onClick={() => handleAddSampleSwatch(previewFabric)}
                    type="button"
                  >
                    + ADD TO SWATCHES ($0)
                  </button>
                </div>

                {swatchNotice && (
                  <p style={{ fontSize: 11, color: "#1a4d2e", fontWeight: 600, marginTop: 12 }}>
                    {swatchNotice}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 2: Sticky Bottom Floating Bar */}
      <aside className="fabric-sticky-bar">
        <div className="bar-container">
          <div className="bar-selection-info">
            <span className="bar-style-name">{activeStyle.name.toUpperCase()}</span>
            <span className="bar-divider">/</span>
            <span className="bar-fabric-name">
              Linen : {selectedFabric.color.name || selectedFabric.name}
            </span>
          </div>

          <div className="bar-price-wrapper">
            <span className="bar-price-label">Price from</span>
            <span className="bar-price-amount">${currentPrice}</span>
          </div>

          <Link
            href={`/configure/${category}/details?style=${activeStyle.slug}&fabric=${selectedFabric.slug}`}
            className="bar-continue-btn"
          >
            CONTINUE TO DETAILS &amp; CUSTOMIZATION →
          </Link>
        </div>
      </aside>

      <Footer />
    </div>
  );
}
