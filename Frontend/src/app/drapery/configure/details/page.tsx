"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
import { customizerApi } from "@/lib/api";
import { useCommerce } from "@/components/commerce-context";
import "./details.css";

const groups = [
  ["02", "SELECT MOUNT & POSITION", ["INSIDE MOUNT", "OUTSIDE MOUNT", "CEILING MOUNT"]],
  ["03", "CHOOSE YOUR LINING", ["COTTON PRIVACY LINING", "100% BLACKOUT LINING", "UNLINED"]],
  ["04", "RODS, RAILS & MOTORIZED SYSTEMS", ["CLASSIC ROD", "TRAVERSE ROD", "SOMFY MOTORIZED TRACK"]],
  ["05", "SELECT DRAPERY HARDWARE", ["ANTIQUE BRASS", "MATTE BLACK", "SATIN NICKEL", "DARK BRONZE"]],
  ["06", "EMBROIDERED TRIMS", ["CLEAN FINISH", "CLASSIC BORDER", "ORNATE BORDER"]],
  ["07", "VALANCE CONFIGURATION", ["NO VALANCE", "UPHOLSTERED CORNICE", "SOFT VALANCE"]],
  ["08", "TIE BACKS", ["STRAIGHT TIEBACK", "SCULPTED TIEBACK"]]
];

export default function Details() {
  const { addToCart } = useCommerce();
  const [, startTransition] = useTransition();

  // Customizer State
  const [width, setWidth] = useState("54 1/2");
  const [height, setHeight] = useState("96");
  const [panelConfig, setPanelConfig] = useState<"pair" | "single_panel">("pair");
  const [fullness, setFullness] = useState("standard");
  const [lining, setLining] = useState("privacy");
  const [pleat, setPleat] = useState("pinch-pleat");
  const [mount, setMount] = useState("OUTSIDE MOUNT");
  const [hardware, setHardware] = useState("ANTIQUE BRASS");

  // Price Calculation State
  const [calcLoading, setCalcLoading] = useState(false);
  const [priceResult, setPriceResult] = useState<{
    unitPrice: number;
    totalPrice: number;
    fabricYardage: number;
    fabricCost: number;
    liningCost: number;
    pleatLaborCost: number;
    baseLaborCost: number;
  }>({
    unitPrice: 1097,
    totalPrice: 1097,
    fabricYardage: 9.5,
    fabricCost: 646,
    liningCost: 171,
    pleatLaborCost: 90,
    baseLaborCost: 190
  });

  const [calcError, setCalcError] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState(false);

  // Recalculate price whenever dimensions or options change
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setCalcLoading(true);
      setCalcError(null);
      try {
        const liningId = lining.includes("BLACKOUT") ? "blackout" : lining.includes("UNLINED") ? "unlined" : "privacy";
        const res = await customizerApi.calculatePrice({
          productId: "660000000000000000000006",
          width: width.trim().endsWith("\"") ? width.trim() : `${width.trim()}"`,
          height: height.trim().endsWith("\"") ? height.trim() : `${height.trim()}"`,
          fullnessId: fullness,
          liningId,
          pleatId: pleat,
          panelConfiguration: panelConfig,
          quantity: 1
        });

        if (active && res.data?.priceBreakdown) {
          const pb = res.data.priceBreakdown;
          startTransition(() => {
            setPriceResult({
              unitPrice: pb.calculatedUnitPrice,
              totalPrice: pb.totalPrice,
              fabricYardage: pb.fabricYardage,
              fabricCost: pb.fabricCost,
              liningCost: pb.liningCost,
              pleatLaborCost: pb.pleatLaborCost,
              baseLaborCost: pb.baseLaborCost
            });
          });
        }
      } catch (err: any) {
        if (active) {
          setCalcError(err.message || "Invalid dimensions. Please enter width between 24\" and 240\".");
        }
      } finally {
        if (active) setCalcLoading(false);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [width, height, fullness, lining, pleat, panelConfig]);

  const handleAddToCart = () => {
    addToCart({
      id: `custom-curtain-${Date.now()}`,
      productId: "660000000000000000000006",
      name: "The Chateau Pure Belgian Flax Linen Drapery",
      price: priceResult.totalPrice,
      image: "/figma/home-01.jpeg",
      variant: `Custom ${panelConfig === "pair" ? "Pair" : "Single"} · ${width}"W × ${height}"H · ${lining}`,
      isCustom: true,
      specs: {
        width,
        height,
        fullness,
        lining,
        pleat,
        mount,
        hardware,
        panelConfiguration: panelConfig,
        priceBreakdown: priceResult
      }
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3500);
  };

  return (
    <div className="details-step">
      <Header />
      <main>
        <header>
          <span>BESPOKE ATELIER CUSTOMIZER</span>
          <h1>Pinch Pleat Linen Drapery</h1>
        </header>

        {addedNotice && (
          <div style={{ maxWidth: 1120, margin: "0 auto 20px", background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>✓ Tailored drapery successfully added to your cart!</span>
            <Link href="/cart" style={{ fontWeight: 600, textDecoration: "underline", color: "#065f46", fontSize: 12 }}>
              VIEW CART &amp; CHECKOUT →
            </Link>
          </div>
        )}

        <div className="details-layout">
          <aside>
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{ position: "relative", width: "100%", height: 500, overflow: "hidden" }}>
                <Image src="/figma/home-01.jpeg" alt="Pinch pleat drapery preview" fill priority sizes="45vw" style={{ objectFit: "cover" }} />
              </div>
              <div style={{ background: "white", padding: 20, border: "1px solid #e0ded8", marginTop: 14 }}>
                <h4 style={{ fontFamily: "var(--font-serif)", fontSize: 18, margin: "0 0 8px" }}>Live Engineering Summary</h4>
                <p style={{ fontSize: 11, color: "#666", margin: "0 0 12px", lineHeight: 1.5 }}>
                  {panelConfig === "pair" ? "Pair (2 panels)" : "Single Panel"} · {width}&quot; Finished Width × {height}&quot; Drop
                </p>
                <div style={{ fontSize: 11, borderTop: "1px solid #eee", paddingTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span>Fabric Yardage:</span>
                    <b>{priceResult.fabricYardage} yards</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span>Fabric Cost:</span>
                    <b>${priceResult.fabricCost.toFixed(2)}</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span>Lining &amp; Labor:</span>
                    <b>${(priceResult.liningCost + priceResult.pleatLaborCost + priceResult.baseLaborCost).toFixed(2)}</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid #eee", fontSize: 13 }}>
                    <b>Calculated Total:</b>
                    <b style={{ color: "#7b803e" }}>
                      {calcLoading ? "Calculating..." : `$${priceResult.totalPrice.toFixed(2)}`}
                    </b>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section>
            {/* Step 1: Measurements */}
            <div className="config-section measurements">
              <div className="section-label">
                <b>01</b>
                <span>PRECISE MEASUREMENTS</span>
                <small>Server Validated Pricing</small>
              </div>
              <h2>YOUR MEASUREMENTS</h2>
              <p>Enter your finished dimensions with optional fractions (e.g. 54 1/2, 120, 96 1/4).</p>

              {calcError && (
                <div style={{ background: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", padding: "8px 12px", fontSize: 11, marginBottom: 14 }}>
                  {calcError}
                </div>
              )}

              <div className="measurement-grid">
                <label>
                  WINDOW WIDTH
                  <input
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="54 1/2"
                  />
                  <small>inches (24&quot; - 240&quot;)</small>
                </label>
                <label>
                  FINISHED LENGTH
                  <input
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="96"
                  />
                  <small>inches (36&quot; - 200&quot;)</small>
                </label>
                <label>
                  PANEL CONFIGURATION
                  <select
                    value={panelConfig}
                    onChange={(e) => setPanelConfig(e.target.value as "pair" | "single_panel")}
                  >
                    <option value="pair">Pair (2 panels)</option>
                    <option value="single_panel">Single panel (1 panel)</option>
                  </select>
                </label>
                <label>
                  FULLNESS
                  <select
                    value={fullness}
                    onChange={(e) => setFullness(e.target.value)}
                  >
                    <option value="standard">2.0× Standard Fullness</option>
                    <option value="deluxe">2.5× Deluxe Fullness</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Config Groups */}
            {groups.map(([n, title, options], index) => (
              <div className="config-section" key={title as string}>
                <div className="section-label">
                  <b>{n as string}</b>
                  <span>{title as string}</span>
                  <small>
                    Selected: {index === 0 ? mount : index === 1 ? lining : index === 3 ? hardware : "Tailored Atelier"}
                  </small>
                </div>
                <div className="option-grid">
                  {(options as string[]).map((x, i) => {
                    const isSelected =
                      index === 0
                        ? mount === x
                        : index === 1
                        ? lining === x
                        : index === 3
                        ? hardware === x
                        : i === 0;

                    return (
                      <label
                        className={isSelected ? "selected" : ""}
                        key={x}
                        onClick={() => {
                          if (index === 0) setMount(x);
                          if (index === 1) setLining(x);
                          if (index === 3) setHardware(x);
                        }}
                      >
                        <input
                          type="radio"
                          name={title as string}
                          checked={isSelected}
                          onChange={() => {}}
                        />
                        <div className="option-visual">
                          {index === 1 ? (
                            <Image
                              src={["/figma/home-19.png", "/figma/home-03.jpeg", "/figma/home-12.jpeg"][i] || "/figma/home-03.jpeg"}
                              alt=""
                              fill
                              sizes="12vw"
                            />
                          ) : (
                            <span>{index === 3 ? ["●", "●", "●", "●"][i] : "▥"}</span>
                          )}
                        </div>
                        <b>{x}</b>
                        <small>
                          {index === 2 ? "Tailored for smooth operation" : "Recommended for this luxury style"}
                        </small>
                      </label>
                    );
                  })}
                </div>
                {index === 3 && (
                  <div className="finish-swatches">
                    {["#bd9a47", "#272727", "#88847d", "#6d5745", "#ddd6c5", "#857b69"].map((c) => (
                      <i key={c} style={{ background: c }} />
                    ))}
                  </div>
                )}
                {index === 4 && (
                  <div className="trim-feature">
                    <Image src="/figma/home-04.jpeg" alt="Trim detail" width={180} height={130} />
                    <div>
                      <h3>Champagne Ivory Tassel</h3>
                      <p>Hand-finished decorative trim with a soft architectural drape.</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Final Summary Card */}
            <div className="config-section final-summary">
              <h2>YOUR CUSTOM DRAPERY</h2>
              <p>
                Pinch Pleat · Belgian Flax Linen · {lining} · {hardware} ({panelConfig === "pair" ? "Pair" : "Single"})
              </p>
              <div>
                <span>Calculated Price</span>
                <b>
                  {calcLoading ? "Recalculating..." : `$${priceResult.totalPrice.toFixed(2)}`}
                </b>
              </div>
              <button type="button" onClick={handleAddToCart}>
                {addedNotice ? "✓ ADDED TO CART" : "ADD TO CART"}
              </button>
            </div>
          </section>
        </div>
      </main>

      <div className="detail-bottom-bar">
        <span>
          YOUR CUSTOM DRAPERY
          <small>
            {panelConfig === "pair" ? "Pair" : "Single"} · {width}&quot; × {height}&quot; · {lining}
          </small>
        </span>
        <b>${priceResult.totalPrice.toFixed(2)}</b>
        <button type="button" onClick={handleAddToCart}>
          {addedNotice ? "✓ ADDED TO CART" : "ADD TO CART"}
        </button>
      </div>
      <Footer />
    </div>
  );
}
