"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Footer, Header } from "@/components/site-chrome";
import { useCommerce } from "@/components/commerce-context";
import { BORDERS, COLORS, DraperyConfig, FABRICS, LININGS, PLEATS, TASSELS, TRIMS, calculateDraperyPrice } from "@/lib/drapery-pricing";
import "./details.css";

export const customizerSteps = ["fabric", "pleat", "panels", "measurements", "lining", "decor", "tiebacks", "review"] as const;
export type CustomizerStep = (typeof customizerSteps)[number];

const initial: DraperyConfig = {
  fabric: "linen", color: "ivory", pleat: "pinch", panel: "pair", width: 72, length: 96,
  lining: "none", liningPrivacyChoice: "none", border: "none", trimType: "none", trimPlacement: "leading-one",
  trimDesign: "classic", tasselDesign: "design-1", tasselColor: "Gold", tiebackType: "none", tiebackStyle: "style-1",
  tiebackDesign: "design-1", tiebackColor: "Gold", tiebackQty: 1,
};

const meta: Record<CustomizerStep, { eyebrow: string; title: string; copy: string }> = {
  fabric: { eyebrow: "FABRIC & COLOUR", title: "Choose Your Fabric", copy: "Begin with the textile and colour that set the character of your room." },
  pleat: { eyebrow: "PLEAT STYLE", title: "Choose Your Heading", copy: "The heading determines the structure, fullness and movement of your drapery." },
  panels: { eyebrow: "PANEL CONFIGURATION", title: "Pair or Single Panel", copy: "Choose balanced centre-opening panels or one continuous panel." },
  measurements: { eyebrow: "FINISHED MEASUREMENTS", title: "Enter Width & Length", copy: "Pricing follows the exact width and length matrix supplied by the workroom." },
  lining: { eyebrow: "LINING SELECTION", title: "Choose Your Lining", copy: "Control light, privacy, insulation and finished drape." },
  decor: { eyebrow: "BORDERS, TRIMS & FRINGES", title: "Add an Atelier Finish", copy: "Borders and trims are mutually exclusive and scale with the chosen dimensions." },
  tiebacks: { eyebrow: "STANDALONE TIE BACKS", title: "Complete the Composition", copy: "Add independent fabric, fringe or tassel tie backs in the quantity you need." },
  review: { eyebrow: "FINAL SPECIFICATION", title: "Review Your Drapery", copy: "Confirm every selection and see the complete itemised estimate." },
};

const money = (value: number) => `$${value.toFixed(2)}`;
const names = (id: string) => FABRICS.find((item) => item.id === id)?.name || id;

export function CustomizerScreen({ step }: { step: CustomizerStep }) {
  const { addToCart } = useCommerce();
  const [config, setConfig] = useState<DraperyConfig>(initial);
  const [openStep, setOpenStep] = useState<CustomizerStep>(step);
  const [decorTab, setDecorTab] = useState<"border" | "trim" | "fringe">("border");
  const [ready, setReady] = useState(false);
  const [added, setAdded] = useState(false);
  const [room, setRoom] = useState("Primary Bedroom");
  const [notes, setNotes] = useState("");
  const estimate = useMemo(() => calculateDraperyPrice(config), [config]);
  const index = customizerSteps.indexOf(openStep);
  const fabric = FABRICS.find((item) => item.id === config.fabric) || FABRICS[1];
  const pleated = config.pleat !== "none";
  const maxWidth = pleated ? 400 : 1000;
  const valid = config.width >= 12 && config.width <= maxWidth && config.length >= 10 && config.length <= 400;

  useEffect(() => {
    try { setConfig({ ...initial, ...JSON.parse(localStorage.getItem("ihf-drapery-config-v2") || "{}") }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("ihf-drapery-config-v2", JSON.stringify(config)); }, [config, ready]);
  useEffect(() => setOpenStep(step), [step]);

  const update = <K extends keyof DraperyConfig>(key: K, value: DraperyConfig[K]) => setConfig((old) => ({ ...old, [key]: value }));
  const chooseFabric = (id: string) => {
    const next = FABRICS.find((item) => item.id === id);
    if (!next) return;
    setConfig((old) => ({ ...old, fabric: id, color: next.colors.includes(old.color as never) ? old.color : next.colors[0], lining: id === "sheer" ? "none" : old.lining }));
  };
  const advance = () => {
    const next = customizerSteps[Math.min(index + 1, customizerSteps.length - 1)];
    setOpenStep(next);
    requestAnimationFrame(() => document.getElementById(`custom-step-${next}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const summary = (target: CustomizerStep) => ({
    fabric: `${names(config.fabric)} · ${COLORS[config.color]?.label}`, pleat: PLEATS.find((item) => item.id === config.pleat)?.label,
    panels: config.panel === "pair" ? "Pair · 2 panels" : "Single panel", measurements: `${config.width}″ W × ${config.length}″ L`,
    lining: LININGS.find((item) => item.id === config.lining)?.label, decor: config.border !== "none" ? BORDERS.find((item) => item.id === config.border)?.label : config.trimType === "none" ? "Clean finish" : TRIMS.find((item) => item.id === config.trimDesign)?.label,
    tiebacks: config.tiebackType === "none" ? "No tie backs" : `${config.tiebackType.replaceAll("-", " ")} · ${config.tiebackQty}`, review: room,
  }[target] || "Select an option");

  const fabricPanel = <div className="accordion-panel-body"><div className="fabric-option-grid">{FABRICS.map((item) => <button key={item.id} className={config.fabric === item.id ? "selected" : ""} onClick={() => chooseFabric(item.id)}><span className="fabric-image"><Image src={item.image} alt="" fill sizes="180px" /></span><span className="tile-check">{config.fabric === item.id ? "✓" : ""}</span><b>{item.name}</b><small>{item.description}</small><em>From {money(item.basePrice)}</em></button>)}</div><div className="colour-panel"><b>COLOUR · {COLORS[config.color]?.label}</b><div>{fabric.colors.map((color) => <button key={color} className={config.color === color ? "selected" : ""} style={{ background: COLORS[color]?.hex }} title={COLORS[color]?.label} onClick={() => update("color", color)} />)}</div></div></div>;
  const pleatPanel = <div className="accordion-panel-body"><div className="pleat-option-grid">{PLEATS.map((item, optionIndex) => <button key={item.id} className={config.pleat === item.id ? "selected" : ""} onClick={() => setConfig((old) => ({ ...old, pleat: item.id, width: Math.min(old.width, item.id === "none" ? 1000 : 400) }))}><span className={`pleat-drawing pleat-${optionIndex}`}><i/><i/><i/><i/><i/></span><span className="tile-check">{config.pleat === item.id ? "✓" : ""}</span><b>{item.label}</b><small>{item.description}</small></button>)}</div></div>;
  const panelsPanel = <div className="accordion-panel-body"><div className="panel-configuration-grid">{[["pair","PAIR · 2 PANELS","Balanced centre opening"],["single","SINGLE PANEL","One continuous panel"]].map(([value,title,copy], optionIndex) => <button key={value} className={config.panel === value ? "selected" : ""} onClick={() => update("panel", value as DraperyConfig["panel"])}><div className={`panel-sketch sketch-${optionIndex + 1}`}><i/><i/><i/><i/><i/></div><span className="tile-check">{config.panel === value ? "✓" : ""}</span><b>{title}</b><small>{copy}</small></button>)}</div></div>;
  const measurementPanel = <div className="accordion-panel-body"><div className="measurement-fields"><label><span>FINISHED WIDTH</span><div><input type="number" min="12" max={maxWidth} value={config.width} onChange={(event) => update("width", Number(event.target.value))}/><b>IN</b></div><small className={config.width < 12 || config.width > maxWidth ? "error" : ""}>12″ minimum — {maxWidth}″ maximum for {pleated ? "pleated" : "flat"} drapery</small></label><label><span>FINISHED LENGTH</span><div><input type="number" min="10" max="400" value={config.length} onChange={(event) => update("length", Number(event.target.value))}/><b>IN</b></div><small className={config.length < 10 || config.length > 400 ? "error" : ""}>10″ minimum — 400″ maximum</small></label></div><div className="pricing-rule-note"><b>WORKROOM PRICE MATRIX</b><p>Length increments are applied at the supplied 9″ and 6″ breakpoints. Width uses {estimate?.multiplier || 0} workroom width{estimate?.multiplier === 1 ? "" : "s"} for this selection.</p></div></div>;
  const liningPanel = <div className="accordion-panel-body">{config.fabric === "sheer" ? <div className="pricing-rule-note"><b>SHEERS ARE ALWAYS UNLINED</b><p>This preserves their translucent, light-filtering character.</p></div> : <div className="line-option-list">{LININGS.map((item) => <button key={item.id} className={config.lining === item.id ? "selected" : ""} onClick={() => setConfig((old) => ({ ...old, lining: item.id, liningPrivacyChoice: "none" }))}><span><b>{item.label}</b><small>{item.description}</small></span><em>{item.basePrice ? `+${money(item.basePrice)} base` : "Included"}</em></button>)}</div>}{config.lining === "privacy" && <div className="sub-choice"><b>PRIVACY LINING PRICING</b><button className={config.liningPrivacyChoice === "none" ? "selected" : ""} onClick={() => update("liningPrivacyChoice", "none")}>Included · no increase</button><button className={config.liningPrivacyChoice === "increase" ? "selected" : ""} onClick={() => update("liningPrivacyChoice", "increase")}>Scale with curtain dimensions</button></div>}</div>;

  const decorPanel = <div className="accordion-panel-body"><div className="decor-tabs"><button className={decorTab === "border" ? "selected" : ""} onClick={() => setDecorTab("border")}>BORDERS</button><button className={decorTab === "trim" ? "selected" : ""} onClick={() => setDecorTab("trim")}>TRIMS</button><button className={decorTab === "fringe" ? "selected" : ""} onClick={() => setDecorTab("fringe")}>FRINGES</button></div>{decorTab === "border" ? <div className="line-option-list">{BORDERS.map((item) => <button key={item.id} className={config.border === item.id ? "selected" : ""} onClick={() => setConfig((old) => ({ ...old, border: item.id, trimType: "none" }))}><b>{item.label}</b><em>{item.basePrice ? `+${money(item.basePrice)} base` : "Included"}</em></button>)}</div> : <><div className="placement-row"><b>PLACEMENT</b>{[["leading-one","Leading Edge"],["leading-both","Both Leading Edges"],["leading-bottom","Leading Edge + Bottom"]].map(([value,label]) => <button key={value} className={config.trimPlacement === value ? "selected" : ""} onClick={() => update("trimPlacement", value)}>{label}</button>)}</div><div className="line-option-list"><button className={config.trimType === "none" ? "selected" : ""} onClick={() => update("trimType", "none")}><b>None · Clean Finish</b><em>Included</em></button>{TRIMS.filter((item) => decorTab === "trim" ? !item.id.includes("tassel") && !item.id.includes("fringe") : item.id.includes("tassel") || item.id.includes("fringe")).map((item) => <button key={item.id} className={config.trimType !== "none" && config.trimDesign === item.id ? "selected" : ""} onClick={() => setConfig((old) => ({ ...old, border: "none", trimType: decorTab === "trim" ? "embroidery" : "tassel", trimDesign: item.id }))}><b>{item.label}</b><em>+{money(item.basePrice)} base</em></button>)}</div></>}</div>;
  const tiebackPanel = <div className="accordion-panel-body"><div className="tieback-types">{[["none","No Tie Backs"],["fabric","Fabric Tie Back"],["fabric-trim","Fabric + Trim"],["fabric-fringe","Fabric + Fringe"],["tassel","Tassel Tie Back"]].map(([value,label]) => <button key={value} className={config.tiebackType === value ? "selected" : ""} onClick={() => update("tiebackType", value)}>{label}</button>)}</div>{config.tiebackType === "tassel" && <div className="line-option-list">{TASSELS.map((item) => <button key={item.id} className={config.tiebackDesign === item.id ? "selected" : ""} onClick={() => update("tiebackDesign", item.id)}><b>{item.label}</b><em>+{money(item.price)} each</em></button>)}</div>}{config.tiebackType !== "none" && <div className="quantity-control"><b>QUANTITY</b><button onClick={() => update("tiebackQty", Math.max(1, config.tiebackQty - 1))}>−</button><span>{config.tiebackQty}</span><button onClick={() => update("tiebackQty", config.tiebackQty + 1)}>+</button></div>}</div>;

  const reviewPanel = <div className="accordion-panel-body"><div className="room-note-fields"><label>ROOM LABEL<input value={room} onChange={(event) => setRoom(event.target.value)}/></label><label>WORKROOM NOTES<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Installation notes or special requests"/></label></div><div className="review-card"><div className="review-heading"><span>ITEMISED ESTIMATE</span><strong>{estimate ? money(estimate.total) : "—"}</strong></div>{estimate && [["Base curtain", estimate.base],["Lining",estimate.lining],["Border",estimate.border],["Trim / fringe",estimate.trim],["Tie backs",estimate.tiebacks]].map(([label,value]) => <div className="review-row" key={String(label)}><span>{label}</span><strong>{money(Number(value))}</strong></div>)}</div>{added && <p className="added-message">✓ Added to cart. <Link href="/cart">View cart →</Link></p>}</div>;
  const content: Record<CustomizerStep, React.ReactNode> = { fabric: fabricPanel, pleat: pleatPanel, panels: panelsPanel, measurements: measurementPanel, lining: liningPanel, decor: decorPanel, tiebacks: tiebackPanel, review: reviewPanel };

  const add = () => {
    if (!estimate) return;
    addToCart({ id: `custom-drapery-${Date.now()}`, productId: "660000000000000000000006", name: `${PLEATS.find((item) => item.id === config.pleat)?.label} ${names(config.fabric)} Drapery`, price: estimate.total, image: fabric.image, variant: `${config.panel === "pair" ? "Pair" : "Single"} · ${config.width}″ × ${config.length}″`, isCustom: true, specs: { width: String(config.width), height: String(config.length), fullness: `${estimate.multiplier} workroom widths`, lining: config.lining, pleat: config.pleat, trim: config.border !== "none" ? config.border : config.trimType, tieBack: config.tiebackType, panelConfiguration: config.panel, priceBreakdown: { ...estimate, fabric: config.fabric, color: config.color, room, notes, configuration: config } } });
    setAdded(true);
  };

  return <div className="customizer-page"><Header/><div className="configurator-title"><span>CUSTOM DRAPERY</span><h1>Made-to-Measure Drapery</h1><p>Workroom pricing · Live specification · Hand finished</p></div><main className="customizer-shell"><aside className="customizer-preview"><div className="preview-photo"><Image src="/figma/home-hero-hd.png" alt="Custom drapery in a finished interior" fill priority sizes="50vw"/><span className="preview-fabric-chip" style={{ background: COLORS[config.color]?.hex }}/></div><div className="preview-spec-card"><span>YOUR SELECTION</span><h2>{PLEATS.find((item) => item.id === config.pleat)?.label} Drapery</h2><p>{names(config.fabric)} · {COLORS[config.color]?.label}</p><dl><div><dt>Panels</dt><dd>{summary("panels")}</dd></div><div><dt>Size</dt><dd>{summary("measurements")}</dd></div><div><dt>Lining</dt><dd>{summary("lining")}</dd></div><div><dt>Workroom widths</dt><dd>{estimate?.multiplier || "—"}</dd></div></dl></div>{estimate && <div className="live-price-card"><span>LIVE ESTIMATE</span><strong>{money(estimate.total)}</strong><small>Taxes, delivery and installation calculated at checkout.</small></div>}</aside><section className="customizer-content"><div className="accordion-heading"><span>BESPOKE CONFIGURATION</span><h2>Design Your Drapery</h2><p>Every tile expands independently. Selections and pricing update instantly.</p></div><div className="config-accordion">{customizerSteps.map((target, stepIndex) => { const open = openStep === target; return <article id={`custom-step-${target}`} className={open ? "open" : ""} key={target}><button type="button" className="accordion-trigger" onClick={() => setOpenStep(target)} aria-expanded={open}><span>{String(stepIndex + 1).padStart(2,"0")}</span><div><b>{meta[target].eyebrow}</b>{!open && <small>{summary(target)}</small>}</div><em>{open ? "−" : "+"}</em></button>{open && <div className="accordion-expanded"><h3>{meta[target].title}</h3><p className="step-copy">{meta[target].copy}</p>{content[target]}{target !== "review" && <button className="accordion-continue" disabled={target === "measurements" && !valid} onClick={advance}>SAVE &amp; CONTINUE →</button>}</div>}</article>; })}</div></section></main><div className="customizer-bar"><div><span>CUSTOM {names(config.fabric).toUpperCase()} DRAPERY</span><small>{PLEATS.find((item) => item.id === config.pleat)?.label} · {config.width}″ × {config.length}″ · {config.panel === "pair" ? "Pair" : "Single"}</small></div><strong><small>ESTIMATED TOTAL</small>{estimate ? money(estimate.total) : "CHECK SIZE"}</strong><nav><button className="back" onClick={() => setOpenStep(customizerSteps[Math.max(0,index-1)])} disabled={index === 0}>← BACK</button>{openStep === "review" ? <button onClick={add} disabled={!estimate}>{added ? "ADDED TO CART ✓" : "ADD TO CART"}</button> : <button onClick={advance}>CONTINUE →</button>}</nav></div><Footer/></div>;
}
