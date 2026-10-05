"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCommerce } from "./commerce-context";

export interface RelatedProductItem {
  _id: string;
  title: string;
  slug: string;
  basePrice: number;
  fabricType?: string;
  images: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
  category?: string | { name?: string };
}

export interface RelatedProductsSectionProps {
  relatedProducts: RelatedProductItem[];
  defaultCategoryName?: string;
}

export function RelatedProductsSection({
  relatedProducts,
  defaultCategoryName = "Collection"
}: RelatedProductsSectionProps) {
  const { toggleFavourite, favourites } = useCommerce();

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="detail-recs">
      <div className="detail-section-head">
        <div>
          <span>COMPLETE YOUR ROOM</span>
          <h2>You May Also Like</h2>
          <p>Products selected from the same category and material family.</p>
        </div>
      </div>

      <div className="recs-grid">
        {relatedProducts.map((item) => {
          const image = item.images?.find((x) => x.isPrimary) || item.images?.[0];
          if (!image) return null;

          const categoryName =
            typeof item.category === "string"
              ? item.category
              : item.category?.name || defaultCategoryName;

          const isFav = favourites.some((f) => f.id === item._id);

          const handleToggleLike = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavourite({
              id: item._id,
              name: item.title,
              price: item.basePrice,
              image: image.url,
              variant: item.fabricType || categoryName
            });
          };

          return (
            <Link href={`/product/${item.slug}`} key={item._id} className="rec-card">
              <div className="rec-img-box">
                <Image
                  src={image.url}
                  alt={image.alt || item.title}
                  fill
                  unoptimized
                  sizes="25vw"
                  className="rec-img"
                />
                <button
                  type="button"
                  className={`rec-heart-btn ${isFav ? "active" : ""}`}
                  onClick={handleToggleLike}
                  title={isFav ? "Remove from favourites" : "Add to favourites"}
                  aria-label="Toggle favourite"
                >
                  {isFav ? "♥" : "♡"}
                </button>
              </div>
              <span className="rec-category">{categoryName}</span>
              <h3 className="rec-title">{item.title}</h3>
              <p className="rec-price">From ${item.basePrice.toFixed(2)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
