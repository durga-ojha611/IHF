"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface StoryCard {
  id: string;
  image: string;
  badge: string;
  quote: string;
  author: string;
  location: string;
  avatar: string;
}

const storiesData: StoryCard[] = [
  {
    id: "story-1",
    image: "/figma/real-review-1-hd.png",
    badge: "French Pleat Drapery",
    quote: '"Beautiful and exceeded all expectations. The French pleat hangs with such graceful weight and precision. Shipping was fast! Great experience"',
    author: "Sarah Jenkins",
    location: "Seattle, WA",
    avatar: "/figma/avatar-sarah.jpg",
  },
  {
    id: "story-2",
    image: "/figma/real-review-2.png",
    badge: "Dupioni Silk Drapes",
    quote: '"Very well made to my specs, high quality backing fabric, expert construction, and the Dupioni is just stunning fabric. Shipped incredibly fast, worth every penny. Buy it."',
    author: "Michael Chang",
    location: "Chicago, IL",
    avatar: "/figma/avatar-michael.jpg",
  },
  {
    id: "story-3",
    image: "/figma/real-review-3.png",
    badge: "Custom Silk Drapery",
    quote: '"Custom drapes are so expensive and Babita was such a professional and worked so carefully with me to order what I needed. Amazing to work with, very knowledgeable and the workmanship is perfection! Will definitely work with them again and will recommend to others!"',
    author: "Emily Richardson",
    location: "Austin, TX",
    avatar: "/figma/avatar-emily.jpg",
  },
  {
    id: "story-4",
    image: "/figma/customer-story-room.png",
    badge: "Belgian Flax Linen",
    quote: '"We ordered floor-to-ceiling 100% Belgian Flax Linen with thermal privacy lining. The natural slub texture filters afternoon sun into a warm, serene glow. Custom tailoring fits like an absolute dream."',
    author: "David & Elena Vance",
    location: "San Francisco, CA",
    avatar: "/figma/rohan-mehta.png",
  },
  {
    id: "story-5",
    image: "/figma/in-their-homes-1.png",
    badge: "Triple Pinch Pleat Velvet",
    quote: '"Finding true 100% blackout velvet for our master bedroom was difficult until we found IHF. Heavyweight luxury drape, memory-trained folds, and completely silent glide. Our sleep has never been better."',
    author: "Marcus Sterling",
    location: "New York, NY",
    avatar: "/figma/avatar-michael.jpg",
  },
  {
    id: "story-6",
    image: "/figma/in-their-homes-2.png",
    badge: "Cascade Roman Shade",
    quote: '"The tailored cascade folds and cordless mechanism in our dining room look straight out of Architectural Digest. Ordering custom dimensions down to the quarter-inch was completely seamless."',
    author: "Claire Dupont",
    location: "Boston, MA",
    avatar: "/figma/avatar-sarah.jpg",
  },
  {
    id: "story-7",
    image: "/figma/in-their-homes-3.png",
    badge: "Natural Linen Sheer Panels",
    quote: '"These airy linen sheers add ethereal movement and privacy to our living room windows without blocking daylight. Handcrafted stitching and generous bottom weight chains keep them hanging straight."',
    author: "Sophia Alvarez",
    location: "Miami, FL",
    avatar: "/figma/avatar-emily.jpg",
  },
  {
    id: "story-8",
    image: "/figma/home-04.jpeg",
    badge: "Tassel Trim Valance",
    quote: '"The craftsmanship on the upholstered valance with hand-knotted tassel trims is true bespoke luxury. It transformed our heritage drawing room into an embassy-grade residence."',
    author: "Alistair Ward",
    location: "London, UK",
    avatar: "/figma/rohan-mehta.png",
  },
  {
    id: "story-9",
    image: "/figma/home-15.jpeg",
    badge: "Tailored Euro Pleat Drapes",
    quote: '"The fabric swatches arrived in 3 days, making selection so easy. When the draperies arrived, they hung right out of the box with zero puckering and impeccable header tape. Outstanding atelier work."',
    author: "Liam & Jessica O'Connor",
    location: "Toronto, Canada",
    avatar: "/figma/avatar-sarah.jpg",
  },
];

function StarRating() {
  return (
    <div className="story-stars" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="#3e3931"
          stroke="#3e3931"
          strokeWidth="1"
          className="story-star-icon"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function CustomerStoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const checkScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = scrollLeft / maxScroll;
      const slide = Math.min(2, Math.max(0, Math.round(progress * 2)));
      setActiveSlide(slide);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState);
    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.querySelector<HTMLElement>(".story-card");
    const cardWidth = firstCard ? firstCard.offsetWidth + 28 : 420;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = (maxScroll / 2) * index;
    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
    setActiveSlide(index);
  };

  return (
    <section className="customer-stories-section">
      <div className="home-shell">
        {/* Header row: Title on left, Carousel controls and indicators on right */}
        <div className="stories-header">
          <div className="stories-title-wrap">
            <span className="stories-kicker">CUSTOMER STORIES</span>
            <h2 className="stories-heading">
              Real Homes, <em>Real Words.</em>
            </h2>
          </div>

          <div className="stories-controls-wrap">
            {/* Elegant Dots Design */}
            <div className="stories-dots-bar" role="tablist" aria-label="Customer review slides">
              {[0, 1, 2].map((idx) => {
                const isActive = activeSlide === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`story-dot ${isActive ? "active" : ""}`}
                    onClick={() => scrollToSlide(idx)}
                  />
                );
              })}
            </div>

            {/* Left Scroll Button */}
            <button
              type="button"
              className={`story-arrow-btn prev ${!canScrollLeft ? "disabled" : ""}`}
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left to previous customer reviews"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Scroll Button */}
            <button
              type="button"
              className={`story-arrow-btn next ${!canScrollRight ? "disabled" : ""}`}
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right to next customer reviews"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Reviews Cards Track */}
        <div className="stories-scroll-track" ref={scrollRef}>
          {storiesData.map((card, i) => (
            <article key={`${card.id}-${i}`} className="story-card">
              {/* Card Image with overlay product badge */}
              <div className="story-image-wrap">
                <Image
                  src={card.image}
                  alt={`${card.badge} in customer interior`}
                  fill
                  sizes="(max-width: 800px) 90vw, (max-width: 1200px) 48vw, 32vw"
                  className="story-img"
                  priority={i < 3}
                />
                <span className="story-badge">{card.badge}</span>
              </div>

              {/* Card Body */}
              <div className="story-body">
                <StarRating />
                <p className="story-quote">{card.quote}</p>

                {/* Author Info */}
                <div className="story-author">
                  <div className="story-avatar-wrap">
                    <Image
                      src={card.avatar}
                      alt={card.author}
                      width={38}
                      height={38}
                      className="story-avatar-img"
                    />
                  </div>
                  <div className="story-author-info">
                    <h4 className="story-author-name">{card.author}</h4>
                    <span className="story-author-location">{card.location}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA: Redirect to Etsy Store */}
        <div className="stories-bottom-cta">
          <a
            href="https://www.etsy.com/shop/IndiaHomeFurnishings"
            target="_blank"
            rel="noopener noreferrer"
            className="stories-etsy-link"
            aria-label="Shop our collection on Etsy (opens in a new tab)"
          >
            SHOP OUR COLLECTION ON ETSY
          </a>
        </div>
      </div>
    </section>
  );
}
