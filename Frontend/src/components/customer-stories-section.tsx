"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface StoryCard {
  id: string;
  image: string;
  badge: string;
  quote: string;
  author: string;
  location: string;
  avatar: string;
}

const storiesData: StoryCard[][] = [
  // Slide 0: Real Customer Reviews with authentic room photos and distinct customer avatars
  [
    {
      id: "story-1",
      image: "/figma/real-review-1-hd.png",
      badge: "French Pleat Drapery",
      quote: '"Beautiful and exceeded all expectations. Shipping was fast! Great experience"',
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
      quote: '"Custom drapes are so expensive and Babita was such a professional and worked so carefully with me to order what I needed. Amazing to work, with, very knowledgeable and the workmanship is perfection! Will definitely work with them again and will recommend to others!"',
      author: "Emily Richardson",
      location: "Austin, TX",
      avatar: "/figma/avatar-emily.jpg",
    },
  ],
  // Slide 1
  [
    {
      id: "story-4",
      image: "/figma/home-15.jpeg",
      badge: "Belgian Flax Linen",
      quote: '"The texture of the fabric completely transformed our living space. Custom tailoring fits like an absolute dream."',
      author: "Priya Sharma",
      location: "Mumbai",
      avatar: "/figma/rohan-mehta.png",
    },
    {
      id: "story-5",
      image: "/figma/customer-story-room.png",
      badge: "Velvet Dusk Blackout",
      quote: '"From measurement to installation, everything was effortless. The linen curtains are absolutely sublime."',
      author: "Rohan Mehta",
      location: "Bengaluru",
      avatar: "/figma/rohan-mehta.png",
    },
    {
      id: "story-6",
      image: "/figma/home-10.jpeg",
      badge: "Pure Silk Pleated",
      quote: '"Exceptional finish, heavy drape, and wonderful support from the design team throughout the selection process."',
      author: "Vikram Singhania",
      location: "New Delhi",
      avatar: "/figma/rohan-mehta.png",
    },
  ],
  // Slide 2
  [
    {
      id: "story-7",
      image: "/figma/home-17.jpeg",
      badge: "Natural Linen Sheer",
      quote: '"Light filters through so gently. Truly bespoke craftsmanship that you cannot find anywhere else."',
      author: "Ananya Iyer",
      location: "Chennai",
      avatar: "/figma/rohan-mehta.png",
    },
    {
      id: "story-8",
      image: "/figma/customer-story-room.png",
      badge: "Velvet Dusk Blackout",
      quote: '"From measurement to installation, everything was effortless. The linen curtains are absolutely sublime."',
      author: "Rohan Mehta",
      location: "Bengaluru",
      avatar: "/figma/rohan-mehta.png",
    },
    {
      id: "story-9",
      image: "/figma/home-01.jpeg",
      badge: "Cascade Roman Shade",
      quote: '"Impeccable quality and precise measurements. We could not be happier with our new home decor."',
      author: "Kabir Malhotra",
      location: "Hyderabad",
      avatar: "/figma/rohan-mehta.png",
    },
  ],
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
  const [activeSlide, setActiveSlide] = useState(0);

  const currentCards = storiesData[activeSlide] || storiesData[0];

  return (
    <section className="customer-stories-section">
      <div className="home-shell">
        {/* Header row: Title on left, Carousel dots on right */}
        <div className="stories-header">
          <div className="stories-title-wrap">
            <span className="stories-kicker">CUSTOMER STORIES</span>
            <h2 className="stories-heading">
              Real Homes, <em>Real Words.</em>
            </h2>
          </div>

          <div className="stories-pagination" role="tablist" aria-label="Customer stories pagination">
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
                  onClick={() => setActiveSlide(idx)}
                />
              );
            })}
          </div>
        </div>

        {/* 3 Testimonial Cards Grid */}
        <div className="stories-grid">
          {currentCards.map((card, i) => (
            <article key={`${card.id}-${i}`} className="story-card">
              {/* Card Image with overlay product badge */}
              <div className="story-image-wrap">
                <Image
                  src={card.image}
                  alt={`${card.badge} in customer interior`}
                  fill
                  sizes="(max-width: 800px) 100vw, 33vw"
                  className="story-img"
                  priority={i === 0}
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

        {/* Bottom CTA */}
        <div className="stories-bottom-cta">
          <Link href="/products" className="stories-etsy-link">
            SHOP OUR COLLECTION ON ETSY
          </Link>
        </div>
      </div>
    </section>
  );
}
