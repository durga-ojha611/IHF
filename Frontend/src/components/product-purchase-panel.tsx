"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCommerce } from "./commerce-context";

type GalleryImage = { url: string; alt?: string };
type ProductColor = { name: string; hexCode: string; image?: string };

interface BundleAddonItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  image: string;
  basePrice: number;
  selected: boolean;
  selectedSize: string;
  availableSizes: Array<{ label: string; dim: string }>;
  selectedColor: string;
  availableColors: Array<{ name: string; hex: string }>;
  quantity: number;
}

export function ProductPurchasePanel({
  id, title, price, description, eyebrow, category, subcategory, images, colors, sizes, ratingCount = 0
}: {
  id: string; title: string; price: number; description: string; eyebrow: string; category: string;
  subcategory?: string; images: GalleryImage[]; colors: ProductColor[]; sizes: string[]; ratingCount?: number;
}) {
  const { addToCart, toggleFavourite, favourites } = useCommerce();
  const [imageIndex, setImageIndex] = useState(0);
  const [color, setColor] = useState(colors[0]?.name || "Natural");
  const [size, setSize] = useState(sizes[0] || "Standard");
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);

  const visibleSizes = useMemo(() => sizes.slice(0, 6), [sizes]);
  const selectedImage = images[imageIndex] || images[0];
  const item = { id, name: title, price, image: selectedImage.url, variant: `${color} · ${size}` };
  const favourite = favourites.some((entry) => entry.id === id);

  // Bundle Addons State
  const [bundleItems, setBundleItems] = useState<BundleAddonItem[]>([
    {
      id: `${id}-bundle-sham-pair`,
      title: "Belgian Linen Tailored Sham Pair",
      badge: "PAIR (SET OF 2)",
      description: "King 20\" × 36\" · Flanged edge with envelope closure",
      image: "/figma/home-details-swatches.png",
      basePrice: 95,
      selected: true,
      selectedSize: "King",
      availableSizes: [
        { label: "Standard", dim: '20" × 26"' },
        { label: "Queen", dim: '20" × 30"' },
        { label: "King", dim: '20" × 36"' },
        { label: "Euro", dim: '26" × 26"' }
      ],
      selectedColor: "Matching Belgian Ivory",
      availableColors: [
        { name: "Matching Belgian Ivory", hex: "#faf8f5" },
        { name: "Warm Oat", hex: "#e5ded0" },
        { name: "Terracotta", hex: "#ba785d" },
        { name: "Charcoal", hex: "#33312c" }
      ],
      quantity: 1
    },
    {
      id: `${id}-bundle-euro-square`,
      title: "European Square Sham Pair",
      badge: "PAIR (SET OF 2)",
      description: "Euro 26\" × 26\" · Architectural backdrop cushions",
      image: "/figma/home-02.png",
      basePrice: 90,
      selected: true,
      selectedSize: "Euro",
      availableSizes: [
        { label: "Standard", dim: '20" × 26"' },
        { label: "Queen", dim: '20" × 30"' },
        { label: "King", dim: '20" × 36"' },
        { label: "Euro", dim: '26" × 26"' }
      ],
      selectedColor: "Selected Ivory",
      availableColors: [
        { name: "Selected Ivory", hex: "#faf8f5" },
        { name: "Sand Beige", hex: "#e0d8c8" },
        { name: "Charcoal Velvet", hex: "#2f2d29" }
      ],
      quantity: 1
    },
    {
      id: `${id}-bundle-sheer-overlay`,
      title: "Tailored Sheer Curtain Overlay Pair",
      badge: "PAIR (SET OF 2)",
      description: "84\" × 96\" · Light diffusing Belgian linen sheers",
      image: "/figma/shop-the-look-bedroom.jpg",
      basePrice: 120,
      selected: false,
      selectedSize: "Pair 84\" × 96\"",
      availableSizes: [
        { label: "Single", dim: '54" × 84"' },
        { label: "Pair 84\" × 96\"", dim: '84" × 96"' },
        { label: "Grand", dim: '108" × 108"' }
      ],
      selectedColor: "Natural Sheer",
      availableColors: [
        { name: "Natural Sheer", hex: "#fcfbfa" },
        { name: "Soft Cream", hex: "#f3eee4" }
      ],
      quantity: 1
    }
  ]);

  const toggleBundleItem = (addonId: string) => {
    setBundleItems((prev) =>
      prev.map((item) => (item.id === addonId ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateAddonSize = (addonId: string, newSize: string) => {
    setBundleItems((prev) =>
      prev.map((item) => (item.id === addonId ? { ...item, selectedSize: newSize } : item))
    );
  };

  const updateAddonColor = (addonId: string, newColor: string) => {
    setBundleItems((prev) =>
      prev.map((item) => (item.id === addonId ? { ...item, selectedColor: newColor } : item))
    );
  };

  const updateAddonQty = (addonId: string, delta: number) => {
    setBundleItems((prev) =>
      prev.map((item) =>
        item.id === addonId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const resetAllBundleItems = () => {
    setBundleItems((prev) => prev.map((item) => ({ ...item, selected: false, quantity: 1 })));
  };

  // Bundle Total Calculations
  const selectedAddons = useMemo(() => bundleItems.filter((i) => i.selected), [bundleItems]);
  const addonsSubtotal = useMemo(
    () => selectedAddons.reduce((sum, item) => sum + item.basePrice * item.quantity, 0),
    [selectedAddons]
  );
  const totalItemCount = 1 + selectedAddons.reduce((sum, i) => sum + i.quantity, 0);
  const discountRate = selectedAddons.length >= 2 ? 0.10 : 0;
  const rawTotal = price + addonsSubtotal;
  const discountAmount = rawTotal * discountRate;
  const finalBundleTotal = rawTotal - discountAmount;

  const addMainToCart = () => {
    addToCart(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  const addFullBundleToCart = () => {
    // 1. Add main product
    addToCart(item);

    // 2. Add all selected bundle addons
    selectedAddons.forEach((addon) => {
      addToCart({
        id: `${addon.id}-${addon.selectedSize}-${addon.selectedColor}`,
        name: addon.title,
        price: addon.basePrice * (1 - discountRate),
        image: addon.image,
        variant: `${addon.selectedColor} · ${addon.selectedSize}`,
        quantity: addon.quantity
      });
    });

    setBundleAdded(true);
    window.setTimeout(() => setBundleAdded(false), 1800);
  };

  return (
    <section className="detail-top">
      <div className="detail-gallery">
        <div className="detail-main-img">
          <Image src={selectedImage.url} alt={selectedImage.alt || title} fill priority quality={92} sizes="60vw" />
          <button className="detail-heart" aria-label="Save product" onClick={() => toggleFavourite(item)}>{favourite ? "♥" : "♡"}</button>
        </div>
        {images.length > 1 && <div className="detail-thumbs">{images.slice(0, 6).map((image, index) => (
          <button className={index === imageIndex ? "active" : ""} key={image.url} onClick={() => setImageIndex(index)}>
            <Image src={image.url} alt={image.alt || `${title} view ${index + 1}`} width={150} height={110} />
          </button>
        ))}</div>}
      </div>

      <div className="detail-config">
        <div className="detail-breadcrumb">HOME / {category.toUpperCase()}{subcategory ? ` / ${subcategory.toUpperCase()}` : ""}</div>
        <span>{eyebrow.toUpperCase()} ATELIER</span>
        <h1>{title}</h1>
        <div className="detail-rating">★★★★★ <b>{ratingCount} REVIEWS</b></div>
        <h3>From ${price.toFixed(2)}</h3>
        <p>{description}</p>

        {colors.length > 0 && <div className="detail-choice">
          <label>COLOUR <b>{color}</b></label>
          <div className="detail-swatches">{colors.slice(0, 12).map((option) => <button
            aria-label={`Select ${option.name}`} title={option.name} className={color === option.name ? "active" : ""}
            key={option.name} style={{ background: option.hexCode }} onClick={() => setColor(option.name)}
          />)}</div>
        </div>}

        <div className="detail-price-row"><b>SELECT SIZE</b><span>FROM ${price.toFixed(2)}</span></div>
        <div className="detail-sizes">{visibleSizes.map((option) => <button className={size === option ? "active" : ""} key={option} onClick={() => setSize(option)}>{option}</button>)}</div>
        {sizes.length > 6 && <div className="detail-more-sizes">
          <button onClick={() => setExpanded((value) => !value)}>{expanded ? "HIDE MORE SIZES" : `VIEW ALL ${sizes.length} SIZES`} <span>{expanded ? "−" : "+"}</span></button>
          {expanded && <select aria-label="All available sizes" value={size} onChange={(event) => setSize(event.target.value)}>{sizes.map((option) => <option key={option}>{option}</option>)}</select>}
        </div>}

        <div className="detail-selection"><span>YOUR SELECTION</span><b>{color} · {size}</b></div>
        <button className="detail-add" onClick={addMainToCart}>{added ? "ADDED TO CART ✓" : "ADD TO CART"}</button>
        <p className="detail-service">Made to order · Complimentary delivery · Secure checkout</p>

        {/* ==========================================================================
            CUSTOM ENSEMBLE BUILDER BUNDLE SECTION (Matching Attached Reference)
           ========================================================================== */}
        <div className="bundle-builder-container" id="bundle-builder">
          <div className="bundle-header-bar">
            <div>
              <div className="bundle-kickers">
                <span className="bundle-badge-kicker">CUSTOM ENSEMBLE BUILDER</span>
                <span className="bundle-badge-savings">TIERED SAVINGS (10% OFF 3+ PIECES)</span>
              </div>
              <h3 className="bundle-main-title">CREATE YOUR BEDDING &amp; DRAPERY BUNDLE</h3>
              <p className="bundle-sub-desc">
                Select coordinating shams, overlay sheers, and decorative cushions to style your room and unlock 10% atelier savings on 3+ pieces.
              </p>
            </div>
            <button type="button" className="bundle-reset-btn" onClick={resetAllBundleItems}>
              RESET ALL
            </button>
          </div>

          <div className="bundle-items-list">
            {bundleItems.map((addon) => {
              const currentSizeObj = addon.availableSizes.find((s) => s.label === addon.selectedSize) || addon.availableSizes[0];

              return (
                <div key={addon.id} className={`bundle-item-card ${addon.selected ? "selected" : ""}`}>
                  <div className="bundle-card-top-row">
                    <label className="bundle-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={addon.selected}
                        onChange={() => toggleBundleItem(addon.id)}
                        className="bundle-checkbox-input"
                      />
                      <span className="bundle-checkbox-custom">
                        {addon.selected && "✓"}
                      </span>
                    </label>

                    <div className="bundle-thumb-box">
                      <Image
                        src={addon.image}
                        alt={addon.title}
                        width={64}
                        height={64}
                        className="bundle-thumb-img"
                      />
                      <span className="bundle-thumb-badge">{addon.badge}</span>
                    </div>

                    <div className="bundle-item-meta">
                      <h4 className="bundle-item-title">{addon.title}</h4>
                      <p className="bundle-item-desc">{addon.description}</p>
                    </div>

                    <div className="bundle-item-pricing">
                      <b className="bundle-price-val">+${(addon.basePrice * addon.quantity).toFixed(2)}</b>
                      <span className="bundle-included-tag">{addon.selected ? "INCLUDED IN BUNDLE" : "OPTIONAL ADD-ON"}</span>
                    </div>
                  </div>

                  {/* Expanded Item Controls when selected */}
                  {addon.selected && (
                    <div className="bundle-card-controls">
                      {/* SIZE PILLS */}
                      <div className="bundle-control-row">
                        <span className="bundle-control-label">SIZE:</span>
                        <div className="bundle-size-pills">
                          {addon.availableSizes.map((sz) => (
                            <button
                              key={sz.label}
                              type="button"
                              className={`bundle-size-pill ${addon.selectedSize === sz.label ? "active" : ""}`}
                              onClick={() => updateAddonSize(addon.id, sz.label)}
                            >
                              {sz.label}
                            </button>
                          ))}
                        </div>
                        <span className="bundle-control-value">{currentSizeObj?.label} ({currentSizeObj?.dim})</span>
                      </div>

                      {/* COLOR SWATCHES */}
                      <div className="bundle-control-row">
                        <span className="bundle-control-label">COLOR:</span>
                        <div className="bundle-color-swatches">
                          {addon.availableColors.map((cl) => (
                            <button
                              key={cl.name}
                              type="button"
                              title={cl.name}
                              aria-label={cl.name}
                              className={`bundle-swatch-circle ${addon.selectedColor === cl.name ? "active" : ""}`}
                              style={{ background: cl.hex }}
                              onClick={() => updateAddonColor(addon.id, cl.name)}
                            />
                          ))}
                        </div>
                        <span className="bundle-control-value">{addon.selectedColor}</span>
                      </div>

                      {/* QTY COUNTER & PRICE */}
                      <div className="bundle-control-row qty-row">
                        <span className="bundle-control-label">QTY:</span>
                        <div className="bundle-qty-stepper">
                          <button
                            type="button"
                            onClick={() => updateAddonQty(addon.id, -1)}
                            disabled={addon.quantity <= 1}
                          >
                            −
                          </button>
                          <span>{addon.quantity}</span>
                          <button type="button" onClick={() => updateAddonQty(addon.id, 1)}>
                            +
                          </button>
                        </div>
                        <span className="bundle-selected-price">+${(addon.basePrice * addon.quantity).toFixed(2)} Selected</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* BUNDLE SUMMARY & ADD TO CART BAR */}
          <div className="bundle-summary-footer">
            <div className="bundle-summary-info">
              <div className="bundle-summary-count">
                <b>{totalItemCount} ITEMS ENSEMBLE</b>
                {discountRate > 0 && <span className="bundle-savings-tag">10% BUNDLE DISCOUNT APPLIED</span>}
              </div>
              <div className="bundle-summary-pricing">
                {discountRate > 0 && <s className="bundle-raw-price">${rawTotal.toFixed(2)}</s>}
                <b className="bundle-final-price">${finalBundleTotal.toFixed(2)}</b>
              </div>
            </div>

            <button
              type="button"
              className="bundle-add-all-btn"
              onClick={addFullBundleToCart}
            >
              {bundleAdded ? "ENSEMBLE ADDED TO CART ✓" : `ADD BUNDLE TO CART (${totalItemCount} ITEMS) — $${finalBundleTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

