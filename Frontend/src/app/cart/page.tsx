"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import { useCommerce } from "@/components/commerce-context";
import { useAuth } from "@/components/auth-context";
import "../commerce.css";

export default function Cart() {
  const { cart, subtotal, setQuantity, removeCart, checkout, openAuthModal } = useCommerce();
  const { user } = useAuth();

  const [checkingOut, setCheckingOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Shipping Form State
  const defaultAddr = user?.addresses?.[0];
  const [fullName, setFullName] = useState(defaultAddr?.fullName || user?.name || "Eleanor Vance");
  const [street, setStreet] = useState(defaultAddr?.street || "740 Park Avenue");
  const [city, setCity] = useState(defaultAddr?.city || "New York");
  const [state, setState] = useState(defaultAddr?.state || "NY");
  const [zipCode, setZipCode] = useState(defaultAddr?.zipCode || "10021");

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("checkout");
      return;
    }
    setSubmitting(true);
    setCheckoutError(null);

    const res = await checkout({
      fullName,
      street,
      city,
      state,
      zipCode,
      country: "US"
    });

    setSubmitting(false);

    if (res.success) {
      setOrderSuccess(res.order);
      setCheckingOut(false);
    } else {
      setCheckoutError(res.error || "Payment and order creation failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <main className="commerce-page">
        <header className="commerce-head">
          <span>BESPOKE SELECTION</span>
          <h1>Shopping Cart</h1>
          <p>Complimentary white-glove worldwide delivery on every order.</p>
        </header>

        {orderSuccess ? (
          <div style={{ maxWidth: 700, margin: "0 auto", background: "white", padding: 48, border: "1px solid #ddd8cf", textAlign: "center" }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: "#7b803e", fontWeight: 600 }}>COMMISSION CONFIRMED</span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 36, margin: "12px 0 6px" }}>Thank You for Your Order</h2>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>
              Your bespoke commission has been received by the India Home Furnishings atelier.
            </p>
            <div style={{ background: "#faf9f6", border: "1px solid #eee", padding: 20, marginBottom: 24, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span>Order Reference:</span>
                <b>#{orderSuccess.orderNumber || "IHF-2026-CONFIRMED"}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span>Total Amount:</span>
                <b>${orderSuccess.pricing?.totalPrice?.toFixed(2) || subtotal.toFixed(2)}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>Estimated Atelier Dispatch:</span>
                <b>18 Business Days</b>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
              <Link href="/account" style={{ background: "#222", color: "white", padding: "14px 26px", fontSize: 10, letterSpacing: 1.5 }}>
                VIEW IN ACCOUNT
              </Link>
              <Link href="/products/bedding" style={{ background: "#f4f3ef", border: "1px solid #ccc", padding: "14px 26px", fontSize: 10, letterSpacing: 1.5, color: "#222" }}>
                CONTINUE BROWSING
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="empty-state">
            <h2>Your cart is waiting.</h2>
            <p>Discover considered pieces made beautifully for your home.</p>
            <Link href="/products/bedding">EXPLORE COLLECTIONS</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section>
              {cart.map((x) => (
                <article className="cart-line" key={x.id}>
                  <Image src={x.image} alt={x.name} width={130} height={145} style={{ objectFit: "cover" }} />
                  <div>
                    <small>INDIA HOME FURNISHINGS · {x.isCustom ? "CUSTOM ATELIER" : "READY TO SHIP"}</small>
                    <h2>{x.name}</h2>
                    <p>{x.variant}</p>
                    {x.isCustom && x.specs && (
                      <div style={{ fontSize: 11, color: "#666", background: "#f5f4ef", padding: "6px 10px", marginTop: 6, display: "inline-block" }}>
                        Dimensions: {x.specs.width}&quot; × {x.specs.height}&quot; · {x.specs.fullness} Fullness
                      </div>
                    )}
                    <div className="qty-control" style={{ marginTop: 12 }}>
                      <button onClick={() => setQuantity(x.id, x.quantity - 1)}>−</button>
                      <span>{x.quantity}</span>
                      <button onClick={() => setQuantity(x.id, x.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="line-price">
                    ${(x.price * x.quantity).toFixed(2)}
                    <button onClick={() => removeCart(x.id)}>REMOVE</button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <b>${subtotal.toFixed(2)}</b>
              </div>
              <div className="summary-row">
                <span>Tailored White-Glove Delivery</span>
                <b style={{ color: "#7b803e" }}>COMPLIMENTARY</b>
              </div>
              <div className="summary-row total">
                <span>Total (USD)</span>
                <b>${subtotal.toFixed(2)}</b>
              </div>

              {!checkingOut ? (
                <>
                  <button type="button" onClick={() => {
                    if (!user) {
                      openAuthModal("checkout");
                      return;
                    }
                    setCheckingOut(true);
                  }}>
                    PROCEED TO CHECKOUT
                  </button>
                  <p>Encrypted Stripe payment with server-side price verification.</p>
                </>
              ) : (
                <form onSubmit={handleCheckoutSubmit} style={{ marginTop: 20 }}>
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: 18, marginBottom: 12 }}>
                    Shipping Residence
                  </h4>
                  {checkoutError && (
                    <div style={{ background: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", padding: "8px 10px", fontSize: 11, marginBottom: 10 }}>
                      {checkoutError}
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      style={{ padding: "8px 10px", fontSize: 12, border: "1px solid #ccc" }}
                    />
                    <input
                      placeholder="Street Address"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      style={{ padding: "8px 10px", fontSize: 12, border: "1px solid #ccc" }}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      <input
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        style={{ padding: "8px 10px", fontSize: 12, border: "1px solid #ccc" }}
                      />
                      <input
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        style={{ padding: "8px 10px", fontSize: 12, border: "1px solid #ccc" }}
                      />
                      <input
                        placeholder="Zip"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                        style={{ padding: "8px 10px", fontSize: 12, border: "1px solid #ccc" }}
                      />
                    </div>
                    <button type="submit" disabled={submitting} style={{ marginTop: 12 }}>
                      {submitting ? "CONFIRMING WITH ATELIER..." : `AUTHORIZE & PLACE COMMISSION ($${subtotal.toFixed(2)})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckingOut(false)}
                      style={{ background: "none", border: 0, textDecoration: "underline", color: "#666", fontSize: 10, cursor: "pointer", marginTop: 4 }}
                    >
                      ← Back to summary
                    </button>
                  </div>
                </form>
              )}
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
