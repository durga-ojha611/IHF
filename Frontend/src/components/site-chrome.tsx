"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCommerce } from "./commerce-context";
import "@/app/footer.css";

const nav = [
  ["Drapery", "/drapery"],
  ["Shades", "/products/shades"],
  ["Valances", "/products/valances"],
  ["Pillows", "/products/pillows"],
  ["Bedding", "/products/bedding"],
  ["Table Linen", "/products/table-linen"],
  ["Fabrics & Swatches", "/swatches"],
  ["Decor & More", "/products/decor"],
  ["Resources", "/resources"],
];

export function Header() {
  const { cartCount, favouriteCount, openCartDrawer } = useCommerce();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement">
        <div className="announcement-track">
          <span>Fabric swatches</span>
          <i>·</i>
          <span>Custom-made products</span>
          <i>·</i>
          <span>Worldwide Delivery</span>
          <i>·</i>
          <span>Duty &amp; Tax Free</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>

        {/* Monogram Brand Mark */}
        <Link href="/" className="monogram" aria-label="India Home Furnishings">
          <Image src="/figma/ihf-monogram.svg" alt="India Home Furnishings" width={97} height={42} priority />
        </Link>

        {/* Center Wordmark */}
        <Link href="/" className="wordmark">
          INDIA HOME FURNISHINGS
        </Link>

        {/* Right Actions */}
        <div className="actions">
          <Link href="/favourites" aria-label="Favourites">
            <Image src="/figma/ihf-icon-1.svg" alt="Favourites" width={20} height={20} />
          </Link>
          <button 
            type="button" 
            className="count-link" 
            onClick={openCartDrawer} 
            aria-label="Cart"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <Image src="/figma/ihf-icon-2.svg" alt="Cart" width={20} height={20} />
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
          <Link href="/account" aria-label="Account">
            <Image src="/figma/ihf-icon-3.svg" alt="Account" width={20} height={20} />
          </Link>
          <Link href="/search" aria-label="Search">
            <Image src="/figma/ihf-icon-4.svg" alt="Search" width={20} height={20} />
          </Link>
        </div>
      </header>

      {/* Desktop & Tablet Category Nav Bar */}
      <nav className="nav">
        {nav.map(([label, href]) => (
          <Link key={label} href={href}>
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile Drawer Menu & Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile Navigation"
          >
            <div className="mobile-drawer-header">
              <span className="mobile-drawer-title">CATEGORIES</span>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="mobile-drawer-links">
              {nav.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{label}</span>
                  <span className="mobile-nav-arrow">→</span>
                </Link>
              ))}
            </div>

            <div className="mobile-drawer-footer">
              <Link href="/drapery/configure" className="mobile-primary-btn" onClick={() => setMobileMenuOpen(false)}>
                START CUSTOMIZER
              </Link>
              <div className="mobile-footer-quicklinks">
                <Link href="/account" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                <Link href="/swatches" onClick={() => setMobileMenuOpen(false)}>Order Swatches</Link>
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>View Cart ({cartCount})</Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer-wrapper">
      {/* Main Footer Directory (5 Columns) */}
      <div className="footer-inner-container">
        <div className="footer-main-row">
          {/* Column 1: Brand & Atelier Tagline */}
          <div className="footer-brand-col">
            {/* Real Official IHF Monogram Logo */}
            <Link href="/" className="footer-real-logo-link" aria-label="India Home Furnishings">
              <Image
                src="/figma/ihf-monogram.svg"
                alt="India Home Furnishings"
                width={120}
                height={52}
                priority
              />
            </Link>
            <Link href="/" className="footer-brand-heading">
              INDIA HOME<br />FURNISHINGS
            </Link>
            <div className="footer-clean-tagline">
              ELEVATE YOUR SPACES
            </div>
            <p className="footer-brand-desc">
              Premium draperies, valances and handcrafted home furnishings. Tailored to perfection, designed for timeless living.
            </p>
            {/* Social Icons Row (Instagram, Pinterest, Facebook, YouTube, LinkedIn) */}
            <div className="footer-social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Pinterest">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="16" x2="12" y2="22" />
                  <path d="M12 2a10 10 0 0 0-3.6 19.33c-.05-.82-.1-2.09.02-3l1.15-4.88s-.29-.59-.29-1.46c0-1.37.8-2.39 1.79-2.39.84 0 1.25.63 1.25 1.39 0 .85-.54 2.12-.82 3.3-.23 1 .5 1.82 1.48 1.82 1.78 0 3.15-1.88 3.15-4.59 0-2.4-1.72-4.08-4.19-4.08-2.86 0-4.53 2.14-4.53 4.36 0 .86.33 1.79.75 2.29a.3.3 0 0 1 .07.29c-.08.33-.26 1.05-.3 1.2-.05.2-.16.24-.37.15-1.38-.64-2.24-2.65-2.24-4.27 0-3.47 2.52-6.66 7.28-6.66 3.82 0 6.79 2.73 6.79 6.37 0 3.8-2.39 6.85-5.71 6.85-1.12 0-2.17-.58-2.53-1.27l-.69 2.63c-.25.96-.92 2.16-1.37 2.89A10 10 0 1 0 12 2Z" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <polygon points="10 15 15 12 10 9 10 15" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div className="footer-nav-col">
            <h5>SHOP</h5>
            <ul className="footer-nav-list">
              <li><Link href="/drapery">Draperies</Link></li>
              <li><Link href="/products/valances">Valances</Link></li>
              <li><Link href="/drapery">Curtain Panels</Link></li>
              <li><Link href="/drapery">Sheers</Link></li>
              <li><Link href="/products/decor">Home Decor</Link></li>
              <li><Link href="/swatches">Fabric by the Yard</Link></li>
              <li><Link href="/products">New Arrivals</Link></li>
              <li><Link href="/products">Sale</Link></li>
            </ul>
          </div>

          {/* Column 3: OUR COMPANY */}
          <div className="footer-nav-col">
            <h5>OUR COMPANY</h5>
            <ul className="footer-nav-list">
              <li><Link href="/our-story">About Us</Link></li>
              <li><Link href="/our-story">Our Story</Link></li>
              <li><Link href="/sustainability">Sustainability</Link></li>
              <li><Link href="/trade">Trade Program</Link></li>
              <li><Link href="/resources">Design Resources</Link></li>
              <li><Link href="/journal">Blog</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: CUSTOMER SERVICE */}
          <div className="footer-nav-col">
            <h5>CUSTOMER SERVICE</h5>
            <ul className="footer-nav-list">
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/shipping">Shipping &amp; Delivery</Link></li>
              <li><Link href="/returns">Returns &amp; Exchanges</Link></li>
              <li><Link href="/account">Order Tracking</Link></li>
              <li><Link href="/size-guide">Size Guide</Link></li>
              <li><Link href="/fabric-care">Fabric Care</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Column 5: STAY INSPIRED, SHIPPING & ETSY */}
          <div className="footer-aside-col">
            <h5>STAY INSPIRED</h5>
            <p className="footer-aside-desc">
              Get the latest trends, exclusive offers and design ideas straight to your inbox.
            </p>

            {/* Newsletter Input with Solid Dark Button */}
            <form onSubmit={handleSubscribe} className="footer-sub-form">
              <div className="footer-sub-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="footer-sub-input"
                  aria-label="Enter your email address"
                />
              </div>
              <button type="submit" className="footer-sub-btn">
                <span>SUBSCRIBE</span>
                <span>→</span>
              </button>
            </form>

            {subscribed && (
              <div className="footer-sub-success">
                ✓ Thank you for subscribing to India Home Furnishings!
              </div>
            )}

            {/* We Ship To */}
            <div className="footer-ship-section">
              <div className="footer-ship-header">
                <span>WE SHIP TO</span>
              </div>
              <div className="footer-ship-badges">
                {/* USA Flag */}
                <div className="footer-country-pill">
                  <svg className="footer-flag-icon" viewBox="0 0 640 480">
                    <rect width="640" height="480" fill="#bd3d44"/>
                    <path stroke="#fff" strokeWidth="37" d="M0 55.5h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
                    <rect width="256" height="258" fill="#192f5d"/>
                  </svg>
                  <span>USA</span>
                </div>

                {/* Canada Flag */}
                <div className="footer-country-pill">
                  <svg className="footer-flag-icon" viewBox="0 0 640 480">
                    <rect width="640" height="480" fill="#fff"/>
                    <rect width="160" height="480" fill="#d80027"/>
                    <rect x="480" width="160" height="480" fill="#d80027"/>
                    <path d="M320 120l18 36 38-8-12 36 28 24-38 6 12 38-34-18-12 40-12-40-34 18 12-38-38-6 28-24-12-36 38 8z" fill="#d80027"/>
                  </svg>
                  <span>CANADA</span>
                </div>

                {/* Europe Flag */}
                <div className="footer-country-pill">
                  <svg className="footer-flag-icon" viewBox="0 0 640 480">
                    <rect width="640" height="480" fill="#003399"/>
                    <circle cx="320" cy="140" r="10" fill="#ffcc00"/>
                    <circle cx="320" cy="340" r="10" fill="#ffcc00"/>
                    <circle cx="220" cy="240" r="10" fill="#ffcc00"/>
                    <circle cx="420" cy="240" r="10" fill="#ffcc00"/>
                    <circle cx="250" cy="170" r="10" fill="#ffcc00"/>
                    <circle cx="390" cy="170" r="10" fill="#ffcc00"/>
                    <circle cx="250" cy="310" r="10" fill="#ffcc00"/>
                    <circle cx="390" cy="310" r="10" fill="#ffcc00"/>
                  </svg>
                  <span>EUROPE</span>
                </div>
              </div>
            </div>

            {/* Also Available On: Etsy */}
            <div className="footer-market-section">
              <div className="footer-market-title">
                ALSO AVAILABLE ON
              </div>
              <a
                href="https://www.etsy.com/shop/IndiaHomeFurnishings"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-etsy-card"
                aria-label="Shop India Home Furnishings on Etsy"
              >
                <div className="footer-etsy-logo">
                  <Image
                    src="/figma/etsy-orange-logo.png"
                    alt="Etsy"
                    width={52}
                    height={22}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="footer-etsy-divider" />
                <span className="footer-etsy-sub" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  Shop our unique designs on
                  <Image
                    src="/figma/etsy-orange-logo.png"
                    alt="Etsy"
                    width={40}
                    height={16}
                    style={{ objectFit: "contain", verticalAlign: "middle" }}
                  />
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Bar & Payment Assurance */}
      <div className="footer-bottom-bar-wrap">
        <div className="footer-inner-container">
          <div className="footer-bottom-flex">
            {/* Copyright */}
            <div className="footer-bottom-copy">
              © 2026 India Home Furnishings. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="footer-bottom-links">
              <Link href="/privacy">PRIVACY POLICY</Link>
              <span className="footer-bottom-dot">|</span>
              <Link href="/terms">TERMS &amp; CONDITIONS</Link>
              <span className="footer-bottom-dot">|</span>
              <Link href="/shipping">SHIPPING &amp; RETURNS</Link>
              <span className="footer-bottom-dot">|</span>
              <a href="mailto:concierge@indiahomefurnishings.com">CONTACT CONCIERGE</a>
            </div>

            {/* Secure Payments Assurances */}
            <div className="footer-payments-wrap">
              <span className="footer-payments-label">Secure Payments</span>
              {/* Visa */}
              <svg className="footer-payment-icon" viewBox="0 0 38 24" width="34" height="22" aria-label="Visa">
                <rect width="38" height="24" rx="3" fill="#1A1F71"/>
                <text x="7" y="16" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontSize="11" fontWeight="800" fontStyle="italic" letterSpacing="0.5">VISA</text>
              </svg>

              {/* Mastercard */}
              <svg className="footer-payment-icon" viewBox="0 0 38 24" width="34" height="22" aria-label="Mastercard">
                <rect width="38" height="24" rx="3" fill="#FFFFFF" stroke="#E2DDD5"/>
                <circle cx="15" cy="12" r="6" fill="#EB001B"/>
                <circle cx="23" cy="12" r="6" fill="#F79E1B" fillOpacity="0.85"/>
              </svg>

              {/* Amex */}
              <svg className="footer-payment-icon" viewBox="0 0 38 24" width="34" height="22" aria-label="American Express">
                <rect width="38" height="24" rx="3" fill="#006FCF"/>
                <text x="6" y="15" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8" fontWeight="bold" letterSpacing="0.5">AMEX</text>
              </svg>

              {/* PayPal */}
              <svg className="footer-payment-icon" viewBox="0 0 38 24" width="34" height="22" aria-label="PayPal">
                <rect width="38" height="24" rx="3" fill="#FFFFFF" stroke="#E2DDD5"/>
                <text x="6" y="15" fill="#003087" fontFamily="system-ui, -apple-system, sans-serif" fontSize="9" fontWeight="800" fontStyle="italic" letterSpacing="-0.5">Pay<tspan fill="#0079C1">Pal</tspan></text>
              </svg>

              {/* Apple Pay */}
              <svg className="footer-payment-icon" viewBox="0 0 38 24" width="34" height="22" aria-label="Apple Pay">
                <rect width="38" height="24" rx="3" fill="#000000"/>
                <text x="6" y="15" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontSize="9" fontWeight="600">Pay</text>
              </svg>
            </div>

            {/* Credo with Heart & Single Upward Arrow Button */}
            <div className="footer-bottom-credo">
              <span>Designed for Beautiful Homes® Across the Globe</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>

            {/* Single Upward Arrow Button in Footer */}
            <button
              type="button"
              className="footer-top-arrow-btn"
              onClick={scrollToTop}
              title="Scroll to top of page"
              aria-label="Scroll to top"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
