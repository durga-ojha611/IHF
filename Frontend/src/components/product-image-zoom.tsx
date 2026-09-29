"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";

interface ProductImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  onZoomClick?: () => void;
}

export function ProductImageZoom({
  src,
  alt,
  className = "",
  onZoomClick
}: ProductImageZoomProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none cursor-zoom-in ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onZoomClick}
    >
      <div
        className="w-full h-full relative transition-transform duration-100 ease-out"
        style={{
          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
          transform: isHovered ? "scale(1.35)" : "scale(1)"
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Zoom Lens Indicator Icon in top right */}
      <div
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-neutral-800 transition-transform hover:scale-110 pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          if (onZoomClick) onZoomClick();
        }}
        title="Click to expand high-res preview"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
    </div>
  );
}

export default ProductImageZoom;
