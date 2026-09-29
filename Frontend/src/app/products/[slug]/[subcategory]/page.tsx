import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
import "./listing.css";

const productImages=["/figma/product-linen-bedspread-hd.png","/figma/home-hero-hd.png","/figma/home-11.png","/figma/product-linen-bedspread-hd.png","/figma/home-13.png","/figma/home-16.png"];
const productNames=["Waffle Weave Linen Coverlet","Garment-Washed Duvet Set","Bespoke Linen Quilt","Waffle Weave Linen Coverlet","Garment-Washed Duvet Set","Bespoke Linen Quilt"];
const related=[
  ["/figma/home-10.jpeg","Quilts & Coverlet","320","18 STYLES"],
  ["/figma/home-11.png","Bedding Sets","540","4-PIECE SUITES"],
  ["/figma/home-15.jpeg","Pillowcases & Shams","85","EURO & STANDARD"],
  ["/figma/home-17.jpeg","Bed Runners","145","ARTISANAL TEXTURES"],
  ["/figma/product-linen-bedspread-hd.png","Bed Skirts","190","CUSTOM DROPS"],
  ["/figma/home-01.jpeg","Throw Pillows","110","DOWN & FEATHER"],
];

const human=(value:string)=>value.split("-").map(x=>x[0].toUpperCase()+x.slice(1)).join(" ");

export default async function ProductListing({params}:{params:Promise<{slug:string;subcategory:string}>}){
  const {slug,subcategory}=await params;const category=human(slug);const title=human(subcategory);
  return <div className="archive-page"><Header/><main>
    <section className="archive-intro"><div className="archive-crumb">HOME / &nbsp;{category.toUpperCase()} / &nbsp;<b>{title.toUpperCase()}</b></div><span>THE {category.toUpperCase()} ARCHIVE</span><h1>{title}</h1><div className="archive-summary"><p>Meticulously tailored from pure European flax linen, Egyptian cotton sateen, and washed waffle weaves. Designed for effortless draping, lasting softness, and quiet luxury.</p><div><b>100%<small>TRACEABLE FLAX</small></b><b>Hand<small>STITCHED EDGES</small></b></div></div></section>
    <div className="archive-toolbar"><div><b>SHOWING 12 MASTERPIECES</b><span>EUROPEAN LINEN&nbsp; CLOSE</span><span>QUEEN / KING&nbsp; CLOSE</span><button>RESET</button></div><div>SORT BY:&nbsp; <button>HIDE FILTERS</button></div></div>
    <section className="archive-products"><aside><div className="filter-title"><b>REFINE ARCHIVE</b><button>RESET ALL</button></div>{[["STYLE",["Solid Weave","Patterned & Jacquard","Hand-Embroidered","Bordered & Flanged"]],["AESTHETIC MOOD",["Contemporary Minimal","Modern Warmth","Architectural Traditional","Rustic Wabi-Sabi","Coastal Serenity"]],["MATERIAL & WEAVE",["Pure Flax Linen","Mulberry Raw Silk","Crisp Egyptian Percale","Lustrous Cotton Sateen","Organic Waffle Weave"]],["PRICE TIER",["$19 – $499","$500 – $999","$1,000 and above"]]].map(([heading,items])=><fieldset key={heading as string}><legend>{heading as string}<span>⌃</span></legend>{(items as string[]).map((x,i)=><label key={x}><input type="radio" defaultChecked={i===0}/><span>{x}</span><small>({14-i*3})</small></label>)}</fieldset>)}<fieldset><legend>COLOR NUANCE <span>⌃</span></legend><div className="color-options">{["#fff","#faf7e8","#e9e5ca","#888","#9b4f17","#111","#2875a0","#536d2e"].map(c=><i key={c} style={{background:c}}/>)}</div></fieldset><fieldset><legend>BED SIZE <span>⌃</span></legend><div className="size-options">{["TWIN","FULL","QUEEN","KING","SUPER","CUSTOM"].map((x,i)=><button className={i===2||i===3?"active":""} key={x}>{x}</button>)}</div></fieldset></aside>
      <div><div className="archive-grid">{productImages.map((src,i)=><Link href="/product/signature-linen" className="archive-card" key={`${src}-${i}`}><div><Image src={src} alt={productNames[i]} fill sizes="26vw"/><button>♡</button>{i===1&&<span>PURE FLAX</span>}</div><small>BEDDING</small><h2>{productNames[i]}</h2><p><i/> <i/> {i===1?"+6":"2"} colors</p><div className="card-price"><b>${["310 – $380","285 – $345","420 – $495"][i%3]}</b><span>{i===0?"5.0 ★ (42)":"4.9 ★ (89)"}</span></div></Link>)}</div><div className="archive-progress">Displaying 6 of 12 atelier creations<i/><button>LOAD MORE MASTERPIECES</button></div></div>
    </section>
    <section className="related-archive"><div><span>THE ATELIER BEDDING ARCHIVE</span><h2>Explore Bedding Categories</h2><p>Complement your duvet cover with mastercrafted coordinates woven from identical linen and Egyptian sateen yarn lots for seamless harmony.</p></div><div className="related-grid">{related.map(([src,name,price,badge])=><Link href={`/products/${slug}/${name.toLowerCase().replaceAll(" ","-").replaceAll("&","and")}`} key={name}><div><Image src={src} alt={name} fill sizes="32vw"/><span>{badge}</span></div><h3>{name}<b>From ${price}</b></h3><p>Hand-quilted Belgian linen and timeless layers tailored for effortless seasonal transitions.</p><em>EXPLORE {name.toUpperCase()} &nbsp;→</em></Link>)}</div></section>
  </main><Footer/></div>
}
