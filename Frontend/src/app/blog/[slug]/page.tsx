"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/site-chrome";
import { getBlogPost, BlogPostProduct } from "@/lib/blog-data";
import { useCommerce } from "@/components/commerce-context";
import "../blog.css";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "a-touch-of-grandeur";
  const post = getBlogPost(slug);
  const { addToCart, toggleFavourite, favourites } = useCommerce();

  // Related products slider offset state
  const [sliderIndex, setSliderIndex] = useState(0);

  const handlePrevSlide = () => {
    setSliderIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setSliderIndex((prev) =>
      prev + 4 < post.relatedProducts.length ? prev + 1 : prev
    );
  };

  const visibleProducts = post.relatedProducts.slice(sliderIndex, sliderIndex + 4);

  const handleProductClick = (product: BlogPostProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: product.variant
    });
  };

  return (
    <div className="blog-detail-container">
      <Header />

      {/* Top Breadcrumb Navigation */}
      <div className="blog-nav-bar">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link>
          <span>/</span>
          <Link href="/blog">THE ART OF THE FINISH</Link>
          <span>/</span>
          <span>{post.kicker}</span>
        </nav>

        <Link href="/blog" className="blog-all-articles-link">
          ← ALL ARTICLES
        </Link>
      </div>

      {/* 1. FIRST: Top Hero Picture */}
      <div className="blog-hero-wrapper">
        <div className="blog-hero-image-box">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1180px"
          />
        </div>
      </div>

      {/* 2. SECOND: Heading Coming From Right Side Covering 80% Width */}
      <header className="blog-header-section">
        <span className="blog-kicker-badge">{post.kicker}</span>
        <h1 className="blog-main-title">{post.title}</h1>
        <p className="blog-subtitle-lead">{post.subtitle}</p>
      </header>

      {/* 3. Rich Webpage Content Body (Pure Paragraph Format) */}
      <article className="blog-article-content">
        {post.paragraphs.map((para, idx) => (
          <p key={idx} className={idx === 0 ? "blog-intro-paragraph" : "blog-body-paragraph"}>
            {para}
          </p>
        ))}
      </article>

      {/* 4. "YOU MAY ALSO LIKE" Section (Exact replica of Screenshot 2) */}
      <section className="blog-recommendations-section">
        <div className="blog-rec-inner">
          <div className="blog-rec-header-row">
            <div className="blog-rec-header-left">
              <span className="blog-rec-kicker">COMPLETE YOUR ROOM</span>
              <h2 className="blog-rec-title">You May Also Like</h2>
              <p className="blog-rec-subtitle">
                Products selected from the same category and material family.
              </p>
            </div>

            <div className="blog-rec-arrows">
              <button
                type="button"
                className="blog-rec-arrow-btn"
                onClick={handlePrevSlide}
                disabled={sliderIndex === 0}
                style={{ opacity: sliderIndex === 0 ? 0.3 : 1 }}
                aria-label="Previous products"
              >
                ←
              </button>
              <button
                type="button"
                className="blog-rec-arrow-btn"
                onClick={handleNextSlide}
                disabled={sliderIndex + 4 >= post.relatedProducts.length}
                style={{ opacity: sliderIndex + 4 >= post.relatedProducts.length ? 0.3 : 1 }}
                aria-label="Next products"
              >
                →
              </button>
            </div>
          </div>

          <div className="blog-rec-grid">
            {visibleProducts.map((prod) => {
              const isFav = favourites.some((f) => f.id === prod.id);
              return (
                <div
                  key={prod.id}
                  className="blog-product-card-v2"
                  onClick={() => handleProductClick(prod)}
                >
                  <div className="blog-product-img-box">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      sizes="300px"
                    />
                    <button
                      type="button"
                      className="blog-fav-heart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavourite({
                          id: prod.id,
                          name: prod.name,
                          price: prod.price,
                          image: prod.image,
                          variant: prod.variant
                        });
                      }}
                      aria-label="Add to favourites"
                      style={{ color: isFav ? "#b93838" : "#171614" }}
                    >
                      {isFav ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="blog-product-info-v2">
                    <span className="blog-product-cat-tag">
                      {prod.categoryTag || "Collection"}
                    </span>
                    <h3 className="blog-product-title-v2">{prod.name}</h3>
                    <span className="blog-product-price-v2">
                      {prod.pricePrefix || "From"} ${prod.price}
                    </span>
                    <span className="blog-product-color-count">
                      {prod.colorCount || "3 colours"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
