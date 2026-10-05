"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useCommerce } from "./commerce-context";
import { useAuth } from "./auth-context";
import "./cart-drawer.css";

export function CartDrawer() {
  const { user } = useAuth();
  const { cart, isCartOpen, closeCartDrawer, removeCart, setQuantity, subtotal, cartCount, openAuthModal } = useCommerce();

  // Lock scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCartDrawer]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className="cart-drawer-backdrop" 
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      {/* Right Side Sliding Cart Window */}
      <aside 
        className="cart-drawer-panel"
        aria-label="Shopping Cart Drawer"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <span className="cart-drawer-badge">ADDED TO CART</span>
            <h2>YOUR CART ({cartCount})</h2>
          </div>
          <button 
            type="button" 
            className="cart-drawer-close"
            onClick={closeCartDrawer}
            aria-label="Close cart drawer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Free Shipping / Value Proposition Bar */}
        <div className="cart-drawer-promo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5l10 -10" />
          </svg>
          <span>Free Express Shipping on Orders Over $250</span>
        </div>

        {/* Cart Item List */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-drawer-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b5b0a3" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <h3>Your Cart is Empty</h3>
              <p>Explore our bespoke draperies, fabrics, and home decor.</p>
              <Link 
                href="/swatches" 
                className="cart-drawer-explore-btn"
                onClick={closeCartDrawer}
              >
                EXPLORE SWATCHES &amp; FABRICS
              </Link>
            </div>
          ) : (
            <ul className="cart-drawer-items">
              {cart.map((item) => (
                <li key={item.id} className="cart-drawer-item">
                  <div className="cart-drawer-item-img">
                    <Image
                      src={item.image || "/figma/home-01.jpeg"}
                      alt={item.name}
                      width={80}
                      height={96}
                      className="object-cover rounded-sm"
                    />
                  </div>

                  <div className="cart-drawer-item-info">
                    <div className="cart-drawer-item-head">
                      <h4>{item.name}</h4>
                      <button
                        type="button"
                        className="cart-drawer-item-remove"
                        onClick={() => removeCart(item.id)}
                        title="Remove item"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    {item.variant && <p className="cart-drawer-item-variant">{item.variant}</p>}

                    {item.isCustom && item.specs && (
                      <div className="cart-drawer-item-specs">
                        <span>Size: {item.specs.width} × {item.specs.height}</span>
                        {item.specs.lining && <span> · Lining: {item.specs.lining}</span>}
                      </div>
                    )}

                    <div className="cart-drawer-item-bottom">
                      <div className="cart-drawer-qty-picker">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-drawer-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with Subtotal & Actions */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-summary-row">
              <span>Subtotal</span>
              <strong className="cart-drawer-subtotal">${subtotal.toFixed(2)}</strong>
            </div>

            <p className="cart-drawer-tax-note">
              Taxes, duty, and shipping calculated at checkout.
            </p>

            <div className="cart-drawer-actions">
              <Link 
                href="/cart" 
                className="cart-drawer-btn-secondary"
                onClick={closeCartDrawer}
              >
                VIEW FULL CART
              </Link>
              <button 
                type="button"
                className="cart-drawer-btn-primary"
                onClick={() => {
                  closeCartDrawer();
                  if (!user) {
                    openAuthModal("checkout");
                  } else {
                    window.location.href = "/cart?checkout=true";
                  }
                }}
              >
                PROCEED TO CHECKOUT →
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
