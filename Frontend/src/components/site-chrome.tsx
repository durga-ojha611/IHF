"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCommerce } from "./commerce-context";

const nav = [
  ["Drapery", "/products/drapery"],
  ["Shades", "/products/shades"],
  ["Valances", "/products/valances"],
  ["Pillows", "/products/pillows"],
  ["Bedding", "/products/bedding"],
  ["Table Linen", "/products/table-linen"],
  ["Fabrics & Swatches", "/products/fabrics"],
  ["Decor & More", "/products/decor"],
  ["Resources", "/resources"],
];

export function Header() {
  const { cartCount, favouriteCount } = useCommerce();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
          <Link className="count-link" href="/favourites" aria-label="Favourites">
            <Image src="/figma/ihf-icon-1.svg" alt="Favourites" width={20} height={20} />
            {favouriteCount > 0 && <b>{favouriteCount}</b>}
          </Link>
          <Link className="count-link" href="/cart" aria-label="Cart">
            <Image src="/figma/ihf-icon-2.svg" alt="Cart" width={20} height={20} />
            {cartCount > 0 && <b>{cartCount}</b>}
          </Link>
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
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Brand Column */}
        <div className="footer-brand">
          <Link href="/" className="footer-brand-title">
            INDIA HOME FURNISHINGS
          </Link>
          <div className="footer-brand-divider" />
          <h3 className="footer-heading">
            Bespoke drapery for modern life.
          </h3>
          <p className="footer-tagline">
            Timeless designs, quality fabrics and expert craftsmanship for a home that lasts.
          </p>
        </div>

        {/* Column 2: SHOP */}
        <div className="footer-col">
          <h4>SHOP</h4>
          <div className="footer-links">
            <Link href="/products">Collections</Link>
            <Link href="/drapery/configure">Made to Measure</Link>
            <Link href="/shipping">Shipping &amp; Returns</Link>
          </div>
        </div>

        {/* Column 3: COMPANY */}
        <div className="footer-col">
          <h4>COMPANY</h4>
          <div className="footer-links">
            <Link href="/our-story">Our Story</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>

        {/* Column 4: CONNECT */}
        <div className="footer-col">
          <h4>CONNECT</h4>
          <div className="footer-connect-list">
            <a href="mailto:concierge@indiahomefurnishings.com" className="footer-connect-item">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>Email Us</span>
            </a>
            <a href="tel:+18005550199" className="footer-connect-item">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Call Us</span>
            </a>
            <a href="/our-story" className="footer-connect-item">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Visit Us</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom-divider" />

      <div className="footer-copyright">
        © 2026 INDIA HOME FURNISHINGS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
