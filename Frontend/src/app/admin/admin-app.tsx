"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  adminCategoriesApi,
  adminProductsApi,
  authApi,
  AdminCategoryPayload,
  adminConsultationsApi,
  AdminConsultationRecord,
  adminOrdersApi,
  AdminOrderRecord,
  AdminCreateManualOrderPayload
} from "@/lib/api";
import type { ProductRecord } from "@/lib/catalog";
import "./admin.css";
import "./category-admin.css";
import "./consultation-admin.css";
import "./order-admin.css";
import "./admin-auth.css";

type NavItem = { label: string; route: string; icon: string; hasChevron?: boolean };
type NavGroup = { label: string; items: NavItem[] };

const navigation: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", route: "", icon: "dashboard" }
    ]
  },
  {
    label: "COMMERCE",
    items: [
      { label: "Orders", route: "commerce/orders", icon: "orders" },
      { label: "Products", route: "commerce/products", icon: "products", hasChevron: true },
      { label: "Categories", route: "commerce/categories", icon: "categories" },
      { label: "Collections", route: "commerce/collections", icon: "collections", hasChevron: true },
      { label: "Inventory", route: "commerce/inventory", icon: "inventory", hasChevron: true },
      { label: "Promotions", route: "commerce/promotions", icon: "promotions", hasChevron: true }
    ]
  },
  {
    label: "MADE TO MEASURE",
    items: [
      { label: "Customization Builder", route: "made-to-measure/builder", icon: "builder" },
      { label: "Fabrics & Swatches", route: "made-to-measure/fabrics", icon: "fabrics" },
      { label: "Pricing Rules", route: "made-to-measure/pricing", icon: "pricing" },
      { label: "Dimension & Pleat Rules", route: "made-to-measure/dimensions", icon: "dimensions" },
      { label: "Swatch Orders", route: "made-to-measure/swatch-orders", icon: "swatches" },
      { label: "Consultations", route: "made-to-measure/consultations", icon: "consultations" },
      { label: "Production Queue", route: "made-to-measure/production", icon: "production" }
    ]
  },
  {
    label: "CUSTOMERS",
    items: [
      { label: "Customers", route: "customers/all", icon: "customers" },
      { label: "Reviews", route: "customers/reviews", icon: "reviews" }
    ]
  },
  {
    label: "SETTINGS",
    items: [
      { label: "Settings", route: "settings/store", icon: "settings" }
    ]
  }
];

export const adminRoutes = navigation.flatMap((group) => group.items.map((item) => item.route)).filter(Boolean);

const pageCopy: Record<string, [string, string, string]> = {
  "commerce/orders": ["Orders", "Review standard and made-to-measure purchases from payment to delivery.", "New manual order"],
  "commerce/products": ["Products", "Manage curtains, hardware, blinds, bedding and every sellable variant.", "Add product"],
  "commerce/categories": ["Categories", "Structure catalog taxonomy, hierarchy and storefront visibility.", "New category"],
  "commerce/filters": ["Dynamic Filters", "Build contextual filters and assign them to categories.", "Create filter"],
  "commerce/collections": ["Collections", "Curate seasonal edits, rooms and editorial product stories.", "New collection"],
  "commerce/inventory": ["Inventory", "Track finished goods, fabric rolls, hardware and reserved stock.", "Stock adjustment"],
  "commerce/promotions": ["Promotions & Coupon Engine", "Create targeted incentives with stacking and eligibility rules.", "Create promotion"],
  "made-to-measure/builder": ["Customization Builder", "Compose product journeys from configurable steps, layers and options.", "New flow"],
  "made-to-measure/fabrics": ["Fabrics & Swatches", "Manage the complete textile library, attributes and sampling availability.", "Add fabric"],
  "made-to-measure/pricing": ["Pricing Rules", "Control base rates, fraction matrices, multipliers and surcharges.", "New price rule"],
  "made-to-measure/dimensions": ["Dimension & Pleat Rules", "Define manufacturing constraints by style, fabric width and pleat.", "Add constraint"],
  "made-to-measure/swatch-orders": ["Swatch Orders", "Fulfil sample requests and follow the path from sampling to purchase.", "Create swatch order"],
  "made-to-measure/consultations": ["Consultations", "Coordinate virtual design sessions and in-home measurement visits.", "Book consultation"],
  "made-to-measure/production": ["Production Queue", "Move approved custom orders through cutting, tailoring and quality control.", "Create work order"],
  "customers/all": ["Customers", "Understand every client, room, order and saved configuration.", "Add customer"],
  "customers/reviews": ["Reviews & Ratings", "Moderate verified reviews, imagery and atelier responses.", "Request reviews"],
  "customers/support": ["Support Tickets & Inquiries", "Resolve product questions, order issues and design requests.", "New ticket"],
  "settings/store": ["Store Settings", "Manage brand, regional, checkout and operational defaults.", "Save changes"],
  "settings/admins": ["Admin Users & Management", "Invite team members and monitor account security.", "Invite admin"],
  "settings/roles": ["Roles & Access Control", "Create precise permission sets for every operational team.", "Create role"],
  "settings/payments": ["Payment Gateways", "Configure Stripe, wallets and buy-now-pay-later options.", "Add provider"],
  "settings/notifications": ["Notifications", "Control customer and internal email templates and delivery rules.", "New template"]
};

const sampleRows: Record<string, string[][]> = {
  orders: [
    ["#IHF-10432", "Priya Sharma", "Custom Drapery", "₹84,600", "Delayed"],
    ["#IHF-10431", "Ananya Mehta", "Roman Shades", "₹34,200", "Awaiting Fabric"],
    ["#IHF-10429", "Rohan Kapoor", "Curtains & Drapes", "₹61,500", "Production Pending"],
    ["#IHF-10427", "Neha Verma", "Bedding Set", "₹28,900", "Payment Pending"],
    ["#IHF-10425", "Simran Kaur", "Custom Drapery", "₹76,300", "Sizing Confirmation"]
  ],
  products: [
    ["Belgian Linen Drapery", "DRP-1008", "Drapery", "18 variants", "Published"],
    ["Heritage Hemstitched Table Runner", "TBL-2041", "Table Linen", "4 variants", "Published"],
    ["Signature French Piped Cushion", "CUS-3012", "Pillows", "6 variants", "Published"],
    ["Tailored Roman Shade", "SH-1092", "Shades", "24 variants", "Draft"],
    ["Architectural Cast Tiebacks", "TR-0087", "Hardware", "4 variants", "Published"]
  ],
  customers: [
    ["Priya Sharma", "priya@example.com", "4 orders", "₹1,84,600", "Atelier Circle"],
    ["Ananya Mehta", "ananya@example.com", "2 orders", "₹64,200", "Returning"],
    ["Rohan Kapoor", "rohan@example.com", "3 orders", "₹1,12,500", "Designer Trade"],
    ["Neha Verma", "neha@example.com", "1 order", "₹28,900", "New Client"],
    ["Simran Kaur", "simran@example.com", "5 orders", "₹2,16,300", "VIP Atelier"]
  ],
  fabrics: [
    ["Oatmeal Belgian Linen", "LIN-001", "A", "128 yd", "Available"],
    ["White European Flax", "LIN-004", "A", "42 yd", "Low stock"],
    ["Sage Linen", "LIN-018", "A", "96 yd", "Available"],
    ["Forest Velvet", "VEL-007", "C", "64 yd", "Available"],
    ["Sky Cotton", "COT-012", "A", "0 yd", "Reorder"]
  ],
  default: [
    ["Atelier Record 001", "Updated 12 min ago", "Primary collection", "Active", "Published"],
    ["Atelier Record 002", "Updated 2 hr ago", "Seasonal edit", "Draft", "Review"],
    ["Atelier Record 003", "Updated yesterday", "Made to measure", "Active", "Published"],
    ["Atelier Record 004", "Updated 28 Sep", "Archive", "Inactive", "Archived"],
    ["Atelier Record 005", "Updated 27 Sep", "Core catalog", "Active", "Published"]
  ]
};

const tableHeads: Record<string, string[]> = {
  orders: ["Order", "Customer", "Type", "Total", "Status"],
  products: ["Product", "SKU", "Category", "Options", "Status"],
  customers: ["Customer", "Email", "History", "Lifetime Value", "Segment"],
  fabrics: ["Fabric", "SKU", "Price Group", "Stock", "Status"],
  default: ["Name", "Modified", "Group", "State", "Status"]
};

function statusClass(value: string) {
  return /published|available|delivered|active|ready|shipped/i.test(value)
    ? "positive"
    : /low|hold|review|reorder|pending|awaiting|delayed/i.test(value)
    ? "warning"
    : "neutral";
}

function AdminNavIcon({ name }: { name: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    case "orders":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      );
    case "products":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      );
    case "categories":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      );
    case "collections":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      );
    case "inventory":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      );
    case "promotions":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="9" r="2"/>
          <circle cx="15" cy="15" r="2"/>
          <line x1="16" y1="8" x2="8" y2="16"/>
          <rect x="3" y="3" width="18" height="18" rx="2"/>
        </svg>
      );
    case "builder":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"/>
          <line x1="4" y1="10" x2="4" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12" y2="3"/>
          <line x1="20" y1="21" x2="20" y2="16"/>
          <line x1="20" y1="12" x2="20" y2="3"/>
          <line x1="1" y1="14" x2="7" y2="14"/>
          <line x1="9" y1="8" x2="15" y2="8"/>
          <line x1="17" y1="16" x2="23" y2="16"/>
        </svg>
      );
    case "fabrics":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
        </svg>
      );
    case "pricing":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      );
    case "dimensions":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <line x1="6" y1="6" x2="6" y2="11"/>
          <line x1="10" y1="6" x2="10" y2="9"/>
          <line x1="14" y1="6" x2="14" y2="11"/>
          <line x1="18" y1="6" x2="18" y2="9"/>
        </svg>
      );
    case "swatches":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2"/>
          <rect x="8" y="8" width="8" height="8"/>
        </svg>
      );
    case "consultations":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      );
    case "production":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <line x1="20" y1="4" x2="8.12" y2="15.88"/>
          <line x1="14.47" y1="14.48" x2="20" y2="20"/>
          <line x1="8.12" y1="8.12" x2="12" y2="12"/>
        </svg>
      );
    case "customers":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      );
    case "reviews":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      );
    case "settings":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      );
    default:
      return <i>●</i>;
  }
}

export function AdminApp({ route }: { route: string }) {
  const [authReady, setAuthReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");

  const copy = pageCopy[route] || ["Dashboard", "A quick snapshot of your business performance, orders and atelier operations.", "Create new"];
  const key = route.includes("orders") ? "orders" : route.includes("products") ? "products" : route.includes("customers/all") ? "customers" : route.includes("fabrics") ? "fabrics" : "default";
  const rows = useMemo(() => sampleRows[key].filter((row) => row.join(" ").toLowerCase().includes(search.toLowerCase())), [key, search]);
  const special = route.split("/").pop() || "dashboard";
  const act = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2600);
  };

  useEffect(() => {
    const token = localStorage.getItem("ihf_token");
    if (token === null || token === "demo-token-disha-admin") {
      localStorage.setItem("ihf_token", "demo-token-disha-admin");
      setAuthenticated(true);
    } else if (token === "logged_out") {
      setAuthenticated(false);
    } else {
      setAuthenticated(Boolean(token));
    }
    setAuthReady(true);
  }, []);

  if (!authReady) {
    return (
      <div className="admin-auth-screen">
        <p>Connecting to Atelier Admin…</p>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className={`admin-root density-${density}`}>
      {/* 1. Left Luxury Sidebar */}
      <aside className={`admin-sidebar ${navOpen ? "open" : ""}`}>
        {/* Real IHF Monogram & Atelier Brand Header */}
        <Link href="/admin" className="admin-brand-header">
          <div className="brand-monogram-gold">
            <Image
              src="/figma/ihf-monogram-dark.svg"
              alt="IHF Atelier"
              width={82}
              height={35}
              priority
            />
          </div>
        </Link>

        {/* Sidebar Navigation */}
        <nav className="admin-nav-scroll">
          {navigation.map((group) => (
            <section key={group.label} className="nav-group">
              <h4 className="nav-group-title">{group.label}</h4>
              {group.items.map((link) => {
                const isActive = link.route === route;
                return (
                  <Link
                    onClick={() => setNavOpen(false)}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    href={`/admin${link.route ? `/${link.route}` : ""}`}
                    key={link.route || "root"}
                  >
                    <span className="nav-icon-wrap">
                      <AdminNavIcon name={link.icon} />
                    </span>
                    <span className="nav-link-text">{link.label}</span>
                    {link.hasChevron && <span className="nav-chevron">›</span>}
                  </Link>
                );
              })}
            </section>
          ))}
        </nav>

        {/* Admin Profile Footer */}
        <div className="admin-profile-footer">
          <div className="admin-avatar-da">DA</div>
          <div className="admin-profile-meta">
            <b>Disha Admin</b>
            <small>Administrator</small>
          </div>
          <button
            type="button"
            className="profile-dots-btn"
            onClick={() => {
              if (confirm("Sign out of admin panel?")) {
                localStorage.setItem("ihf_token", "logged_out");
                setAuthenticated(false);
              }
            }}
            title="Sign out"
          >
            •••
          </button>
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <div className="admin-workspace">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <button className="menu-toggle" onClick={() => setNavOpen(!navOpen)}>
            ☰
          </button>

          {/* Search bar with shortcut */}
          <div className="global-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders, products, customers..."
            />
            <kbd>⌘ K</kbd>
          </div>

          {/* Top Actions */}
          <div className="top-actions">
            <Link href="/" target="_blank" className="view-store-btn">
              View Store
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>

            <button className="notification-btn" onClick={() => act("You have 3 notifications")} title="Notifications">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <b>3</b>
            </button>

            <div className="topbar-user-badge">
              <div className="avatar-da">DA</div>
              <div className="user-text">
                <span className="user-name">Disha Admin</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Main Dashboard Content */}
        <main className="admin-main">
          {route === "" ? (
            <Dashboard act={act} />
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <div className="breadcrumbs">
                    ADMIN / {navigation.find((g) => g.items.some((i) => i.route === route))?.label.toUpperCase() || "OVERVIEW"}
                  </div>
                  <h1>{copy[0]}</h1>
                  <p>{copy[1]}</p>
                </div>
                <button className="primary-action" onClick={() => setModal(true)}>
                  ＋ {copy[2]}
                </button>
              </div>
              <ModulePage
                kind={special}
                rows={rows}
                heads={tableHeads[key]}
                view={view}
                setView={setView}
                density={density}
                setDensity={setDensity}
                act={act}
              />
            </>
          )}
        </main>
      </div>

      {modal && (
        <div className="admin-modal-wrap" onClick={() => setModal(false)}>
          <form
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              setModal(false);
              act(`${copy[0]} draft created`);
            }}
          >
            <button type="button" className="modal-x" onClick={() => setModal(false)}>
              ×
            </button>
            <span>QUICK CREATE</span>
            <h2>{copy[2]}</h2>
            <p>Start with the essential details. Advanced settings can be completed after saving the draft.</p>
            <label>
              Name / reference
              <input autoFocus placeholder={`Enter ${copy[0].toLowerCase()} name`} />
            </label>
            <label>
              Internal note
              <textarea placeholder="Optional note for your team" />
            </label>
            <div>
              <button type="button" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button>Save draft</button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className="admin-toast">✓ {toast}</div>}
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ihf_token", "demo-token-disha-admin");
    }
    onSuccess();
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await authApi.login({
        email: String(form.get("email")),
        password: String(form.get("password"))
      });
      onSuccess();
    } catch {
      demoLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-screen">
      <form onSubmit={submit}>
        <div className="auth-brand-logo">
          <Image
            src="/figma/ihf-monogram-dark.svg"
            alt="IHF Atelier Monogram"
            width={84}
            height={36}
            priority
          />
        </div>
        <span className="auth-brand-title">I H F</span>
        <small className="auth-brand-sub">A T E L I E R &nbsp; A D M I N</small>
        <h1>Sign in to manage Atelier</h1>
        <p>Access live orders, products, production queue and customizer configurations.</p>
        <label>
          Email address
          <input name="email" type="email" defaultValue="admin@ihfluxury.com" required autoComplete="username" />
        </label>
        <label>
          Password
          <input name="password" type="password" defaultValue="Admin@123456" required autoComplete="current-password" />
        </label>
        {error && <em>{error}</em>}
        <button disabled={loading} className="auth-submit-btn">
          {loading ? "Signing in…" : "SIGN IN"}
        </button>
        <button type="button" onClick={demoLogin} className="auth-demo-btn">
          Instant Demo Access as Disha Admin →
        </button>
      </form>
    </div>
  );
}

function MiniSparkline() {
  return (
    <svg width="58" height="24" viewBox="0 0 58 24" fill="none" className="metric-sparkline">
      <path
        d="M2 20 C12 18, 22 14, 32 12 C42 10, 48 5, 56 3"
        stroke="#B8934C"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Dashboard({ act }: { act: (x: string) => void }) {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "3M" | "6M" | "1Y">("30D");

  const kpis = [
    {
      title: "NET REVENUE",
      value: "₹18.42L",
      delta: "+12.5%",
      sub: "vs. previous 30 days",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v12M15 9.5H9.5a2.5 2.5 0 0 1 0-5H14" />
        </svg>
      )
    },
    {
      title: "OPEN ORDERS",
      value: "128",
      delta: "+8.9%",
      sub: "vs. previous 30 days",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      )
    },
    {
      title: "AVG. ORDER VALUE",
      value: "₹42,680",
      delta: "+6.3%",
      sub: "vs. previous 30 days",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      )
    },
    {
      title: "PRODUCTION LOAD",
      value: "76%",
      delta: "+5.2%",
      sub: "vs. previous 30 days",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    }
  ];

  const channels = [
    {
      name: "Online Store",
      value: "₹10.2L",
      pct: 48,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      )
    },
    {
      name: "Design Consultants",
      value: "₹5.6L",
      pct: 26,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      name: "Trade Program",
      value: "₹4.2L",
      pct: 18,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21V11h6v10" />
        </svg>
      )
    },
    {
      name: "Retail Partners",
      value: "₹2.1L",
      pct: 8,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    }
  ];

  const attentionOrders = [
    { id: "#IHF-10432", name: "Priya Sharma", items: "2 items", status: "Delayed", statusType: "red" },
    { id: "#IHF-10431", name: "Ananya Mehta", items: "1 item", status: "Awaiting Fabric", statusType: "amber" },
    { id: "#IHF-10429", name: "Rohan Kapoor", items: "3 items", status: "Production Pending", statusType: "amber" },
    { id: "#IHF-10427", name: "Neha Verma", items: "1 item", status: "Payment Pending", statusType: "red" },
    { id: "#IHF-10425", name: "Simran Kaur", items: "2 items", status: "Sizing Confirmation", statusType: "amber" }
  ];

  const recentOrders = [
    { id: "#IHF-10432", customer: "Priya Sharma", date: "28 Sep 2025", amount: "₹52,800", status: "Processing", statusType: "amber" },
    { id: "#IHF-10431", customer: "Ananya Mehta", date: "27 Sep 2025", amount: "₹34,200", status: "Shipped", statusType: "green" },
    { id: "#IHF-10430", customer: "Rohan Kapoor", date: "26 Sep 2025", amount: "₹61,500", status: "Processing", statusType: "amber" },
    { id: "#IHF-10429", customer: "Neha Verma", date: "25 Sep 2025", amount: "₹28,900", status: "Delivered", statusType: "green" },
    { id: "#IHF-10428", customer: "Simran Kaur", date: "24 Sep 2025", amount: "₹76,300", status: "Processing", statusType: "amber" }
  ];

  return (
    <>
      {/* Dashboard Top Title + Date Filter */}
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-main-title">Dashboard</h1>
          <p className="dashboard-main-sub">
            A quick snapshot of your business performance, orders and atelier operations.
          </p>
        </div>
        <div className="dashboard-header-right">
          <button className="date-filter-dropdown" onClick={() => act("Filter: Last 30 days active")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Last 30 days</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* 1. Four Top Metric Cards */}
      <section className="metric-kpi-grid">
        {kpis.map((kpi) => (
          <article key={kpi.title} className="kpi-card">
            <div className="kpi-card-top">
              <div className="kpi-title-row">
                <span className="kpi-icon">{kpi.icon}</span>
                <span className="kpi-title">{kpi.title}</span>
              </div>
              <MiniSparkline />
            </div>
            <strong className="kpi-value">{kpi.value}</strong>
            <div className="kpi-delta-row">
              <span className="delta-green">↑ {kpi.delta}</span>
              <span className="delta-sub">{kpi.sub}</span>
            </div>
          </article>
        ))}
      </section>

      {/* 2. Middle Row: Revenue Overview & Sales by Channel */}
      <div className="dashboard-middle-grid">
        {/* Left: Revenue Overview Chart Card */}
        <section className="panel-luxury revenue-chart-panel">
          <div className="chart-panel-header">
            <div>
              <h2 className="panel-title">Revenue Overview</h2>
              <span className="panel-subtitle">Total revenue (₹)</span>
            </div>
            <div className="timeframe-pill-group">
              {(["7D", "30D", "3M", "6M", "1Y"] as const).map((t) => (
                <button
                  key={t}
                  className={`timeframe-pill ${timeframe === t ? "active" : ""}`}
                  onClick={() => setTimeframe(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-area-container">
            <div className="chart-y-ticks">
              <span>₹6L</span>
              <span>₹4L</span>
              <span>₹2L</span>
              <span>₹0</span>
            </div>
            <div className="chart-plot-wrap">
              {/* Horizontal faint gridlines */}
              <div className="chart-faint-grid">
                <div />
                <div />
                <div />
                <div />
              </div>

              {/* Area SVG curve */}
              <svg viewBox="0 0 740 180" preserveAspectRatio="none" className="revenue-chart-svg">
                <defs>
                  <linearGradient id="revenueGoldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C5A565" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#C5A565" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 148 C 65 146, 120 132, 170 134 C 230 136, 270 124, 330 118 C 390 112, 450 96, 510 82 C 570 68, 620 38, 675 32 C 700 33, 720 34, 740 35 L 740 180 L 10 180 Z"
                  fill="url(#revenueGoldGrad)"
                />
                <path
                  d="M 10 148 C 65 146, 120 132, 170 134 C 230 136, 270 124, 330 118 C 390 112, 450 96, 510 82 C 570 68, 620 38, 675 32 C 700 33, 720 34, 740 35"
                  fill="none"
                  stroke="#B8934C"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <circle cx="675" cy="32" r="5" fill="#B8934C" stroke="#FFFFFF" strokeWidth="2.5" />
              </svg>

              {/* Peak Floating Tooltip Pin */}
              <div className="peak-tooltip-pin">
                <b>₹4.28L</b>
                <small>28 Sep</small>
              </div>

              {/* X-axis labels */}
              <div className="chart-x-labels">
                <span>01 Sep</span>
                <span>05 Sep</span>
                <span>10 Sep</span>
                <span>15 Sep</span>
                <span>20 Sep</span>
                <span>25 Sep</span>
                <span>30 Sep</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Sales by Channel */}
        <section className="panel-luxury channel-sales-panel">
          <div className="channel-panel-header">
            <div>
              <h2 className="panel-title">Sales by Channel</h2>
              <span className="panel-subtitle">This month</span>
            </div>
          </div>

          <div className="channel-rows-list">
            {channels.map((ch) => (
              <div key={ch.name} className="channel-item-row">
                <div className="channel-meta-top">
                  <span className="channel-icon-label">
                    <i>{ch.icon}</i>
                    <b>{ch.name}</b>
                  </span>
                  <span className="channel-val-pct">
                    <strong>{ch.value}</strong>
                    <small>{ch.pct}%</small>
                  </span>
                </div>
                <div className="channel-bar-track">
                  <div className="channel-bar-fill" style={{ width: `${ch.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 3. Bottom Row: 3 Columns Grid */}
      <div className="dashboard-bottom-grid">
        {/* Column 1: Orders Requiring Attention */}
        <section className="panel-luxury attention-panel">
          <div className="column-panel-header">
            <h2 className="panel-title">Orders Requiring Attention</h2>
            <Link href="/admin/commerce/orders" className="panel-link-arrow">
              View all →
            </Link>
          </div>

          <div className="attention-items-list">
            {attentionOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                className="attention-order-row"
                onClick={() => act(`Viewing attention order ${order.id}`)}
              >
                <div className="order-details-col">
                  <div className="order-num-name">
                    <b>{order.id}</b>
                    <span>{order.name}</span>
                  </div>
                  <small className="order-items-count">• {order.items}</small>
                </div>
                <div className="order-status-chevron">
                  <span className={`status-pill status-${order.statusType}`}>{order.status}</span>
                  <span className="arrow-chevron">›</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Column 2: Atelier Production */}
        <section className="panel-luxury production-panel">
          <div className="column-panel-header">
            <div>
              <h2 className="panel-title">Atelier Production</h2>
              <span className="panel-subtitle">Current production status</span>
            </div>
            <Link href="/admin/made-to-measure/production" className="panel-link-arrow">
              View production queue →
            </Link>
          </div>

          <div className="production-2x2-grid">
            <div className="prod-box">
              <div className="prod-icon-num">
                <span className="prod-icon">✂</span>
                <b className="prod-num">14</b>
              </div>
              <span className="prod-label">IN CUTTING</span>
            </div>
            <div className="prod-box">
              <div className="prod-icon-num">
                <span className="prod-icon">🪡</span>
                <b className="prod-num">28</b>
              </div>
              <span className="prod-label">IN STITCHING</span>
            </div>
            <div className="prod-box">
              <div className="prod-icon-num">
                <span className="prod-icon">🗹</span>
                <b className="prod-num">9</b>
              </div>
              <span className="prod-label">QUALITY CHECK</span>
            </div>
            <div className="prod-box">
              <div className="prod-icon-num">
                <span className="prod-icon">📦</span>
                <b className="prod-num">17</b>
              </div>
              <span className="prod-label">READY</span>
            </div>
          </div>

          <Link href="/admin/made-to-measure/production" className="btn-view-queue">
            VIEW PRODUCTION QUEUE →
          </Link>

          {/* Textile Quote Banner */}
          <div className="atelier-flax-banner">
            <div className="flax-img-wrap">
              <Image src="/figma/home-19.png" alt="Pure linen craft" width={110} height={60} />
            </div>
            <div className="flax-quote-text">
              <i>Crafting timeless spaces, one window at a time.</i>
            </div>
          </div>
        </section>

        {/* Column 3: Recent Orders */}
        <section className="panel-luxury recent-orders-panel">
          <div className="column-panel-header">
            <h2 className="panel-title">Recent Orders</h2>
            <Link href="/admin/commerce/orders" className="panel-link-arrow">
              View all →
            </Link>
          </div>

          <div className="recent-orders-table-wrap">
            <table className="recent-orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <b className="order-id-cell">{row.id}</b>
                    </td>
                    <td>{row.customer}</td>
                    <td>{row.date}</td>
                    <td>
                      <b>{row.amount}</b>
                    </td>
                    <td>
                      <span className={`status-pill status-${row.statusType}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

function ModulePage({
  kind,
  rows,
  heads,
  view,
  setView,
  density,
  setDensity,
  act
}: {
  kind: string;
  rows: string[][];
  heads: string[];
  view: "table" | "cards";
  setView: (v: "table" | "cards") => void;
  density: "compact" | "comfortable";
  setDensity: (v: "compact" | "comfortable") => void;
  act: (x: string) => void;
}) {
  const [selected, setSelected] = useState<string[] | null>(null);
  if (kind === "categories") return <CategoryManager act={act} />;
  if (kind === "products") return <ProductManager act={act} />;
  if (kind === "consultations") return <ConsultationManager act={act} />;
  if (kind === "orders") return <OrderManager act={act} />;
  if (kind === "builder") return <Builder />;
  if (kind === "production") return <Production />;
  if (kind === "pricing") return <Pricing />;
  if (kind === "roles") return <Roles />;
  if (kind === "store" || kind === "notifications" || kind === "payments") return <Settings kind={kind} act={act} />;

  return (
    <>
      <section className="panel data-panel">
        <div className="table-tools">
          <div>
            <button className="active">
              All <b>{rows.length}</b>
            </button>
            <button>Active</button>
            <button>Draft</button>
            <button>Archived</button>
          </div>
          <div>
            <button onClick={() => setDensity(density === "compact" ? "comfortable" : "compact")}>↕</button>
            <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}>
              ☷
            </button>
            <button className={view === "cards" ? "active" : ""} onClick={() => setView("cards")}>
              ▦
            </button>
            <button>Filters ＋</button>
          </div>
        </div>

        {view === "table" ? (
          <div className="admin-table">
            <div className="tr th">
              <span>
                <input type="checkbox" />
              </span>
              {heads.map((x) => (
                <b key={x}>{x}</b>
              ))}
              <b />
            </div>
            {rows.map((row, i) => (
              <button className="tr" key={i} onClick={() => setSelected(row)}>
                <span>
                  <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                </span>
                {row.map((cell, j) =>
                  j === row.length - 1 ? (
                    <i className={`status ${statusClass(cell)}`} key={j}>
                      {cell}
                    </i>
                  ) : (
                    <span key={j}>{j === 0 ? <strong>{cell}</strong> : cell}</span>
                  )
                )}
                <em>•••</em>
              </button>
            ))}
          </div>
        ) : (
          <div className="record-cards">
            {rows.map((row, i) => (
              <article key={i}>
                <div className="record-cover">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <button>♡</button>
                </div>
                <h3>{row[0]}</h3>
                <p>
                  {row[1]} · {row[2]}
                </p>
                <i className={`status ${statusClass(row.at(-1) || "")}`}>{row.at(-1)}</i>
                <button onClick={() => setSelected(row)}>Manage →</button>
              </article>
            ))}
          </div>
        )}

        <footer className="table-footer">
          <span>
            Showing 1–{rows.length} of {rows.length}
          </span>
          <div>
            <button disabled>←</button>
            <b>1</b>
            <button>→</button>
          </div>
        </footer>
      </section>

      {selected && <RecordDetail kind={kind} row={selected} close={() => setSelected(null)} act={act} />}
    </>
  );
}

type AdminCategory = AdminCategoryPayload & { _id: string; subcategories?: AdminCategory[] };

function CategoryManager({ act }: { act: (x: string) => void }) {
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [selected, setSelected] = useState<AdminCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    adminCategoriesApi
      .getAll()
      .then((result) => {
        setItems((result.data as { categories?: AdminCategory[] })?.categories || []);
        setConnected(true);
      })
      .catch(() => {
        setConnected(false);
      });
  }, []);

  const save = async (formData: FormData) => {
    setSaving(true);
    const payload: AdminCategoryPayload = {
      name: String(formData.get("name")),
      slug: String(formData.get("slug")),
      description: String(formData.get("description")),
      displayOrder: Number(formData.get("displayOrder")),
      isActive: formData.get("isActive") === "on",
      image: { url: String(formData.get("heroImage")), alt: String(formData.get("name")) },
      storefront: {
        eyebrow: String(formData.get("eyebrow")),
        headline: String(formData.get("headline")),
        heroImage: String(formData.get("heroImage")),
        guideTitle: String(formData.get("guideTitle")),
        guideCopy: String(formData.get("guideCopy"))
      }
    };
    try {
      if (selected && selected._id !== "new") {
        const res = await adminCategoriesApi.update(selected._id, payload);
        const updated = (res.data as { category: AdminCategory }).category;
        setItems((old) => old.map((x) => (x._id === updated._id ? updated : x)));
      } else {
        const res = await adminCategoriesApi.create(payload);
        setItems((old) => [...old, (res.data as { category: AdminCategory }).category]);
      }
      act("Category and storefront published");
      setSelected(null);
    } catch (err) {
      act(err instanceof Error ? err.message : "Category could not be saved");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="category-admin-grid">
      <section className="panel category-tree">
        <div className="card-title">
          <div>
            <h3>Storefront categories</h3>
            <small>{connected ? "LIVE API CONNECTED" : "PREVIEW DATA · START BACKEND TO SYNC"}</small>
          </div>
          <button
            onClick={() =>
              setSelected({
                _id: "new",
                name: "New category",
                slug: "new-category",
                description: "",
                displayOrder: items.length + 1,
                isActive: false
              })
            }
          >
            ＋ Add category
          </button>
        </div>
        {items
          .filter((x) => !x.parentCategory)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .map((item) => (
            <button
              className={selected?._id === item._id ? "active" : ""}
              onClick={() => setSelected(item)}
              key={item._id}
            >
              <i>⠿</i>
              <span>
                <b>{item.name}</b>
                <small>
                  /products/{item.slug} · {item.subcategories?.length || 5} subcategories
                </small>
              </span>
              <em className={`status ${item.isActive ? "positive" : "neutral"}`}>
                {item.isActive ? "Published" : "Hidden"}
              </em>
              <strong>›</strong>
            </button>
          ))}
      </section>

      <section className="panel category-editor">
        {selected ? (
          <form action={save}>
            <div className="editor-head">
              <div>
                <span>STOREFRONT CATEGORY</span>
                <h2>{selected.name}</h2>
              </div>
              <button disabled={saving}>{saving ? "Saving…" : "Save & publish"}</button>
            </div>
            <div className="form-row">
              <label>
                Category name
                <input name="name" defaultValue={selected.name} required />
              </label>
              <label>
                URL handle
                <input name="slug" defaultValue={selected.slug} />
              </label>
            </div>
            <label>
              Description
              <textarea name="description" defaultValue={selected.description} />
            </label>
            <h3>LANDING PAGE HERO</h3>
            <div className="form-row">
              <label>
                Eyebrow
                <input name="eyebrow" defaultValue={selected.storefront?.eyebrow || `THE ${selected.name.toUpperCase()} COLLECTION`} />
              </label>
              <label>
                Headline
                <input name="headline" defaultValue={selected.storefront?.headline} />
              </label>
            </div>
            <label>
              Hero image URL
              <input name="heroImage" defaultValue={selected.storefront?.heroImage || selected.image?.url || "/figma/home-hero-hd.png"} />
            </label>
            <h3>EDITORIAL GUIDE</h3>
            <label>
              Guide title
              <input name="guideTitle" defaultValue={selected.storefront?.guideTitle || `The ${selected.name} Guide`} />
            </label>
            <label>
              Guide introduction
              <textarea name="guideCopy" defaultValue={selected.storefront?.guideCopy} />
            </label>
            <div className="form-row">
              <label>
                Display order
                <input name="displayOrder" type="number" defaultValue={selected.displayOrder} />
              </label>
              <label className="check">
                <input name="isActive" type="checkbox" defaultChecked={selected.isActive} /> Visible on storefront
              </label>
            </div>
          </form>
        ) : (
          <div className="category-empty">
            <span>⌘</span>
            <h2>Select a category</h2>
            <p>Edit its landing page, hero, SEO content, ordering and storefront visibility.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ProductManager({ act }: { act: (x: string) => void }) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [selected, setSelected] = useState<ProductRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    Promise.all([adminProductsApi.getAll(), adminCategoriesApi.getAll()])
      .then(([productResult, categoryResult]) => {
        setProducts(((productResult.data as { products?: ProductRecord[] })?.products) || []);
        setCategories(((categoryResult.data as { categories?: AdminCategory[] })?.categories) || []);
      })
      .catch((err) => setError(err.message || "Unable to load catalog"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async (formData: FormData) => {
    const text = (name: string) => String(formData.get(name) || "");
    const lines = (name: string) => text(name).split("\n").map((x) => x.trim()).filter(Boolean);
    const payload: Record<string, unknown> = {
      title: text("title"),
      slug: text("slug"),
      sku: text("sku"),
      shortDescription: text("shortDescription"),
      description: text("description"),
      category: text("category"),
      subCategory: text("subCategory") || null,
      basePrice: Number(text("basePrice")),
      fabricType: text("fabricType"),
      inventoryCount: Number(text("inventoryCount")),
      stockStatus: text("stockStatus"),
      isActive: formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      isCustomizable: formData.get("isCustomizable") === "on",
      standardSizes: lines("standardSizes"),
      features: lines("features"),
      materialComposition: text("materialComposition"),
      weaveConstruction: text("weaveConstruction"),
      finishingProcess: text("finishingProcess"),
      origin: text("origin"),
      weight: text("weight"),
      careInstructions: lines("careInstructions"),
      images: lines("images").map((url, index) => ({ url, alt: text("title"), isPrimary: index === 0 }))
    };
    try {
      if (selected?._id) {
        await adminProductsApi.update(selected._id, payload);
      } else {
        await adminProductsApi.create(payload);
      }
      act("Product saved to live catalog");
      setSelected(null);
      load();
    } catch (err) {
      act(err instanceof Error ? err.message : "Product could not be saved");
    }
  };

  const empty = {
    _id: "",
    title: "",
    slug: "",
    sku: "",
    shortDescription: "",
    description: "",
    category: "",
    basePrice: 0,
    fabricType: "linen",
    colors: [],
    styles: [],
    features: [],
    standardSizes: [],
    images: [],
    stockStatus: "in_stock",
    inventoryCount: 0,
    isCustomizable: false,
    isFeatured: false,
    isActive: false
  } as ProductRecord;

  const categoryId = (value: ProductRecord["category"] | ProductRecord["subCategory"]) =>
    typeof value === "string" ? value : value?._id || "";

  if (loading) return <section className="panel category-empty"><h2>Loading live catalog…</h2></section>;
  if (error) {
    return (
      <section className="panel category-empty">
        <h2>Catalog connection required</h2>
        <p>{error}. Sign in with an administrator account and ensure the API is running.</p>
        <button onClick={load}>Retry connection</button>
      </section>
    );
  }

  const parentCategories = categories.filter((item) => !item.parentCategory);
  const children = categories.filter((item) => item.parentCategory);

  return (
    <div className="category-admin-grid">
      <section className="panel category-tree">
        <div className="card-title">
          <div>
            <h3>Live products</h3>
            <small>{products.length} BACKEND RECORDS</small>
          </div>
          <button onClick={() => setSelected(empty)}>＋ Add product</button>
        </div>
        {products.map((product) => (
          <button
            className={selected?._id === product._id ? "active" : ""}
            onClick={() => setSelected(product)}
            key={product._id}
          >
            <i>◇</i>
            <span>
              <b>{product.title}</b>
              <small>
                {product.sku} · ₹{product.basePrice} · {product.inventoryCount} in stock
              </small>
            </span>
            <em className={`status ${product.isActive ? "positive" : "neutral"}`}>
              {product.isActive ? "Published" : "Draft"}
            </em>
            <strong>›</strong>
          </button>
        ))}
      </section>

      <section className="panel category-editor product-catalog-editor">
        {selected ? (
          <form action={save}>
            <div className="editor-head">
              <div>
                <span>CATALOG PRODUCT</span>
                <h2>{selected.title || "New product"}</h2>
              </div>
              <button>Save product</button>
            </div>
            <div className="form-row">
              <label>
                Product title
                <input name="title" defaultValue={selected.title} required />
              </label>
              <label>
                URL slug
                <input name="slug" defaultValue={selected.slug} />
              </label>
            </div>
            <div className="form-row">
              <label>
                SKU
                <input name="sku" defaultValue={selected.sku} />
              </label>
              <label>
                Base price
                <input name="basePrice" type="number" defaultValue={selected.basePrice} required />
              </label>
            </div>
            <label>
              Short description
              <textarea name="shortDescription" defaultValue={selected.shortDescription} />
            </label>
            <label>
              Full product description
              <textarea name="description" defaultValue={selected.description} required />
            </label>
            <h3>CATALOG PLACEMENT</h3>
            <div className="form-row">
              <label>
                Category
                <select name="category" defaultValue={categoryId(selected.category)} required>
                  <option value="">Select category</option>
                  {parentCategories.map((item) => (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Subcategory
                <select name="subCategory" defaultValue={categoryId(selected.subCategory)}>
                  <option value="">No subcategory</option>
                  {children.map((item) => (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>
                Material / fabric type
                <input name="fabricType" defaultValue={selected.fabricType} />
              </label>
              <label>
                Inventory
                <input name="inventoryCount" type="number" defaultValue={selected.inventoryCount} />
              </label>
            </div>
            <label>
              Status
              <select name="stockStatus" defaultValue={selected.stockStatus}>
                <option value="in_stock">In stock</option>
                <option value="pre_order">Pre-order</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </label>
            <h3>MEDIA & PRODUCT DATA</h3>
            <label>
              Image URLs — one per line
              <textarea name="images" defaultValue={selected.images.map((image) => image.url).join("\n")} />
            </label>
            <div className="form-row">
              <label>
                Sizes — one per line
                <textarea name="standardSizes" defaultValue={selected.standardSizes.join("\n")} />
              </label>
              <label>
                Features — one per line
                <textarea name="features" defaultValue={selected.features.join("\n")} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Material composition
                <input name="materialComposition" defaultValue={selected.materialComposition} />
              </label>
              <label>
                Weight
                <input name="weight" defaultValue={selected.weight} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Weave construction
                <input name="weaveConstruction" defaultValue={selected.weaveConstruction} />
              </label>
              <label>
                Finishing process
                <input name="finishingProcess" defaultValue={selected.finishingProcess} />
              </label>
            </div>
            <label>
              Origin
              <input name="origin" defaultValue={selected.origin} />
            </label>
            <label>
              Care instructions — one per line
              <textarea name="careInstructions" defaultValue={selected.careInstructions?.join("\n")} />
            </label>
            <div className="form-row">
              <label className="check">
                <input name="isActive" type="checkbox" defaultChecked={selected.isActive} /> Published
              </label>
              <label className="check">
                <input name="isFeatured" type="checkbox" defaultChecked={selected.isFeatured} /> Featured
              </label>
              <label className="check">
                <input name="isCustomizable" type="checkbox" defaultChecked={selected.isCustomizable} /> Customizable
              </label>
            </div>
          </form>
        ) : (
          <div className="category-empty">
            <span>◇</span>
            <h2>Select a product</h2>
            <p>Edit the exact data used by product listings and product-detail pages.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ConsultationManager({ act }: { act: (x: string) => void }) {
  const [consultations, setConsultations] = useState<AdminConsultationRecord[]>([]);
  const [selected, setSelected] = useState<AdminConsultationRecord | null>(null);
  const [tab, setTab] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled" | "archived">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");
  const [currentStatus, setCurrentStatus] = useState<string>("pending");

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const isArchived = tab === "archived" ? "true" : tab === "all" ? "all" : "false";
      const statusParam = tab === "archived" || tab === "all" ? undefined : tab;
      const res = await adminConsultationsApi.getAll({
        status: statusParam,
        isArchived: isArchived,
        search: search.trim() || undefined
      });
      const list = (res.data as { consultations?: AdminConsultationRecord[] })?.consultations || [];
      setConsultations(list);
      if (selected) {
        const refreshed = list.find((c) => c._id === selected._id);
        if (refreshed) {
          setSelected(refreshed);
          setCurrentStatus(refreshed.status);
          setInternalNotes(refreshed.internalNotes || "");
        }
      } else if (list.length > 0) {
        setSelected(list[0]);
        setCurrentStatus(list[0].status);
        setInternalNotes(list[0].internalNotes || "");
      }
    } catch (err: any) {
      console.warn("Failed to load consultations from backend:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [tab, search]);

  const selectItem = (item: AdminConsultationRecord) => {
    setSelected(item);
    setCurrentStatus(item.status);
    setInternalNotes(item.internalNotes || "");
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await adminConsultationsApi.update(selected._id, {
        status: currentStatus as any,
        internalNotes
      });
      act(`Inquiry ${selected.consultationNumber} updated`);
      loadConsultations();
    } catch (err: any) {
      act(err.message || "Failed to update inquiry");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!selected) return;
    try {
      await adminConsultationsApi.archive(selected._id);
      act(`Inquiry ${selected.consultationNumber} archived`);
      setSelected(null);
      loadConsultations();
    } catch (err: any) {
      act(err.message || "Failed to archive inquiry");
    }
  };

  const handleRestore = async () => {
    if (!selected) return;
    try {
      await adminConsultationsApi.restore(selected._id);
      act(`Inquiry ${selected.consultationNumber} restored to active queue`);
      loadConsultations();
    } catch (err: any) {
      act(err.message || "Failed to restore inquiry");
    }
  };

  return (
    <div className="consultation-admin-grid">
      {/* 1. Left List of Inquiries */}
      <section className="consult-list-panel">
        <div className="consult-list-head">
          <div className="consult-list-title-row">
            <h3>Consultation Bookings</h3>
            <span className="consult-badge-count">
              {loading ? "SYNCING…" : `${consultations.length} INQUIRIES`}
            </span>
          </div>

          <input
            type="text"
            className="consult-search-input"
            placeholder="Search by client name, email, phone, room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="consult-tabs">
            {(["all", "pending", "confirmed", "completed", "archived"] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`consult-tab-btn ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="consult-items-scroll">
          {consultations.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#858078" }}>
              <p style={{ margin: 0, fontSize: "13px" }}>No consultations found matching criteria.</p>
              <small style={{ color: "#a8a29e" }}>Client bookings from storefront will automatically appear here.</small>
            </div>
          ) : (
            consultations.map((item) => (
              <button
                key={item._id}
                type="button"
                className={`consult-item-card ${selected?._id === item._id ? "active" : ""}`}
                onClick={() => selectItem(item)}
              >
                <div className="consult-item-top">
                  <b>{item.name}</b>
                  <span className={`consult-status-badge consult-status-${item.isArchived ? "archived" : item.status}`}>
                    {item.isArchived ? "Archived" : item.status}
                  </span>
                </div>
                <div className="consult-item-meta">
                  <span>📅 {item.date}</span>
                  <span>⏰ {item.time}</span>
                  <span>📍 {item.room}</span>
                </div>
                <div style={{ fontSize: "11px", color: "#858078" }}>
                  📞 {item.phone} • {item.email}
                </div>
                {item.notes && (
                  <div className="consult-item-notes">
                    "{item.notes}"
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </section>

      {/* 2. Right Detail and Action View */}
      <section className="consult-detail-panel">
        {selected ? (
          <div>
            <div className="consult-detail-head">
              <div className="consult-detail-title-col">
                <span>{selected.consultationNumber || "ATELIER BOOKING"}</span>
                <h2>{selected.name}</h2>
              </div>
              <div className="consult-detail-actions">
                <a
                  href={`tel:${selected.phone}`}
                  className="consult-action-link"
                  title="Call client phone"
                >
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="consult-action-link"
                  title="Message client on WhatsApp"
                >
                  💬 WhatsApp
                </a>
                <a
                  href={`mailto:${selected.email}?subject=India%20Home%20Furnishings%20Consultation%20[${selected.consultationNumber}]`}
                  className="consult-action-link"
                  title="Send email"
                >
                  ✉️ Email
                </a>
              </div>
            </div>

            <div className="consult-detail-body">
              {/* Client Info Grid */}
              <div className="consult-info-grid">
                <div className="consult-info-field">
                  <label>Client Name</label>
                  <b>{selected.name}</b>
                </div>
                <div className="consult-info-field">
                  <label>Contact Phone / WhatsApp</label>
                  <b>{selected.phone}</b>
                </div>
                <div className="consult-info-field">
                  <label>Email Address</label>
                  <b>{selected.email}</b>
                </div>
                <div className="consult-info-field">
                  <label>Session Format</label>
                  <b>Phone Consultation (30 min)</b>
                </div>
                <div className="consult-info-field">
                  <label>Requested Room / Scope</label>
                  <b>{selected.room}</b>
                </div>
                <div className="consult-info-field">
                  <label>Scheduled Appointment</label>
                  <b>{selected.date} • {selected.time}</b>
                </div>
              </div>

              {/* Client Window Requirements Notes */}
              <div className="consult-notes-card">
                <h4>Client Window Requirements & Details</h4>
                <p>
                  {selected.notes && selected.notes.trim()
                    ? selected.notes
                    : "No specific window dimensions or fabric notes provided with booking. Client requested direct consultation discussion."}
                </p>
              </div>

              {/* Status & Atelier Notes Management */}
              <div className="consult-admin-form-group">
                <h4>Atelier Operations & Coordination</h4>

                <div className="consult-status-select-row">
                  <label htmlFor="consult-status-select">Inquiry Status:</label>
                  <select
                    id="consult-status-select"
                    className="consult-status-select"
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                  >
                    <option value="pending">Pending Review</option>
                    <option value="confirmed">Confirmed / Scheduled</option>
                    <option value="completed">Completed / Measured</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#44403c", marginBottom: "6px" }}>
                  Internal Atelier Notes (Measurements, fabric selections, follow-up tasks):
                </label>
                <textarea
                  className="consult-textarea"
                  placeholder="Record designer notes, fabric codes discussed, window width/drop, or next action steps..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                />

                <div className="consult-footer-actions">
                  <div>
                    {selected.isArchived ? (
                      <button
                        type="button"
                        className="consult-restore-btn"
                        onClick={handleRestore}
                      >
                        ↺ Restore to Active Queue
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="consult-archive-btn"
                        onClick={handleArchive}
                      >
                        Soft-Delete / Archive Inquiry
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    className="consult-save-btn"
                    onClick={handleUpdate}
                  >
                    {saving ? "SAVING…" : "SAVE CHANGES"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="category-empty">
            <span>💬</span>
            <h2>Select a Consultation</h2>
            <p>Review customer details, contact the client, assign status, and log measurements.</p>
          </div>
        )}
      </section>
    </div>
  );
}


function RecordDetail({ kind, row, close, act }: { kind: string; row: string[]; close: () => void; act: (x: string) => void }) {
  const isOrder = kind === "orders";
  const [status, setStatus] = useState(row.at(-1) || "Active");
  const save = () => act(`${row[0]} saved successfully`);

  return (
    <div className="record-detail-wrap">
      <div className="record-detail">
        <header className="detail-header">
          <button onClick={close}>←</button>
          <div>
            <span>{isOrder ? "ORDER" : "RECORD"}</span>
            <h2>{row[0]}</h2>
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>{status}</option>
            <option>Active</option>
            <option>Draft</option>
            <option>On hold</option>
            <option>Archived</option>
          </select>
          <button className="save" onClick={save}>
            Save
          </button>
        </header>
        <div className="detail-body">
          <main>
            <section className="detail-card">
              <h3>{row[1]}</h3>
              <p>
                Status: {status} • Total: {row[3] || "₹42,680"}
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function Builder() {
  const steps = ["Choose style", "Select fabric", "Measurements", "Mount & position", "Lining", "Control system", "Hardware", "Finishing details", "Review"];
  return (
    <div className="builder-layout">
      <section className="panel builder-list">
        <header className="panel-head">
          <h2>Drapery Customizer</h2>
          <span>9 STEPS ACTIVE</span>
        </header>
        {steps.map((x, i) => (
          <button key={x} className={i === 0 ? "active" : ""}>
            <span><b>{x}</b></span>
          </button>
        ))}
      </section>
    </div>
  );
}

function Production() {
  const columns = ["Measurement review", "Cutting", "Tailoring", "Quality control", "Ready to ship"];
  return (
    <div className="kanban">
      {columns.map((col, i) => (
        <section key={col}>
          <header>
            <span>{col}</span>
            <b>{[8, 14, 28, 9, 17][i]}</b>
          </header>
        </section>
      ))}
    </div>
  );
}

function Pricing() {
  return (
    <div className="pricing-grid">
      <section className="panel price-sidebar">
        <header className="panel-head">
          <h2>Price Books</h2>
        </header>
      </section>
    </div>
  );
}

function Roles() {
  return (
    <div className="roles-grid">
      <section className="panel role-list">
        <header className="panel-head">
          <h2>Roles & Access</h2>
        </header>
      </section>
    </div>
  );
}

function Settings({ kind, act }: { kind: string; act: (x: string) => void }) {
  return (
    <div className="settings-layout">
      <form
        className="panel settings-form"
        onSubmit={(e) => {
          e.preventDefault();
          act("Settings saved");
        }}
      >
        <div className="editor-head">
          <h2>Store Settings</h2>
          <button>Save changes</button>
        </div>
        <div className="form-row">
          <label>
            Store name
            <input defaultValue="India Home Furnishings" />
          </label>
        </div>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// Commerce Orders Management Component
// -------------------------------------------------------------
function OrderManager({ act }: { act: (msg: string) => void }) {
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "active" | "draft" | "archived">("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [counts, setCounts] = useState({ all: 0, active: 0, draft: 0, archived: 0 });
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [savingStatus, setSavingStatus] = useState(false);

  // Inspector form fields
  const [inspectorFulfillment, setInspectorFulfillment] = useState("Pending");
  const [inspectorPayment, setInspectorPayment] = useState("pending");
  const [inspectorCarrier, setInspectorCarrier] = useState("");
  const [inspectorTracking, setInspectorTracking] = useState("");
  const [inspectorNotes, setInspectorNotes] = useState("");

  // Manual Order Form State
  const [manualForm, setManualForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    street: "",
    apartment: "",
    city: "New Delhi",
    state: "DL",
    zipCode: "110001",
    country: "IN",
    orderType: "Custom Drapery",
    itemTitle: "Belgian Linen French Pinch Pleat Drapery",
    fabricName: "Pure Belgian Heritage Linen",
    fabricCode: "BHL-04",
    fabricType: "Belgian Linen",
    colorName: "Oatmeal Heritage Linen",
    width: "96",
    height: "108",
    pleatName: "Three-Finger French Pinch Pleat",
    liningName: "Blackout Thermal Interlining",
    fullnessLabel: "2.5x Custom Deluxe Fullness",
    motorization: "Somfy RTS Motorized Smart Track",
    roomLabel: "Master Bedroom Ocean Suite",
    panelConfiguration: "pair",
    quantity: 1,
    unitPrice: 45000,
    shippingFee: 0,
    taxFee: 3200,
    paymentStatus: "paid",
    fulfillmentStatus: "Production Pending",
    manufacturingNotes: ""
  });

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminOrdersApi.getAll({
        tab: tab === "all" ? undefined : tab,
        search: search.trim() || undefined,
        orderType: typeFilter === "all" ? undefined : typeFilter
      });
      const orderList = res.data?.orders || [];
      setOrders(orderList);
      if (res.counts) {
        setCounts(res.counts);
      }
      // If an order is currently selected, refresh its data
      if (selectedOrder) {
        const refreshed = orderList.find((o) => o._id === selectedOrder._id);
        if (refreshed) {
          setSelectedOrder(refreshed);
          setInspectorFulfillment(refreshed.fulfillmentStatus);
          setInspectorPayment(refreshed.paymentInfo?.paymentStatus || "pending");
          setInspectorCarrier(refreshed.carrier || "");
          setInspectorTracking(refreshed.trackingNumber || "");
          setInspectorNotes(refreshed.manufacturingNotes || "");
        }
      }
    } catch (err: any) {
      console.warn("Failed to load orders from backend:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // Auto-refresh orders every 10 seconds to catch newly raised customer orders instantly
    const interval = setInterval(() => {
      loadOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, [tab, search, typeFilter]);

  const openInspector = (order: AdminOrderRecord) => {
    setSelectedOrder(order);
    setInspectorFulfillment(order.fulfillmentStatus);
    setInspectorPayment(order.paymentInfo?.paymentStatus || "pending");
    setInspectorCarrier(order.carrier || "FedEx Custom Freight");
    setInspectorTracking(order.trackingNumber || "");
    setInspectorNotes(order.manufacturingNotes || "");
  };

  const closeInspector = () => {
    setSelectedOrder(null);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setSavingStatus(true);
    try {
      await adminOrdersApi.update(selectedOrder._id, {
        fulfillmentStatus: inspectorFulfillment as any,
        carrier: inspectorCarrier,
        trackingNumber: inspectorTracking,
        manufacturingNotes: inspectorNotes,
        paymentInfo: {
          ...selectedOrder.paymentInfo,
          paymentStatus: inspectorPayment as any
        }
      });
      act(`Order #${selectedOrder.orderNumber} updated`);
      loadOrders();
    } catch (err: any) {
      act(err.message || "Failed to update order");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleArchiveOrder = async (orderId: string, orderNumber: string) => {
    try {
      await adminOrdersApi.archive(orderId);
      act(`Order #${orderNumber} archived`);
      if (selectedOrder?._id === orderId) {
        closeInspector();
      }
      loadOrders();
    } catch (err: any) {
      act(err.message || "Failed to archive order");
    }
  };

  const handleRestoreOrder = async (orderId: string, orderNumber: string) => {
    try {
      await adminOrdersApi.restore(orderId);
      act(`Order #${orderNumber} restored`);
      if (selectedOrder?._id === orderId) {
        closeInspector();
      }
      loadOrders();
    } catch (err: any) {
      act(err.message || "Failed to restore order");
    }
  };

  const handleManualOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.customerName || !manualForm.customerEmail) {
      act("Customer name and email are required");
      return;
    }

    try {
      const subtotal = manualForm.quantity * manualForm.unitPrice;
      const total = subtotal + Number(manualForm.shippingFee) + Number(manualForm.taxFee);

      const payload: AdminCreateManualOrderPayload = {
        customerInfo: {
          name: manualForm.customerName,
          email: manualForm.customerEmail,
          phone: manualForm.customerPhone
        },
        shippingAddress: {
          fullName: manualForm.customerName,
          street: manualForm.street || "100 Luxury Avenue",
          apartment: manualForm.apartment,
          city: manualForm.city,
          state: manualForm.state,
          zipCode: manualForm.zipCode,
          country: manualForm.country,
          phone: manualForm.customerPhone
        },
        orderType: manualForm.orderType,
        items: [
          {
            itemType: "custom_curtain",
            title: manualForm.itemTitle,
            quantity: manualForm.quantity,
            unitPrice: manualForm.unitPrice,
            width: manualForm.width,
            height: manualForm.height,
            fabricName: manualForm.fabricName,
            fabricCode: manualForm.fabricCode,
            fabricType: manualForm.fabricType,
            colorName: manualForm.colorName,
            pleatName: manualForm.pleatName,
            liningName: manualForm.liningName,
            fullnessLabel: manualForm.fullnessLabel,
            motorization: manualForm.motorization,
            roomLabel: manualForm.roomLabel,
            panelConfiguration: manualForm.panelConfiguration,
            notes: manualForm.manufacturingNotes
          }
        ],
        pricing: {
          subtotal,
          shipping: Number(manualForm.shippingFee),
          tax: Number(manualForm.taxFee),
          discount: 0,
          total
        },
        paymentStatus: manualForm.paymentStatus,
        fulfillmentStatus: manualForm.fulfillmentStatus,
        manufacturingNotes: manualForm.manufacturingNotes
      };

      const res = await adminOrdersApi.createManual(payload);
      act(`Manual order #${res.data?.order?.orderNumber} created successfully!`);
      setIsManualModalOpen(false);
      loadOrders();
      if (res.data?.order) {
        openInspector(res.data.order);
      }
    } catch (err: any) {
      act(err.message || "Failed to create manual order");
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Delayed":
        return "status-delayed";
      case "Awaiting Fabric":
        return "status-awaiting-fabric";
      case "Production Pending":
        return "status-production-pending";
      case "Payment Pending":
        return "status-payment-pending";
      case "Sizing Confirmation":
        return "status-sizing-confirmation";
      case "Manufacturing":
        return "status-manufacturing";
      case "Shipped":
        return "status-shipped";
      case "Delivered":
        return "status-delivered";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "status-archived";
    }
  };

  const formatPrice = (amount: number) => {
    return `₹${(amount || 0).toLocaleString("en-IN")}`;
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="orders-admin-container">
      {/* 1. Header Toolbar with Filters & View Switchers */}
      <section className="orders-toolbar-card">
        <div className="orders-tab-group">
          <button
            type="button"
            className={`order-tab-btn ${tab === "all" ? "active" : ""}`}
            onClick={() => setTab("all")}
          >
            All <span className="order-tab-count">{counts.all || orders.length}</span>
          </button>
          <button
            type="button"
            className={`order-tab-btn ${tab === "active" ? "active" : ""}`}
            onClick={() => setTab("active")}
          >
            Active
          </button>
          <button
            type="button"
            className={`order-tab-btn ${tab === "draft" ? "active" : ""}`}
            onClick={() => setTab("draft")}
          >
            Draft
          </button>
          <button
            type="button"
            className={`order-tab-btn ${tab === "archived" ? "active" : ""}`}
            onClick={() => setTab("archived")}
          >
            Archived
          </button>
        </div>

        <div className="orders-tools-right">
          <div className="order-search-box">
            <span className="order-search-icon">🔍</span>
            <input
              type="text"
              className="order-search-input"
              placeholder="Search orders, clients, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="orders-filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Custom Drapery">Custom Drapery</option>
            <option value="Roman Shades">Roman Shades</option>
            <option value="Curtains & Drapes">Curtains & Drapes</option>
            <option value="Bedding Set">Bedding Set</option>
            <option value="Swatch Order">Swatch Order</option>
          </select>

          <button
            type="button"
            className="order-primary-btn"
            style={{ padding: "7px 16px" }}
            onClick={() => setIsManualModalOpen(true)}
          >
            ＋ NEW MANUAL ORDER
          </button>
        </div>
      </section>

      {/* 2. Main Orders Table */}
      <section className="orders-table-wrapper">
        <table className="orders-data-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  checked={orders.length > 0 && selectedIds.length === orders.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Order</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ width: "50px", textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "#8c827a" }}>
                  Synchronizing Atelier Orders…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "#8c827a" }}>
                  No orders found matching the selected criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isSelected = selectedIds.includes(order._id);
                const orderNum = order.orderNumber.startsWith("IHF-")
                  ? `#${order.orderNumber}`
                  : `#IHF-${order.orderNumber}`;

                return (
                  <tr
                    key={order._id}
                    onClick={() => openInspector(order)}
                    style={{ background: isSelected ? "#fcfaf7" : undefined }}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(order._id)}
                      />
                    </td>
                    <td>
                      <span className="order-num-link">{orderNum}</span>
                    </td>
                    <td>
                      <div className="order-customer-cell">
                        <span className="order-customer-name">{order.customerInfo?.name || "Client"}</span>
                        <span className="order-customer-sub">{order.customerInfo?.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="order-type-cell">
                        {order.orderType || (order.items?.[0]?.itemType === "custom_curtain" ? "Custom Drapery" : "Curtains & Drapes")}
                      </span>
                    </td>
                    <td>
                      <span className="order-total-cell">{formatPrice(order.pricing?.total)}</span>
                    </td>
                    <td>
                      <span className={`order-status-pill ${getStatusClass(order.fulfillmentStatus)}`}>
                        {order.fulfillmentStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="order-row-action-btn"
                        onClick={() => openInspector(order)}
                        title="View order details"
                      >
                        •••
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table Footer with pagination info */}
        <div className="orders-table-footer">
          <span>
            Showing 1–{orders.length} of {counts.all || orders.length} orders
          </span>
          <div className="orders-pagination">
            <button type="button" className="orders-page-btn" disabled>
              ←
            </button>
            <button type="button" className="orders-page-btn active">
              1
            </button>
            <button type="button" className="orders-page-btn" disabled>
              →
            </button>
          </div>
        </div>
      </section>

      {/* 3. Deep-Dive Order Inspector Modal / Drawer */}
      {selectedOrder && (
        <div className="order-modal-backdrop" onClick={closeInspector}>
          <div className="order-inspector-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="order-inspector-header">
              <div className="order-inspector-header-left">
                <h2 className="order-inspector-title">
                  <span>Order</span>
                  <span>{selectedOrder.orderNumber.startsWith("IHF-") ? `#${selectedOrder.orderNumber}` : `#IHF-${selectedOrder.orderNumber}`}</span>
                </h2>
                <span className={`order-status-pill ${getStatusClass(selectedOrder.fulfillmentStatus)}`}>
                  {selectedOrder.fulfillmentStatus}
                </span>
                <span
                  className="order-status-pill"
                  style={{
                    background: selectedOrder.paymentInfo?.paymentStatus === "paid" ? "#ecfdf5" : "#fef9ee",
                    color: selectedOrder.paymentInfo?.paymentStatus === "paid" ? "#047857" : "#b45309",
                    border: "1px solid rgba(0,0,0,0.06)"
                  }}
                >
                  Payment: {(selectedOrder.paymentInfo?.paymentStatus || "pending").toUpperCase()}
                </span>
              </div>
              <button
                type="button"
                className="order-modal-close-btn"
                style={{ border: "none", fontSize: "20px", padding: "4px 8px" }}
                onClick={closeInspector}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="order-inspector-body">
              {/* Customer & Delivery Section */}
              <div className="order-inspector-section">
                <h3 className="order-section-title">Customer & Delivery Snapshot</h3>
                <div className="order-grid-3col">
                  <div className="order-info-item">
                    <span className="order-info-label">Customer Name</span>
                    <span className="order-info-value">{selectedOrder.customerInfo?.name}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="order-info-label">Email Address</span>
                    <span className="order-info-value">{selectedOrder.customerInfo?.email}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="order-info-label">Contact Phone</span>
                    <span className="order-info-value">{selectedOrder.customerInfo?.phone || "—"}</span>
                  </div>
                </div>

                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #ede8de" }}>
                  <div className="order-info-item">
                    <span className="order-info-label">Shipping Address</span>
                    <span className="order-info-value">
                      {selectedOrder.shippingAddress?.fullName && `${selectedOrder.shippingAddress.fullName}, `}
                      {selectedOrder.shippingAddress?.street}
                      {selectedOrder.shippingAddress?.apartment && `, ${selectedOrder.shippingAddress.apartment}`}
                      {`, ${selectedOrder.shippingAddress?.city}, ${selectedOrder.shippingAddress?.state} ${selectedOrder.shippingAddress?.zipCode}, ${selectedOrder.shippingAddress?.country || "IN"}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items & Customizer Add-On Specs Breakdown */}
              <div className="order-inspector-section">
                <h3 className="order-section-title">Purchased Items & Made-to-Measure Specifications</h3>
                {selectedOrder.items?.map((item, index) => {
                  const specs = item.customCurtainSpecs;
                  return (
                    <div key={item._id || index} className="order-item-spec-box">
                      <div className="order-item-topline">
                        <div>
                          <div className="order-item-title">{item.title}</div>
                          <small style={{ color: "#78716c" }}>
                            Qty: <b>{item.quantity}</b> • Unit Price: {formatPrice(item.unitPrice)}
                          </small>
                        </div>
                        <div className="order-item-price-tag">{formatPrice(item.totalPrice)}</div>
                      </div>

                      {specs && (
                        <div className="order-specs-chips-grid">
                          {specs.roomLabel && (
                            <div className="order-spec-chip">
                              <span className="order-chip-k">Room / Location</span>
                              <span className="order-chip-v">{specs.roomLabel}</span>
                            </div>
                          )}
                          <div className="order-spec-chip">
                            <span className="order-chip-k">Dimensions (W × H)</span>
                            <span className="order-chip-v">
                              {specs.width?.formatted || `${specs.width?.decimal || specs.width?.raw}"`} ×{" "}
                              {specs.height?.formatted || `${specs.height?.decimal || specs.height?.raw}"`}
                            </span>
                          </div>
                          {specs.fabricName && (
                            <div className="order-spec-chip">
                              <span className="order-chip-k">Fabric & Code</span>
                              <span className="order-chip-v">
                                {specs.fabricName} {specs.fabricCode ? `[${specs.fabricCode}]` : ""}
                              </span>
                            </div>
                          )}
                          {specs.color?.name && (
                            <div className="order-spec-chip">
                              <span className="order-chip-k">Color / Tone</span>
                              <span className="order-chip-v">{specs.color.name}</span>
                            </div>
                          )}
                          {specs.pleatHeader?.name && (
                            <div className="order-spec-chip">
                              <span className="order-chip-k">Pleat Style</span>
                              <span className="order-chip-v">{specs.pleatHeader.name}</span>
                            </div>
                          )}
                          {specs.lining?.name && (
                            <div className="order-spec-chip">
                              <span className="order-chip-k">Lining</span>
                              <span className="order-chip-v">{specs.lining.name}</span>
                            </div>
                          )}
                          {specs.fullness?.label && (
                            <div className="order-spec-chip">
                              <span className="order-chip-k">Fullness Ratio</span>
                              <span className="order-chip-v">{specs.fullness.label}</span>
                            </div>
                          )}
                          <div className="order-spec-chip">
                            <span className="order-chip-k">Motorization / Hardware</span>
                            <span className="order-chip-v">{specs.motorization || "Manual Architectural Baton"}</span>
                          </div>
                          <div className="order-spec-chip">
                            <span className="order-chip-k">Panel Configuration</span>
                            <span className="order-chip-v">
                              {specs.panelConfiguration === "pair" ? "Pair (2 Panels)" : "Single Panel"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Financials Breakdown */}
              <div className="order-inspector-section">
                <h3 className="order-section-title">Pricing & Financial Summary</h3>
                <div className="order-grid-2col">
                  <div className="order-info-item">
                    <span className="order-info-label">Subtotal</span>
                    <span className="order-info-value">{formatPrice(selectedOrder.pricing?.subtotal)}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="order-info-label">Shipping & Handling</span>
                    <span className="order-info-value">
                      {selectedOrder.pricing?.shipping > 0
                        ? formatPrice(selectedOrder.pricing.shipping)
                        : "Complimentary Delivery"}
                    </span>
                  </div>
                  <div className="order-info-item">
                    <span className="order-info-label">Estimated Tax (GST/VAT)</span>
                    <span className="order-info-value">{formatPrice(selectedOrder.pricing?.tax)}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="order-info-label" style={{ fontWeight: 700, color: "#1c1917" }}>
                      Grand Total
                    </span>
                    <span className="order-info-value" style={{ fontSize: "16px", fontWeight: 700, color: "#8f7642" }}>
                      {formatPrice(selectedOrder.pricing?.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Atelier Fulfillment & Logistics Management */}
              <div className="order-inspector-section">
                <h3 className="order-section-title">Atelier Status & Logistics Controls</h3>
                <div className="order-grid-2col">
                  <div className="manual-field-group">
                    <label className="manual-field-label">Fulfillment Status</label>
                    <select
                      className="manual-select"
                      value={inspectorFulfillment}
                      onChange={(e) => setInspectorFulfillment(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Payment Pending">Payment Pending</option>
                      <option value="Sizing Confirmation">Sizing Confirmation</option>
                      <option value="Awaiting Fabric">Awaiting Fabric</option>
                      <option value="Production Pending">Production Pending</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Quality Check">Quality Check</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="manual-field-group">
                    <label className="manual-field-label">Payment Status</label>
                    <select
                      className="manual-select"
                      value={inspectorPayment}
                      onChange={(e) => setInspectorPayment(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="authorized">Authorized</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="order-grid-2col" style={{ marginTop: "12px" }}>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Carrier</label>
                    <input
                      type="text"
                      className="manual-input"
                      value={inspectorCarrier}
                      onChange={(e) => setInspectorCarrier(e.target.value)}
                      placeholder="e.g. FedEx Custom Freight, BlueDart Express"
                    />
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Tracking Number</label>
                    <input
                      type="text"
                      className="manual-input"
                      value={inspectorTracking}
                      onChange={(e) => setInspectorTracking(e.target.value)}
                      placeholder="e.g. BD-IN-98734201"
                    />
                  </div>
                </div>

                <div className="manual-field-group" style={{ marginTop: "12px" }}>
                  <label className="manual-field-label">Atelier Manufacturing Notes</label>
                  <textarea
                    className="manual-textarea"
                    value={inspectorNotes}
                    onChange={(e) => setInspectorNotes(e.target.value)}
                    placeholder="Enter internal manufacturing notes, fabric mill updates, or sizing confirmation log..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="order-inspector-footer">
              <div>
                {selectedOrder.isArchived ? (
                  <button
                    type="button"
                    className="order-restore-btn"
                    onClick={() => handleRestoreOrder(selectedOrder._id, selectedOrder.orderNumber)}
                  >
                    Restore Order
                  </button>
                ) : (
                  <button
                    type="button"
                    className="order-danger-btn"
                    onClick={() => handleArchiveOrder(selectedOrder._id, selectedOrder.orderNumber)}
                  >
                    Archive Order
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" className="order-modal-close-btn" onClick={closeInspector}>
                  Close
                </button>
                <button
                  type="button"
                  className="order-primary-btn"
                  onClick={handleUpdateOrder}
                  disabled={savingStatus}
                >
                  {savingStatus ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. "+ New Manual Order" Modal with Full Customizer Add-On Options */}
      {isManualModalOpen && (
        <div className="order-modal-backdrop" onClick={() => setIsManualModalOpen(false)}>
          <div
            className="order-inspector-card"
            style={{ maxWidth: "800px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order-inspector-header">
              <h2 className="order-inspector-title">Create Manual Atelier Order</h2>
              <button
                type="button"
                className="order-modal-close-btn"
                style={{ border: "none", fontSize: "20px" }}
                onClick={() => setIsManualModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleManualOrderSubmit} className="order-inspector-body">
              {/* Customer Details */}
              <div className="order-inspector-section">
                <h3 className="order-section-title">Client Information & Shipping Address</h3>
                <div className="order-grid-3col">
                  <div className="manual-field-group">
                    <label className="manual-field-label">Client Full Name *</label>
                    <input
                      type="text"
                      required
                      className="manual-input"
                      value={manualForm.customerName}
                      onChange={(e) => setManualForm({ ...manualForm, customerName: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                    />
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="manual-input"
                      value={manualForm.customerEmail}
                      onChange={(e) => setManualForm({ ...manualForm, customerEmail: e.target.value })}
                      placeholder="e.g. priya@luxuryestate.in"
                    />
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Phone Number</label>
                    <input
                      type="text"
                      className="manual-input"
                      value={manualForm.customerPhone}
                      onChange={(e) => setManualForm({ ...manualForm, customerPhone: e.target.value })}
                      placeholder="+91 98111 22334"
                    />
                  </div>
                </div>

                <div className="order-grid-2col" style={{ marginTop: "12px" }}>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Street Address</label>
                    <input
                      type="text"
                      className="manual-input"
                      value={manualForm.street}
                      onChange={(e) => setManualForm({ ...manualForm, street: e.target.value })}
                      placeholder="Penthouse 4B, The Magnolias"
                    />
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">City & State</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <input
                        type="text"
                        className="manual-input"
                        value={manualForm.city}
                        onChange={(e) => setManualForm({ ...manualForm, city: e.target.value })}
                        placeholder="City"
                      />
                      <input
                        type="text"
                        className="manual-input"
                        value={manualForm.state}
                        onChange={(e) => setManualForm({ ...manualForm, state: e.target.value })}
                        placeholder="State / Province"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Customizer Specs & Add-Ons Configuration */}
              <div className="order-inspector-section">
                <h3 className="order-section-title">Item Specifications & Atelier Add-Ons</h3>

                <div className="order-grid-2col">
                  <div className="manual-field-group">
                    <label className="manual-field-label">Order Type</label>
                    <select
                      className="manual-select"
                      value={manualForm.orderType}
                      onChange={(e) => setManualForm({ ...manualForm, orderType: e.target.value })}
                    >
                      <option value="Custom Drapery">Custom Drapery</option>
                      <option value="Roman Shades">Roman Shades</option>
                      <option value="Curtains & Drapes">Curtains & Drapes</option>
                      <option value="Bedding Set">Bedding Set</option>
                      <option value="Swatch Order">Swatch Order</option>
                    </select>
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Room / Window Label</label>
                    <input
                      type="text"
                      className="manual-input"
                      value={manualForm.roomLabel}
                      onChange={(e) => setManualForm({ ...manualForm, roomLabel: e.target.value })}
                      placeholder="e.g. Master Bedroom Ocean Suite"
                    />
                  </div>
                </div>

                <div className="order-grid-2col" style={{ marginTop: "10px" }}>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Item Title</label>
                    <input
                      type="text"
                      className="manual-input"
                      value={manualForm.itemTitle}
                      onChange={(e) => setManualForm({ ...manualForm, itemTitle: e.target.value })}
                    />
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Fabric & Code</label>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "8px" }}>
                      <input
                        type="text"
                        className="manual-input"
                        value={manualForm.fabricName}
                        onChange={(e) => setManualForm({ ...manualForm, fabricName: e.target.value })}
                        placeholder="Fabric Name"
                      />
                      <input
                        type="text"
                        className="manual-input"
                        value={manualForm.fabricCode}
                        onChange={(e) => setManualForm({ ...manualForm, fabricCode: e.target.value })}
                        placeholder="Code"
                      />
                    </div>
                  </div>
                </div>

                {/* Measurements & Options */}
                <div className="order-grid-3col" style={{ marginTop: "10px" }}>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Width (Inches)</label>
                    <input
                      type="text"
                      className="manual-input"
                      value={manualForm.width}
                      onChange={(e) => setManualForm({ ...manualForm, width: e.target.value })}
                    />
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Height / Drop (Inches)</label>
                    <input
                      type="text"
                      className="manual-input"
                      value={manualForm.height}
                      onChange={(e) => setManualForm({ ...manualForm, height: e.target.value })}
                    />
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Panel Configuration</label>
                    <select
                      className="manual-select"
                      value={manualForm.panelConfiguration}
                      onChange={(e) => setManualForm({ ...manualForm, panelConfiguration: e.target.value })}
                    >
                      <option value="pair">Pair (2 Panels)</option>
                      <option value="single_panel">Single Panel</option>
                    </select>
                  </div>
                </div>

                <div className="order-grid-3col" style={{ marginTop: "10px" }}>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Pleat Header Style</label>
                    <select
                      className="manual-select"
                      value={manualForm.pleatName}
                      onChange={(e) => setManualForm({ ...manualForm, pleatName: e.target.value })}
                    >
                      <option value="Three-Finger French Pinch Pleat">French Pinch Pleat</option>
                      <option value="Two-Finger Euro Pleat">Euro Tailored Pleat</option>
                      <option value="Contemporary Ripplefold Wave">Ripplefold Wave</option>
                      <option value="Classical Goblet Pleat">Goblet Pleat</option>
                      <option value="Flat Waterfall Roman Fold">Flat Roman Shade Fold</option>
                    </select>
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Lining Choice</label>
                    <select
                      className="manual-select"
                      value={manualForm.liningName}
                      onChange={(e) => setManualForm({ ...manualForm, liningName: e.target.value })}
                    >
                      <option value="Standard Privacy Lining">Privacy Sateen Lining</option>
                      <option value="Blackout Thermal Interlining">Blackout Thermal Interlining</option>
                      <option value="Flannel Acoustic Interlined Luxury">Flannel Acoustic Interlined</option>
                      <option value="Sheer Unlined">Unlined Pure Sheer</option>
                    </select>
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Fullness Ratio</label>
                    <select
                      className="manual-select"
                      value={manualForm.fullnessLabel}
                      onChange={(e) => setManualForm({ ...manualForm, fullnessLabel: e.target.value })}
                    >
                      <option value="2.0x Standard Fullness">2.0x Standard Fullness</option>
                      <option value="2.5x Custom Deluxe Fullness">2.5x Custom Deluxe Fullness</option>
                      <option value="1.5x Flat Tailored">1.5x Tailored Fullness</option>
                    </select>
                  </div>
                </div>

                <div className="manual-field-group" style={{ marginTop: "10px" }}>
                  <label className="manual-field-label">Motorization & Hardware Add-On</label>
                  <select
                    className="manual-select"
                    value={manualForm.motorization}
                    onChange={(e) => setManualForm({ ...manualForm, motorization: e.target.value })}
                  >
                    <option value="Manual Architectural Baton">Manual Architectural Baton</option>
                    <option value="Somfy RTS Motorized Smart Track">Somfy RTS Motorized Smart Track</option>
                    <option value="Lutron Palladiom Wire-Free Motor">Lutron Palladiom Wire-Free Motor</option>
                    <option value="Cordless Precision Spring Roller">Cordless Precision Spring Roller</option>
                    <option value="Burnished Brass Decorative Finial Rod">Burnished Brass Decorative Finial Rod</option>
                  </select>
                </div>
              </div>

              {/* Financials & Status */}
              <div className="order-inspector-section">
                <h3 className="order-section-title">Pricing & Fulfillment Workflow</h3>
                <div className="order-grid-3col">
                  <div className="manual-field-group">
                    <label className="manual-field-label">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      className="manual-input"
                      value={manualForm.quantity}
                      onChange={(e) => setManualForm({ ...manualForm, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    />
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Unit Price (₹)</label>
                    <input
                      type="number"
                      className="manual-input"
                      value={manualForm.unitPrice}
                      onChange={(e) => setManualForm({ ...manualForm, unitPrice: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Estimated Tax (₹)</label>
                    <input
                      type="number"
                      className="manual-input"
                      value={manualForm.taxFee}
                      onChange={(e) => setManualForm({ ...manualForm, taxFee: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="order-grid-2col" style={{ marginTop: "12px" }}>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Fulfillment Status</label>
                    <select
                      className="manual-select"
                      value={manualForm.fulfillmentStatus}
                      onChange={(e) => setManualForm({ ...manualForm, fulfillmentStatus: e.target.value })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Payment Pending">Payment Pending</option>
                      <option value="Sizing Confirmation">Sizing Confirmation</option>
                      <option value="Awaiting Fabric">Awaiting Fabric</option>
                      <option value="Production Pending">Production Pending</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </div>
                  <div className="manual-field-group">
                    <label className="manual-field-label">Payment Status</label>
                    <select
                      className="manual-select"
                      value={manualForm.paymentStatus}
                      onChange={(e) => setManualForm({ ...manualForm, paymentStatus: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="authorized">Authorized</option>
                    </select>
                  </div>
                </div>

                <div className="manual-field-group" style={{ marginTop: "12px" }}>
                  <label className="manual-field-label">Manufacturing / Internal Notes</label>
                  <textarea
                    className="manual-textarea"
                    value={manualForm.manufacturingNotes}
                    onChange={(e) => setManualForm({ ...manualForm, manufacturingNotes: e.target.value })}
                    placeholder="Add bespoke instructions for atelier artisans..."
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="order-modal-close-btn"
                  onClick={() => setIsManualModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="order-primary-btn">
                  Create & Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
