"use client";

import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import { BLOG_LIST } from "@/lib/blog-data";
import "./blog.css";

export default function BlogListingPage() {
  return (
    <div className="blog-detail-container">
      <Header />

      <section className="blog-header-section" style={{ marginTop: "40px" }}>
        <span className="blog-kicker-badge">CRAFT &amp; DESIGN JOURNAL</span>
        <h1 className="blog-main-title">The Art of the Finish</h1>
        <p className="blog-subtitle-lead">
          Explore expert guides, hand-crafted finishing details, passementerie inspiration, and bespoke window treatment design.
        </p>
      </section>

      {/* Grid of All Blog Posts */}
      <section className="home-shell" style={{ maxWidth: "1180px", margin: "0 auto 100px", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "32px" }}>
          {BLOG_LIST.map((post) => (
            <article 
              key={post.slug}
              style={{
                background: "#ffffff",
                border: "1px solid #e7e2d6",
                borderRadius: "4px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div style={{ position: "relative", width: "100%", height: "280px" }}>
                  <Image
                    src={post.heroImage}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </Link>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", color: "#7b803e" }}>
                    {post.kicker}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: "8px 0 12px", color: "#191815" }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.6, margin: "0 0 16px" }}>
                    {post.subtitle}
                  </p>
                </div>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="home-link"
                  style={{ fontSize: "10px", letterSpacing: "1.2px", fontWeight: 600, color: "#191815", textDecoration: "none" }}
                >
                  EXPLORE ARTICLE <span>↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
