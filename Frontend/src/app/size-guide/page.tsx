import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";

export const metadata = {
  title: "Size Guide | India Home Furnishings",
  description: "How to measure your windows accurately for custom draperies, roman shades, and valances from India Home Furnishings.",
};

export default function SizeGuidePage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "64px 24px 96px", fontFamily: "var(--font-inter), sans-serif", color: "#222" }}>
        <div style={{ marginBottom: 40, borderBottom: "1px solid #ECE7DE", paddingBottom: 28 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#927d3d", fontWeight: 600 }}>
            MEASUREMENT GUIDE
          </span>
          <h1 style={{ fontFamily: "var(--font-serif), serif", fontSize: 42, fontWeight: 400, margin: "14px 0 10px", color: "#1c1c1a" }}>
            Size &amp; Measurement Guide
          </h1>
          <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Precision starts with the perfect measurement.</p>
        </div>

        <section style={{ lineHeight: 1.8, fontSize: 14.5, color: "#444", display: "flex", flexDirection: "column", gap: 32 }}>
          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              Tools You Will Need
            </h2>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>A steel measuring tape (cloth tapes can stretch and distort readings)</li>
              <li>A pencil and notepad to record measurements</li>
              <li>A step ladder for higher windows</li>
            </ul>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              Measuring for Draperies &amp; Curtain Panels
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { step: "Width", desc: "Measure the width of your window from wall to wall or between your curtain rod brackets. For a generous, luxurious look, multiply the window width by 2–2.5 to determine the total fabric width needed." },
                { step: "Drop (Length)", desc: "Measure from the top of your curtain rod to your desired endpoint. For floor-length panels: measure to the floor and subtract 0.5\" for a clean break, or add 6\"–12\" for a dramatic puddle look." },
                { step: "Header Clearance", desc: "Ensure at least 4\"–6\" of wall space above the window frame to mount your rod and create an illusion of height." },
              ].map(({ step, desc }) => (
                <div key={step} style={{ background: "#FAF8F5", border: "1px solid #ECE7DE", borderRadius: 8, padding: "16px 20px" }}>
                  <p style={{ fontWeight: 600, color: "#1c1c1a", margin: "0 0 6px" }}>{step}</p>
                  <p style={{ margin: 0, color: "#555", fontSize: 13.5 }}>{desc}</p>
                </div>
              ))}
            </div>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              Measuring for Roman Shades
            </h2>
            <p><strong>Inside mount</strong> (shade sits inside the window frame):</p>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              <li>Measure the inside width at the top, middle, and bottom. Use the <em>narrowest</em> measurement.</li>
              <li>Measure the inside drop from top to sill. Use the <em>longest</em> measurement.</li>
            </ul>
            <p style={{ marginTop: 12 }}><strong>Outside mount</strong> (shade is mounted above and wider than the window frame):</p>
            <ul style={{ paddingLeft: 22, marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              <li>Add 2\"–3\" to each side of the window frame for adequate coverage.</li>
              <li>Add 2\"–4\" above the frame and measure to where you want the shade to end.</li>
            </ul>
          </article>

          <article>
            <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, fontWeight: 500, color: "#1c1c1a", marginBottom: 12 }}>
              Need Expert Help?
            </h2>
            <p>
              Our design concierge team is happy to walk you through measurements over video call or email. Schedule a complimentary consultation or reach us at{" "}
              <a href="mailto:concierge@indiahomefurnishings.com" style={{ color: "#927d3d", textDecoration: "underline" }}>concierge@indiahomefurnishings.com</a>.
            </p>
          </article>
        </section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #ECE7DE", display: "flex", gap: 24 }}>
          <Link href="/" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#1c1c1a" }}>← Return to Storefront</Link>
          <Link href="/fabric-care" style={{ fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline", color: "#927d3d" }}>Fabric Care Guide →</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
