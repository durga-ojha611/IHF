"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCommerce } from "./commerce-context";

type GalleryImage = { url: string; alt?: string };
type ProductColor = { name: string; hexCode: string; image?: string };

export function ProductPurchasePanel({
  id, title, price, description, eyebrow, category, subcategory, images, colors, sizes, ratingCount = 0
}: {
  id: string; title: string; price: number; description: string; eyebrow: string; category: string;
  subcategory?: string; images: GalleryImage[]; colors: ProductColor[]; sizes: string[]; ratingCount?: number;
}) {
  const { addToCart, toggleFavourite, favourites } = useCommerce();
  const [imageIndex, setImageIndex] = useState(0);
  const [color, setColor] = useState(colors[0]?.name || "Natural");
  const [size, setSize] = useState(sizes[0] || "Standard");
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);
  const visibleSizes = useMemo(() => sizes.slice(0, 6), [sizes]);
  const selectedImage = images[imageIndex] || images[0];
  const item = { id, name: title, price, image: selectedImage.url, variant: `${color} · ${size}` };
  const favourite = favourites.some((entry) => entry.id === id);

  const add = () => {
    addToCart(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section className="detail-top">
      <div className="detail-gallery">
        <div className="detail-main-img">
          <Image src={selectedImage.url} alt={selectedImage.alt || title} fill priority quality={92} sizes="60vw" />
          <button className="detail-heart" aria-label="Save product" onClick={() => toggleFavourite(item)}>{favourite ? "♥" : "♡"}</button>
        </div>
        {images.length > 1 && <div className="detail-thumbs">{images.slice(0, 6).map((image, index) => (
          <button className={index === imageIndex ? "active" : ""} key={image.url} onClick={() => setImageIndex(index)}>
            <Image src={image.url} alt={image.alt || `${title} view ${index + 1}`} width={150} height={110} />
          </button>
        ))}</div>}
      </div>

      <div className="detail-config">
        <div className="detail-breadcrumb">HOME / {category.toUpperCase()}{subcategory ? ` / ${subcategory.toUpperCase()}` : ""}</div>
        <span>{eyebrow.toUpperCase()} ATELIER</span>
        <h1>{title}</h1>
        <div className="detail-rating">★★★★★ <b>{ratingCount} REVIEWS</b></div>
        <h3>From ${price.toFixed(2)}</h3>
        <p>{description}</p>

        {colors.length > 0 && <div className="detail-choice">
          <label>COLOUR <b>{color}</b></label>
          <div className="detail-swatches">{colors.slice(0, 12).map((option) => <button
            aria-label={`Select ${option.name}`} title={option.name} className={color === option.name ? "active" : ""}
            key={option.name} style={{ background: option.hexCode }} onClick={() => setColor(option.name)}
          />)}</div>
        </div>}

        <div className="detail-price-row"><b>SELECT SIZE</b><span>FROM ${price.toFixed(2)}</span></div>
        <div className="detail-sizes">{visibleSizes.map((option) => <button className={size === option ? "active" : ""} key={option} onClick={() => setSize(option)}>{option}</button>)}</div>
        {sizes.length > 6 && <div className="detail-more-sizes">
          <button onClick={() => setExpanded((value) => !value)}>{expanded ? "HIDE MORE SIZES" : `VIEW ALL ${sizes.length} SIZES`} <span>{expanded ? "−" : "+"}</span></button>
          {expanded && <select aria-label="All available sizes" value={size} onChange={(event) => setSize(event.target.value)}>{sizes.map((option) => <option key={option}>{option}</option>)}</select>}
        </div>}
        <div className="detail-selection"><span>YOUR SELECTION</span><b>{color} · {size}</b></div>
        <button className="detail-add" onClick={add}>{added ? "ADDED TO CART ✓" : "ADD TO CART"}</button>
        <p className="detail-service">Made to order · Complimentary delivery · Secure checkout</p>
      </div>
    </section>
  );
}
