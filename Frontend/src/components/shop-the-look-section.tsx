"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./shop-the-look.css";

export interface LookItem {
  id: string;
  name: string;
  specs: string;
  price: number;
  image: string;
  badge?: string;
  isCustomizable?: boolean;
  hotspot: {
    top: string;
    left: string;
  };
}

const LOOK_ITEMS: LookItem[] = [
  {
    id: "bedspread",
    name: "Linen Blend Bedspread",
    specs: "Queen · Selected Ivory",
    price: 295.0,
    image: "/figma/cat-bedding-hero-new.jpg",
    hotspot: { top: "58%", left: "54%" }
  },
  {
    id: "bedskirt",
    name: "Tailored Linen Bed Skirt",
    specs: "Queen · Natural Flax Pleat",
    price: 145.0,
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=300&q=80",
    hotspot: { top: "78%", left: "58%" }
  },
  {
    id: "pillows",
    name: "Bolster & Lumbar Pillows",
    specs: "Set of 2 · Undyed Belgian Linen",
    price: 115.0,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=300&q=80",
    hotspot: { top: "50%", left: "70%" }
  },
  {
    id: "curtains",
    name: "Ripple Fold Sheer Drapery",
    specs: "108\" Drop Pair · Off-White",
    price: 545.0,
    badge: "SHEER DRAPERY",
    isCustomizable: true,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80",
    hotspot: { top: "28%", left: "21%" }
  },
  {
    id: "bedthrow",
    name: "Artisanal Fringed Bed Throw",
    specs: "50\" x 70\" · Soft Cream Slub",
    price: 145.0,
    badge: "LOOM THROW",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=300&q=80",
    hotspot: { top: "68%", left: "41%" }
  }
];

export function ShopTheLookSection() {
  // Initially Bedspread is added by default, user can toggle any piece by clicking on hotspot or button
  const [addedItemIds, setAddedItemIds] = useState<string[]>(["bedspread"]);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Toggle item selection
  const toggleItem = (id: string) => {
    setAddedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate pricing
  const rawSubtotal = LOOK_ITEMS.reduce((sum, item) => {
    return addedItemIds.includes(item.id) ? sum + item.price : sum;
  }, 0);

  const fullBundleRawPrice = LOOK_ITEMS.reduce((sum, item) => sum + item.price, 0); // $1,245.00
  const isFullBundle = addedItemIds.length === LOOK_ITEMS.length;
  
  // 15% discount if full 5-piece bundle selected, or 10% if 3+ items
  const discountRate = isFullBundle ? 0.15 : addedItemIds.length >= 3 ? 0.10 : 0;
  const discountAmount = rawSubtotal * discountRate;
  const finalTotal = rawSubtotal - discountAmount;

  const handleAddToCart = () => {
    if (addedItemIds.length === 0) return;

    // Trigger cart event/local storage update if cart exists
    try {
      const existingCart = JSON.parse(localStorage.getItem("ihf_cart") || "[]");
      const itemsToAdd = LOOK_ITEMS.filter((item) => addedItemIds.includes(item.id)).map(item => ({
        id: item.id,
        title: item.name,
        price: item.price,
        specs: item.specs,
        quantity: 1,
        image: item.image
      }));
      localStorage.setItem("ihf_cart", JSON.stringify([...existingCart, ...itemsToAdd]));
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Graceful fallback
    }

    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 3000);
  };

  return (
    <section className="shop-the-look-wrapper" id="shop-the-look">
      {/* SECTION HEADER */}
      <div className="look-header">
        <span className="look-kicker">STYLING SERVICE</span>
        <h2 className="look-title">Shop The Look</h2>
        <p className="look-subtitle">
          Curated by our atelier designers — every element of this serene primary bedroom styled together for effortless harmony. Discover the exact textiles, draperies, and bespoke coordinates photographed in this suite.
        </p>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="look-container">
        {/* LEFT COLUMN: INTERIOR ROOM PHOTO WITH HOTSPOTS */}
        <div className="room-photo-card">
          <div className="room-photo-viewport">
            <Image
              src="/figma/shop-the-look-bedroom.jpg"
              alt="Serene primary bedroom styled with linen bedding and sheer drapery"
              fill
              unoptimized
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              className="room-main-img"
            />

            {/* HOTSPOT MARKERS */}
            {LOOK_ITEMS.map((item) => {
              const isAdded = addedItemIds.includes(item.id);
              const isHovered = hoveredItemId === item.id;

              return (
                <button
                  key={item.id}
                  className={`hotspot-marker ${isAdded ? "added" : ""} ${isHovered ? "hovered" : ""}`}
                  style={{ top: item.hotspot.top, left: item.hotspot.left }}
                  onClick={() => toggleItem(item.id)}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  title={`Click to ${isAdded ? "remove" : "add"} ${item.name}`}
                  aria-label={`Toggle ${item.name}`}
                >
                  <span className="hotspot-icon">{isAdded ? "✓" : "+"}</span>
                  <span className="hotspot-tooltip">
                    <b>{item.name}</b>
                    <small>${item.price.toFixed(2)} · {isAdded ? "Click to remove" : "Click to add"}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="photo-caption-bar">
            <span>Click any marker (+) to examine product specifications</span>
          </div>
        </div>

        {/* RIGHT COLUMN: BUNDLE PIECES CARD */}
        <div className="bundle-card">
          <div className="bundle-card-header">
            <div>
              <h3 className="bundle-title">The Primary Suite Look</h3>
              <p className="bundle-desc">
                Order individual components or purchase the full architectural look at exclusive package rates.
              </p>
            </div>
            <span className="bundle-count-badge">5 PIECES</span>
          </div>

          {/* PRODUCT ITEMS LIST */}
          <div className="bundle-items-list">
            {LOOK_ITEMS.map((item) => {
              const isAdded = addedItemIds.includes(item.id);
              const isHovered = hoveredItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bundle-item-row ${isAdded ? "item-added" : ""} ${isHovered ? "item-hovered" : ""}`}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  <div className="item-thumb">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      sizes="65px"
                      className="item-thumb-img"
                    />
                  </div>

                  <div className="item-info">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-specs">{item.specs}</p>
                    <b className="item-price">${item.price.toFixed(2)}</b>
                  </div>

                  <div className="item-action">
                    {isAdded ? (
                      <button
                        className="btn-added"
                        onClick={() => toggleItem(item.id)}
                      >
                        ADDED
                      </button>
                    ) : (
                      <button
                        className="btn-add"
                        onClick={() => toggleItem(item.id)}
                      >
                        + ADD
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PRICING & ENSEMBLE SUMMARY */}
          <div className="bundle-pricing-summary">
            <div className="pricing-info">
              <div>
                <b>
                  {isFullBundle
                    ? "Complete 5-Piece Ensemble"
                    : `Selected ${addedItemIds.length}-Piece Look`}
                </b>
                {discountAmount > 0 && (
                  <span className="savings-tag">
                    Save {isFullBundle ? "15%" : "10%"} (${discountAmount.toFixed(2)} off) with Room Bundle
                  </span>
                )}
              </div>

              <div className="pricing-totals">
                {discountAmount > 0 && (
                  <span className="original-price">${rawSubtotal.toFixed(2)}</span>
                )}
                <b className="final-price">${finalTotal.toFixed(2)}</b>
              </div>
            </div>

            {cartSuccess ? (
              <div className="look-cart-success">
                ✓ Added {addedItemIds.length} items to your shopping cart!
              </div>
            ) : (
              <button
                className="add-ensemble-btn"
                onClick={handleAddToCart}
                disabled={addedItemIds.length === 0}
              >
                {addedItemIds.length === 0
                  ? "SELECT ITEMS ABOVE"
                  : `ADD ${isFullBundle ? "COMPLETE LOOK" : `SELECTED (${addedItemIds.length})`} TO CART — $${finalTotal.toFixed(2)}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
