"use client";

import React, { useState } from "react";
import "./delivery-estimate.css";

export function DeliveryEstimateSection() {
  const [pincode, setPincode] = useState("90210");
  const [estimateResult, setEstimateResult] = useState<{
    city: string;
    dispatchDays: string;
    deliveryDates: string;
  }>({
    city: "Los Angeles Area",
    dispatchDays: "24-48 Hours",
    deliveryDates: "Oct 8 - Oct 10"
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  // Accordion drop-down state matching reference (Made to Measure open by default, others collapsible)
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    freeShipping: false,
    finalSale: false,
    madeToMeasure: true
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = pincode.trim();
    if (!cleanCode || cleanCode.length < 4) {
      setErrorMsg("Please enter a valid pincode or zip code.");
      return;
    }

    setIsChecking(true);
    setErrorMsg("");

    setTimeout(() => {
      const now = new Date();
      const minDate = new Date(now);
      minDate.setDate(now.getDate() + 3);
      const maxDate = new Date(now);
      maxDate.setDate(now.getDate() + 5);

      const monthFormat = { month: "short", day: "numeric" } as const;
      const minStr = minDate.toLocaleDateString("en-US", monthFormat);
      const maxStr = maxDate.toLocaleDateString("en-US", monthFormat);

      let regionName = "Your Location";
      if (cleanCode.startsWith("100") || cleanCode.startsWith("101")) regionName = "New York Metro Area";
      else if (cleanCode.startsWith("900") || cleanCode.startsWith("902")) regionName = "Los Angeles Area";
      else if (cleanCode.startsWith("606")) regionName = "Chicago Region";
      else if (cleanCode.startsWith("110")) regionName = "Delhi NCR Region";
      else if (cleanCode.startsWith("400")) regionName = "Mumbai Region";
      else regionName = `Pincode Zone (${cleanCode})`;

      setEstimateResult({
        city: regionName,
        dispatchDays: "24-48 Hours",
        deliveryDates: `${minStr} - ${maxStr}`
      });
    }, 350);
  };

  const handleResetPincode = () => {
    setPincode("");
    setEstimateResult(null);
    setErrorMsg("");
    setTimeout(() => {
      const inputEl = document.querySelector(".pincode-field") as HTMLInputElement;
      if (inputEl) inputEl.focus();
    }, 50);
  };

  return (
    <section className="delivery-estimate-wrapper" id="delivery-estimate">
      <div className="delivery-estimate-container">
        {/* LEFT COLUMN: PINCODE ESTIMATOR */}
        <div className="delivery-left-col">
          <h2 className="delivery-section-title">Delivery Estimate</h2>

          <form onSubmit={handleCheckPincode} className="pincode-form">
            <div className="pincode-input-group">
              <input
                type="text"
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                className="pincode-field"
                aria-label="Enter Pincode"
              />
              <button type="submit" className="pincode-check-btn" disabled={isChecking}>
                {isChecking ? "CHECKING..." : "CHECK"}
              </button>
              {(pincode || estimateResult) && (
                <button
                  type="button"
                  className="pincode-reset-btn"
                  onClick={handleResetPincode}
                  title="Reset pincode lookup"
                >
                  RESET ↺
                </button>
              )}
            </div>
          </form>

          <p className="pincode-subnote">
            Enter your pincode to check estimated delivery dates and shipping options available for your location.
          </p>

          {errorMsg && <div className="pincode-error-box">{errorMsg}</div>}

          {estimateResult && (
            <div className="pincode-result-card">
              <div className="result-header">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div className="result-status-icon">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="#2c6e49" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="result-title-meta">
                    <span className="result-main-title">
                      Delivery Available to <strong>{estimateResult.city}</strong>
                    </span>
                    <span className="result-shipping-sub">Standard White-Glove Shipping</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="result-reset-action"
                  onClick={handleResetPincode}
                  title="Reset location and pincode"
                >
                  RESET ↺
                </button>
              </div>

              <div className="result-details-grid">
                <div className="result-detail-col">
                  <span className="detail-label">Dispatches In</span>
                  <span className="detail-value">{estimateResult.dispatchDays}</span>
                </div>
                <div className="result-detail-col">
                  <span className="detail-label">Estimated Delivery</span>
                  <span className="detail-value">{estimateResult.deliveryDates}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE TEXT ACCORDION DROPDOWNS */}
        <div className="delivery-right-col">
          {/* ACCORDION ITEM 1: FREE SHIPPING */}
          <div className={`delivery-accordion-item ${openAccordions.freeShipping ? "open" : ""}`}>
            <button
              type="button"
              className="accordion-header-btn"
              onClick={() => toggleAccordion("freeShipping")}
              aria-expanded={openAccordions.freeShipping}
            >
              <h3 className="accordion-title">Free Shipping</h3>
              <span className={`accordion-chevron-icon ${openAccordions.freeShipping ? "rotated" : ""}`}>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="#4a473f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            {openAccordions.freeShipping && (
              <div className="accordion-content">
                <p>
                  We are pleased to offer complimentary white-glove standard shipping on all orders exceeding $150. Each piece is meticulously inspected and packaged in our signature sustainable fabric bags. Most orders are processed within 48 hours and delivered via our premium logistics partners within 3-5 business days.
                </p>
              </div>
            )}
          </div>

          {/* ACCORDION ITEM 2: FINAL SALE */}
          <div className={`delivery-accordion-item ${openAccordions.finalSale ? "open" : ""}`}>
            <button
              type="button"
              className="accordion-header-btn"
              onClick={() => toggleAccordion("finalSale")}
              aria-expanded={openAccordions.finalSale}
            >
              <h3 className="accordion-title">Final Sale</h3>
              <span className={`accordion-chevron-icon ${openAccordions.finalSale ? "rotated" : ""}`}>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="#4a473f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            {openAccordions.finalSale && (
              <div className="accordion-content">
                <p>
                  Due to the artisanal, small-batch nature of our textiles and to maintain the highest hygiene standards for our premium bedding, all items are final sale. We encourage ordering swatches to ensure the perfect match for your space.
                </p>
              </div>
            )}
          </div>

          {/* ACCORDION ITEM 3: MADE TO MEASURE */}
          <div className={`delivery-accordion-item ${openAccordions.madeToMeasure ? "open" : ""}`}>
            <button
              type="button"
              className="accordion-header-btn"
              onClick={() => toggleAccordion("madeToMeasure")}
              aria-expanded={openAccordions.madeToMeasure}
            >
              <h3 className="accordion-title">Made to Measure</h3>
              <span className={`accordion-chevron-icon ${openAccordions.madeToMeasure ? "rotated" : ""}`}>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="#4a473f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            {openAccordions.madeToMeasure && (
              <div className="accordion-content">
                <p>
                  For spaces requiring bespoke dimensions, our master weavers can accommodate custom sizing for select collections. This artisanal process ensures a perfect fit for non-standard beds or unique interior requirements. Please contact our dedicated design concierge for a personalized consultation and detailed quotation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

