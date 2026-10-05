import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";

export const metadata = {
  title: "Fabric Care Guide | India Home Furnishings",
  description: "Professional fabric care instructions for IHF draperies, roman shades, pillows, and luxury furnishings — to keep your home looking pristine.",
};

export default function FabricCarePage() {
  const fabrics = [
    { name: "Linen & Linen Blends", care: "Dry clean recommended. If hand-washing, use cool water with mild detergent. Do not wring — gently press and hang to dry. Iron on medium while slightly damp. Expect 3–5% natural shrinkage." },
    { name: "Silk & Silk Blends", care: "Dry clean only. Silk is extremely sensitive to water marks and heat. Keep away from direct sunlight to prevent fading. Store in a cool, dark place in breathable cotton bags." },
    { name: "Velvet & Velvet Blends", care: "Professional dry clean only. Brush pile in one direction with a soft velvet brush to restore nap. Do not fold — hang or roll in acid-free tissue. Avoid prolonged sunlight exposure." },
    { name: "Cotton & Cotton Sateen", care: "Hand wash in cold water or dry clean. Tumble dry on low heat briefly and remove while slightly damp. Iron on medium-high setting on reverse side. Expect minor shrinkage on first wash." },
    { name: "Sheer & Voile", care: "Hand wash gently in lukewarm water using delicate detergent. Do not wring — drip dry by hanging immediately. Iron on lowest setting with a pressing cloth. Avoid bleach entirely." },
    { name: "Blackout & Performance Fabrics", care: "Wipe with a damp cloth for spot cleaning. Do not submerge in water or dry clean — backing may delaminate. For deep cleaning, consult our concierge team." },
  ];

  return (
    <>
      <Header />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "64px 24px 96px", fontFamily: "var(--font-inter), sans-serif", color: "#222" }}>
        <div style={{ marginBottom: 40, borderBottom: "1px solid #ECE7DE", paddingBottom: 28 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#927d3d", fontWeight: 600 }}>
            CARE &amp; MAINTENANCE
          </span>
          <h1 style={{ fontFamily: "var(--font-serif), serif", fontSize: 42, fontWeight: 400, margin: "14px 0 10px", color: "#1c1c1a" }}>
            Fabric Care Guide
          </h1>
          <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Keep your atelier-crafted pieces looking pristine for decades.</p>
        </div>

        <section style={{ lineHeight: 1.8, fontSize: 14.5, color: "#444", display: "flex", flexDirection: "column", gap: 32 }}>
          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              General Care Principles
            </h2>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Dust your draperies lightly every 2–4 weeks using a soft brush attachment on low suction vacuum.</li>
              <li>Rotate panels periodically to ensure even sun exposure and fading.</li>
              <li>Address spills and stains immediately by blotting (never rubbing) with a clean, damp white cloth.</li>
              <li>Always check care labels sewn into each panel — our atelier includes specific care instructions per fabric.</li>
            </ul>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 16 }}>
              Fabric-Specific Care Instructions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {fabrics.map(({ name, care }) => (
                <div key={name} style={{ background: "#FAF8F5", border: "1px solid #ECE7DE", borderRadius: 8, padding: "18px 22px" }}>
                  <p style={{ fontWeight: 600, color: "#1c1c1a", margin: "0 0 8px", fontSize: 15 }}>{name}</p>
                  <p style={{ margin: 0, color: "#555", fontSize: 13.5, lineHeight: 1.7 }}>{care}</p>
                </div>
              ))}
            </div>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              Professional Cleaning
            </h2>
            <p>
              For heirloom-quality results, we recommend professional dry cleaning every 12–18 months for heavily draped windows in high-traffic rooms. Always inform your cleaner of the fabric composition — our atelier includes a fabric specification card with every order.
            </p>
            <p style={{ marginTop: 12 }}>
              Have questions about caring for a specific fabric? Contact our concierge at{" "}
              <a href="mailto:concierge@indiahomefurnishings.com" style={{ color: "#927d3d", textDecoration: "underline" }}>concierge@indiahomefurnishings.com</a>.
            </p>
          </article>
        </section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #ECE7DE", display: "flex", gap: 24 }}>
          <Link href="/size-guide" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#1c1c1a" }}>← Size Guide</Link>
          <Link href="/faq" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#927d3d" }}>FAQs →</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
