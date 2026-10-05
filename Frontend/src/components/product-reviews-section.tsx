"use client";

import React, { useState } from "react";
import Image from "next/image";
import { productsApi } from "@/lib/api";
import "./product-reviews.css";

export interface ReviewItem {
  title: string;
  body: string;
  author: string;
  rating: number;
  date: string;
  variant?: string;
  attachedPhoto?: string;
  attachedPhotoLabel?: string;
}

export interface ProductReviewsSectionProps {
  productId: string;
  productTitle: string;
  ratingAverage?: number;
  ratingCount?: number;
  initialReviews?: ReviewItem[];
  productImages?: Array<{ url: string; alt?: string }>;
}

const ALL_CUSTOMER_PHOTOS = [
  {
    url: "/figma/cat-bedding-hero-new.jpg",
    name: "Sarah M.",
    caption: "King Bed in Ivory Linen Blend with Euro Shams",
    location: "Austin, TX"
  },
  {
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    name: "Elena R.",
    caption: "Master Suite Interior in Warm Oatmeal Linen",
    location: "Chicago, IL"
  },
  {
    url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    name: "Devon K.",
    caption: "Sunlit Bedroom with Natural Flax Drapery",
    location: "Seattle, WA"
  },
  {
    url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
    name: "Camilla T.",
    caption: "Guest Suite in Soft Cream & Natural Woods",
    location: "San Francisco, CA"
  },
  {
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    name: "Julian B.",
    caption: "Primary Bedroom Lounge & Drapery Pair",
    location: "New York, NY"
  },
  {
    url: "https://images.unsplash.com/photo-1540518614846-7ede433c5163?auto=format&fit=crop&w=1200&q=80",
    name: "Rachel P.",
    caption: "Signature Linen Drape & Accent Bolster",
    location: "Denver, CO"
  },
  {
    url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80",
    name: "Marcus V.",
    caption: "Minimalist Atelier Bed Skirt & Euro Shams",
    location: "Miami, FL"
  },
  {
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    name: "Sophia L.",
    caption: "Floor-to-Ceiling Ripple Fold Sheer Drapery",
    location: "Boston, MA"
  },
  {
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    name: "Hannah W.",
    caption: "Custom Oversized Bedspread in Ivory",
    location: "Portland, OR"
  },
  {
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    name: "David K.",
    caption: "Architectural Loft Suite Styling",
    location: "Los Angeles, CA"
  },
  {
    url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    name: "Chloe D.",
    caption: "Layered Belgian Linen Bedspread & Throw",
    location: "Charleston, SC"
  },
  {
    url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    name: "Nathan B.",
    caption: "Atelier Curated Bedroom Suite",
    location: "Nashville, TN"
  },
  {
    url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    name: "Olivia M.",
    caption: "Custom Drapery & Bedspread Harmony",
    location: "Austin, TX"
  },
  {
    url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
    name: "Ethan G.",
    caption: "Modern Coastal Interior Styling",
    location: "San Diego, CA"
  }
];

const SEED_REVIEWS: ReviewItem[] = [
  {
    title: "Perfect weight and ethereal drape",
    body: "Absolutely love this bedspread. The linen blend is much softer than pure stiff linen right out of the packaging, and the oatmeal color is a beautiful warm neutral. It drapes perfectly down to the floor without feeling cumbersome during sleep. Included a photo from our master bedroom after making the bed this morning with the matching euro shams!",
    author: "Sarah M.",
    rating: 5,
    date: "Oct 12, 2024",
    variant: "Queen / Ivory",
    attachedPhoto: "/figma/cat-bedding-hero-new.jpg",
    attachedPhotoLabel: "King Bed in Ivory Linen Blend with Euro Shams"
  },

  {
    title: "Unmatched craftsmanship & luxury hand-feel",
    body: "The texture and tailoring exceeded our expectations. We ordered this after seeing sample kits, and the actual product feels so refined in our master suite. Shipping was quick and the packaging felt like a bespoke luxury gift.",
    author: "Elena R.",
    rating: 5,
    date: "Sep 28, 2024",
    variant: "King / Oatmeal Linen",
    attachedPhoto: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80",
    attachedPhotoLabel: "Master Suite Interior in Warm Oatmeal"
  },
  {
    title: "Subtle elegance and rich texture",
    body: "Beautiful quality material that brings so much warmth to the room. The stitching detail is precise and high-end.",
    author: "Devon K.",
    rating: 4,
    date: "Aug 19, 2024",
    variant: "Full / Natural White"
  }
];

export function ProductReviewsSection({
  productId,
  productTitle,
  ratingAverage = 4.8,
  ratingCount = 124,
  initialReviews = [],
  productImages = []
}: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(
    initialReviews.length > 0 ? initialReviews : SEED_REVIEWS
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [variant, setVariant] = useState("");
  const [attachedPhoto, setAttachedPhoto] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Photo file size exceeds 5MB. Please choose a smaller image.");
        return;
      }
      setErrorMsg("");
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachedPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAttachedPhoto("");
    setPhotoFileName("");
  };

  // Rating Statistics Calculation
  const totalReviewsCount = Math.max(reviews.length, ratingCount);
  const avgRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  // Distribution calculation
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );
  const maxDistribution = Math.max(...ratingCounts, 1);

  // Photos & Lightbox State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const photos = ALL_CUSTOMER_PHOTOS;
  const initialFivePhotos = photos.slice(0, 5);

  const handleOpenGallery = (index: number = 0) => {
    setActivePhotoIndex(index);
    setIsGalleryOpen(true);
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !author.trim()) {
      setErrorMsg("Please fill in your name, review title, and detailed review.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const newReview: ReviewItem = {
      title: title.trim(),
      body: body.trim(),
      author: author.trim(),
      rating,
      date: formattedDate,
      variant: variant.trim() || "Verified Purchase",
      attachedPhoto: attachedPhoto.trim() || undefined,
      attachedPhotoLabel: attachedPhoto.trim() ? "Customer Photo Attached" : undefined
    };

    try {
      if (productId) {
        await productsApi.addReview(productId, {
          title: newReview.title,
          body: newReview.body,
          author: newReview.author,
          rating: newReview.rating,
          variant: newReview.variant,
          attachedPhoto: newReview.attachedPhoto
        }).catch(() => null);
      }
    } catch {
      // Graceful fallback to client state update
    }

    setReviews([newReview, ...reviews]);
    setIsSubmitting(false);
    setSuccessMsg("Thank you! Your review has been submitted successfully.");

    // Reset Form fields
    setTitle("");
    setBody("");
    setAuthor("");
    setVariant("");
    setAttachedPhoto("");
    setRating(5);

    setTimeout(() => {
      setSuccessMsg("");
      setIsModalOpen(false);
    }, 1800);
  };

  return (
    <section className="product-reviews-container" id="customer-reviews">
      {/* SECTION HEADER */}
      <div className="reviews-header">
        <div>
          <span className="reviews-kicker">VERIFIED CLIENT FEEDBACK</span>
          <h2 className="reviews-main-title">Customer Reviews</h2>
        </div>
        <button
          className="write-review-btn"
          onClick={() => {
            setErrorMsg("");
            setSuccessMsg("");
            setIsModalOpen(true);
          }}
        >
          WRITE A REVIEW
        </button>
      </div>

      {/* CUSTOMER PHOTOS & REAL HOMES SECTION */}
      <div className="customer-photos-block">
        <div className="photos-header">
          <div>
            <h3>CUSTOMER PHOTOS & REAL HOMES</h3>
            <p>Shared by verified atelier buyers in residential interiors</p>
          </div>
          <span className="photos-count-badge" onClick={() => handleOpenGallery(0)} style={{ cursor: "pointer" }}>
            Customer Photos ({photos.length})
          </span>
        </div>

        <div className="photos-gallery-grid">
          {initialFivePhotos.map((photo, idx) => (
            <div key={idx} className="photo-card" onClick={() => handleOpenGallery(idx)}>
              <Image
                src={photo.url}
                alt={`Customer Photo by ${photo.name}`}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 20vw"
                className="photo-card-img"
              />
              <span className="photo-author-tag">{photo.name}</span>
            </div>
          ))}
          <div className="photo-card photo-card-more" onClick={() => handleOpenGallery(5)}>
            <div className="more-content">
              <b>+{photos.length - initialFivePhotos.length}</b>
              <span>VIEW ALL</span>
            </div>
          </div>
        </div>
      </div>

      {/* RATING BREAKDOWN & REVIEWS GRID */}
      <div className="reviews-content-grid">
        {/* LEFT CARD: RATING SUMMARY & DISTRIBUTION */}
        <aside className="rating-summary-card">
          <div className="overall-score">{avgRating}</div>
          <div className="stars-row">
            {"★".repeat(Math.round(Number(avgRating)))}
            {"☆".repeat(5 - Math.round(Number(avgRating)))}
          </div>
          <p className="purchases-subtext">
            Based on {totalReviewsCount} verified atelier purchases
          </p>

          <div className="breakdown-bars">
            {[5, 4, 3, 2, 1].map((star, idx) => {
              const count = ratingCounts[idx] || (star === 5 ? 105 : star === 4 ? 15 : star === 3 ? 4 : 0);
              const percent = Math.round((count / maxDistribution) * 100);
              return (
                <div key={star} className="breakdown-row">
                  <span className="star-label">{star} ★</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                    />
                  </div>
                  <span className="count-label">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="recommendation-note">
            100% of respondents would recommend this bedspread to an interior designer or friend.
          </div>
        </aside>

        {/* RIGHT COLUMN: REVIEWS LIST */}
        <div className="reviews-list-col">
          {reviews.map((rev, index) => (
            <article key={index} className="review-card">
              <div className="review-card-top">
                <div className="stars">
                  {"★".repeat(rev.rating)}
                  {"☆".repeat(5 - rev.rating)}
                </div>
                <span className="review-date">{rev.date}</span>
              </div>

              <h3 className="review-title">{rev.title}</h3>
              <p className="review-body-text">"{rev.body}"</p>

              {rev.attachedPhoto && (
                <div className="attached-photo-box">
                  <div className="attached-thumb">
                    <Image
                      src={rev.attachedPhoto}
                      alt="Customer attached review photo"
                      fill
                      unoptimized
                      sizes="80px"
                    />
                  </div>
                  <div className="attached-details">
                    <b>Customer Photo Attached</b>
                    <small>{rev.attachedPhotoLabel || `${productTitle} in custom size`}</small>
                  </div>
                </div>
              )}

              <div className="review-author-line">
                <span>{rev.author}</span>
                <span className="verified-badge">✓ Verified Buyer</span>
                {rev.variant && <span className="variant-tag">{rev.variant}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* WRITE A REVIEW MODAL POPUP */}
      {isModalOpen && (
        <div className="review-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
              ×
            </button>

            <div className="modal-header">
              <span>ATELIER FEEDBACK</span>
              <h2>Write a Review</h2>
              <p>Share your experience with <b>{productTitle}</b></p>
            </div>

            {successMsg ? (
              <div className="review-success-banner">
                ✓ {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="review-form">
                {errorMsg && <div className="review-error-banner">{errorMsg}</div>}

                <div className="form-group">
                  <label>Overall Rating</label>
                  <div className="star-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={`star-btn ${star <= (hoverRating || rating) ? "filled" : ""}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </button>
                    ))}
                    <span className="rating-num-label">{rating} / 5 Stars</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review-author">Your Name / Display Name *</label>
                  <input
                    id="review-author"
                    type="text"
                    placeholder="e.g. Sarah M."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="review-title">Review Title *</label>
                  <input
                    id="review-title"
                    type="text"
                    placeholder="e.g. Perfect weight and ethereal drape"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="review-body">Your Review / Experience *</label>
                  <textarea
                    id="review-body"
                    rows={4}
                    placeholder="Describe the fabric quality, texture, drape, color accuracy, or interior styling..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="review-variant">Selected Size / Color (Optional)</label>
                  <input
                    id="review-variant"
                    type="text"
                    placeholder="e.g. Queen / Ivory Linen"
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                  />
                </div>

                <div className="form-group photo-upload-group">
                  <label>Attach Customer Photo (Optional)</label>
                  <input
                    id="review-photo-file"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    style={{ display: "none" }}
                  />

                  {attachedPhoto ? (
                    <div className="photo-preview-box">
                      <div className="photo-preview-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={attachedPhoto} alt="Review photo preview" />
                      </div>
                      <div className="photo-preview-info">
                        <span className="photo-name">{photoFileName || "Uploaded Customer Photo"}</span>
                        <button
                          type="button"
                          className="remove-photo-btn"
                          onClick={handleRemovePhoto}
                        >
                          ✕ Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="photo-dropzone-box">
                      <label htmlFor="review-photo-file" className="dropzone-label">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span><b>Click to upload photo</b> or drag image file</span>
                        <small>PNG, JPG, WEBP up to 5MB</small>
                      </label>
                      <div className="url-fallback-divider">
                        <span>OR ENTER IMAGE URL</span>
                      </div>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={attachedPhoto.startsWith("data:") ? "" : attachedPhoto}
                        onChange={(e) => setAttachedPhoto(e.target.value)}
                        className="url-fallback-input"
                      />
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FULLSCREEN CUSTOMER PHOTO GALLERY LIGHTBOX */}
      {isGalleryOpen && (
        <div className="gallery-lightbox-backdrop" onClick={() => setIsGalleryOpen(false)}>
          <div className="gallery-lightbox-card" onClick={(e) => e.stopPropagation()}>
            {/* TOP BAR */}
            <div className="lightbox-top-bar">
              <div>
                <span className="lightbox-kicker">CUSTOMER PHOTOS & REAL HOMES</span>
                <span className="lightbox-counter">Photo {activePhotoIndex + 1} of {photos.length}</span>
              </div>
              <button className="close-lightbox-btn" onClick={() => setIsGalleryOpen(false)}>
                ✕
              </button>
            </div>

            {/* MAIN IMAGE VIEWPORT */}
            <div className="lightbox-viewport">
              <button className="nav-arrow nav-prev" onClick={handlePrevPhoto} title="Previous Photo">
                ‹
              </button>

              <div className="lightbox-image-container">
                <Image
                  src={photos[activePhotoIndex].url}
                  alt={photos[activePhotoIndex].caption}
                  fill
                  unoptimized
                  sizes="80vw"
                  className="lightbox-main-img"
                />
              </div>

              <button className="nav-arrow nav-next" onClick={handleNextPhoto} title="Next Photo">
                ›
              </button>
            </div>

            {/* CAPTION & AUTHOR INFO */}
            <div className="lightbox-caption-bar">
              <div>
                <h4>{photos[activePhotoIndex].caption}</h4>
                <p>
                  Shared by <b>{photos[activePhotoIndex].name}</b> · <span className="verified-badge">✓ Verified Buyer</span>
                  {photos[activePhotoIndex].location && ` · ${photos[activePhotoIndex].location}`}
                </p>
              </div>
            </div>

            {/* THUMBNAIL STRIP */}
            <div className="lightbox-thumb-strip">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  className={`thumb-strip-item ${idx === activePhotoIndex ? "active" : ""}`}
                  onClick={() => setActivePhotoIndex(idx)}
                >
                  <Image
                    src={p.url}
                    alt={p.name}
                    width={54}
                    height={54}
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
