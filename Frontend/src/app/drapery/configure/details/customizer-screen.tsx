"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";
import { useCommerce } from "@/components/commerce-context";
import "./details.css";

export const customizerSteps = ["measurements", "mount", "lining", "control", "hardware", "trim", "valance", "tiebacks", "review"] as const;
export type CustomizerStep = (typeof customizerSteps)[number];

type Config = {
  width: string; height: string; panels: "pair" | "single_panel"; fullness: "standard" | "deluxe";
  mount: string; lining: string; control: string; hardware: string; trim: string; valance: string; tiebacks: string;
};

const initial: Config = {
  width: "54 1/2", height: "96", panels: "pair", fullness: "standard",
  mount: "Outside Mount", lining: "Cotton Privacy Lining", control: "Classic Rod",
  hardware: "Antique Brass", trim: "Clean Finish", valance: "No Valance", tiebacks: "Straight Tieback"
};

const meta: Record<CustomizerStep, { number: string; eyebrow: string; title: string; copy: string }> = {
  measurements: { number: "01", eyebrow: "WINDOW DETAILS", title: "Tell Us About Your Window", copy: "Enter finished dimensions. Our atelier adds the correct fullness, returns and hems." },
  mount: { number: "02", eyebrow: "MOUNT & POSITION", title: "How Will Your Drapery Be Mounted?", copy: "Choose where the hardware will sit in relation to the window frame." },
  lining: { number: "03", eyebrow: "LIGHT & PRIVACY", title: "Choose Your Lining", copy: "Control light, privacy and the way your finished drapery falls." },
  control: { number: "04", eyebrow: "OPERATION", title: "Rods, Rails & Motorized Systems", copy: "Select the system that best suits the room and how you live." },
  hardware: { number: "05", eyebrow: "THE FINISHING DETAIL", title: "Select Your Hardware Finish", copy: "Architectural metalwork, finished by hand to complement your interior." },
  trim: { number: "06", eyebrow: "ATELIER EMBELLISHMENT", title: "Add a Decorative Trim", copy: "Keep the edge beautifully clean or introduce a subtle hand-finished detail." },
  valance: { number: "07", eyebrow: "TOP TREATMENT", title: "Valance Configuration", copy: "Complete the installation with a tailored architectural top treatment." },
  tiebacks: { number: "08", eyebrow: "FINISHING TOUCH", title: "Choose Your Tiebacks", copy: "A considered holdback gives the drapery a graceful, composed silhouette." },
  review: { number: "09", eyebrow: "ATELIER REVIEW", title: "Your Custom Drapery", copy: "Review every detail before our workroom begins your made-to-measure piece." }
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

function pathFor(step: CustomizerStep) {
  return step === "measurements" ? "/drapery/configure/details" : `/drapery/configure/details/${step}`;
}

export function CustomizerScreen({ step }: { step: CustomizerStep }) {
  const router = useRouter();
  const { addToCart } = useCommerce();
  const [config, setConfig] = useState<Config>(initial);
  const [ready, setReady] = useState(false);
  const [added, setAdded] = useState(false);
  const index = customizerSteps.indexOf(step);
  const info = meta[step];
  const estimate = useMemo(() => priceFor(config), [config]);
  const widthValid = inches(config.width) >= 24 && inches(config.width) <= 240;
  const heightValid = inches(config.height) >= 36 && inches(config.height) <= 200;

  useEffect(() => {
    try { setConfig({ ...initial, ...JSON.parse(localStorage.getItem("ihf-drapery-config") || "{}") }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("ihf-drapery-config", JSON.stringify(config)); }, [config, ready]);

  const update = <K extends keyof Config>(key: K, value: Config[K]) => setConfig((old) => ({ ...old, [key]: value }));
  const go = (direction: number) => router.push(pathFor(customizerSteps[index + direction]));
  const select = (name: string) => { const field = fieldForStep[step]; if (field) update(field, name as never); };
  const selected = fieldForStep[step] ? String(config[fieldForStep[step] as keyof Config]) : "";

  const add = () => {
    addToCart({
      id: `custom-drapery-${Date.now()}`, productId: "660000000000000000000006",
      name: "Pinch Pleat Belgian Linen Drapery", price: estimate.total, image: "/figma/home-01.jpeg",
      variant: `${config.panels === "pair" ? "Pair" : "Single panel"} · ${config.width}″ W × ${config.height}″ H`, isCustom: true,
      specs: { width: config.width, height: config.height, fullness: config.fullness, lining: config.lining, pleat: "pinch-pleat", mount: config.mount, hardware: config.hardware, railSystem: config.control, trim: config.trim, valance: config.valance, tieBack: config.tiebacks, panelConfiguration: config.panels, priceBreakdown: estimate }
    });
    setAdded(true);
  };

  return <div className="customizer-page">
    <Header />
    <div className="customizer-progress" aria-label={`Step ${index + 1} of ${customizerSteps.length}`}>
      <div><span>Custom Drapery</span><b>{String(index + 1).padStart(2,"0")} / {String(customizerSteps.length).padStart(2,"0")}</b></div>
      <i><em style={{ width: `${((index + 1) / customizerSteps.length) * 100}%` }} /></i>
    </div>
    <main className="customizer-shell">
      <aside className="customizer-preview">
        <div className="preview-photo"><Image src="/figma/home-01.jpeg" alt="Pinch pleat drapery in a calm interior" fill priority sizes="45vw" /></div>
        <div className="preview-caption"><span>YOUR SELECTION</span><h2>Pinch Pleat Drapery</h2><p>Belgian Flax Linen · Oatmeal</p></div>
      </aside>
      <section className="customizer-content">
        <Link className="customizer-edit" href="/drapery/configure/fabric">← EDIT FABRIC</Link>
        <header><span>{info.number} — {info.eyebrow}</span><h1>{info.title}</h1><p>{info.copy}</p></header>

        {step === "measurements" && <div className="measure-panel">
          <div className="configuration-toggle"><button className={config.panels === "pair" ? "active" : ""} onClick={() => update("panels", "pair")}>PAIR · 2 PANELS</button><button className={config.panels === "single_panel" ? "active" : ""} onClick={() => update("panels", "single_panel")}>SINGLE PANEL</button></div>
          <div className="measurement-fields"><label><span>FINISHED WIDTH</span><div><input value={config.width} onChange={(e) => update("width", e.target.value)} /><b>IN</b></div><small className={!widthValid ? "error" : ""}>{widthValid ? "24″ minimum — 240″ maximum" : "Enter a width between 24″ and 240″"}</small></label><label><span>FINISHED DROP</span><div><input value={config.height} onChange={(e) => update("height", e.target.value)} /><b>IN</b></div><small className={!heightValid ? "error" : ""}>{heightValid ? "36″ minimum — 200″ maximum" : "Enter a drop between 36″ and 200″"}</small></label></div>
          <div className="fullness-choice"><span>FULLNESS</span>{(["standard","deluxe"] as const).map((x) => <button className={config.fullness === x ? "active" : ""} onClick={() => update("fullness", x)} key={x}><b>{x === "standard" ? "2.0× STANDARD" : "2.5× DELUXE"}</b><small>{x === "standard" ? "A refined everyday drape" : "A richer, more luxurious fold"}</small></button>)}</div>
          <div className="atelier-note"><b>COMPLIMENTARY MEASURING SUPPORT</b><p>Share a photograph of your window with our atelier after checkout. We will confirm every dimension before production.</p></div>
        </div>}

        {choices[step] && <div className={`choice-grid choice-${step}`}>
          {choices[step]!.map((choice, optionIndex) => <button key={choice.name} className={selected === choice.name ? "selected" : ""} onClick={() => select(choice.name)}>
            <div className="choice-visual">
              {choice.image ? <Image src={choice.image} alt="" fill sizes="20vw" /> : choice.tone ? <i className="finish-disc" style={{ background: choice.tone }} /> : <span className={`line-diagram diagram-${step}-${optionIndex}`}><i/><i/><i/><i/></span>}
            </div>
            <span className="radio-dot"/><b>{choice.name}</b><small>{choice.description}</small>
          </button>)}
        </div>}

        {step === "review" && <div className="review-card">
          <div className="review-heading"><span>MADE TO YOUR MEASUREMENTS</span><strong>${estimate.total.toLocaleString()}</strong></div>
          {[["Style","Pinch Pleat Drapery"],["Fabric","Oatmeal Belgian Flax Linen"],["Dimensions",`${config.width}″ W × ${config.height}″ H`],["Panels",config.panels === "pair" ? "Pair · 2 panels" : "Single panel"],["Mount",config.mount],["Lining",config.lining],["Operation",config.control],["Hardware",config.hardware],["Trim",config.trim],["Valance",config.valance],["Tiebacks",config.tiebacks]].map(([label,value], i) => <div className="review-row" key={label}><span><b>{String(i+1).padStart(2,"0")}</b>{label}</span><strong>{value}</strong><Link href={i < 4 ? pathFor("measurements") : pathFor(customizerSteps[Math.min(i-2,7)])}>EDIT</Link></div>)}
          <div className="workroom-note"><b>HANDCRAFTED IN OUR ATELIER</b><p>Estimated dispatch in 4–6 weeks. Your order is reviewed by a drapery specialist before production begins.</p></div>
          {added && <p className="added-message">✓ Added to your cart. <Link href="/cart">View cart →</Link></p>}
        </div>}
      </section>
    </main>
    <div className="customizer-bar"><div><span>PINCH PLEAT DRAPERY</span><small>{config.width}″ × {config.height}″ · {config.panels === "pair" ? "Pair" : "Single"}</small></div><strong>${estimate.total.toLocaleString()}</strong><nav>{index > 0 && <button className="back" onClick={() => go(-1)}>← BACK</button>}{step === "review" ? <button onClick={add}>{added ? "ADDED TO CART ✓" : "ADD TO CART"}</button> : <button disabled={step === "measurements" && (!widthValid || !heightValid)} onClick={() => go(1)}>CONTINUE →</button>}</nav></div>
    <Footer />
  </div>;
}
