"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import "./order-tracking.css";

interface TrackingTimelineStep {
  label: string;
  date: string;
  done: boolean;
  active?: boolean;
}

interface TrackingData {
  orderNumber: string;
  orderDate: string;
  status: "processing" | "in_transit" | "delivered";
  statusText: string;
  carrier: string;
  trackingNumber: string;
  items: string;
  estimatedDelivery: string;
  destination: string;
  steps: TrackingTimelineStep[];
}

const DEMO_ORDERS: Record<string, TrackingData> = {
  "IHF-78291": {
    orderNumber: "#IHF-78291",
    orderDate: "Sep 28, 2026",
    status: "delivered",
    statusText: "Delivered",
    carrier: "FedEx Custom Express",
    trackingNumber: "FEDEX-782910482",
    items: "Tailored Belgian Flax Linen Draperies (Pair 96″ × 108″)",
    estimatedDelivery: "Delivered on Oct 4, 2026",
    destination: "New York, NY 10012, USA",
    steps: [
      { label: "Order Confirmed & Atelier Verification", date: "Sep 28, 2026", done: true },
      { label: "Jaipur Handloom Weaving & Fabric Cut", date: "Sep 30, 2026", done: true },
      { label: "Master Tailoring & Hand Pleating", date: "Oct 1, 2026", done: true },
      { label: "12-Point Drape & Quality Audit", date: "Oct 2, 2026", done: true },
      { label: "Delivered via Express White-Glove", date: "Oct 4, 2026", done: true, active: true }
    ]
  },
  "IHF-10432": {
    orderNumber: "#IHF-10432",
    orderDate: "Oct 1, 2026",
    status: "in_transit",
    statusText: "In Transit",
    carrier: "FedEx Atelier Priority",
    trackingNumber: "FEDEX-104329184",
    items: "Bespoke Flat Roman Shade (Privacy Lining, Soft Ecru)",
    estimatedDelivery: "Thursday, Oct 8, 2026",
    destination: "Los Angeles, CA 90210, USA",
    steps: [
      { label: "Order Confirmed & Atelier Verification", date: "Oct 1, 2026", done: true },
      { label: "Jaipur Handloom Weaving & Fabric Cut", date: "Oct 3, 2026", done: true },
      { label: "Master Tailoring & Hand Pleating", date: "Oct 4, 2026", done: true },
      { label: "12-Point Drape & Quality Audit", date: "Oct 5, 2026", done: true, active: true },
      { label: "Dispatched via Express Courier", date: "Expected Oct 8, 2026", done: false }
    ]
  },
  "IHF-54019": {
    orderNumber: "#IHF-54019",
    orderDate: "Oct 4, 2026",
    status: "processing",
    statusText: "Crafting in Atelier",
    carrier: "FedEx Custom Express",
    trackingNumber: "FEDEX-540198273",
    items: "Silk Velvet Custom Drapes (100% Blackout, Warm Amber)",
    estimatedDelivery: "Monday, Oct 12, 2026",
    destination: "Chicago, IL 60611, USA",
    steps: [
      { label: "Order Confirmed & Atelier Verification", date: "Oct 4, 2026", done: true },
      { label: "Jaipur Handloom Weaving & Fabric Cut", date: "Oct 5, 2026", done: true, active: true },
      { label: "Master Tailoring & Hand Pleating", date: "In Progress", done: false },
      { label: "12-Point Drape & Quality Audit", date: "Upcoming", done: false },
      { label: "Dispatched via Express Courier", date: "Upcoming", done: false }
    ]
  }
};

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performSearch = (queryNum: string, code: string) => {
    const cleanNum = queryNum.trim().toUpperCase().replace("#", "");
    if (!cleanNum) {
      setError("Please enter your Order Number.");
      return;
    }

    setSearching(true);
    setError(null);

    setTimeout(() => {
      setSearching(false);
      // Check demo keys
      const matchedKey = Object.keys(DEMO_ORDERS).find((k) =>
        cleanNum.includes(k) || k.includes(cleanNum)
      );

      if (matchedKey) {
        setResult(DEMO_ORDERS[matchedKey]);
      } else {
        // Fallback dynamic tracking generation
        setResult({
          orderNumber: `#${cleanNum}`,
          orderDate: "Recent Order",
          status: "in_transit",
          statusText: "In Transit",
          carrier: "FedEx Atelier Priority",
          trackingNumber: `FEDEX-${Math.floor(100000000 + Math.random() * 900000000)}`,
          items: "Custom Bespoke Window Treatments",
          estimatedDelivery: "3 to 5 Business Days",
          destination: code.trim() ? `Zip Code: ${code.trim()}, USA` : "United States",
          steps: [
            { label: "Order Confirmed & Atelier Verification", date: "Completed", done: true },
            { label: "Jaipur Handloom Weaving & Fabric Cut", date: "Completed", done: true },
            { label: "Master Tailoring & Hand Pleating", date: "In Progress", done: true, active: true },
            { label: "12-Point Drape & Quality Audit", date: "Upcoming", done: false },
            { label: "Dispatched via Express Courier", date: "Upcoming", done: false }
          ]
        });
      }
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(orderNumber, postalCode);
  };

  const handleQuickTest = (code: string) => {
    setOrderNumber(code);
    performSearch(code, "10012");
  };

  return (
    <div className="track-page">
      <Header />

      <main className="track-main">
        <div className="track-container">
          {/* 1. Header Hero */}
          <div className="track-header">
            <span className="track-eyebrow">ATELIER FULFILLMENT &amp; DISPATCH</span>
            <h1 className="track-title">Track Your Order</h1>
            <p className="track-subtitle">
              Enter your Order Number and Shipping Zip / Postal Code to check real-time tailoring, quality inspection, and express carrier delivery updates.
            </p>
          </div>

          {/* 2. Main 2-Column Grid */}
          <div className="track-grid">
            {/* Left Card: Input Form */}
            <div className="track-card">
              <div className="track-card-header">
                <h2 className="track-card-title">Order Lookup</h2>
                <p className="track-card-desc">
                  Tracking is updated in real time as your pieces move through our master atelier.
                </p>
              </div>

              {error && (
                <div style={{ padding: "10px 14px", background: "#fef2f2", color: "#991b1b", borderRadius: "6px", fontSize: "12.5px", marginBottom: "16px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="track-form">
                <div className="track-field-group">
                  <label htmlFor="orderNumberInput" className="track-label">
                    Order Number *
                  </label>
                  <input
                    id="orderNumberInput"
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. #IHF-78291 or 10432"
                    className="track-input"
                  />
                </div>

                <div className="track-field-group">
                  <label htmlFor="postalCodeInput" className="track-label">
                    Shipping Zip / Postal Code (Optional)
                  </label>
                  <input
                    id="postalCodeInput"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 10012 or 90210"
                    className="track-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={searching}
                  className="track-submit-btn"
                >
                  {searching ? "SEARCHING DISPATCH…" : "TRACK ORDER →"}
                </button>
              </form>

              {/* Quick Sample Orders */}
              <div className="track-quick-test">
                <span className="track-quick-label">Try a Sample Order:</span>
                <div className="track-quick-tags">
                  <button
                    type="button"
                    className="track-quick-pill"
                    onClick={() => handleQuickTest("IHF-78291")}
                  >
                    #IHF-78291 (Delivered)
                  </button>
                  <button
                    type="button"
                    className="track-quick-pill"
                    onClick={() => handleQuickTest("IHF-10432")}
                  >
                    #IHF-10432 (In Transit)
                  </button>
                  <button
                    type="button"
                    className="track-quick-pill"
                    onClick={() => handleQuickTest("IHF-54019")}
                  >
                    #IHF-54019 (Tailoring)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card: Status & Timeline */}
            <div>
              {result ? (
                <div className="track-result-card">
                  <div className="track-result-header">
                    <div>
                      <span style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#8f7642", fontWeight: 700 }}>
                        ORDER DETAILS
                      </span>
                      <h3 className="track-result-order-num">{result.orderNumber}</h3>
                    </div>
                    <span className={`track-status-pill ${result.status}`}>
                      ● {result.statusText}
                    </span>
                  </div>

                  {/* Summary Details */}
                  <div className="track-meta-grid">
                    <div className="track-meta-item">
                      <span className="track-meta-label">Items</span>
                      <span className="track-meta-val">{result.items}</span>
                    </div>

                    <div className="track-meta-item">
                      <span className="track-meta-label">Carrier &amp; Tracking</span>
                      <span className="track-meta-val" style={{ color: "#8f7642", fontWeight: 600 }}>
                        {result.carrier} · {result.trackingNumber}
                      </span>
                    </div>

                    <div className="track-meta-item">
                      <span className="track-meta-label">Order Date</span>
                      <span className="track-meta-val">{result.orderDate}</span>
                    </div>

                    <div className="track-meta-item">
                      <span className="track-meta-label">Estimated Delivery</span>
                      <span className="track-meta-val">{result.estimatedDelivery}</span>
                    </div>
                  </div>

                  {/* Timeline Stages */}
                  <h4 className="track-timeline-title">Fulfillment &amp; Courier Stages</h4>
                  <div className="track-timeline">
                    {result.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`track-timeline-step ${step.done ? "is-done" : ""} ${step.active ? "is-active" : ""}`}
                      >
                        <div className="track-step-dot" aria-hidden="true">
                          {step.done ? "✓" : idx + 1}
                        </div>
                        <div className="track-step-name">{step.label}</div>
                        <div className="track-step-date">{step.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="track-empty-card">
                  <div className="track-empty-icon" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </div>
                  <h3 className="track-empty-title">Awaiting Order Number</h3>
                  <p className="track-empty-desc">
                    Enter your Order Number on the left to review your live fulfillment progress, master tailoring milestones, and FedEx dispatch tracking.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Concierge Support Bar */}
          <div className="track-support-bar">
            <div className="track-support-text">
              <strong>Need personal concierge assistance with your order?</strong>
              <br />
              Our client care specialists can look up your dimensions, fabric status, and dispatch schedule.
            </div>
            <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
              <a href="tel:+18005550199" className="track-support-link">
                📞 +1 (800) 555-0199
              </a>
              <Link href="/contact" className="track-support-link">
                CONTACT CONCIERGE →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
