"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
import { useCommerce } from "@/components/commerce-context";
import { CategoryCustomizerConfig, CustomizerStyleConfig } from "@/lib/customizer-configs";
import { ALL_FABRICS, FabricItem } from "@/lib/fabrics-data";
import "@/app/drapery/configure/details/details.css";

interface Props {
  config: CategoryCustomizerConfig;
  initialStyleSlug?: string;
  initialFabricSlug?: string;
  category: string;
}

export default function CategoryDetailsClient({ config, initialStyleSlug, initialFabricSlug, category }: Props) {
  const { addToCart } = useCommerce();

  const activeStyle: CustomizerStyleConfig = useMemo(() => {
    return config.styles.find((s) => s.slug === initialStyleSlug) || config.styles[0];
  }, [config, initialStyleSlug]);

  const activeFabric: FabricItem = useMemo(() => {
    return ALL_FABRICS.find((f) => f.slug === initialFabricSlug) || ALL_FABRICS[3];
  }, [initialFabricSlug]);

  // Spec States
  const [width, setWidth] = useState<string>("54 1/2");
  const [height, setHeight] = useState<string>("96");
  const [mount, setMount] = useState<string>(activeStyle.specs.mountTypes?.[0] || "Inside Window Casing (Flush)");
  const [lining, setLining] = useState<string>(activeStyle.specs.liningOptions?.[0] || "Cotton Privacy Lining");
  const [control, setControl] = useState<string>(activeStyle.specs.controlOptions?.[0] || "Precision Cordless Lift");
  const [hardware, setHardware] = useState<string>(activeStyle.specs.hardwareFinishes?.[0] || "Antique Brass");
  const [roomLabel, setRoomLabel] = useState<string>("Living Room");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");

  const [added, setAdded] = useState<boolean>(false);

  // Price Calculation
  const totalPrice = useMemo(() => {
    let p = activeStyle.price;
    if (activeFabric.priceGroup === "B") p += 30;
    if (activeFabric.priceGroup === "C") p += 60;
    if (activeFabric.priceGroup === "D") p += 90;
    if (lining.toLowerCase().includes("blackout")) p += 65;
    if (control.toLowerCase().includes("motor")) p += 190;
    return p;
  }, [activeStyle, activeFabric, lining, control]);

  const handleAddToCart = () => {
    addToCart({
      id: `custom-${category}-${activeStyle.slug}-${Date.now()}`,
      productId: activeStyle.id,
      name: `Custom ${activeStyle.name}`,
      price: totalPrice,
      image: activeStyle.image,
      variant: `${activeFabric.name} (${activeFabric.color.name}) · ${width}″ W × ${height}″ H · ${roomLabel}`,
      quantity: 1,
      isCustom: true,
      specs: {
        width,
        height,
        mount,
        lining,
        hardware,
        fullness: control,
        pleat: activeStyle.name
      }
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 5000);
  };

  return (
    <div className="drape-flow">
      <Header />
      <main className="details-container" style={{ maxWidth: 1140, margin: "auto", padding: "50px 24px 100px" }}>
        {/* Step Indicator */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, letterSpacing: 1, color: "#888", marginBottom: 30, textTransform: "uppercase" }}>
          <Link href={`/configure/${category}`} style={{ color: "#111", textDecoration: "none" }}>
            01 Style
          </Link>
          <span>/</span>
          <Link href={`/configure/${category}/fabric?style=${activeStyle.slug}`} style={{ color: "#111", textDecoration: "none" }}>
            02 Fabric &amp; Material
          </Link>
          <span>/</span>
          <span style={{ color: "#927d3d", fontWeight: 700 }}>03 Measurements &amp; Details</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 50, alignItems: "start" }}>
          {/* Left Column: Form Controls */}
          <div>
            <span style={{ fontSize: 9, letterSpacing: 2, color: "#927d3d", fontWeight: 600, textTransform: "uppercase" }}>
              STEP 03 — PRECISION ATELIER SPECIFICATIONS
            </span>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 36, margin: "10px 0 8px", color: "#1c1a17" }}>
              Tailor Your {activeStyle.name}
            </h1>
            <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7, marginBottom: 32 }}>
              Bench-crafted to 1/8″ accuracy in {activeFabric.name} ({activeFabric.color.name}). Provide your exact window clearances below.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Measurements */}
              <div style={{ background: "#fff", border: "1px solid #ddd7cb", borderRadius: 8, padding: 24 }}>
                <h3 style={{ fontSize: 14, letterSpacing: 1, margin: "0 0 16px", textTransform: "uppercase", fontWeight: 600 }}>
                  1. Finished Dimensions (Inches)
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: 1, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>
                      Finished Width (Inches)
                    </label>
                    <input
                      type="text"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d4cfc4", borderRadius: 4, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: 1, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>
                      Finished Height / Drop (Inches)
                    </label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d4cfc4", borderRadius: 4, fontSize: 13 }}
                    />
                  </div>
                </div>
              </div>

              {/* Mounting Method */}
              {activeStyle.specs.mountTypes && (
                <div style={{ background: "#fff", border: "1px solid #ddd7cb", borderRadius: 8, padding: 24 }}>
                  <h3 style={{ fontSize: 14, letterSpacing: 1, margin: "0 0 16px", textTransform: "uppercase", fontWeight: 600 }}>
                    2. Mounting Installation
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {activeStyle.specs.mountTypes.map((m) => (
                      <label key={m} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="mount"
                          checked={mount === m}
                          onChange={() => setMount(m)}
                        />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Lining / Core */}
              {activeStyle.specs.liningOptions && (
                <div style={{ background: "#fff", border: "1px solid #ddd7cb", borderRadius: 8, padding: 24 }}>
                  <h3 style={{ fontSize: 14, letterSpacing: 1, margin: "0 0 16px", textTransform: "uppercase", fontWeight: 600 }}>
                    3. Lining &amp; Light Control
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {activeStyle.specs.liningOptions.map((l) => (
                      <label key={l} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="lining"
                          checked={lining === l}
                          onChange={() => setLining(l)}
                        />
                        <span>{l} {l.toLowerCase().includes("blackout") && "(+$65)"}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Operation / Controls */}
              {activeStyle.specs.controlOptions && (
                <div style={{ background: "#fff", border: "1px solid #ddd7cb", borderRadius: 8, padding: 24 }}>
                  <h3 style={{ fontSize: 14, letterSpacing: 1, margin: "0 0 16px", textTransform: "uppercase", fontWeight: 600 }}>
                    4. Control &amp; Operation
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {activeStyle.specs.controlOptions.map((c) => (
                      <label key={c} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="control"
                          checked={control === c}
                          onChange={() => setControl(c)}
                        />
                        <span>{c} {c.toLowerCase().includes("motor") && "(+$190 Smart Hub Included)"}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Label */}
              <div style={{ background: "#fff", border: "1px solid #ddd7cb", borderRadius: 8, padding: 24 }}>
                <h3 style={{ fontSize: 14, letterSpacing: 1, margin: "0 0 16px", textTransform: "uppercase", fontWeight: 600 }}>
                  5. Room Location &amp; Atelier Notes
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: 1, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>
                      Room Label (Printed on Seam Tag)
                    </label>
                    <input
                      type="text"
                      value={roomLabel}
                      onChange={(e) => setRoomLabel(e.target.value)}
                      placeholder="e.g. Master Bedroom North Window"
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d4cfc4", borderRadius: 4, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: 1, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>
                      Special Workroom Instructions (Optional)
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows={3}
                      placeholder="Specific clearance or puddle notes..."
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d4cfc4", borderRadius: 4, fontSize: 12, resize: "vertical" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Order Summary Card */}
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{ background: "#fff", border: "1px solid #d9d4c7", borderRadius: 10, padding: 32, boxShadow: "0 6px 24px rgba(0,0,0,0.04)" }}>
              <div style={{ position: "relative", height: 260, borderRadius: 6, overflow: "hidden", marginBottom: 20 }}>
                <Image src={activeStyle.image} alt={activeStyle.name} fill priority sizes="40vw" style={{ objectFit: "cover" }} />
              </div>

              <span style={{ fontSize: 9, letterSpacing: 2, color: "#927d3d", fontWeight: 600, textTransform: "uppercase" }}>
                ORDER SPECIFICATION SUMMARY
              </span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, margin: "6px 0 16px", color: "#1c1a17" }}>
                Custom {activeStyle.name}
              </h2>

              <div style={{ borderTop: "1px solid #eee", borderBottom: "1px solid #eee", padding: "16px 0", fontSize: 11, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#777" }}>Fabric &amp; Color:</span>
                  <b>{activeFabric.name} ({activeFabric.color.name})</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#777" }}>Price Tier:</span>
                  <span>Price Group {activeFabric.priceGroup}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#777" }}>Dimensions:</span>
                  <b>{width}″ W × {height}″ H</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#777" }}>Mounting:</span>
                  <span>{mount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#777" }}>Lining:</span>
                  <span>{lining}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#777" }}>Control System:</span>
                  <span>{control}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#777" }}>Room Designation:</span>
                  <span>{roomLabel}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "20px 0" }}>
                <span style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#555" }}>
                  Total Custom Price:
                </span>
                <b style={{ fontFamily: "var(--font-serif)", fontSize: 30, color: "#1c1a17" }}>
                  ${totalPrice}
                </b>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  width: "100%",
                  background: "#111",
                  color: "#fff",
                  border: 0,
                  padding: "16px",
                  fontSize: 10,
                  letterSpacing: 2,
                  fontWeight: 600,
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                {added ? "✓ ADDED TO SHOPPING BAG" : "ADD BESPOKE PIECE TO BAG"}
              </button>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <Link
                  href="/swatches"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    border: "1px solid #111",
                    padding: "12px",
                    fontSize: 9,
                    letterSpacing: 1.2,
                    textDecoration: "none",
                    color: "#111",
                    borderRadius: 3
                  }}
                >
                  ORDER FREE SWATCH ($0)
                </Link>
                <Link
                  href="/cart"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    background: "#f4f1ea",
                    padding: "12px",
                    fontSize: 9,
                    letterSpacing: 1.2,
                    textDecoration: "none",
                    color: "#111",
                    borderRadius: 3
                  }}
                >
                  VIEW BAG ↗
                </Link>
              </div>

              <p style={{ fontSize: 10, color: "#888", textAlign: "center", marginTop: 18, lineHeight: 1.5 }}>
                Free worldwide white-glove delivery · 100% atelier fit guarantee · Handcrafted to millimeter accuracy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
