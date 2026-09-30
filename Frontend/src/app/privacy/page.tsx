import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "64px 24px 96px", fontFamily: "var(--font-inter), sans-serif", color: "#222" }}>
        <div style={{ marginBottom: 40, borderBottom: "1px solid #ECE7DE", paddingBottom: 28 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#927d3d", fontWeight: 600 }}>
            LEGAL &amp; COMPLIANCE
          </span>
          <h1 style={{ fontFamily: "var(--font-serif), serif", fontSize: 42, fontWeight: 400, margin: "14px 0 10px", color: "#1c1c1a" }}>
            Privacy Policy &amp; Terms
          </h1>
          <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
            Effective Date: January 1, 2026 · Last Updated: September 2026
          </p>
        </div>

        <section style={{ lineHeight: 1.8, fontSize: 14.5, color: "#444", display: "flex", flexDirection: "column", gap: 32 }}>
          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              1. Our Commitment to Your Privacy
            </h2>
            <p>
              At India Home Furnishings (&quot;IHF&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we craft bespoke draperies, shades, and fine furnishings with the utmost dedication to craftsmanship, integrity, and trust. We treat your personal and architectural design information with the highest degree of confidentiality and care.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              2. Information We Collect
            </h2>
            <p>When you browse our storefront, request fabric swatches, or configure bespoke drapery, we collect:</p>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Contact Information:</strong> Full name, shipping and billing addresses, email address, and phone number.</li>
              <li><strong>Made-to-Measure Specifications:</strong> Room names, custom window width and drop dimensions, pleat headings, lining selections, and atelier workroom notes.</li>
              <li><strong>Transaction Details:</strong> Items ordered, pricing breakdown, currency, and payment confirmation tokens. Note that sensitive credit card details are handled directly via PCI-DSS Level 1 compliant Stripe infrastructure; we never store your full payment card credentials on our servers.</li>
              <li><strong>Technical Data:</strong> IP address, device specifications, browser type, and interaction cookies to maintain your shopping bag and custom drapery configurations.</li>
            </ul>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              3. How We Use Your Information
            </h2>
            <p>Your details are utilized strictly for:</p>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Precision tailoring, cutting, sewing, and inspection in our textile atelier.</li>
              <li>Dispatching complimentary fabric sample kits and finished goods with tracked courier delivery.</li>
              <li>Sending transactional receipts, production milestone updates, and consultation notifications.</li>
              <li>Providing attentive customer concierge support before, during, and after installation.</li>
            </ul>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              4. Bespoke Manufacturing Terms
            </h2>
            <p>
              Because custom draperies and roman shades are tailored to your exact window measurements and selected fabrics, orders entered into atelier production cannot be cancelled or modified after 24 hours of placement. Every custom order is covered by our <em>Flawless Fit Guarantee</em> — if an atelier manufacturing defect occurs, we will adjust or remake your panel promptly.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              5. Contact Our Privacy Concierge
            </h2>
            <p>
              If you have any questions regarding your data, wish to request access or deletion of your stored information, or need clarification regarding custom orders, please contact our atelier team:
            </p>
            <div style={{ background: "#FAF8F5", border: "1px solid #ECE7DE", borderRadius: 8, padding: "20px 24px", marginTop: 12 }}>
              <p style={{ margin: 0, fontWeight: 600, color: "#1c1c1a" }}>India Home Furnishings Atelier Concierge</p>
              <p style={{ margin: "4px 0", color: "#666" }}>Email: <a href="mailto:concierge@indiahomefurnishings.com" style={{ textDecoration: "underline", color: "#1c1c1a" }}>concierge@indiahomefurnishings.com</a></p>
              <p style={{ margin: "4px 0", color: "#666" }}>Toll-Free: +1 (800) 555-0199 (Mon–Fri, 9am–6pm EST)</p>
            </div>
          </article>
        </section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #ECE7DE" }}>
          <Link href="/" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#1c1c1a" }}>
            ← Return to Storefront
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
