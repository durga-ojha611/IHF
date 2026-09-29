"use client";

import { useState } from "react";

function ScissorsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="m8.2 15.6 7.6-9.6" />
      <path d="m15.8 15.6-7.6-9.6" />
      <circle cx="12" cy="10.8" r="0.8" fill="currentColor" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 17V5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2" />
      <path d="M15 17h-6" />
      <path d="M19 17h2a1 1 0 0 0 1-1v-4a2 2 0 0 0-.6-1.4l-2.4-2.6A2 2 0 0 0 17.6 7H14v10" />
      <circle cx="7" cy="17.5" r="2.5" />
      <circle cx="17" cy="17.5" r="2.5" />
    </svg>
  );
}

function RibbonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="m8.5 13.5-1.5 8 5-2.5 5 2.5-1.5-8" />
    </svg>
  );
}

function HammerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" />
      <path d="m17.6 15 4.4-4.4" />
      <path d="m21 11-2-2a2 2 0 0 0-1.4-.6H16L13.5 6A5 5 0 0 0 10 4.5H9" />
      <path d="m9.5 11.5 3 3" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4c0 3.8-3.2 7-7 7 3.8 0 7 3.2 7 7 0-3.8 3.2-7 7-7-3.8 0-7-3.2-7-7z" />
      <path d="M18 3v4" />
      <path d="M20 5h-4" />
      <path d="M4 18v2" />
      <path d="M5 19H3" />
    </svg>
  );
}

interface BenefitItem {
  id: string;
  title: string;
  description: string;
  Icon: React.ComponentType;
}

const benefits: BenefitItem[] = [
  {
    id: "made-to-measure",
    title: "Made to Measure",
    description: "Designed around your space, not the other way around. Every piece is tailored to fit your dimensions beautifully and seamlessly.",
    Icon: ScissorsIcon,
  },
  {
    id: "free-shipping",
    title: "Free Shipping",
    description: "Enjoy the ease of having your order delivered right to your doorstep. We take care of the shipping, so you can focus on creating your space.",
    Icon: TruckIcon,
  },
  {
    id: "premium-fabrics",
    title: "Premium Fabrics",
    description: "Thoughtfully selected fabrics bring softness, texture and timeless beauty to your home. Made to look beautiful and feel exceptional, day after day.",
    Icon: RibbonIcon,
  },
  {
    id: "expert-craftsmanship",
    title: "Expert Craftsmanship",
    description: "Every piece is crafted with care and attention to detail. From precise finishing to thoughtful construction, quality is built into every stitch.",
    Icon: HammerIcon,
  },
  {
    id: "thoughtfully-designed",
    title: "Thoughtfully Designed",
    description: "Every detail is considered to balance beauty, comfort and function. Because a well-designed home should feel as good as it looks.",
    Icon: ShieldCheckIcon,
  },
  {
    id: "easy-customisation",
    title: "Easy Customisation",
    description: "Make it truly yours with a range of fabrics, colours, sizes and finishing options. Create pieces that fit your home and your personal style perfectly.",
    Icon: SparklesIcon,
  },
];

export function BenefitSection() {
  // Free Shipping is active initially as shown in reference picture
  const [activeIndex, setActiveIndex] = useState<number>(1);

  return (
    <section className="love">
      <div className="home-heading">
        <span className="home-kicker">THE DIFFERENCE IS IN THE DETAILS</span>
        <h2>
          Why Homeowners Love<br />
          <em>Us</em>
        </h2>
        <p className="love-subheading">
          Six unfair advantages built into every single order. No shortcuts, no substitutions.
        </p>
      </div>

      <div className="benefit-grid home-shell" role="region" aria-label="Brand Benefits">
        {benefits.map((item, index) => {
          const isActive = activeIndex === index;
          const { Icon } = item;
          return (
            <article
              key={item.id}
              className={`benefit-card ${isActive ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
            >
              <div className={`benefit-icon-circle ${isActive ? "active" : ""}`}>
                <Icon />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
