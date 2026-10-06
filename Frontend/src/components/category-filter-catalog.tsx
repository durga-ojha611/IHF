"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CatalogCard } from "@/lib/catalog";

interface CategoryFilterCatalogProps {
  categoryName: string;
  categorySlug: string;
  subcategories: CatalogCard[];
  fabrics?: CatalogCard[];
  products: CatalogCard[];
  isCustomizable?: boolean;
  customizerUrl?: string;
}

export function CategoryFilterCatalog({
  categoryName,
  categorySlug,
  subcategories,
  fabrics = [],
  products,
  isCustomizable = false,
  customizerUrl = ""
}: CategoryFilterCatalogProps) {
  // 1. Accordion Collapse State (STYLE / TYPE open by default matching design)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    style: true,
    material: false,
    size: false,
    color: false,
    price: false
  });

  // 2. Selected Filter Checkboxes
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  // 3. Sort Order State
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "price-desc">("recommended");

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleFilter = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedStyles([]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedPrices([]);
  };

  const hasActiveFilters =
    selectedStyles.length > 0 ||
    selectedMaterials.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedPrices.length > 0;

  // Available filter options tailored per category
  const availableStyles = useMemo(() => {
    if (subcategories.length > 0) {
      return subcategories.map((s) => s.name);
    }
    return [
      "Bespoke Mitered Tablecloth",
      "Classic Hemstitched Runner",
      "Dinner Napkins (Set of 4)"
    ];
  }, [subcategories]);

  const availableMaterials = useMemo(() => {
    if (fabrics.length > 0) {
      const names = fabrics.map((f) => f.name.split("·")[0].trim());
      return Array.from(new Set(names));
    }
    return [
      "Pure Belgian Flax Linen",
      "Organic Cotton Damask",
      "Linen-Silk Blend",
      "Heavyweight Flax"
    ];
  }, [fabrics]);

  const availableSizes = useMemo(() => {
    if (categorySlug === "table-linen") {
      return [
        "Standard Tablecloth (60″ × 90″)",
        "Large Tablecloth (70″ × 108″)",
        "Banquet Runner (16″ × 90″)",
        "Dinner Napkin Set (20″ × 20″)"
      ];
    }
    if (categorySlug === "bedding") {
      return [
        "Twin / Twin XL",
        "Full / Queen (90″ × 92″)",
        "King / Cal King (108″ × 92″)",
        "Euro Sham Pair (26″ × 26″)"
      ];
    }
    return [
      "Pair 96″ × 84″",
      "Pair 96″ × 96″",
      "Pair 96″ × 108″",
      "Custom Tailored Size"
    ];
  }, [categorySlug]);


  const availableColors = [
    "Natural Taupe",
    "Pure Off-White",
    "Oatmeal Linen",
    "Terracotta Clay",
    "Sage Leaf"
  ];

  const availablePriceRanges = [
    { label: "Under $100", min: 0, max: 99 },
    { label: "$100 - $200", min: 100, max: 200 },
    { label: "$200+", min: 201, max: 99999 }
  ];

  // Dynamic Filtering Calculation
  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
      // Filter by Style / Type
      if (selectedStyles.length > 0) {
        const matchesStyle = selectedStyles.some(
          (style) =>
            product.name.toLowerCase().includes(style.toLowerCase()) ||
            style.toLowerCase().includes(product.name.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(style.toLowerCase()))
        );
        if (!matchesStyle) return false;
      }

      // Filter by Material
      if (selectedMaterials.length > 0) {
        const matchesMaterial = selectedMaterials.some(
          (mat) =>
            (product.description && product.description.toLowerCase().includes(mat.toLowerCase())) ||
            product.name.toLowerCase().includes(mat.toLowerCase())
        );
        if (!matchesMaterial) return false;
      }

      // Filter by Size
      if (selectedSizes.length > 0) {
        const matchesSize = selectedSizes.some(
          (sz) =>
            (product.description && product.description.toLowerCase().includes(sz.toLowerCase())) ||
            product.name.toLowerCase().includes(sz.toLowerCase())
        );
        if (!matchesSize) return false;
      }

      // Filter by Color
      if (selectedColors.length > 0) {
        const matchesColor = selectedColors.some(
          (col) =>
            (product.description && product.description.toLowerCase().includes(col.toLowerCase())) ||
            product.name.toLowerCase().includes(col.toLowerCase())
        );
        if (!matchesColor) return false;
      }

      // Filter by Price Range
      if (selectedPrices.length > 0) {
        const matchesPrice = selectedPrices.some((rangeLabel) => {
          const rangeObj = availablePriceRanges.find((r) => r.label === rangeLabel);
          if (!rangeObj) return true;
          return product.price >= rangeObj.min && product.price <= rangeObj.max;
        });
        if (!matchesPrice) return false;
      }

      return true;
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, selectedStyles, selectedMaterials, selectedSizes, selectedColors, selectedPrices, sortBy]);

  return (
    <section className="cp-catalog cp-section" id="collection">
      {/* CATALOG HEADER */}
      <div className="cp-catalog-head">
        <div>
          <h2>Find Your Perfect {categoryName}</h2>
          <div className="cp-catalog-count">
            <span>{filteredProducts.length} {filteredProducts.length === 1 ? "Design" : "Designs"}</span>
            {hasActiveFilters && (
              <button type="button" className="cp-clear-filters-btn" onClick={clearAllFilters}>
                Clear All Filters ✕
              </button>
            )}
          </div>
        </div>

        <div className="cp-sort-container">
          <label htmlFor="cp-sort-select" className="cp-sort-label">SORT BY:</label>
          <select
            id="cp-sort-select"
            className="cp-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="recommended">RECOMMENDED</option>
            <option value="price-asc">PRICE: LOW TO HIGH</option>
            <option value="price-desc">PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>

      {/* CATALOG BODY WITH SIDEBAR & GRID */}
      <div className="cp-catalog-body">
        {/* LEFT SIDEBAR ACCORDION FILTERS */}
        <aside className="cp-sidebar-filters">
          {/* SECTION 1: STYLE / TYPE */}
          <div className="cp-filter-group">
            <button
              type="button"
              className="cp-filter-accordion-header"
              onClick={() => toggleSection("style")}
            >
              <span className="cp-filter-title">STYLE / TYPE</span>
              <span className="cp-filter-icon">{openSections.style ? "−" : "+"}</span>
            </button>
            {openSections.style && (
              <div className="cp-filter-options">
                {availableStyles.map((styleName) => (
                  <label key={styleName} className="cp-filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedStyles.includes(styleName)}
                      onChange={() => handleToggleFilter(selectedStyles, setSelectedStyles, styleName)}
                    />
                    <span>{styleName}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: MATERIAL */}
          <div className="cp-filter-group">
            <button
              type="button"
              className="cp-filter-accordion-header"
              onClick={() => toggleSection("material")}
            >
              <span className="cp-filter-title">MATERIAL</span>
              <span className="cp-filter-icon">{openSections.material ? "−" : "+"}</span>
            </button>
            {openSections.material && (
              <div className="cp-filter-options">
                {availableMaterials.map((mat) => (
                  <label key={mat} className="cp-filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(mat)}
                      onChange={() => handleToggleFilter(selectedMaterials, setSelectedMaterials, mat)}
                    />
                    <span>{mat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: SIZE */}
          <div className="cp-filter-group">
            <button
              type="button"
              className="cp-filter-accordion-header"
              onClick={() => toggleSection("size")}
            >
              <span className="cp-filter-title">SIZE</span>
              <span className="cp-filter-icon">{openSections.size ? "−" : "+"}</span>
            </button>
            {openSections.size && (
              <div className="cp-filter-options">
                {availableSizes.map((sz) => (
                  <label key={sz} className="cp-filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(sz)}
                      onChange={() => handleToggleFilter(selectedSizes, setSelectedSizes, sz)}
                    />
                    <span>{sz}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 4: COLOR */}
          <div className="cp-filter-group">
            <button
              type="button"
              className="cp-filter-accordion-header"
              onClick={() => toggleSection("color")}
            >
              <span className="cp-filter-title">COLOR</span>
              <span className="cp-filter-icon">{openSections.color ? "−" : "+"}</span>
            </button>
            {openSections.color && (
              <div className="cp-filter-options">
                {availableColors.map((col) => (
                  <label key={col} className="cp-filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(col)}
                      onChange={() => handleToggleFilter(selectedColors, setSelectedColors, col)}
                    />
                    <span>{col}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 5: PRICE */}
          <div className="cp-filter-group">
            <button
              type="button"
              className="cp-filter-accordion-header"
              onClick={() => toggleSection("price")}
            >
              <span className="cp-filter-title">PRICE</span>
              <span className="cp-filter-icon">{openSections.price ? "−" : "+"}</span>
            </button>
            {openSections.price && (
              <div className="cp-filter-options">
                {availablePriceRanges.map((pr) => (
                  <label key={pr.label} className="cp-filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(pr.label)}
                      onChange={() => handleToggleFilter(selectedPrices, setSelectedPrices, pr.label)}
                    />
                    <span>{pr.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PRODUCT GRID */}
        <div className="cp-product-grid-wrapper">
          {filteredProducts.length > 0 ? (
            <div className="cp-product-grid">
              {filteredProducts.map((item) => (
                <Link key={item.slug} className="cp-product" href={`/product/${item.slug}`}>
                  <div className="cp-product-image-container" style={{ position: "relative" }}>
                    <Image src={item.image} alt={item.name} fill sizes="30vw" />
                    {item.customizable && <em>MADE TO MEASURE</em>}
                  </div>
                  <small>{item.productType || "ATELIER COLLECTION"}</small>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <footer>
                    <b>From ${item.price}</b>
                  </footer>
                  <span>
                    VIEW DETAILS <i>→</i>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="cp-no-results">
              <h3>No designs match your selected filters</h3>
              <p>Try clearing some filters to view our full collection.</p>
              <button type="button" className="cp-clear-filters-btn-large" onClick={clearAllFilters}>
                CLEAR FILTERS
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
