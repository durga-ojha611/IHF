"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import { useAuth } from "@/components/auth-context";
import { authApi, ordersApi } from "@/lib/api";
import "../commerce.css";

export default function Account() {
  const { user, loading, login, register, logout } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setOrdersLoading(true);
      ordersApi
        .getMyOrders()
        .then((res) => {
          setOrders(res.data?.orders || []);
        })
        .catch(() => {
          setOrders([]);
        })
        .finally(() => {
          setOrdersLoading(false);
        });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (isForgotPassword) {
        if (!email.trim()) throw new Error("Please enter your email address.");
        const res = await authApi.forgotPassword(email.trim());
        setSuccess(res.message || "A secure password reset link has been dispatched to your email address.");
      } else if (isRegister) {
        if (!name.trim()) throw new Error("Please enter your full name.");
        await register(name, email, password, phone);
        setSuccess("Account successfully created. Welcome to IHF!");
      } else {
        await login(email, password);
        setSuccess("Signed in successfully.");
      }
    } catch (err: any) {
      setError(err.message || "Action failed. Please check your information.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (role: "client" | "admin") => {
    setIsRegister(false);
    setIsForgotPassword(false);
    setError(null);
    if (role === "client") {
      setEmail("client@luxurydrapes.com");
      setPassword("Client@123456");
    } else {
      setEmail("admin@ihfluxury.com");
      setPassword("Admin@123456");
    }
  };

  return (
    <>
      <Header />
      <main className="commerce-page">
        {user ? (
          /* Logged In Dashboard */
          <div style={{ maxWidth: 960, margin: "0 auto", background: "white", padding: 48, border: "1px solid #ddd8cf" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, borderBottom: "1px solid #eee", paddingBottom: 24 }}>
              <div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: "#7b803e", fontWeight: 600 }}>VIP CLIENT SUITE</span>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 36, margin: "8px 0 4px" }}>Welcome, {user.name}</h1>
                <p style={{ fontSize: 13, color: "#666", margin: 0 }}>{user.email} · {user.role.toUpperCase()}</p>
              </div>
              <button
                onClick={() => logout()}
                style={{ background: "#222", color: "white", border: 0, padding: "10px 24px", fontSize: 10, letterSpacing: 1.5, cursor: "pointer" }}
              >
                SIGN OUT
              </button>
            </div>

            {/* Addresses */}
            <div style={{ marginTop: 36 }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 12 }}>Saved Delivery Residences</h3>
              {user.addresses && user.addresses.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                  {user.addresses.map((addr) => (
                    <div key={addr._id} style={{ border: "1px solid #e0ded8", padding: 18, background: "#faf9f6" }}>
                      <b style={{ display: "block", fontSize: 13, marginBottom: 6 }}>{addr.label || "Residence"}</b>
                      <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.6 }}>
                        {addr.fullName}<br />
                        {addr.street}<br />
                        {addr.city}, {addr.state} {addr.zipCode}<br />
                        {addr.country}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: "#777" }}>No addresses saved yet. They will appear here when you place an order.</p>
              )}
            </div>

            {/* Orders */}
            <div style={{ marginTop: 44 }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 12 }}>Bespoke Orders &amp; Commissions</h3>
              {ordersLoading ? (
                <p style={{ fontSize: 12, color: "#777" }}>Loading commissions...</p>
              ) : orders.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {orders.map((ord) => (
                    <div key={ord._id} style={{ border: "1px solid #e0ded8", padding: 20, background: "#faf9f6" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eae7e1", paddingBottom: 10, marginBottom: 12 }}>
                        <div>
                          <b style={{ fontSize: 13 }}>Order #{ord.orderNumber}</b>
                          <span style={{ fontSize: 11, color: "#777", marginLeft: 12 }}>
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 10, letterSpacing: 1, padding: "3px 8px", background: ord.fulfillmentStatus === "Delivered" ? "#d1fae5" : "#fef3c7", color: "#111", fontWeight: 600 }}>
                            {ord.fulfillmentStatus?.toUpperCase() || "PENDING"}
                          </span>
                          <b style={{ display: "block", fontSize: 14, marginTop: 4 }}>${ord.pricing?.totalPrice?.toFixed(2) || "0.00"}</b>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#555" }}>
                        {ord.items?.map((it: any, idx: number) => (
                          <div key={idx} style={{ marginBottom: 4 }}>
                            • {it.itemType === "custom_curtain" ? "Custom Drapery Commission" : (it.title || "Custom Piece")} (Qty: {it.quantity})
                            {it.customSpecs && (
                              <span style={{ color: "#888", marginLeft: 8 }}>
                                [{it.customSpecs.width} × {it.customSpecs.height} · {it.customSpecs.pleatId} · {it.customSpecs.liningId}]
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 28, background: "#faf9f6", border: "1px dashed #d5d1c8", textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: "#666", margin: 0 }}>You have no active bespoke commissions yet.</p>
                  <Link href="/drapery/configure" style={{ display: "inline-block", marginTop: 12, fontSize: 10, letterSpacing: 1.5, textDecoration: "underline", color: "#111" }}>
                    CONFIGURE YOUR FIRST DRAPERY →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Sign In / Register / Forgot Password Form */
          <div className="account-shell">
            <div className="account-art">
              <Image src="/figma/home-15.jpeg" alt="A beautiful bedroom" fill sizes="40vw" />
            </div>
            <form className="account-form" onSubmit={handleSubmit} noValidate>
              <span className="home-kicker">
                {isForgotPassword ? "ACCOUNT RECOVERY" : isRegister ? "EXCLUSIVE MEMBERSHIP" : "WELCOME BACK"}
              </span>

              <h1>
                {isForgotPassword ? "Reset Password" : isRegister ? "Create Account" : "Your Account"}
              </h1>

              <p>
                {isForgotPassword
                  ? "Enter the email associated with your account and we will send a password reset link."
                  : isRegister
                  ? "Join the India Home Furnishings atelier to track bespoke draperies, save swatch palettes, and book personal design appointments."
                  : "Sign in to view orders, saved custom drapery designs, complimentary swatches and design appointments."}
              </p>

              {error && (
                <div style={{ background: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", padding: "10px 14px", fontSize: 11, marginBottom: 14 }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ background: "#ecfdf5", border: "1px solid #34d399", color: "#065f46", padding: "10px 14px", fontSize: 11, marginBottom: 14 }}>
                  {success}
                </div>
              )}

              {/* REGISTER ONLY FIELDS */}
              {!isForgotPassword && isRegister && (
                <>
                  <div className="account-form-group">
                    <label className="account-form-label" htmlFor="register-name">FULL NAME</label>
                    <div className="account-input-wrap">
                      <input
                        id="register-name"
                        className="account-input"
                        type="text"
                        placeholder="Eleanor Vance"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="account-form-group">
                    <label className="account-form-label" htmlFor="register-phone">PHONE (OPTIONAL)</label>
                    <div className="account-input-wrap">
                      <input
                        id="register-phone"
                        className="account-input"
                        type="tel"
                        placeholder="+1 (212) 555-7821"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* EMAIL FIELD (Common to all) */}
              <div className="account-form-group">
                <label className="account-form-label" htmlFor="account-email">EMAIL ADDRESS</label>
                <div className="account-input-wrap">
                  <input
                    id="account-email"
                    className="account-input"
                    type="email"
                    placeholder="client@luxurydrapes.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD FIELD WITH FLUSH-RIGHT END TOGGLE */}
              {!isForgotPassword && (
                <div className="account-form-group">
                  <label className="account-form-label" htmlFor="account-password">PASSWORD</label>
                  <div className="account-input-wrap">
                    <input
                      id="account-password"
                      className="account-input account-input-with-toggle"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="account-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        /* Eye Slash Icon (Hide) */
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        /* Eye Icon (Show) */
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* FORGOT PASSWORD LINK (Shown in Sign In mode) */}
              {!isForgotPassword && !isRegister && (
                <div style={{ textAlign: "right", marginTop: 4, marginBottom: 18 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError(null);
                      setSuccess(null);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontSize: 10,
                      color: "#666",
                      textDecoration: "underline",
                      cursor: "pointer",
                      letterSpacing: 0.5
                    }}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button className="account-submit-btn" type="submit" disabled={submitting}>
                {submitting
                  ? "PROCESSING..."
                  : isForgotPassword
                  ? "SEND RESET LINK"
                  : isRegister
                  ? "CREATE ACCOUNT"
                  : "SIGN IN"}
              </button>

              {/* NAVIGATION LINKS */}
              <div style={{ marginTop: 20, textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}>
                {isForgotPassword ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError(null);
                      setSuccess(null);
                    }}
                    style={{ background: "none", border: 0, fontSize: 10, letterSpacing: 1, textDecoration: "underline", cursor: "pointer", color: "#444" }}
                  >
                    ← BACK TO SIGN IN
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(!isRegister);
                      setError(null);
                      setSuccess(null);
                    }}
                    style={{ background: "none", border: 0, fontSize: 10, letterSpacing: 1, textDecoration: "underline", cursor: "pointer", color: "#444" }}
                  >
                    {isRegister ? "ALREADY HAVE AN ACCOUNT? SIGN IN" : "NEW HERE? CREATE AN ACCOUNT"}
                  </button>
                )}
              </div>

              {/* DEV DEMO SHORTCUTS */}
              {!isRegister && !isForgotPassword && (
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #eee", textAlign: "center" }}>
                  <span style={{ fontSize: 9, letterSpacing: 1.5, color: "#888", display: "block", marginBottom: 8 }}>DEV DEMO ONE-CLICK CREDENTIALS:</span>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleDemoFill("client")}
                      style={{ background: "#f4f3ef", border: "1px solid #ddd", padding: "6px 12px", fontSize: 9, cursor: "pointer" }}
                    >
                      Demo Client
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoFill("admin")}
                      style={{ background: "#f4f3ef", border: "1px solid #ddd", padding: "6px 12px", fontSize: 9, cursor: "pointer" }}
                    >
                      Demo Admin
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
