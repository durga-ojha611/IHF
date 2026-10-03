"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/site-chrome";
import { useAuth } from "@/components/auth-context";
import { authApi, ordersApi, swatchesApi } from "@/lib/api";
import "../commerce.css";
import "./auth-card.css";

function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
    </svg>
  );
}

export default function Account() {
  const router = useRouter();
  const { user, login, loginWithGoogle, register, logout } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [swatchOrders, setSwatchOrders] = useState<any[]>([]);
  const [swatchOrdersLoading, setSwatchOrdersLoading] = useState(false);

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

      setSwatchOrdersLoading(true);
      swatchesApi
        .getMySwatchOrders()
        .then((res) => {
          setSwatchOrders(res.data?.orders || []);
        })
        .catch(() => {
          setSwatchOrders([]);
        })
        .finally(() => {
          setSwatchOrdersLoading(false);
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
        setSuccess("Account created successfully! Please sign in below with your email and password.");
        setIsRegister(false);
        setPassword("");
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      setSuccess("Successfully authenticated with Google!");
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || "Google Sign-In failed. Please try again.");
    } finally {
      setSubmitting(false);
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

            {/* Complimentary Swatch Sample Kits */}
            <div style={{ marginTop: 44 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, margin: 0 }}>Complimentary Swatch Kits</h3>
                <Link href="/swatches" style={{ fontSize: 11, letterSpacing: 1, textDecoration: "underline", color: "#8b783a", fontWeight: 600 }}>
                  ORDER NEW SWATCHES +
                </Link>
              </div>
              {swatchOrdersLoading ? (
                <p style={{ fontSize: 12, color: "#777" }}>Loading swatch kits...</p>
              ) : swatchOrders.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {swatchOrders.map((sOrd) => (
                    <div key={sOrd.orderNumber} style={{ border: "1px solid #e0ded8", padding: 20, background: "#faf9f6", borderRadius: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eae7e1", paddingBottom: 10, marginBottom: 12 }}>
                        <div>
                          <b style={{ fontSize: 13 }}>Kit #{sOrd.orderNumber}</b>
                          <span style={{ fontSize: 11, color: "#777", marginLeft: 12 }}>
                            {sOrd.createdAt ? new Date(sOrd.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                        <span style={{ fontSize: 10, letterSpacing: 1, padding: "3px 8px", background: sOrd.status === "delivered" ? "#d1fae5" : "#fef3c7", color: "#111", fontWeight: 600, textTransform: "uppercase" }}>
                          {sOrd.status || "PENDING"}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#555", margin: "0 0 10px" }}>
                        Delivery to: {sOrd.customerInfo?.name} · {sOrd.customerInfo?.shippingAddress?.street},{" "}
                        {sOrd.customerInfo?.shippingAddress?.city} ({sOrd.customerInfo?.shippingAddress?.country || "US"})
                      </p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {sOrd.swatches?.map((sw: any, idx: number) => (
                          <div key={idx} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "white", border: "1px solid #e2ddd4", padding: "4px 8px", borderRadius: 4, fontSize: 11 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: sw.hexCode || "#ddd", border: "1px solid #ccc" }} />
                            <b>{sw.fabricName}</b> ({sw.colorName})
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 24, background: "#faf9f6", border: "1px dashed #d5d1c8", textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: "#666", margin: 0 }}>You haven&apos;t ordered any fabric swatches yet.</p>
                  <Link href="/swatches" style={{ display: "inline-block", marginTop: 8, fontSize: 10, letterSpacing: 1.5, textDecoration: "underline", color: "#8b783a", fontWeight: 600 }}>
                    ORDER COMPLIMENTARY SWATCH KIT (UP TO 4 SAMPLES) →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Exact Luxury Split Auth Card matching the user's design image (WITHOUT DEMO BUTTONS) */
          <div className="auth-page-wrapper">
            <div className="auth-split-card">
              {/* Close / Dismiss Button */}
              <button
                type="button"
                className="auth-close-btn"
                onClick={handleClose}
                title="Close and return"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Left Column: Visual Story */}
              <div className="auth-hero-pane">
                <Image
                  src="/figma/auth-hero-hd.jpg"
                  alt="Durga / IHF - Bespoke Living"
                  fill
                  sizes="(max-width: 860px) 100vw, 50vw"
                  className="auth-hero-img"
                  priority
                />
              </div>

              {/* Right Column: Form Pane */}
              <div className="auth-form-pane">
                {/* Botanical sketch art in top right corner */}
                <div className="auth-botanical-art">
                  <Image
                    src="/figma/auth-botanical.png"
                    alt=""
                    width={130}
                    height={130}
                    aria-hidden="true"
                  />
                </div>

                <span className="auth-kicker">
                  {isForgotPassword ? "ACCOUNT RECOVERY" : isRegister ? "EXCLUSIVE ACCESS" : "WELCOME BACK"}
                </span>

                <h1 className="auth-title">
                  {isForgotPassword ? "Reset Password" : isRegister ? "Create Account" : "Your Account"}
                </h1>

                <p className="auth-description">
                  {isForgotPassword
                    ? "Enter the email associated with your account and we will send a password reset link."
                    : isRegister
                    ? "Join our atelier to track bespoke draperies, save swatch palettes, and book personal design appointments."
                    : "Sign in to view orders, saved custom drapery designs, complimentary swatches and design appointments."}
                </p>

                {error && <div className="auth-alert-error">{error}</div>}
                {success && <div className="auth-alert-success">{success}</div>}

                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                  {/* SIGN UP ONLY FIELDS */}
                  {!isForgotPassword && isRegister && (
                    <>
                      <div className="auth-form-group">
                        <label className="auth-label" htmlFor="register-name">
                          FULL NAME
                        </label>
                        <div className="auth-input-container">
                          <span className="auth-input-icon">
                            <UserIcon />
                          </span>
                          <input
                            id="register-name"
                            className="auth-input"
                            type="text"
                            placeholder="Eleanor Vance"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="auth-form-group">
                        <label className="auth-label" htmlFor="register-phone">
                          PHONE NUMBER (OPTIONAL)
                        </label>
                        <div className="auth-input-container">
                          <span className="auth-input-icon">
                            <PhoneIcon />
                          </span>
                          <input
                            id="register-phone"
                            className="auth-input"
                            type="tel"
                            placeholder="+1 (555) 019-2834"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* EMAIL ADDRESS */}
                  <div className="auth-form-group">
                    <label className="auth-label" htmlFor="auth-email">
                      EMAIL ADDRESS
                    </label>
                    <div className="auth-input-container">
                      <span className="auth-input-icon">
                        <MailIcon />
                      </span>
                      <input
                        id="auth-email"
                        className="auth-input"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* PASSWORD (Sign In & Sign Up) */}
                  {!isForgotPassword && (
                    <div className="auth-form-group">
                      <label className="auth-label" htmlFor="auth-password">
                        PASSWORD
                      </label>
                      <div className="auth-input-container">
                        <span className="auth-input-icon">
                          <LockIcon />
                        </span>
                        <input
                          id="auth-password"
                          className="auth-input has-toggle"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          className="auth-eye-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          title={showPassword ? "Hide password" : "Show password"}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FORGOT PASSWORD LINK (Shown in Sign In mode) */}
                  {!isForgotPassword && !isRegister && (
                    <div className="auth-forgot-link-wrap">
                      <button
                        type="button"
                        className="auth-forgot-btn"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setError(null);
                          setSuccess(null);
                        }}
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}

                  {/* PRIMARY SUBMIT BUTTON */}
                  <button className="auth-submit-btn" type="submit" disabled={submitting}>
                    <span>
                      {submitting
                        ? "PROCESSING..."
                        : isForgotPassword
                        ? "SEND RESET LINK"
                        : isRegister
                        ? "CREATE ACCOUNT"
                        : "SIGN IN"}
                    </span>
                    <span aria-hidden="true">→</span>
                  </button>
                </form>

                {/* OR DIVIDER */}
                {!isForgotPassword && (
                  <>
                    <div className="auth-divider">OR</div>

                    {/* GOOGLE SOCIAL BUTTON */}
                    <button
                      type="button"
                      className="auth-google-btn"
                      onClick={handleGoogleSignIn}
                    >
                      <GoogleIcon />
                      <span>Continue with Google</span>
                    </button>
                  </>
                )}

                {/* MODE TOGGLE LINK */}
                <div className="auth-switch-mode">
                  {isForgotPassword ? (
                    <button
                      type="button"
                      className="auth-switch-btn"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setError(null);
                        setSuccess(null);
                      }}
                    >
                      ← BACK TO SIGN IN
                    </button>
                  ) : isRegister ? (
                    <>
                      <span>ALREADY HAVE AN ACCOUNT?</span>
                      <button
                        type="button"
                        className="auth-switch-btn"
                        onClick={() => {
                          setIsRegister(false);
                          setError(null);
                          setSuccess(null);
                        }}
                      >
                        SIGN IN
                      </button>
                    </>
                  ) : (
                    <>
                      <span>NEW HERE?</span>
                      <button
                        type="button"
                        className="auth-switch-btn"
                        onClick={() => {
                          setIsRegister(true);
                          setError(null);
                          setSuccess(null);
                        }}
                      >
                        CREATE AN ACCOUNT
                      </button>
                    </>
                  )}
                </div>

                {/* NOTE: DEV DEMO ONE-CLICK CREDENTIALS ARE INTENTIONALLY EXCLUDED AS REQUESTED */}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
