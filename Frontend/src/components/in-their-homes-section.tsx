"use client";

import Image from "next/image";
import { useState, useRef } from "react";

interface HomeStory {
  id: string;
  image: string;
  author: string;
  location: string;
}

const homeStories: HomeStory[] = [
  {
    id: "seattle",
    image: "/figma/in-their-homes-1.png",
    author: "Sarah M.",
    location: "Seattle, WA",
  },
  {
    id: "chicago",
    image: "/figma/in-their-homes-2.png",
    author: "James L.",
    location: "Chicago, IL",
  },
  {
    id: "austin",
    image: "/figma/in-their-homes-3.png",
    author: "Elena R.",
    location: "Austin, TX",
  },
  {
    id: "san-francisco",
    image: "/figma/home-15.jpeg",
    author: "Maya P.",
    location: "San Francisco, CA",
  },
  {
    id: "brooklyn",
    image: "/figma/home-10.jpeg",
    author: "David K.",
    location: "Brooklyn, NY",
  },
  {
    id: "boston",
    image: "/figma/home-01.jpeg",
    author: "Ananya S.",
    location: "Boston, MA",
  },
];

export function InTheirHomesSection() {
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxIndex = homeStories.length - 3;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleStories = homeStories.slice(startIndex, startIndex + 3);

  return (
    <section className="in-their-homes-section">
      <div className="home-shell">
        {/* Header: Title & subtitle on left, Arrows on right */}
        <div className="homes-header">
          <div className="homes-header-copy">
            <h2 className="homes-title">In Their Homes</h2>
            <p className="homes-subtitle">
              Real stories, real spaces. See how our custom pieces transform homes across the country.
            </p>
          </div>

          <div className="homes-nav-arrows" aria-label="Gallery navigation">
            <button
              type="button"
              className={`homes-nav-btn ${startIndex === 0 ? "disabled" : ""}`}
              onClick={handlePrev}
              disabled={startIndex === 0}
              aria-label="Previous home stories"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className={`homes-nav-btn ${startIndex >= maxIndex ? "disabled" : ""}`}
              onClick={handleNext}
              disabled={startIndex >= maxIndex}
              aria-label="Next home stories"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* 3-Column Stories Grid */}
        <div className="homes-grid" ref={containerRef}>
          {visibleStories.map((story) => (
            <article key={story.id} className="home-item">
              <div className="home-item-img-wrap">
                <Image
                  src={story.image}
                  alt={`${story.author} home in ${story.location}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="home-item-img"
                  priority
                />
              </div>
              <p className="home-item-caption">
                {story.author} — {story.location}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
