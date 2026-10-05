"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import "./faq.css";

interface FAQItem {
  id: string;
  number: string;
  category: string;
  question: string;
  answer: string;
}

const EIGHT_LUXURY_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    number: "01",
    category: "MEASUREMENT & SIZING",
    question: "How do I measure my windows accurately for bespoke draperies?",
    answer:
      "We recommend using a rigid steel tape measure for exact dimensions. For width, measure the full length of your curtain pole or track excluding decorative finials. For length, measure from the top of the rod down to your desired drop point—to the floor (-0.5″ for floating, +2″ to +4″ for elegant puddling). Detailed step-by-step measurement guides and video walkthroughs are available in our Atelier Concierge section."
  },
  {
    id: "faq-2",
    number: "02",
    category: "CRAFT & TIMELINE",
    question: "What is the standard crafting and delivery timeframe for custom orders?",
    answer:
      "Every custom drapery panel, shade, and table linen is hand-tailored by our senior master weavers. Standard atelier crafting takes 7 to 10 business days. Once inspect-certified through our 12-point quality checklist, your order is dispatched via FedEx Express White-Glove delivery (3 to 5 business days)."
  },
  {
    id: "faq-3",
    number: "03",
    category: "CUSTOM SPECIFICATIONS",
    question: "Can I request custom width or drop dimensions not listed on the website?",
    answer:
      "Yes, absolutely. Our master workroom crafts bespoke draperies up to 240 inches in length and 180 inches per panel width, as well as custom table runner drops and banquet tablecloth dimensions. Contact our Concierge Design Team directly at concierge@indiahomefurnishings.com for a custom quote and CAD rendering."
  },
  {
    id: "faq-4",
    number: "04",
    category: "LINING & OPACITY",
    question: "Should I choose Privacy Satin, 100% Blackout, or Unlined drapery?",
    answer:
      "Privacy lining (Cotton Satin) softens direct sun glare while maintaining warm ambient daylight. 100% Blackout lining completely blocks incoming light, protects fine natural fibers from UV fading, and provides high thermal insulation for energy efficiency. Unlined options offer light, organic transparency ideal for sheer linen."
  },
  {
    id: "faq-5",
    number: "05",
    category: "FABRIC SWATCHES",
    question: "How do fabric swatches work and are they refundable?",
    answer:
      "Fabric swatches allow you to experience the natural hand weight, weave texture, and color tone of our Belgian Flax, Silk Velvet, and Sheer collections in your home's natural light. Swatch sample boxes are delivered free with code SWATCHFREE and include a $25 credit applicable toward your full bespoke drapery order."
  },
  {
    id: "faq-6",
    number: "06",
    category: "CARE & MAINTENANCE",
    question: "What care instructions are recommended for Belgian Flax Linen & Silk?",
    answer:
      "We recommend professional dry cleaning for all lined custom draperies and delicate silk blends. Unlined 100% Belgian flax linens and table runners can be gently steamed in place to relax natural linen folds. Never machine wash or tumble dry structured pleat headings."
  },
  {
    id: "faq-7",
    number: "07",
    category: "RETURNS & EXCHANGES",
    question: "What is your return and exchange policy for custom and ready-made items?",
    answer:
      "Custom-tailored draperies, made-to-measure shades, and bespoke table linens are handcrafted specifically to your exact window and table specifications and are final sale once production begins. Ready-to-hang items and swatches may be returned in pristine, original condition within 14 days of delivery."
  },
  {
    id: "faq-8",
    number: "08",
    category: "HARDWARE & INSTALLATION",
    question: "Do you offer hardware recommendations and white-glove installation?",
    answer:
      "Our Atelier hardware collection includes custom hand-finished brass, iron, and silent ceiling track systems designed specifically to support heavyweight double-pleated drapes. We also partner with certified national white-glove installation specialists to assist with mounting upon delivery."
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({
    "faq-1": true // First item open by default for luxury presentation
  });

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return EIGHT_LUXURY_FAQS;
    const q = searchQuery.toLowerCase().trim();
    return EIGHT_LUXURY_FAQS.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const allExpanded = useMemo(() => {
    return filteredFaqs.length > 0 && filteredFaqs.every((item) => openFaqs[item.id]);
  }, [filteredFaqs, openFaqs]);

  const toggleExpandAll = () => {
    if (allExpanded) {
      setOpenFaqs({});
    } else {
      const nextState: Record<string, boolean> = {};
      filteredFaqs.forEach((item) => {
        nextState[item.id] = true;
      });
      setOpenFaqs(nextState);
    }
  };

  return (
    <div className="faq-page-wrapper">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="faq-hero-section">
          <div className="faq-hero-bg-overlay" />
          <div className="faq-hero-content">
            <span className="faq-kicker">ATELIER HELP &amp; CLIENT CONCIERGE</span>
            <h1 className="faq-hero-title">Frequently Asked Questions</h1>
            <p className="faq-hero-desc">
              Everything you need to know about our bespoke draperies, custom table linens, measurement guidelines, fabric care, and white-glove delivery.
            </p>

            {/* Live Search Input */}
            <div className="faq-search-wrapper">
              <span className="faq-search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                className="faq-search-input"
                placeholder="Search topics (e.g. measuring, lining, shipping, swatches)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search FAQs"
              />
            </div>
          </div>
        </section>

        {/* FAQ Accordion List Container */}
        <section className="faq-container-main">
          <div className="faq-meta-bar">
            <span className="faq-count-text">
              Showing {filteredFaqs.length} of 8 Atelier Guidance Answers
            </span>
            <button type="button" className="faq-expand-all-btn" onClick={toggleExpandAll}>
              {allExpanded ? "Collapse All −" : "Expand All +"}
            </button>
          </div>

          <div className="faq-accordion-list">
            {filteredFaqs.map((faq) => {
              const isOpen = Boolean(openFaqs[faq.id]);
              return (
                <div
                  key={faq.id}
                  className={`faq-accordion-card ${isOpen ? "open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-card-header"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="faq-card-title-group">
                      <span className="faq-item-number">{faq.number}</span>
                      <div>
                        <span className="faq-item-badge">{faq.category}</span>
                        <h2 className="faq-question-text">{faq.question}</h2>
                      </div>
                    </div>
                    <span className="faq-toggle-icon">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="faq-card-answer-body">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 20px", background: "#ffffff", borderRadius: 12, border: "1px dashed #dcd7c8" }}>
                <p style={{ fontSize: 16, color: "#444", margin: "0 0 12px" }}>No FAQs match "{searchQuery}"</p>
                <button
                  type="button"
                  className="faq-expand-all-btn"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search Filter ✕
                </button>
              </div>
            )}
          </div>

          {/* Atelier Concierge Callout */}
          <div className="faq-concierge-card">
            <div className="faq-concierge-info">
              <h3>Need Custom Assistance?</h3>
              <p>
                Our senior drapery concierges and interior specialists are available 7 days a week for measurement audits, fabric swatch consultation, and custom quotations.
              </p>
            </div>
            <div className="faq-concierge-actions">
              <a href="mailto:concierge@indiahomefurnishings.com" className="faq-concierge-btn-primary">
                EMAIL CONCIERGE ✉
              </a>
              <Link href="/account" className="faq-concierge-btn-secondary">
                MY ACCOUNT
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
