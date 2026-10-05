import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";

export const metadata = {
  title: "Terms & Conditions | India Home Furnishings",
  description:
    "Review the Terms & Conditions for shopping at India Home Furnishings — including our bespoke order policies, cancellation terms, and atelier guarantee.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "64px 24px 96px",
          fontFamily: "var(--font-inter), sans-serif",
          color: "#222",
        }}
      >
        <div style={{ marginBottom: 40, borderBottom: "1px solid #ECE7DE", paddingBottom: 28 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#927d3d", fontWeight: 600 }}>
            LEGAL &amp; COMPLIANCE
          </span>
          <h1 style={{ fontFamily: "var(--font-serif), serif", fontSize: 42, fontWeight: 400, margin: "14px 0 10px", color: "#1c1c1a" }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
            Effective Date: January 1, 2026 · Last Updated: September 2026
          </p>
        </div>

        <section style={{ lineHeight: 1.8, fontSize: 14.5, color: "#444", display: "flex", flexDirection: "column", gap: 32 }}>
          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or purchasing from India Home Furnishings (&quot;IHF&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), you agree to be bound by these Terms &amp; Conditions. These terms apply to all visitors, customers, and registered account holders. If you do not agree, please discontinue use of our website.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              2. Bespoke &amp; Made-to-Order Policy
            </h2>
            <p>All draperies, roman shades, valances, and custom-configured home furnishings are made-to-measure in our atelier. As a result:</p>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>No Returns on Custom Orders:</strong> Custom-made items are not eligible for return or exchange unless there is a verified manufacturing defect.</li>
              <li><strong>24-Hour Cancellation Window:</strong> Orders may be cancelled or modified within 24 hours of placement. After this window, production begins and the order is final.</li>
              <li><strong>Flawless Fit Guarantee:</strong> If an atelier manufacturing defect is confirmed, we will remake or repair the item at no additional cost within 30 days of delivery.</li>
            </ul>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              3. Pricing &amp; Payment
            </h2>
            <p>
              All prices are in US Dollars (USD) unless otherwise stated. IHF reserves the right to modify pricing without notice. Payments are processed securely via Stripe (PCI-DSS Level 1). We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. Full payment is required at the time of order placement.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              4. Shipping &amp; Delivery
            </h2>
            <p>
              Production lead times for custom orders are typically 3–6 weeks depending on fabric availability and complexity. Standard ready-to-ship items ship within 5–7 business days. Estimated delivery dates are provided in good faith and are not guaranteed. IHF is not liable for delays caused by third-party carriers or customs.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              5. Intellectual Property
            </h2>
            <p>
              All content on the India Home Furnishings website — including product images, fabric swatch photography, design renderings, logo marks, and written descriptions — is the exclusive intellectual property of IHF. Reproduction or commercial use without express written permission is strictly prohibited.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              6. Limitation of Liability
            </h2>
            <p>
              IHF shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products or services. Our maximum liability to any customer shall not exceed the total amount paid for the specific order in question.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              7. Governing Law
            </h2>
            <p>
              These Terms &amp; Conditions are governed by the laws of the State of California, USA. Any disputes shall be resolved in the courts of Los Angeles County, California.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              8. Contact Our Atelier Team
            </h2>
            <p>For any questions about these terms, please reach our concierge team:</p>
            <div style={{ background: "#FAF8F5", border: "1px solid #ECE7DE", borderRadius: 8, padding: "20px 24px", marginTop: 12 }}>
              <p style={{ margin: 0, fontWeight: 600, color: "#1c1c1a" }}>India Home Furnishings Atelier Concierge</p>
              <p style={{ margin: "4px 0", color: "#666" }}>Email: <a href="mailto:concierge@indiahomefurnishings.com" style={{ textDecoration: "underline", color: "#1c1c1a" }}>concierge@indiahomefurnishings.com</a></p>
              <p style={{ margin: "4px 0", color: "#666" }}>Toll-Free: +1 (800) 555-0199 (Mon–Fri, 9am–6pm EST)</p>
            </div>
          </article>
        </section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #ECE7DE", display: "flex", gap: 24 }}>
          <Link href="/" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#1c1c1a" }}>
            ← Return to Storefront
          </Link>
          <Link href="/privacy" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#927d3d" }}>
            Privacy Policy →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
