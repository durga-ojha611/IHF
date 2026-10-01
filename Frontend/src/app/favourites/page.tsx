"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import { useCommerce } from "@/components/commerce-context";
import "./favourites.css";

// Default luxury curated wishlist items matching screenshot when user opens
const DEFAULT_CURATED_WISHLIST = [
  {
    id: "waffle-weave-coverlet",
    name: "Waffle Weave Linen Coverlet",
    category: "BEDDING",
    price: "310",
    priceRange: "$310 – $360",
    image: "/figma/bedding-hero-exact.png",
    isCustom: false,
    rating: 5,
    colors: ["#DCD5C6", "#E8E4DB", "#B9B0A2"]
  },
  {
    id: "garment-washed-duvet",
    name: "Garment-Washed Duvet Set",
    category: "BEDDING",
    price: "285",
    priceRange: "$285 – $345",
    image: "/figma/home-02.png",
    isCustom: true,
    rating: 5,
    colors: ["#C7BEAF", "#DFD8CB", "#8C827A"]
  },
  {
    id: "bespoke-linen-quilt",
    name: "Bespoke Linen Quilt",
    category: "BEDDING",
    price: "420",
    priceRange: "$420 – $495",
    image: "/figma/home-03.jpeg",
    isCustom: false,
    rating: 5,
    colors: ["#D4CCBD", "#ECE7DD"]
  }
];

const RECENTLY_VIEWED_ITEMS = [
  {
    id: "waffle-coverlet-view",
    title: "Waffle Weave Linen Coverlet",
    category: "BEDDING",
    priceRange: "$310 – $360",
    image: "/figma/bedding-hero-exact.png",
    slug: "belgian-linen-duvet-cover"
  },
  {
    id: "garment-duvet-view",
    title: "Garment-Washed Duvet Set",
    category: "BEDDING",
    priceRange: "$285 – $345",
    image: "/figma/home-02.png",
    slug: "garment-washed-duvet-set"
  },
  {
    id: "bespoke-quilt-view",
    title: "Bespoke Linen Quilt",
    category: "BEDDING",
    priceRange: "$420 – $495",
    image: "/figma/home-03.jpeg",
    slug: "bespoke-linen-quilt"
  },
  {
    id: "bolster-lumbar-view",
    title: "Bolster & Lumbar Pillows",
    category: "PILLOWS",
    priceRange: "$115.00",
    image: "/figma/product-linen-bedspread-hd.png",
    slug: "alpine-boucle-bolster"
  }
];

export default function FavouritesPage() {
  const { favourites, removeFavourite, addToCart } = useCommerce();
  const [activeTab, setActiveTab] = useState<"all" | "ready" | "custom">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Combine live user saved items with curated default items if empty
  const displayItems =
    favourites.length > 0
      ? favourites.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.isCustom ? "CUSTOM DRAPERY" : "BEDDING",
          price: String(item.price),
          priceRange: `$${item.price}`,
          image:
            item.image && !item.image.endsWith(".png") && !item.image.endsWith(".jpeg") && !item.image.endsWith(".jpg")
              ? "/figma/cat-bedding.png"
              : item.image || "/figma/cat-bedding.png",
          isCustom: Boolean(item.isCustom),
          badgeText: item.isCustom ? "CUSTOM" : undefined,
          rating: 5,
          colors: ["#DCD5C6", "#E8E4DB"]
        }))
      : DEFAULT_CURATED_WISHLIST;

  // Filter based on active tab
  const filteredItems = displayItems.filter((item) => {
    if (activeTab === "ready") return !item.isCustom;
    if (activeTab === "custom") return item.isCustom;
    return true;
  });

  const handleShareWishlist = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast("Wishlist link copied to clipboard!");
    }
  };

  const handleAddAllToCart = () => {
    filteredItems.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price.replace(/[^0-9.]/g, "")) || 295,
        quantity: 1,
        image: item.image,
        isCustom: item.isCustom
      });
    });
    showToast(`Added all ${filteredItems.length} items to cart!`);
  };

  const handleAddToCart = (item: (typeof displayItems)[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price.replace(/[^0-9.]/g, "")) || 295,
      quantity: 1,
      image: item.image,
      isCustom: item.isCustom
    });
    showToast(`"${item.name}" added to cart!`);
  };

  return (
    <>
      <Header />
      <div className="favourites-page">
        <div className="favourites-container">
          {/* Breadcrumb */}
          <nav className="fav-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">HOME</Link>
            <span>/</span>
            <Link href="/account">ACCOUNT</Link>
            <span>/</span>
            <strong style={{ color: "#1c1917" }}>MY FAVOURITES & WISHLIST</strong>
          </nav>

          {/* Hero Header Card */}
          <section className="fav-hero-card">
            <div className="fav-hero-content">
              <span className="fav-hero-eyebrow">SAVED SELECTIONS • PRIVATE COLLECTION</span>
              <h1 className="fav-hero-title">My Curated Favourites</h1>
              <p className="fav-hero-subtitle">
                Your personal selection of handcrafted textiles, custom drapery, customizers, and luxury bedding
                combinations. Saved across your session.
              </p>
            </div>

            <div className="fav-hero-actions">
              <button type="button" className="fav-btn-secondary" onClick={handleShareWishlist}>
                SHARE WISHLIST ↗
              </button>
              <button type="button" className="fav-btn-primary" onClick={handleAddAllToCart}>
                ADD ALL ({filteredItems.length}) TO CART
              </button>
            </div>

            {/* Background Monogram Watermark */}
            <div className="fav-hero-watermark">IHF</div>
          </section>

          {/* Filter & Sort Sub-Toolbar */}
          <section className="fav-toolbar">
            <div className="fav-count-tag">
              <span className="fav-count-dot"></span>
              <span>{filteredItems.length} SAVED ITEMS</span>
            </div>

            <div className="fav-tabs">
              <button
                type="button"
                className={`fav-tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                ALL SAVED
              </button>
              <button
                type="button"
                className={`fav-tab-btn ${activeTab === "ready" ? "active" : ""}`}
                onClick={() => setActiveTab("ready")}
              >
                READY TO SHIP
              </button>
              <button
                type="button"
                className={`fav-tab-btn ${activeTab === "custom" ? "active" : ""}`}
                onClick={() => setActiveTab("custom")}
              >
                CUSTOM MADE
              </button>
            </div>

            <div className="fav-sort-wrap">
              <span>SORT BY:</span>
              <select className="fav-sort-select">
                <option value="newest">NEWEST SAVED</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </section>

          {/* Saved Items Grid */}
          <section className="fav-grid">
            {filteredItems.map((item) => (
              <article key={item.id} className="fav-card">
                <div className="fav-card-image-wrap">
                  <Image unoptimized src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" priority />

                  <button
                    type="button"
                    className="fav-heart-btn"
                    onClick={() => removeFavourite(item.id)}
                    title="Remove from favourites"
                  >
                    ♥
                  </button>
                </div>

                <div className="fav-card-body">
                  <span className="fav-card-category">{item.category}</span>
                  <h3 className="fav-card-title">{item.name}</h3>

                  <div className="fav-card-meta-row">
                    <div className="fav-swatch-dots">
                      {item.colors.map((hex, i) => (
                        <span key={i} className="fav-swatch-dot" style={{ backgroundColor: hex }} />
                      ))}
                    </div>
                    <span className="fav-rating">★★★★★ (5)</span>
                  </div>

                  <div className="fav-card-footer">
                    <span className="fav-price-range">{item.priceRange}</span>
                    <button type="button" className="fav-add-cart-btn" onClick={() => handleAddToCart(item)}>
                      + CART
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Design Consultation & Custom Swatches Callout Banner */}
          <section className="fav-consult-banner">
            <div className="fav-consult-left">
              <span className="fav-consult-left-eyebrow">CONCIERGE SERVICE</span>
              <h2 className="fav-consult-left-title">Design Consultation & Custom Swatches</h2>
              <p className="fav-consult-left-copy">
                Undecided on fabric weight or sheer opacity for your window heights? Order a curated complimentary
                swatch box or book a virtual session with an Atelier Drapery Specialist.
              </p>
              <div className="fav-consult-buttons">
                <Link href="/products/fabrics" className="fav-btn-primary">
                  ORDER FREE SWATCH
                </Link>
                <Link href="/drapery" className="fav-btn-secondary">
                  BOOK VIRTUAL CONSULTATION ↗
                </Link>
              </div>
            </div>

            <div className="fav-consult-right-card">
              <div className="fav-consult-card-head">
                <span className="fav-compass-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="2"/>
                    <path d="m5 21 5.5-13"/>
                    <path d="m19 21-5.5-13"/>
                    <path d="M7 16h10"/>
                  </svg>
                </span>
                <div>
                  <h3>Made to Measure</h3>
                  <small>Architectural precision guarantees</small>
                </div>
              </div>
              <p>
                Every drapery panel and bedspread is tailored to 1/8th inch tolerances by master artisans in our Jaipur atelier.
              </p>
              <Link href="/drapery" className="fav-consult-link">
                COMPLIMENTARY SHIPPING WORLDWIDE 🌍
              </Link>
            </div>
          </section>

          {/* Recently Viewed Section */}
          <section className="fav-recently-viewed-section">
            <div className="fav-section-head">
              <div>
                <span className="fav-section-eyebrow">COORDINATED HARMONY</span>
                <h2 className="fav-section-title">Recently Viewed</h2>
              </div>
              <div className="fav-slider-arrows">
                <button type="button" className="fav-arrow-btn" aria-label="Previous">
                  ‹
                </button>
                <button type="button" className="fav-arrow-btn" aria-label="Next">
                  ›
                </button>
              </div>
            </div>

            <div className="fav-recently-grid">
              {RECENTLY_VIEWED_ITEMS.map((item) => (
                <article key={item.id} className="fav-card">
                  <div className="fav-card-image-wrap">
                    <Image unoptimized src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 25vw" />
                  </div>
                  <div className="fav-card-body">
                    <span className="fav-card-category">{item.category}</span>
                    <h3 className="fav-card-title">{item.title}</h3>
                    <div className="fav-card-footer" style={{ borderTop: "none", paddingTop: 0 }}>
                      <span className="fav-price-range" style={{ fontSize: "14px" }}>
                        {item.priceRange}
                      </span>
                      <Link href={`/product/${item.slug}`} className="fav-add-cart-btn" style={{ padding: "6px 12px" }}>
                        VIEW
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            background: "#1c1917",
            color: "#ffffff",
            padding: "14px 24px",
            borderRadius: "4px",
            fontSize: "12px",
            letterSpacing: "1px",
            fontWeight: 600,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: 9999
          }}
        >
          ✓ {toastMessage}
        </div>
      )}
    </>
  );
}
