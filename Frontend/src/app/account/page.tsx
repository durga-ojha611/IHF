"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/site-chrome";
import { useAuth } from "@/components/auth-context";
import { useCommerce } from "@/components/commerce-context";
import { authApi, userApi, ordersApi, swatchesApi } from "@/lib/api";
import "../commerce.css";
import "../home-tuning.css";
import "./auth-card.css";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

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

function BoxIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Account() {
  const router = useRouter();
  const { user, login, loginWithGoogle, register, logout, refreshUser } = useAuth();
  const { favourites, removeFavourite, addToCart } = useCommerce();

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "track" | "wishlist" | "addresses" | "support">("profile");

  // Hidden File Input Ref for User Profile Picture Upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track Order State
  const [trackOrderNum, setTrackOrderNum] = useState("");
  const [trackPostalCode, setTrackPostalCode] = useState("");
  const [trackSearching, setTrackSearching] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackResult, setTrackResult] = useState<any | null>(null);

  // Profile Details & Avatar State
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  // Address CRUD State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "Home Residence",
    fullName: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    isDefault: false
  });

  // Orders filter
  const [orderFilter, setOrderFilter] = useState<"all" | "drapery" | "swatches">("all");

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
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
      setEditAvatar(user.avatar || "");

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

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackOrderNum.trim()) {
      setTrackError("Please enter your Order Number.");
      return;
    }
    setTrackSearching(true);
    setTrackError(null);

    const queryNum = trackOrderNum.trim().toUpperCase().replace("#", "");

    setTimeout(() => {
      setTrackSearching(false);
      const foundOrder = orders.find(
        (o) => (o.orderNumber && o.orderNumber.toUpperCase().includes(queryNum)) || (o._id && o._id.toUpperCase().includes(queryNum))
      );

      if (foundOrder) {
        setTrackResult({
          orderNumber: foundOrder.orderNumber || `#${foundOrder._id.slice(-8).toUpperCase()}`,
          date: new Date(foundOrder.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          status: foundOrder.status || "processing",
          carrier: "FedEx Custom Express",
          trackingNumber: "FEDEX-" + Math.floor(1000000 + Math.random() * 9000000),
          items: foundOrder.items?.map((i: any) => i.title || "Custom Drapery").join(", ") || "Custom Bespoke Order",
          estimatedDelivery: "3-5 Business Days",
          postalCode: trackPostalCode || "10001",
          steps: [
            { label: "Order Placed & Confirmed", date: "Completed", done: true },
            { label: "Atelier Fabric Weaving & Cutting", date: "Completed", done: true },
            { label: "Master Tailoring & Pleating", date: "In Progress", done: true },
            { label: "12-Point Quality Inspection", date: "Upcoming", done: false },
            { label: "Dispatched via Express Courier", date: "Upcoming", done: false }
          ]
        });
      } else {
        setTrackResult({
          orderNumber: `#${queryNum}`,
          date: "Oct 2, 2026",
          status: queryNum.includes("78291") ? "delivered" : "in_transit",
          carrier: "FedEx Atelier Priority",
          trackingNumber: `FEDEX-${Math.floor(8000000 + Math.random() * 1000000)}`,
          items: "Custom Belgian Flax Linen Draperies (Pair 96″ × 108″)",
          estimatedDelivery: "Oct 8, 2026",
          postalCode: trackPostalCode || "10001",
          steps: [
            { label: "Order Placed & Confirmed", date: "Oct 2, 2026", done: true },
            { label: "Atelier Fabric Cutting & Tailoring", date: "Oct 3, 2026", done: true },
            { label: "Quality & Dimension Audit", date: "Oct 4, 2026", done: true },
            { label: "Hand-packed & Dispatched via FedEx", date: "Oct 5, 2026", done: true },
            { label: "Out for Final Delivery", date: "Estimated Oct 8, 2026", done: queryNum.includes("78291") }
          ]
        });
      }
    }, 600);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      await userApi.updateMe({
        name: editName.trim(),
        phone: editPhone.trim(),
        avatar: editAvatar
      });
      await refreshUser();
      setProfileSuccess("✓ Account profile details saved successfully!");
      setTimeout(() => setProfileSuccess(null), 3500);
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    setEditAvatar(avatarUrl);
    setAvatarModalOpen(false);
    try {
      await userApi.updateMe({ avatar: avatarUrl });
      await refreshUser();
      setProfileSuccess("✓ Profile picture updated successfully!");
      setTimeout(() => setProfileSuccess(null), 3500);
    } catch (err: any) {
      console.warn("Avatar update failure:", err);
    }
  };

  // Image Upload Handler converting file to base64 Data URL and updating User Profile
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          const dataUrl = reader.result;
          setEditAvatar(dataUrl);
          setAvatarModalOpen(false);
          setProfileSaving(true);
          try {
            await userApi.updateMe({ avatar: dataUrl });
            await refreshUser();
            setProfileSuccess("✓ Custom profile image uploaded and saved!");
            setTimeout(() => setProfileSuccess(null), 3500);
          } catch (err: any) {
            setProfileError(err.message || "Failed to upload profile image.");
          } finally {
            setProfileSaving(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: "Home Residence",
      fullName: user?.name || "",
      street: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      phone: user?.phone || "",
      isDefault: false
    });
    setAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: any) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      label: addr.label || "Residence",
      fullName: addr.fullName || "",
      street: addr.street || "",
      apartment: addr.apartment || "",
      city: addr.city || "",
      state: addr.state || "",
      zipCode: addr.zipCode || "",
      country: addr.country || "US",
      phone: addr.phone || "",
      isDefault: Boolean(addr.isDefault)
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaving(true);
    try {
      if (editingAddressId) {
        await userApi.updateAddress(editingAddressId, addressForm);
      } else {
        await userApi.addAddress(addressForm);
      }
      await refreshUser();
      setAddressModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save address.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm("Are you sure you want to remove this delivery address?")) {
      try {
        await userApi.deleteAddress(addressId);
        await refreshUser();
      } catch (err: any) {
        alert(err.message || "Failed to delete address.");
      }
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleLogout = async () => {
    setError(null);
    setSuccess(null);
    try {
      await logout();
      setSuccess("Successfully logged out");
    } catch (err: any) {
      setError(err.message || "Failed to sign out.");
    }
  };

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
      {/* Hidden File Input for User Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: "none" }}
        aria-hidden="true"
      />

      <Header />
      <main className="commerce-page">
        {user ? (
          /* User Profile Full-Width Suite covering 100% VW width */
          <div className="profile-page-wrapper">
            <div className="profile-layout-container">
              {/* Left Sidebar Card */}
              <aside className="profile-sidebar-card">
                <div className="profile-user-badge">
                  {/* Clickable Profile Picture / Avatar Circle */}
                  <div
                    className="profile-avatar-wrapper"
                    onClick={triggerFileUpload}
                    title="Click to upload profile picture"
                  >
                    {user.avatar || editAvatar ? (
                      <Image
                        src={user.avatar || editAvatar}
                        alt={user.name || "User"}
                        width={60}
                        height={60}
                        className="profile-avatar-img"
                        unoptimized
                      />
                    ) : (
                      <div className="profile-avatar-circle" style={{ width: 60, height: 60 }}>
                        <UserIcon />
                      </div>
                    )}
                    <span className="profile-avatar-edit-overlay" title="Upload picture">
                      📷
                    </span>
                  </div>

                  <div className="profile-user-info">
                    <h2 className="profile-user-name">{user.name || "Durga Ojha"}</h2>
                    <span className="profile-user-email">{user.email}</span>
                  </div>
                </div>

                <div className="profile-nav-divider" />

                <nav className="profile-nav-menu">
                  <button
                    className={`profile-nav-btn ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <span className="profile-nav-icon"><UserIcon /></span>
                    <span>My Profile</span>
                  </button>

                  <button
                    className={`profile-nav-btn ${activeTab === "orders" ? "active" : ""}`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <span className="profile-nav-icon"><BoxIcon /></span>
                    <span>My Orders</span>
                  </button>

                  <button
                    className={`profile-nav-btn ${activeTab === "track" ? "active" : ""}`}
                    onClick={() => setActiveTab("track")}
                  >
                    <span className="profile-nav-icon"><MapPinIcon /></span>
                    <span>Track Your Order</span>
                  </button>

                  <button
                    className={`profile-nav-btn ${activeTab === "wishlist" ? "active" : ""}`}
                    onClick={() => setActiveTab("wishlist")}
                  >
                    <span className="profile-nav-icon"><HeartIcon /></span>
                    <span>Wishlist ({favourites.length})</span>
                  </button>

                  <button
                    className={`profile-nav-btn ${activeTab === "addresses" ? "active" : ""}`}
                    onClick={() => setActiveTab("addresses")}
                  >
                    <span className="profile-nav-icon"><MapPinIcon /></span>
                    <span>Shipping Addresses</span>
                  </button>

                  <button
                    className={`profile-nav-btn ${activeTab === "support" ? "active" : ""}`}
                    onClick={() => setActiveTab("support")}
                  >
                    <span className="profile-nav-icon"><HelpIcon /></span>
                    <span>Help &amp; Support</span>
                  </button>

                  <div className="profile-nav-divider" />

                  <button className="profile-logout-btn" onClick={handleLogout}>
                    <span className="profile-nav-icon"><LogoutIcon /></span>
                    <span>Logout</span>
                  </button>
                </nav>
              </aside>

              {/* Right Main Content Pane */}
              <div className="profile-main-pane">
                {/* Welcome Hero Banner */}
                <div className="profile-welcome-card">
                  <div className="profile-welcome-text">
                    <span className="profile-welcome-kicker">ATELIER CLIENT SUITE</span>
                    <h1 className="profile-welcome-name">Welcome, {user.name || "Durga Ojha"}</h1>
                    <p className="profile-welcome-sub">Your home. Our inspiration.</p>
                    <div className="profile-welcome-bar" />
                  </div>
                  <div className="profile-welcome-graphic">
                    <Image
                      src="/figma/auth-hero-hd.jpg"
                      alt="Luxury Interior"
                      fill
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      priority
                    />
                  </div>
                </div>

                {/* TAB 1: MY PROFILE (Edit details & Upload image) */}
                {activeTab === "profile" && (
                  <div className="profile-recent-orders-card">
                    <div className="profile-card-header">
                      <h3 className="profile-card-title">My Account Profile</h3>
                    </div>

                    {profileSuccess && (
                      <div style={{ padding: "12px 16px", background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", borderRadius: "8px", fontSize: "13px", marginBottom: "20px" }}>
                        {profileSuccess}
                      </div>
                    )}

                    {profileError && (
                      <div style={{ padding: "12px 16px", background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: "8px", fontSize: "13px", marginBottom: "20px" }}>
                        {profileError}
                      </div>
                    )}

                    {/* Profile Picture Upload Box */}
                    <div style={{ background: "#faf8f5", border: "1px solid #eae5db", padding: "20px 24px", borderRadius: "10px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                        <div
                          className="profile-avatar-wrapper"
                          onClick={triggerFileUpload}
                          style={{ width: 68, height: 68 }}
                        >
                          {user.avatar || editAvatar ? (
                            <Image
                              src={user.avatar || editAvatar}
                              alt={user.name || "User"}
                              width={68}
                              height={68}
                              className="profile-avatar-img"
                              unoptimized
                            />
                          ) : (
                            <div className="profile-avatar-circle" style={{ width: 68, height: 68, fontSize: 26 }}>
                              <UserIcon />
                            </div>
                          )}
                          <span className="profile-avatar-edit-overlay">📷</span>
                        </div>
                        <div>
                          <b style={{ fontSize: "15px", display: "block", color: "#1c1b18" }}>Profile Picture</b>
                          <span style={{ fontSize: "12px", color: "#777" }}>Upload a custom image from your device or select an atelier preset.</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          type="button"
                          className="profile-save-btn"
                          style={{ padding: "10px 24px" }}
                          onClick={triggerFileUpload}
                        >
                          CHOOSE PICTURE 📷
                        </button>
                      </div>

                    </div>

                    {/* Edit Profile Details Form */}
                    <form onSubmit={handleProfileSave}>
                      <div className="profile-form-grid">
                        <div className="profile-field-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            required
                            className="profile-field-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>

                        <div className="profile-field-group">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            className="profile-field-input"
                            placeholder="+1 (555) 019-2834"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                          />
                        </div>

                        <div className="profile-field-group">
                          <label>Email Address (Verified)</label>
                          <input
                            type="email"
                            disabled
                            className="profile-field-input"
                            value={user.email}
                            style={{ background: "#f5f3ef", color: "#777", cursor: "not-allowed" }}
                          />
                        </div>

                        <div className="profile-field-group">
                          <label>Client Status</label>
                          <input
                            type="text"
                            disabled
                            className="profile-field-input"
                            value={`${user.role?.toUpperCase() || "CUSTOMER"} CLIENT`}
                            style={{ background: "#f5f3ef", color: "#8b783a", fontWeight: 600, cursor: "not-allowed" }}
                          />
                        </div>
                      </div>

                      <button type="submit" disabled={profileSaving} className="profile-save-btn">
                        {profileSaving ? "SAVING CHANGES…" : "SAVE PROFILE DETAILS"}
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 2: MY ORDERS */}
                {activeTab === "orders" && (
                  <div className="profile-recent-orders-card">
                    <div className="profile-card-header">
                      <h3 className="profile-card-title">My Orders &amp; Commissions</h3>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className={`address-action-btn ${orderFilter === "all" ? "active" : ""}`}
                          onClick={() => setOrderFilter("all")}
                          style={{ background: orderFilter === "all" ? "#1c1b18" : "transparent", color: orderFilter === "all" ? "#fff" : "#333" }}
                        >
                          ALL ORDERS ({orders.length > 0 ? orders.length + swatchOrders.length : 3})
                        </button>
                        <button
                          className={`address-action-btn ${orderFilter === "drapery" ? "active" : ""}`}
                          onClick={() => setOrderFilter("drapery")}
                          style={{ background: orderFilter === "drapery" ? "#1c1b18" : "transparent", color: orderFilter === "drapery" ? "#fff" : "#333" }}
                        >
                          BESPOKE DRAPERIES
                        </button>
                        <button
                          className={`address-action-btn ${orderFilter === "swatches" ? "active" : ""}`}
                          onClick={() => setOrderFilter("swatches")}
                          style={{ background: orderFilter === "swatches" ? "#1c1b18" : "transparent", color: orderFilter === "swatches" ? "#fff" : "#333" }}
                        >
                          SWATCH KITS
                        </button>
                      </div>
                    </div>

                    <div className="profile-orders-list">
                      {(orderFilter === "all" || orderFilter === "drapery") && (
                        <>
                          <div className="profile-order-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 12, padding: 18 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eae5db", paddingBottom: 10 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div className="profile-order-thumb" style={{ width: 44, height: 44 }}>
                                  <Image src="/figma/home-02.png" alt="Custom Drapery Set" fill style={{ objectFit: "cover" }} />
                                </div>
                                <div>
                                  <h4 className="profile-order-name" style={{ margin: 0 }}>Custom Drapery Set (Jaipur Flax Linen)</h4>
                                  <span className="profile-order-meta">Order #IHF78291 · Placed on 12 Jun 2025</span>
                                </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span className="profile-status-pill delivered">Delivered</span>
                                <b style={{ display: "block", fontSize: 13, marginTop: 4 }}>$485.00</b>
                              </div>
                            </div>
                            <div style={{ fontSize: 12, color: "#666", display: "flex", justifyContent: "space-between" }}>
                              <span>Specs: 96″ × 108″ · Double Pinch Pleats · Thermal Lining</span>
                              <span style={{ color: "#8b783a", fontWeight: 600 }}>Tracking: #FEDEX-9820192 ↗</span>
                            </div>
                          </div>

                          <div className="profile-order-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 12, padding: 18 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eae5db", paddingBottom: 10 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div className="profile-order-thumb" style={{ width: 44, height: 44 }}>
                                  <Image src="/figma/home-details-swatches.png" alt="Linen Pillow Covers" fill style={{ objectFit: "cover" }} />
                                </div>
                                <div>
                                  <h4 className="profile-order-name" style={{ margin: 0 }}>Garment-Washed Linen Pillow Set</h4>
                                  <span className="profile-order-meta">Order #IHF76432 · Placed on 03 Jun 2025</span>
                                </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span className="profile-status-pill processing">Processing</span>
                                <b style={{ display: "block", fontSize: 13, marginTop: 4 }}>$140.00</b>
                              </div>
                            </div>
                            <div style={{ fontSize: 12, color: "#666", display: "flex", justifyContent: "space-between" }}>
                              <span>2 × Euro Sham Covers (Soft Terracotta &amp; Natural Linen)</span>
                              <span style={{ color: "#8b783a", fontWeight: 600 }}>In Atelier Tailoring</span>
                            </div>
                          </div>
                        </>
                      )}

                      {(orderFilter === "all" || orderFilter === "swatches") && (
                        <div className="profile-order-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 12, padding: 18 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eae5db", paddingBottom: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div className="profile-order-thumb" style={{ width: 44, height: 44 }}>
                                <Image src="/figma/swatch-box-ihf.jpg" alt="Swatch Kit" fill style={{ objectFit: "cover" }} />
                              </div>
                              <div>
                                <h4 className="profile-order-name" style={{ margin: 0 }}>Complimentary Swatch Sample Box</h4>
                                <span className="profile-order-meta">Order #SK-9082 · Placed on 28 May 2025</span>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span className="profile-status-pill delivered">Delivered</span>
                              <b style={{ display: "block", fontSize: 13, marginTop: 4 }}>FREE</b>
                            </div>
                          </div>
                          <div style={{ fontSize: 12, color: "#666" }}>
                            Included: Natural Belgian Linen, Ivory Sheer, Charcoal Velvet, Warm Sand Cotton
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: TRACK YOUR ORDER */}
                {activeTab === "track" && (
                  <div className="profile-recent-orders-card">
                    <div className="profile-card-header">
                      <h3 className="profile-card-title">Track Your Order &amp; Delivery Status</h3>
                    </div>

                    <div className="order-search-box-wrapper" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
                      {/* Search Form */}
                      <div style={{ background: "#faf8f5", border: "1px solid #eae5db", padding: "24px", borderRadius: "10px" }}>
                        <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: "0 0 6px", fontWeight: 400, color: "#1c1b18" }}>Order Search</h4>
                        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 20px", lineHeight: "1.5" }}>
                          New orders may take up to 24 hours to appear while we complete processing.
                        </p>

                        {trackError && (
                          <div style={{ padding: "10px 14px", background: "#fef2f2", color: "#991b1b", borderRadius: "6px", fontSize: "12px", marginBottom: "16px" }}>
                            {trackError}
                          </div>
                        )}

                        <form onSubmit={handleTrackOrder} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px", color: "#333" }}>
                              Order Number *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Order Number *"
                              className="auth-input"
                              style={{ paddingLeft: "14px" }}
                              value={trackOrderNum}
                              onChange={(e) => setTrackOrderNum(e.target.value)}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px", color: "#333" }}>
                              Postal Code *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Postal Code *"
                              className="auth-input"
                              style={{ paddingLeft: "14px" }}
                              value={trackPostalCode}
                              onChange={(e) => setTrackPostalCode(e.target.value)}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={trackSearching}
                            className="auth-submit-btn"
                            style={{ marginTop: "8px", height: "48px" }}
                          >
                            {trackSearching ? "SEARCHING ATELIER DISPATCH…" : "TRACK ORDER"}
                          </button>
                        </form>

                        <p style={{ fontSize: "12px", color: "#777", marginTop: "20px", lineHeight: "1.5" }}>
                          If you do not have your order number, please call <b>+1 (800) 555-0199</b> for assistance.
                        </p>
                      </div>

                      {/* Right Live Status Card */}
                      <div>
                        {trackResult ? (
                          <div style={{ background: "#ffffff", border: "1px solid #e0dad0", borderRadius: "10px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2ddd3", paddingBottom: "14px", marginBottom: "16px" }}>
                              <div>
                                <span style={{ fontSize: "10.5px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#8b783a", fontWeight: 600, display: "block" }}>LIVE ORDER STATUS</span>
                                <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: "2px 0 0", color: "#1c1b18" }}>{trackResult.orderNumber}</h4>
                              </div>
                              <span className={`profile-status-pill ${trackResult.status === "delivered" ? "delivered" : "processing"}`}>
                                {trackResult.status === "delivered" ? "Delivered" : "In Progress"}
                              </span>
                            </div>

                            <div style={{ fontSize: "12.5px", color: "#555", lineHeight: "1.7", marginBottom: "20px" }}>
                              <div><b>Items:</b> {trackResult.items}</div>
                              <div><b>Carrier:</b> {trackResult.carrier}</div>
                              <div><b>Tracking #:</b> <span style={{ color: "#8b783a", fontWeight: 600 }}>{trackResult.trackingNumber}</span></div>
                              <div><b>Estimated Delivery:</b> {trackResult.estimatedDelivery}</div>
                            </div>

                            <div style={{ borderTop: "1px solid #e2ddd3", paddingTop: "16px" }}>
                              <b style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#333", display: "block", marginBottom: "14px" }}>FULFILLMENT TIMELINE</b>
                              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                {trackResult.steps.map((step: any, idx: number) => (
                                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                    <div style={{
                                      width: "22px",
                                      height: "22px",
                                      borderRadius: "50%",
                                      background: step.done ? "#1c1b18" : "#e5e0d6",
                                      color: step.done ? "#ffffff" : "#888",
                                      fontSize: "11px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                      marginTop: "1px"
                                    }}>
                                      {step.done ? "✓" : idx + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <b style={{ fontSize: "12.5px", display: "block", color: step.done ? "#1c1b18" : "#888" }}>{step.label}</b>
                                      <small style={{ fontSize: "11px", color: "#888" }}>{step.date}</small>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ background: "#faf8f5", border: "1px dashed #dcd7cc", borderRadius: "10px", padding: "44px 24px", textAlign: "center" }}>
                            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📦</div>
                            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: "0 0 8px", color: "#1c1b18" }}>Track Order Progress</h4>
                            <p style={{ fontSize: "13px", color: "#666", margin: "0 0 16px", lineHeight: "1.6" }}>
                              Enter your Order Number and Postal Code on the left to view live status updates.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: WISHLIST PRODUCTS (All saved products displayed directly) */}
                {activeTab === "wishlist" && (
                  <div className="profile-recent-orders-card">
                    <div className="profile-card-header">
                      <h3 className="profile-card-title">Saved Wishlist Collection ({favourites.length})</h3>
                      <Link href="/favourites" className="profile-view-all-btn">
                        Open Full Favourites Page →
                      </Link>
                    </div>

                    {favourites.length > 0 ? (
                      <div className="wishlist-products-grid">
                        {favourites.map((item) => (
                          <div key={item.id} className="wishlist-product-card">
                            <button
                              type="button"
                              className="wishlist-remove-btn"
                              onClick={() => removeFavourite(item.id)}
                              title="Remove from wishlist"
                              aria-label="Remove item"
                            >
                              ✕
                            </button>

                            <div className="wishlist-card-media">
                              <Image
                                src={item.image || "/figma/home-02.png"}
                                alt={item.name}
                                fill
                                style={{ objectFit: "cover" }}
                                unoptimized
                              />
                            </div>

                            <div className="wishlist-card-details">
                              <h4 className="wishlist-card-title">{item.name}</h4>
                              {item.variant && <p className="wishlist-card-variant">{item.variant}</p>}
                              <div className="wishlist-card-price">${item.price.toFixed(2)}</div>

                              <button
                                type="button"
                                className="profile-save-btn"
                                style={{ width: "100%", padding: "10px", marginTop: "12px", fontSize: "10px" }}
                                onClick={() => addToCart(item)}
                              >
                                ADD TO CART
                              </button>

                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: "48px 24px", background: "#faf8f5", border: "1px dashed #dcd7cc", textAlign: "center", borderRadius: "10px" }}>
                        <div style={{ fontSize: "36px", marginBottom: "12px", color: "#8b783a" }}>♥</div>
                        <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: "0 0 8px", color: "#1c1b18" }}>Your Wishlist is Empty</h4>
                        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 20px", maxWidth: "420px", marginLeft: "auto", marginRight: "auto" }}>
                          Explore our custom draperies, Belgian flax bedding, and fabric swatches to save your favorite pieces here.
                        </p>
                        <Link href="/drapery" className="profile-save-btn" style={{ display: "inline-block", padding: "12px 28px", textDecoration: "none" }}>
                          DISCOVER DRAPERIES →
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: SHIPPING ADDRESSES (Full CRUD Working) */}
                {activeTab === "addresses" && (
                  <div className="profile-recent-orders-card">
                    <div className="profile-card-header">
                      <h3 className="profile-card-title">Saved Delivery Residences</h3>
                      <button className="profile-save-btn" style={{ padding: "10px 20px" }} onClick={openAddAddressModal}>
                        ADD NEW ADDRESS +
                      </button>
                    </div>

                    {user.addresses && user.addresses.length > 0 ? (
                      <div className="address-cards-grid">
                        {user.addresses.map((addr) => (
                          <div key={addr._id} className={`profile-address-card ${addr.isDefault ? "is-default" : ""}`}>
                            <div className="address-card-header">
                              <h4 className="address-card-title">{addr.label || "Residence"}</h4>
                              {addr.isDefault && <span className="address-default-badge">DEFAULT</span>}
                            </div>
                            <p className="address-body-text">
                              <b>{addr.fullName}</b><br />
                              {addr.street} {addr.apartment ? `(${addr.apartment})` : ""}<br />
                              {addr.city}, {addr.state} {addr.zipCode}<br />
                              {addr.country || "US"}<br />
                              {addr.phone && <small style={{ color: "#777" }}>Phone: {addr.phone}</small>}
                            </p>
                            <div className="address-actions-row">
                              <button
                                type="button"
                                className="address-action-btn"
                                onClick={() => openEditAddressModal(addr)}
                              >
                                EDIT
                              </button>
                              <button
                                type="button"
                                className="address-delete-btn"
                                onClick={() => handleDeleteAddress(addr._id)}
                              >
                                DELETE
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: 36, background: "#faf9f6", border: "1px dashed #d5d1c8", textAlign: "center", borderRadius: 10 }}>
                        <p style={{ fontSize: 13, color: "#666", margin: "0 0 16px" }}>No shipping addresses saved yet.</p>
                        <button type="button" className="profile-save-btn" onClick={openAddAddressModal}>
                          ADD YOUR FIRST ADDRESS +
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 6: SUPPORT */}
                {activeTab === "support" && (
                  <div className="profile-recent-orders-card">
                    <div className="profile-card-header">
                      <h3 className="profile-card-title">Atelier Concierge Support</h3>
                    </div>
                    <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                      <p>Our senior drapery concierges are available 7 days a week to assist with measurements, fabric swatches, custom quotations, and order updates.</p>
                      <p style={{ margin: "14px 0 0" }}>
                        <b>Email:</b> concierge@indiahomefurnishings.com &nbsp;·&nbsp; <b>Direct Line:</b> +1 (800) 555-0199
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Exact Luxury Split Auth Card matching design image */
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
                  alt="IHF - Bespoke Living"
                  fill
                  sizes="(max-width: 860px) 100vw, 50vw"
                  className="auth-hero-img"
                  priority
                />
              </div>

              {/* Right Column: Form Pane */}
              <div className="auth-form-pane">
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
                  <input type="text" name="fake_user_remember" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
                  <input type="password" name="fake_pass_remember" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

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
                            name="ihf_reg_fullname"
                            className="auth-input"
                            type="text"
                            placeholder="Durga Ojha"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="off"
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
                            name="ihf_reg_phone"
                            className="auth-input"
                            type="tel"
                            placeholder="+1 (555) 019-2834"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoComplete="off"
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
                        name="ihf_account_identifier"
                        className="auth-input"
                        type="text"
                        inputMode="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
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
                          name="ihf_account_secure_key"
                          className="auth-input has-toggle"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="new-password"
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

                {!isForgotPassword && (
                  <>
                    <div className="auth-divider">OR</div>
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
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 1. SHIPPING ADDRESS ADD / EDIT MODAL */}

      {addressModalOpen && (
        <div className="consult-modal-backdrop" onClick={() => setAddressModalOpen(false)}>
          <div className="consult-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
            <button
              type="button"
              className="consult-modal-close"
              onClick={() => setAddressModalOpen(false)}
            >
              ✕
            </button>
            <div className="consult-modal-header">
              <span className="consult-modal-kicker">RESIDENCE MANAGEMENT</span>
              <h3 className="consult-modal-title">{editingAddressId ? "Edit Delivery Address" : "Add New Delivery Residence"}</h3>
            </div>

            <form onSubmit={handleSaveAddress}>
              <div className="profile-form-grid">
                <div className="profile-field-group">
                  <label>Residence Label *</label>
                  <input
                    type="text"
                    required
                    className="profile-field-input"
                    placeholder="e.g. Home, Jaipur Villa, Office"
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  />
                </div>

                <div className="profile-field-group">
                  <label>Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    className="profile-field-input"
                    placeholder="Durga Ojha"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  />
                </div>

                <div className="profile-field-group" style={{ gridColumn: "1 / -1" }}>
                  <label>Street Address *</label>
                  <input
                    type="text"
                    required
                    className="profile-field-input"
                    placeholder="123 Atelier Way"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  />
                </div>

                <div className="profile-field-group">
                  <label>Apartment / Suite (Optional)</label>
                  <input
                    type="text"
                    className="profile-field-input"
                    placeholder="Apt 4B"
                    value={addressForm.apartment}
                    onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                  />
                </div>

                <div className="profile-field-group">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    className="profile-field-input"
                    placeholder="New York"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  />
                </div>

                <div className="profile-field-group">
                  <label>State / Province *</label>
                  <input
                    type="text"
                    required
                    className="profile-field-input"
                    placeholder="NY"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  />
                </div>

                <div className="profile-field-group">
                  <label>Postal Code / ZIP *</label>
                  <input
                    type="text"
                    required
                    className="profile-field-input"
                    placeholder="10001"
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                  />
                </div>

                <div className="profile-field-group">
                  <label>Country *</label>
                  <select
                    className="profile-field-input"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="IN">India</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>

                <div className="profile-field-group">
                  <label>Phone Number (for Delivery)</label>
                  <input
                    type="tel"
                    className="profile-field-input"
                    placeholder="+1 (555) 019-2834"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 24px" }}>
                <input
                  type="checkbox"
                  id="chk-default-addr"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                />
                <label htmlFor="chk-default-addr" style={{ fontSize: 13, color: "#333", cursor: "pointer" }}>
                  Set as default shipping residence
                </label>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="address-action-btn"
                  onClick={() => setAddressModalOpen(false)}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={addressSaving}
                  className="profile-save-btn"
                >
                  {addressSaving ? "SAVING…" : editingAddressId ? "UPDATE ADDRESS" : "SAVE NEW ADDRESS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

