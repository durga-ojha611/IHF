"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Footer, Header } from "@/components/site-chrome";
import { useCommerce } from "@/components/commerce-context";
import "./details.css";

export const customizerSteps = ["panels", "mount", "measurements", "lining", "control", "hardware", "trim", "valance", "tiebacks", "review"] as const;
export type CustomizerStep = (typeof customizerSteps)[number];

type Config = {
  width: string; height: string; panels: "pair" | "single_panel"; panelStack: "left" | "right" | "centre"; fullness: "standard" | "deluxe";
  mount: string; lining: string; control: string; hardware: string; trim: string; valance: string; tiebacks: string;
};

const initial: Config = {
  width: "54 1/2", height: "96", panels: "pair", panelStack: "centre", fullness: "standard",
  mount: "Outside Mount", lining: "Cotton Privacy Lining", control: "Classic Rod",
  hardware: "Antique Brass", trim: "Clean Finish", valance: "No Valance", tiebacks: "Straight Tieback"
};

const meta: Record<CustomizerStep, { number: string; eyebrow: string; title: string; copy: string }> = {
  panels: { number: "01", eyebrow: "PANEL CONFIGURATION", title: "Choose Your Panel Configuration", copy: "Select how your drapery will gather and rest when drawn open." },
  mount: { number: "02", eyebrow: "MOUNT TYPE & HARDWARE", title: "Select Your Mount Type", copy: "Choose how the drapery will be installed in relation to the window." },
  measurements: { number: "03", eyebrow: "PRODUCT MEASUREMENTS", title: "Enter Your Measurements", copy: "Provide the finished width and drop. Fractions are accepted." },
  lining: { number: "04", eyebrow: "LINING SELECTION", title: "Choose Your Lining", copy: "Control light, privacy and the way your finished drapery falls." },
  control: { number: "05", eyebrow: "CONTROL SYSTEM", title: "Choose How It Operates", copy: "Select a manual or motorized system for effortless daily use." },
  hardware: { number: "06", eyebrow: "HARDWARE FINISH", title: "Select Your Hardware Finish", copy: "Choose the architectural metal finish for rods, brackets and finials." },
  trim: { number: "07", eyebrow: "FABRIC BORDERS & TRIMS", title: "Add a Decorative Border", copy: "Keep a clean edge or add a hand-finished atelier detail." },
  valance: { number: "08", eyebrow: "TOP TREATMENT", title: "Valance Configuration", copy: "Complete the installation with a tailored top treatment." },
  tiebacks: { number: "09", eyebrow: "PASSEMENTERIE & TIE BACKS", title: "Choose Your Tiebacks", copy: "Finish the composition with a tailored or decorative holdback." },
  review: { number: "10", eyebrow: "ROOM LABEL & WORKROOM NOTES", title: "Review Your Custom Drapery", copy: "Name the room, add workroom notes and confirm every detail." }
};

const choices: Partial<Record<CustomizerStep, { name: string; description: string; image?: string; tone?: string }[]>> = {
  mount: [
    { name: "Inside Mount", description: "A precise fit within a deep architectural recess." },
    { name: "Outside Mount", description: "Recommended for fuller coverage and a taller visual line." },
    { name: "Ceiling Mount", description: "A seamless floor-to-ceiling installation." }
  ],
  lining: [
    { name: "Cotton Privacy Lining", description: "Soft filtered light with a beautifully weighted drape.", image: "/figma/home-19.png" },
    { name: "100% Blackout Lining", description: "Maximum light control, privacy and thermal insulation.", image: "/figma/home-03.jpeg" },
    { name: "Unlined", description: "The most natural, airy expression of the chosen linen.", image: "/figma/home-12.jpeg" }
  ],
  control: [
    { name: "Classic Rod", description: "Hand-finished decorative rod with quiet rings." },
    { name: "Traverse Rod", description: "Smooth cord-drawn operation for everyday ease." },
    { name: "Somfy Motorized Track", description: "Whisper-quiet app and remote-ready automation." }
  ],
  hardware: [
    { name: "Antique Brass", description: "Warm, softly aged heritage finish.", tone: "#b79248" },
    { name: "Matte Black", description: "Graphic and contemporary.", tone: "#242320" },
    { name: "Satin Nickel", description: "Quiet, refined metallic finish.", tone: "#aaa8a2" },
    { name: "Dark Bronze", description: "A deep classic architectural tone.", tone: "#675143" }
  ],
  trim: [
    { name: "Clean Finish", description: "A minimal self-finished edge." },
    { name: "Classic Border", description: "A tailored contrast border, applied by hand.", image: "/figma/home-04.jpeg" },
    { name: "Champagne Tassel", description: "Soft decorative passementerie with a couture character.", image: "/figma/home-18.jpeg" }
  ],
  valance: [
    { name: "No Valance", description: "Clean, uninterrupted drapery." },
    { name: "Upholstered Cornice", description: "A structured, fabric-wrapped top treatment." },
    { name: "Soft Valance", description: "A gently tailored fabric valance." }
  ],
  tiebacks: [
    { name: "Straight Tieback", description: "Simple, architectural holdback." },
    { name: "Sculpted Tieback", description: "A shaped, decorative holdback." },
    { name: "No Tieback", description: "Allow the drapery to fall naturally." }
  ]
};

const fieldForStep: Partial<Record<CustomizerStep, keyof Config>> = {
  mount: "mount", lining: "lining", control: "control", hardware: "hardware", trim: "trim", valance: "valance", tiebacks: "tiebacks"
};

function inches(value: string) {
  const parts = value.trim().replace(/\"/g, "").split(/\s+/);
  const whole = Number(parts[0]);
  if (!Number.isFinite(whole)) return NaN;
  if (!parts[1]) return whole;
  const [a, b] = parts[1].split("/").map(Number);
  return b ? whole + a / b : NaN;
}

function priceFor(config: Config) {
  const width = inches(config.width) || 54.5;
  const height = inches(config.height) || 96;
  const panels = config.panels === "pair" ? 2 : 1;
  const fullness = config.fullness === "deluxe" ? 2.5 : 2;
  const yards = Math.ceil(((width * fullness * panels) / 54) * ((height + 18) / 36) * 2) / 2;
  const extras = (config.lining.includes("Blackout") ? 190 : config.lining === "Unlined" ? 0 : 125) +
    (config.control.includes("Motorized") ? 645 : config.control === "Traverse Rod" ? 185 : 95) +
    (config.trim !== "Clean Finish" ? 110 : 0) + (config.valance !== "No Valance" ? 225 : 0);
  return { yards, total: Math.round(yards * 68 + 245 + extras) };
}

export function CustomizerScreen({ step }: { step: CustomizerStep }) {
  const { addToCart } = useCommerce();
  const [config, setConfig] = useState<Config>(initial);
  const [ready, setReady] = useState(false);
  const [added, setAdded] = useState(false);
  const [openStep, setOpenStep] = useState<CustomizerStep>(step);
  const [room, setRoom] = useState("Primary Bedroom");
  const [notes, setNotes] = useState("");
  const index = customizerSteps.indexOf(openStep);
  const estimate = useMemo(() => priceFor(config), [config]);
  const widthValid = inches(config.width) >= 24 && inches(config.width) <= 240;
  const heightValid = inches(config.height) >= 36 && inches(config.height) <= 200;

  useEffect(() => {
    try { setConfig({ ...initial, ...JSON.parse(localStorage.getItem("ihf-drapery-config") || "{}") }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("ihf-drapery-config", JSON.stringify(config)); }, [config, ready]);
  useEffect(() => setOpenStep(step), [step]);

  const update = <K extends keyof Config>(key: K, value: Config[K]) => setConfig((old) => ({ ...old, [key]: value }));
  const select = (target: CustomizerStep, name: string) => { const field = fieldForStep[target]; if (field) update(field, name as never); };
  const selectedFor = (target: CustomizerStep) => fieldForStep[target] ? String(config[fieldForStep[target] as keyof Config]) : "";
  const summaryFor = (target: CustomizerStep) => ({ panels: config.panels === "pair" ? "Pair · centre open" : `Single panel · ${config.panelStack} stack`, measurements: `${config.width}″ W × ${config.height}″ drop`, mount: config.mount, lining: config.lining, control: config.control, hardware: config.hardware, trim: config.trim, valance: config.valance, tiebacks: config.tiebacks, review: room }[target] || "Select an option");
  const advance = () => {
    const next = customizerSteps[Math.min(index + 1, customizerSteps.length - 1)];
    setOpenStep(next);
    requestAnimationFrame(() => document.getElementById(`custom-step-${next}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const add = () => {
    addToCart({
      id: `custom-drapery-${Date.now()}`, productId: "660000000000000000000006",
      name: "Pinch Pleat Belgian Linen Drapery", price: estimate.total, image: "/figma/home-01.jpeg",
      variant: `${config.panels === "pair" ? "Pair" : "Single panel"} · ${config.width}″ W × ${config.height}″ H`, isCustom: true,
      specs: { width: config.width, height: config.height, fullness: config.fullness, lining: config.lining, pleat: "pinch-pleat", mount: config.mount, hardware: config.hardware, railSystem: config.control, trim: config.trim, valance: config.valance, tieBack: config.tiebacks, panelConfiguration: config.panels, priceBreakdown: estimate }
    });
    setAdded(true);
  };

  const renderChoices = (target: CustomizerStep) => choices[target] ? <div className={`accordion-choice-grid accordion-choice-${target}`}>
    {choices[target]!.map((choice, optionIndex) => <button type="button" key={choice.name} className={selectedFor(target) === choice.name ? "selected" : ""} onClick={() => select(target, choice.name)}>
      <div className="accordion-choice-visual">
        {choice.image ? <Image src={choice.image} alt="" fill sizes="220px" /> : choice.tone ? <i className="finish-disc" style={{ background: choice.tone }} /> : <span className={`line-diagram diagram-${target}-${optionIndex}`}><i/><i/><i/><i/></span>}
      </div>
      <span className="tile-check">{selectedFor(target) === choice.name ? "✓" : ""}</span>
      <b>{choice.name}</b><small>{choice.description}</small>
    </button>)}
  </div> : null;

  const renderExpanded = (target: CustomizerStep) => {
    if (target === "panels") return <div className="accordion-panel-body"><p className="panel-intro">Select where your single drapery panel will gather when drawn open, or choose a balanced pair.</p><div className="panel-configuration-grid">{[["single_panel","left","LEFT STACK","Panel gathers to the left"],["single_panel","right","RIGHT STACK","Panel gathers to the right"],["pair","centre","PAIR · CENTRE OPEN","Two panels open from the centre"]].map(([value,stack,title,copy],i)=>{const selected=config.panels===value&&config.panelStack===stack;return <button type="button" className={selected?"selected":""} onClick={()=>setConfig(old=>({...old,panels:value as Config["panels"],panelStack:stack as Config["panelStack"]}))} key={title}><div className={`panel-sketch sketch-${i}`}><i/><i/><i/><i/><i/></div><span className="tile-check">{selected?"✓":""}</span><b>{title}</b><small>{copy}</small><em>{i===2?"MOST POPULAR":""}</em></button>})}</div><div className="config-assurance"><b>ATELIER RECOMMENDATION</b><p>A pair creates the most balanced fullness and is recommended for windows wider than 48 inches.</p></div></div>;
    if (target === "measurements") return <div className="accordion-panel-body"><div className="measurement-fields"><label><span>FINISHED WIDTH</span><div><input className="measurement-number-input" value={config.width} onChange={(e) => update("width", e.target.value)} /><b>IN</b></div><small className={!widthValid ? "error" : ""}>{widthValid ? "24″ minimum — 240″ maximum" : "Enter a width between 24″ and 240″"}</small></label><label><span>FINISHED DROP</span><div><input className="measurement-number-input" value={config.height} onChange={(e) => update("height", e.target.value)} /><b>IN</b></div><small className={!heightValid ? "error" : ""}>{heightValid ? "36″ minimum — 200″ maximum" : "Enter a drop between 36″ and 200″"}</small></label></div><div className="fullness-choice"><span>FULLNESS</span>{(["standard","deluxe"] as const).map((x) => <button type="button" className={config.fullness === x ? "active" : ""} onClick={() => update("fullness", x)} key={x}><b>{x === "standard" ? "2.0× STANDARD" : "2.5× DELUXE"}</b><small>{x === "standard" ? "Refined everyday drape" : "Richer architectural fold"}</small></button>)}</div><div className="measure-help"><span>⌖</span><div><b>NEED HELP MEASURING?</b><p>Use our measuring guide or schedule a complimentary virtual consultation.</p></div><button>VIEW GUIDE →</button></div></div>;
    if (target === "review") return <div className="accordion-panel-body"><div className="room-note-fields"><label>ROOM LABEL<input value={room} onChange={e=>setRoom(e.target.value)} placeholder="e.g. Primary Bedroom"/></label><label>WORKROOM NOTES<textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Access notes, installation preferences or anything our atelier should know."/></label></div><div className="review-card"><div className="review-heading"><span>YOUR SPECIFICATION</span><strong>${estimate.total.toLocaleString()}</strong></div>{[["Panel configuration",summaryFor("panels")],["Mount",config.mount],["Measurements",summaryFor("measurements")],["Lining",config.lining],["Control",config.control],["Hardware",config.hardware],["Border & trim",config.trim],["Valance",config.valance],["Tiebacks",config.tiebacks]].map(([label,value],i)=><div className="review-row" key={label}><span><b>{String(i+1).padStart(2,"0")}</b>{label}</span><strong>{value}</strong><button onClick={()=>setOpenStep(customizerSteps[i])}>EDIT</button></div>)}</div>{added&&<p className="added-message">✓ Added to your cart. <Link href="/cart">View cart →</Link></p>}</div>;
    return <div className="accordion-panel-body"><p className="panel-intro">{meta[target].copy}</p>{renderChoices(target)}{target==="mount"&&<div className="config-assurance"><b>INSTALLATION NOTE</b><p>Outside mount is recommended where recess depth is limited or greater light control is required.</p></div>}</div>;
  };

  return <div className="customizer-page">
    <Header />
    <div className="configurator-title"><span>CUSTOM DRAPERY</span><h1>Ripple Fold Drapery</h1><p>Made to measure in our atelier · Oatmeal Belgian linen</p></div>
    <main className="customizer-shell">
      <aside className="customizer-preview">
        <div className="preview-photo">
          <Image src="/figma/home-hero-hd.png" alt="Ripple fold drapery in a calm interior" fill priority sizes="50vw" />
          <span className="zoom-badge" title="Inspect drapery preview">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1c1c1a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10.5" cy="10.5" r="6" />
              <line x1="15" y1="15" x2="20.5" y2="20.5" />
            </svg>
          </span>
        </div>
        <div className="preview-spec-card"><span>YOUR SELECTION</span><h2>Ripple Fold Drapery</h2><p>Oatmeal Belgian Flax Linen</p><dl><div><dt>Panel</dt><dd>{summaryFor("panels")}</dd></div><div><dt>Size</dt><dd>{summaryFor("measurements")}</dd></div><div><dt>Lining</dt><dd>{config.lining}</dd></div></dl><Link href="/drapery/configure/fabric">CHANGE FABRIC →</Link></div>
      </aside>
      <section className="customizer-content">
        <div className="accordion-heading"><span>BESPOKE CONFIGURATION</span><h2>Design Your Drapery</h2><p>Complete each section below. Your selections and price update automatically.</p></div>
        <div className="config-accordion">{customizerSteps.map(target=>{const open=openStep===target;return <article id={`custom-step-${target}`} className={open?"open":""} key={target}><button type="button" className="accordion-trigger" onClick={()=>setOpenStep(target)} aria-expanded={open}><span>{meta[target].number}</span><div><b>{meta[target].eyebrow}</b>{!open&&<small>{summaryFor(target)}</small>}</div><em>{open?"−":"+"}</em></button>{open&&<div className="accordion-expanded"><h3>{meta[target].title}</h3>{renderExpanded(target)}{target!=="review"&&<button type="button" className="accordion-continue" disabled={target==="measurements"&&(!widthValid||!heightValid)} onClick={advance}>SAVE &amp; CONTINUE →</button>}</div>}</article>})}</div>
      </section>
    </main>
    <div className="customizer-bar"><div><span>RIPPLE FOLD DRAPERY</span><small>Oatmeal Linen · {config.width}″ × {config.height}″ · {config.panels === "pair" ? "Pair" : "Single"}</small></div><strong><small>ESTIMATED TOTAL</small>${estimate.total.toLocaleString()}</strong><nav><button className="back" onClick={()=>setOpenStep(customizerSteps[Math.max(0,index-1)])} disabled={index===0}>← BACK</button>{openStep==="review"?<button onClick={add}>{added?"ADDED TO CART ✓":"ADD TO CART"}</button>:<button onClick={advance}>CONTINUE →</button>}</nav></div>
    <Footer />
  </div>;
}
