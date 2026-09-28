"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import { productsApi } from "@/lib/api";
import "../commerce.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productsApi.getAll({ search: query.trim() });
        const prods = res.data?.products || [];
        setResults(prods);
      } catch {
        // Fallback filter
        const fallback = [
          {
            _id: "660000000000000000000006",
            title: "The Chateau Pure Belgian Flax Linen Drapery",
            basePrice: 580,
            images: [{ url: "/figma/home-01.jpeg" }],
            slug: "chateau-pure-belgian-flax-linen-drapery"
          },
          {
            _id: "660000000000000000000062",
            title: "The Monaco Royal Silk Velvet Blackout Drapery",
            basePrice: 780,
            images: [{ url: "/figma/home-06.jpeg" }],
            slug: "monaco-royal-silk-velvet-blackout-drapery"
          },
          {
            _id: "660000000000000000000063",
            title: "The Verona Architectural Ripple Fold Sheer",
            basePrice: 420,
            images: [{ url: "/figma/home-11.png" }],
            slug: "verona-architectural-ripple-fold-sheer"
          }
        ];
        setResults(
          fallback.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
        );
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <Header />
      <main className="commerce-page">
        <header className="commerce-head">
          <span>DISCOVER THE CATALOG</span>
          <h1>Search the Atelier</h1>
          <p>Search by fabric, drapery style, collection or color.</p>
        </header>

        <div className="search-form">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Linen, velvet, sheer, pinch pleat..."
          />
          <button type="button">⌕</button>
        </div>

        {loading && (
          <p style={{ textAlign: "center", marginTop: 40, fontSize: 12, color: "#888" }}>
            Searching luxury catalog...
          </p>
        )}

        {query && !loading && (
          <div className="search-results">
            {results.length > 0 ? (
              results.map((p) => (
                <Link href={`/product/${p.slug || "signature-linen"}`} key={p._id || p.title}>
                  <div style={{ position: "relative", width: "100%", height: 280 }}>
                    <Image
                      src={p.images?.[0]?.url || "/figma/home-01.jpeg"}
                      alt={p.title}
                      fill
                      sizes="25vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <h2 style={{ fontSize: 16, marginTop: 12 }}>{p.title}</h2>
                  <p style={{ fontSize: 12, color: "#555" }}>From ${p.basePrice || 450}</p>
                </Link>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0" }}>
                <p style={{ fontSize: 13, color: "#666" }}>
                  No pieces found matching &ldquo;{query}&rdquo;.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
