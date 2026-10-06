"use client";

import React, { useState } from "react";
import { Header, Footer } from "@/components/site-chrome";
import "./faq.css";

interface FAQItem {
  id: string;
  number: string;
  category: string;
  question: string;
  answer: string;
  bullets?: string[];
  note?: string;
}

const EIGHT_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    number: "01",
    category: "MEASUREMENT & SIZING",
    question: "How do I measure my windows accurately for bespoke draperies?",
    answer:
      "We recommend using a rigid steel tape measure for exact architectural dimensions:",
    bullets: [
      "For Width: Measure the full length of your curtain pole or track from end to end (excluding decorative finials). For wall-to-wall coverage, measure the total wall span.",
      "For Length: Measure from the top of the rod or ring eyelet down to your desired drop point—to the sill (-0.5″), to the floor (-0.5″ for clean floating), or puddle (+2″ to +4″ for traditional elegance)."
    ],
    note: "Our Atelier Concierge team is also available for a free 1-on-1 virtual measurement audit before production."
  },
  {
    id: "faq-2",
    number: "02",
    category: "CRAFT & TIMELINE",
    question: "What is the standard crafting and delivery timeframe for custom orders?",
    answer:
      "Every custom drapery panel, shade, and table linen is hand-tailored by our senior master weavers in Jaipur. Standard atelier crafting takes 7 to 10 business days. Following completion, each piece undergoes a rigorous 12-point quality and drape inspection before being dispatched via Express White-Glove delivery (3 to 5 business days) with direct end-to-end tracking."
  },
  {
    id: "faq-3",
    number: "03",
    category: "CUSTOM SPECIFICATIONS",
    question: "Can I request custom width or drop dimensions not listed on the website?",
    answer:
      "Yes, absolutely. Our master workroom routinely crafts grand-scale bespoke draperies up to 240 inches in length and 180 inches per panel width, as well as custom table runner drops and banquet tablecloth dimensions. Contact our Concierge Design Team at concierge@indiahomefurnishings.com for a complimentary custom quote and CAD rendering."
  },
  {
    id: "faq-4",
    number: "04",
    category: "LINING & OPACITY",
    question: "Should I choose Privacy Satin, 100% Blackout, or Unlined drapery?",
    answer:
      "Your lining choice determines light transmission, privacy, and insulation:",
    bullets: [
      "Privacy Lining (Cotton Satin): Softens harsh direct glare while preserving warm ambient daylight. Perfect for living rooms, dining spaces, and home offices.",
      "100% Blackout Lining: Completely blocks incoming light, shields fine natural yarns from UV fading, and provides high thermal and acoustic insulation. Ideal for master bedrooms and media rooms.",
      "Unlined: Delivers organic, breezy translucency with natural fluid drape, best suited for 100% Belgian flax sheer linens."
    ]
  },
  {
    id: "faq-5",
    number: "05",
    category: "FABRIC SWATCHES",
    question: "How do fabric swatches work and are they refundable?",
    answer:
      "Fabric swatches allow you to inspect the weave texture, color fastness, and drape weight in your home's natural daylight. Our 4-piece curated swatch kit is delivered complimentary using promo code SWATCHFREE. Each sample box also includes a $25 credit voucher applicable toward your full drapery or bedding purchase."
  },
  {
    id: "faq-6",
    number: "06",
    category: "CARE & MAINTENANCE",
    question: "What care instructions are recommended for Belgian Flax Linen & Silk?",
    answer:
      "We recommend professional dry cleaning for all lined draperies, structured pinch pleats, and silk velvet fabrics. For unlined 100% Belgian flax linens, you may gently steam them in place to release natural travel folds and relax the drape. Never machine wash or tumble dry structured pleat headings."
  },
  {
    id: "faq-7",
    number: "07",
    category: "RETURNS & EXCHANGES",
    question: "What is your return and exchange policy for custom and ready-made items?",
    answer:
      "Because custom draperies, Roman shades, and bespoke table linens are handcrafted to your exact millimeter specifications, they are final sale once cutting and weaving commence. Ready-to-hang items, fabric yardage, and accessories in unused, pristine original condition may be returned within 14 days of delivery."
  },
  {
    id: "faq-8",
    number: "08",
    category: "HARDWARE & INSTALLATION",
    question: "Do you offer hardware recommendations and white-glove installation?",
    answer:
      "Yes. Our architectural hardware collection features solid heavy-gauge cast brass poles, hand-forged iron traversing tracks, and concealed ceiling-mount channels engineered to carry heavy grand-scale drapes without center sag. We also coordinate with certified national white-glove installers in select metropolitan areas."
  }
];

export default function FAQPage() {
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({
    "faq-1": true
  });

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const allExpanded = EIGHT_FAQS.every((item) => openFaqs[item.id]);

  const toggleExpandAll = () => {
    if (allExpanded) {
      setOpenFaqs({});
    } else {
      const nextState: Record<string, boolean> = {};
      EIGHT_FAQS.forEach((item) => {
        nextState[item.id] = true;
      });
      setOpenFaqs(nextState);
    }
  };

  return (
    <div className="faq-page">
      <Header />

      <main className="faq-main">
        {/* Top Header Section */}
        <section className="faq-header-section">
          <div className="faq-header-inner">
            <span className="faq-eyebrow">CLIENT CARE &amp; CONCIERGE</span>
            <h1 className="faq-title">FAQ</h1>
            <p className="faq-subtitle">
              Frequently asked questions regarding our bespoke window draperies, made-to-measure Roman shades, fabric swatches, and white-glove delivery.
            </p>
          </div>
        </section>

        {/* 8 Questions Dropdown Accordion List */}
        <section className="faq-list-section">
          <div className="faq-list-container">
            {/* Meta Control Bar */}
            <div className="faq-meta-bar">
              <div className="faq-meta-left">
                <span className="faq-indicator-dot" />
                <span className="faq-meta-count">8 QUESTIONS &amp; ANSWERS</span>
              </div>
              <button
                type="button"
                className="faq-toggle-all-btn"
                onClick={toggleExpandAll}
                aria-label={allExpanded ? "Collapse all questions" : "Expand all questions"}
              >
                {allExpanded ? "COLLAPSE ALL −" : "EXPAND ALL +"}
              </button>
            </div>

            {/* Clean, Simple Accordion List */}
            <div className="faq-accordion-group">
              {EIGHT_FAQS.map((faq) => {
                const isOpen = Boolean(openFaqs[faq.id]);

                return (
                  <div
                    key={faq.id}
                    className={`faq-item ${isOpen ? "is-open" : ""}`}
                  >
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <h2 className="faq-question-title">{faq.question}</h2>

                      <span className="faq-toggle-icon" aria-hidden="true">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {isOpen ? (
                            <line x1="5" y1="12" x2="19" y2="12" />
                          ) : (
                            <>
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </>
                          )}
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div className="faq-answer-panel">
                        <p className="faq-answer-text">{faq.answer}</p>

                        {faq.bullets && faq.bullets.length > 0 && (
                          <ul className="faq-answer-bullets">
                            {faq.bullets.map((bullet, idx) => (
                              <li key={idx}>{bullet}</li>
                            ))}
                          </ul>
                        )}

                        {faq.note && (
                          <div className="faq-answer-note">
                            <strong>Note:</strong> {faq.note}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
