"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
import { useCommerce } from "@/components/commerce-context";
import { CategoryCustomizerConfig, CustomizerStyleConfig } from "@/lib/customizer-configs";
import "../configure.css";

interface Props {
  config: CategoryCustomizerConfig;
  initialStyleSlug?: string;
  initialFabricSlug?: string;
}

export default function CategoryCustomizerClient({ config, initialStyleSlug, initialFabricSlug }: Props) {
  const { addToCart } = useCommerce();

  // Find initial style if passed in URL query
  const defaultStyle = config.styles.find(s => s.slug === initialStyleSlug) || config.styles[0];
  const [activeStyle, setActiveStyle] = useState<CustomizerStyleConfig>(defaultStyle);
  const [configuringStyleId, setConfiguringStyleId] = useState<string | null>(defaultStyle.id);

  // Material & Fabric Selection
  const defaultFabric = config.fabrics.find(f => f.slug === initialFabricSlug) || config.fabrics[0];
  const [selectedFabric, setSelectedFabric] = useState(defaultFabric);

  // Category Specific Options
  const [selectedSize, setSelectedSize] = useState<string>(
    activeStyle.specs.defaultSize || activeStyle.specs.availableSizes?.[0] || "Standard"
  );
  const [selectedMount, setSelectedMount] = useState<string>(
    activeStyle.specs.mountTypes?.[0] || "Inside Window Casing (Flush)"
  );
  const [selectedLining, setSelectedLining] = useState<string>(
    activeStyle.specs.liningOptions?.[0] || "Standard Privacy Twill"
  );
  const [selectedControl, setSelectedControl] = useState<string>(
    activeStyle.specs.controlOptions?.[0] || "Precision Cordless Lift"
  );
  const [selectedInsert, setSelectedInsert] = useState<string>(
    activeStyle.specs.insertOptions?.[0] || "90/10 Goose Down & Feather"
  );
  const [selectedHardware, setSelectedHardware] = useState<string>(
    activeStyle.specs.hardwareFinishes?.[0] || "Aged Antique Brass"
  );
  const [selectedEdge, setSelectedEdge] = useState<string>(
    activeStyle.specs.edgeFinishes?.[0] || "Self-Piped Finish"
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Price Calculation
  const calculatePrice = (style: CustomizerStyleConfig) => {
    let price = style.price;
    // Add premium for blackout lining
    if (selectedLining.toLowerCase().includes("blackout")) {
      price += 65;
    }
    // Add premium for motorized smart control
    if (selectedControl.toLowerCase().includes("motor")) {
      price += 190;
    }
    // Add premium for goose down insert
    if (selectedInsert.toLowerCase().includes("down")) {
      price += 25;
    }
    // Add fabric tier adjustment
    if (selectedFabric?.priceGroup === "C") price += 40;
    if (selectedFabric?.priceGroup === "D") price += 60;
    return price;
  };

  const handleStartCustomizing = (style: CustomizerStyleConfig) => {
    setActiveStyle(style);
    setConfiguringStyleId(style.id);
    if (style.specs.defaultSize) setSelectedSize(style.specs.defaultSize);
    if (style.specs.availableSizes?.[0]) setSelectedSize(style.specs.availableSizes[0]);
    if (style.specs.mountTypes?.[0]) setSelectedMount(style.specs.mountTypes[0]);
    if (style.specs.liningOptions?.[0]) setSelectedLining(style.specs.liningOptions[0]);
    if (style.specs.controlOptions?.[0]) setSelectedControl(style.specs.controlOptions[0]);
    if (style.specs.insertOptions?.[0]) setSelectedInsert(style.specs.insertOptions[0]);
    if (style.specs.hardwareFinishes?.[0]) setSelectedHardware(style.specs.hardwareFinishes[0]);
    if (style.specs.edgeFinishes?.[0]) setSelectedEdge(style.specs.edgeFinishes[0]);
  };

  const handleAddToCart = () => {
    const finalPrice = calculatePrice(activeStyle);
    const customItem = {
      id: `custom-${activeStyle.slug}-${Date.now()}`,
      productId: activeStyle.id,
      name: `Custom ${activeStyle.name}`,
      price: finalPrice,
      image: activeStyle.image,
      variant: `${selectedFabric.name} (${selectedFabric.color}) · ${selectedSize}`,
      isCustom: true,
      specs: {
        width: selectedSize,
        height: selectedSize,
        lining: selectedLining,
        mount: selectedMount,
        hardware: selectedHardware,
        pleat: activeStyle.name,
        fullness: selectedControl || selectedInsert || selectedEdge
      }
    };

    addToCart(customItem);
    setToastMessage(`✓ Bespoke ${activeStyle.name} in ${selectedFabric.name} added to your bag!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="drape-flow">
      <Header />
      <main className="style-step">
        <header>
          <span>CUSTOM {config.name.toUpperCase()} ATELIER</span>
          <h1>{config.customizerHeadline || `Choose Your ${config.name} Style`}</h1>
          <p>{config.customizerSubhead || config.description}</p>
        </header>

        {config.styles.map((style) => {
          const isConfiguring = configuringStyleId === style.id;
          const currentPrice = isConfiguring ? calculatePrice(style) : style.price;
          const activeImage = (isConfiguring && selectedFabric?.image) ? selectedFabric.image : style.image;

          return (
            <article key={style.id} className={isConfiguring ? "is-active" : ""}>
              <div className="style-media">
                <Image src={activeImage} alt={style.name} fill priority sizes="(max-width: 800px) 100vw, 55vw" />
              </div>

              <div className="style-content">
                <div>
                  <h2>{style.name}</h2>
                  <small>
                    prices from ${style.price} {isConfiguring && `· Current spec: $${currentPrice}`} ⓘ
                  </small>
                  <hr />
                  <h3>{style.kicker}</h3>
                  <p>{style.description}</p>
                  <b>Key Features</b>
                  <p>{style.features}</p>
                </div>

                <button
                  type="button"
                  className={`style-step-btn ${isConfiguring ? "is-configuring" : ""}`}
                  onClick={() => handleStartCustomizing(style)}
                >
                  {isConfiguring ? "CUSTOMIZING THIS SILHOUETTE ▾" : "START CUSTOMIZING"}
                </button>

                {/* Interactive Customization Studio Section for this Style */}
                {isConfiguring && (
                  <div className="customizer-drawer">
                    <div className="drawer-head">
                      <h4>Atelier Customizer: {style.name}</h4>
                      <span>MADE TO MEASURE</span>
                    </div>

                    <div className="drawer-grid">
                      {/* 1. Fabric Selection */}
                      <div className="drawer-control-group" style={{ gridColumn: "1 / -1" }}>
                        <label>
                          1. Select Fabric &amp; Tone (Current: {selectedFabric.name} · {selectedFabric.color})
                        </label>
                        <div className="swatches-row">
                          {config.fabrics.map((f) => (
                            <button
                              key={f.slug}
                              type="button"
                              className={`swatch-btn ${selectedFabric.slug === f.slug ? "is-active" : ""}`}
                              onClick={() => setSelectedFabric(f)}
                            >
                              <span className="swatch-circle" style={{ backgroundColor: f.hex }} />
                              <span>{f.name} ({f.color})</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Sizing / Dimensions */}
                      {style.specs.availableSizes && (
                        <div className="drawer-control-group">
                          <label>2. Dimensions / Sizing</label>
                          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                            {style.specs.availableSizes.map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* 3. Mount Type (for window treatments) */}
                      {style.specs.mountTypes && (
                        <div className="drawer-control-group">
                          <label>3. Mounting Method</label>
                          <select value={selectedMount} onChange={(e) => setSelectedMount(e.target.value)}>
                            {style.specs.mountTypes.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* 4. Lining Options (for window treatments & valances) */}
                      {style.specs.liningOptions && (
                        <div className="drawer-control-group">
                          <label>4. Lining &amp; Light Control</label>
                          <select value={selectedLining} onChange={(e) => setSelectedLining(e.target.value)}>
                            {style.specs.liningOptions.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* 5. Control Options (cordless, motorized, loop) */}
                      {style.specs.controlOptions && (
                        <div className="drawer-control-group">
                          <label>5. Operation &amp; Controls</label>
                          <select value={selectedControl} onChange={(e) => setSelectedControl(e.target.value)}>
                            {style.specs.controlOptions.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* 6. Insert Options (for pillows/cushions) */}
                      {style.specs.insertOptions && (
                        <div className="drawer-control-group">
                          <label>Insert Fill Specification</label>
                          <select value={selectedInsert} onChange={(e) => setSelectedInsert(e.target.value)}>
                            {style.specs.insertOptions.map((ins) => (
                              <option key={ins} value={ins}>
                                {ins}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* 7. Edge & Border Finishes */}
                      {style.specs.edgeFinishes && (
                        <div className="drawer-control-group">
                          <label>Edge &amp; Perimeter Detail</label>
                          <select value={selectedEdge} onChange={(e) => setSelectedEdge(e.target.value)}>
                            {style.specs.edgeFinishes.map((ed) => (
                              <option key={ed} value={ed}>
                                {ed}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* 8. Hardware Finishes (for rods & decor) */}
                      {style.specs.hardwareFinishes && (
                        <div className="drawer-control-group">
                          <label>Architectural Metal Finish</label>
                          <select value={selectedHardware} onChange={(e) => setSelectedHardware(e.target.value)}>
                            {style.specs.hardwareFinishes.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="drawer-footer">
                      <div className="drawer-price">
                        <small>Total Calculated Custom Price</small>
                        <b>${currentPrice}</b>
                      </div>

                      <div className="drawer-actions">
                        <button type="button" className="drawer-btn-cart" onClick={handleAddToCart}>
                          ADD BESPOKE PIECE TO BAG
                        </button>
                        <Link href="/swatches" className="drawer-btn-swatch">
                          ORDER FREE SWATCHES
                        </Link>
                      </div>
                    </div>

                    {toastMessage && (
                      <div className="toast-notice">
                        <span>{toastMessage}</span>
                        <Link href="/cart" style={{ color: "#fff", textDecoration: "underline", fontWeight: 600 }}>
                          VIEW BAG →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </main>

      {/* Craftsmanship Guarantee Strip */}
      <section className="craft-strip">
        <span>HERITAGE ATELIER &amp; CRAFTSMANSHIP</span>
        <h2>The Art of Bespoke {config.name}</h2>
        <p>
          Handcrafted in our family-led workroom with meticulous attention to detail, precision reinforcement, and lifetime support.
        </p>
        <div>
          {config.craftPillars.map((pillar) => (
            <article key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
