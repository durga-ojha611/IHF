import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";

export const metadata = {
  title: "Shipping & Returns | India Home Furnishings",
  description:
    "Learn about India Home Furnishings shipping policies, delivery timelines, returns, and our Flawless Fit Guarantee for all custom bespoke orders.",
};

export default function ShippingPage() {
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
            DELIVERY &amp; RETURNS
          </span>
          <h1 style={{ fontFamily: "var(--font-serif), serif", fontSize: 42, fontWeight: 400, margin: "14px 0 10px", color: "#1c1c1a" }}>
            Shipping &amp; Returns
          </h1>
          <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
            Last Updated: September 2026
          </p>
        </div>

        <section style={{ lineHeight: 1.8, fontSize: 14.5, color: "#444", display: "flex", flexDirection: "column", gap: 32 }}>
          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              1. Production Lead Times
            </h2>
            <p>Because every item at India Home Furnishings is made-to-measure in our atelier, production timelines apply before shipment:</p>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Custom Draperies &amp; Valances:</strong> 3–5 weeks from confirmed order.</li>
              <li><strong>Roman Shades &amp; Panels:</strong> 4–6 weeks from confirmed order.</li>
              <li><strong>Fabric Swatches &amp; Samples:</strong> Dispatched within 2–3 business days.</li>
              <li><strong>Ready-to-Ship Items:</strong> 5–7 business days.</li>
            </ul>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              2. Shipping Rates &amp; Coverage
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
              {[
                { region: "🇺🇸 USA (Continental)", rate: "FREE on orders over $150\n$14.99 flat rate under $150" },
                { region: "🇨🇦 Canada", rate: "Flat rate $24.99\nDuty &amp; tax may apply" },
                { region: "🇬🇧 United Kingdom", rate: "Flat rate $34.99\nDuty &amp; tax included" },
                { region: "🌍 International", rate: "Calculated at checkout\nMost countries supported" },
              ].map(({ region, rate }) => (
                <div key={region} style={{ background: "#FAF8F5", border: "1px solid #ECE7DE", borderRadius: 8, padding: "16px 20px" }}>
                  <p style={{ fontWeight: 600, color: "#1c1c1a", margin: "0 0 6px" }}>{region}</p>
                  <p style={{ margin: 0, color: "#666", fontSize: 13, whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: rate }} />
                </div>
              ))}
            </div>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              3. Tracking Your Order
            </h2>
            <p>
              Once your order has shipped, you will receive a tracking notification via email with a courier tracking number. You can also monitor your order status in real time by visiting your{" "}
              <Link href="/account" style={{ color: "#927d3d", textDecoration: "underline" }}>Account Dashboard</Link>.
              Our concierge team is always available to provide personal shipping updates.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              4. Returns &amp; Exchanges
            </h2>
            <p>Because our products are bespoke and made-to-your-exact specifications, our return policy is as follows:</p>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
              <li>
                <strong>Custom-Made Items:</strong> Not eligible for return unless a verified manufacturing defect is present. Our <em>Flawless Fit Guarantee</em> covers all atelier workmanship defects — we will remake at no cost.
              </li>
              <li>
                <strong>Ready-to-Ship Items:</strong> Eligible for return within 14 days of delivery in original, unused condition with all original packaging. A 10% restocking fee applies.
              </li>
              <li>
                <strong>Fabric Swatches:</strong> Non-returnable as they are sample items sold at cost.
              </li>
            </ul>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              5. How to Initiate a Return
            </h2>
            <p>To initiate a return or report a defect:</p>
            <ol style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Email our concierge at <a href="mailto:concierge@indiahomefurnishings.com" style={{ color: "#927d3d", textDecoration: "underline" }}>concierge@indiahomefurnishings.com</a> with your order number and photos.</li>
              <li>Our team will review and respond within 1–2 business days.</li>
              <li>If approved, we will provide a prepaid return label or initiate a remake order.</li>
              <li>Refunds (where applicable) are issued to the original payment method within 5–10 business days of receiving the returned item.</li>
            </ol>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              6. Damage in Transit
            </h2>
            <p>
              All orders are packaged with professional care using atelier-grade materials. In the rare event that your order arrives damaged, please document the damage with photographs upon receipt and contact us within 48 hours. We will arrange a replacement or repair immediately at no cost to you.
            </p>
          </article>
        </section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #ECE7DE", display: "flex", gap: 24 }}>
          <Link href="/" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#1c1c1a" }}>
            ← Return to Storefront
          </Link>
          <Link href="/faq" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#927d3d" }}>
            FAQs →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
