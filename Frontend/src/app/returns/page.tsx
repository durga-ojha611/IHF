import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";

export const metadata = {
  title: "Returns & Exchanges | India Home Furnishings",
  description: "Understand the return and exchange policy for India Home Furnishings bespoke draperies and ready-to-ship furnishings.",
};

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "64px 24px 96px", fontFamily: "var(--font-inter), sans-serif", color: "#222" }}>
        <div style={{ marginBottom: 40, borderBottom: "1px solid #ECE7DE", paddingBottom: 28 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#927d3d", fontWeight: 600 }}>
            CUSTOMER SERVICE
          </span>
          <h1 style={{ fontFamily: "var(--font-serif), serif", fontSize: 42, fontWeight: 400, margin: "14px 0 10px", color: "#1c1c1a" }}>
            Returns &amp; Exchanges
          </h1>
          <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Last Updated: September 2026</p>
        </div>

        <section style={{ lineHeight: 1.8, fontSize: 14.5, color: "#444", display: "flex", flexDirection: "column", gap: 32 }}>
          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              Our Flawless Fit Guarantee
            </h2>
            <p>
              At India Home Furnishings, every piece is crafted with meticulous precision in our atelier. We stand behind our workmanship with the <strong>Flawless Fit Guarantee</strong>: if any item we ship has a verifiable manufacturing defect, we will repair or remake it at no charge within 30 days of delivery.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              Custom-Made Items
            </h2>
            <p>Because our draperies and shades are tailored to your exact window specifications, <strong>custom-made items are not eligible for standard returns or exchanges</strong>. This includes:</p>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Custom drapery panels, roman shades, and valances</li>
              <li>Bespoke bedding and table linens configured to specific dimensions</li>
              <li>Any product where custom measurements, fabric, or embellishments were specified</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Exceptions are made only when a manufacturing defect is confirmed by our quality control team upon receiving photographic documentation.
            </p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              Ready-to-Ship Items
            </h2>
            <p>Standard (non-custom) products may be returned within <strong>14 days of delivery</strong>, provided they are:</p>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Unused and in original, unaltered condition</li>
              <li>In the original packaging with all labels and tags intact</li>
              <li>Accompanied by proof of purchase</li>
            </ul>
            <p style={{ marginTop: 12 }}>A 10% restocking fee will be deducted from your refund. Shipping costs are non-refundable unless the return is due to our error.</p>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              How to Initiate a Return
            </h2>
            <ol style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
              <li>Email <a href="mailto:concierge@indiahomefurnishings.com" style={{ color: "#927d3d", textDecoration: "underline" }}>concierge@indiahomefurnishings.com</a> with your order number and description of the issue.</li>
              <li>Attach clear photographs documenting any defect or damage.</li>
              <li>Our team will respond within 1–2 business days with next steps.</li>
              <li>If approved, we will send a prepaid return shipping label.</li>
              <li>Refunds are issued to the original payment method within 5–10 business days of receiving the item.</li>
            </ol>
          </article>
        </section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #ECE7DE", display: "flex", gap: 24 }}>
          <Link href="/shipping" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#1c1c1a" }}>← Shipping Policy</Link>
          <Link href="/faq" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#927d3d" }}>FAQs →</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
