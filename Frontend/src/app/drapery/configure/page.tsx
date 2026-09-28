import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
import "./configure.css";

const styles=[
  ["/figma/home-05.png","RIPPLE FOLD DRAPERY","BEAUTY MEETS FUNCTIONALITY","Adored by interior designers everywhere, our Ripple Fold Drapery is an elegant blend of simplicity and style."],
  ["/figma/home-11.png","TAILORED PLEAT DRAPERY","REFINED AND STRUCTURED","A modern take on traditional pleating, offering a crisp waterfall effect that maintains its structure beautifully."],
  ["/figma/home-01.jpeg","PINCH PLEAT DRAPERY","CLASSIC TRADITION","The timeless standard for custom drapery, featuring hand-sewn, permanent folds that create a full, elegant appearance."],
  ["/figma/home-17.jpeg","GROMMET DRAPERY","CONTEMPORARY & CASUAL","A popular choice for a modern, relaxed aesthetic with metal rings sliding effortlessly over a decorative rod."],
  ["/figma/home-15.jpeg","INVERTED PLEAT DRAPERY","SLEEK AND MINIMALIST","Also known as a reverse box pleat, this style hides fullness at the back, presenting a clean, flat header to the room."],
];

export default function Configure(){return <div className="drape-flow"><Header/><main className="style-step"><header><span>CUSTOM DRAPERY</span><h1>Choose Your Drapery Style</h1></header>{styles.map(([src,title,kicker,copy])=><article key={title}><Image src={src} alt={title} width={690} height={480}/><div><h2>{title}</h2><small>prices from $545&nbsp; ⓘ</small><hr/><h3>{kicker}</h3><p>{copy}</p><b>Key Features</b><p>{title.startsWith("RIPPLE")?"Sophisticated and modern · Functional and easy to operate · Glides easily along the included track":"Crisp, uniform waterfall pleats · Ideal for both casual and formal settings · Operates smoothly on rings or traversing hardware"}</p><Link href="/drapery/configure/fabric">START CUSTOMIZING</Link></div></article>)}</main><section className="craft-strip"><span>HERITAGE ATELIER &amp; CRAFTSMANSHIP</span><h2>The Art of Custom Drapery</h2><p>Handcrafted over precision header systems, tailored with crisp architectural folds, seamless linings, and whisper-quiet control options.</p><div>{["Flush Mount Precision","Symmetrical Fold Memory","Certified Best for Kids®"].map(x=><article key={x}><h3>{x}</h3><p>Engineered for flawless function and an impeccably tailored finish.</p></article>)}</div></section><Footer/></div>}
