import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
import "./category.css";

const collections = [
  ["/figma/home-05.png","Duvet Covers","duvet-covers"],["/figma/home-15.jpeg","Quilts & Coverlets","quilts-coverlets"],
  ["/figma/home-11.png","Comforters","comforters"],["/figma/home-10.jpeg","Sheets","sheets"],["/figma/home-01.jpeg","Blankets & Throws","blankets-throws"],
];
const fabrics = [
  ["/figma/home-04.jpeg","Linen"],["/figma/home-03.jpeg","Cotton"],["/figma/home-17.jpeg","Percale"],["/figma/home-15.jpeg","Sateen"],
  ["/figma/home-12.jpeg","Velvet"],["/figma/home-02.png","Silk Sateen"],["/figma/home-18.jpeg","Wool Blend"],["/figma/home-19.png","Organic Cotton"],
];
const products = [
  ["/figma/home-05.png","Washed Linen Duvet Cover","100% European Flax Linen","185"],
  ["/figma/home-15.jpeg","Textured Cotton Quilt","Organic Cotton","140"],
  ["/figma/home-17.jpeg","Classic Percale Sheet Set","Crisp Matte Cotton","115"],
];
const favourites = [
  ["/figma/home-10.jpeg","Signature Sateen Sheet Set","145"],
  ["/figma/home-11.png","Organic Cotton Duvet","195"],
  ["/figma/home-18.jpeg","Chunky Knit Throw","85"],
  ["/figma/home-12.jpeg","Lightweight Coverlet","210"],
];

function ProductCard({item}:{item:string[]}){return <Link className="cp-product" href="/product/signature-linen"><div><Image src={item[0]} alt={item[1]} fill sizes="30vw"/></div><small>★ ★ ★ ★ ★</small><h3>{item[1]}</h3>{item[2]&&<p>{item[2]}</p>}<b>From ${item[3]??item[2]}</b><span>EXPLORE PRODUCT ↗</span></Link>}

export default async function Products({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const title=slug.split("-").map(s=>s[0].toUpperCase()+s.slice(1)).join(" ");
  const isBedding=slug==="bedding";
  return <div className="category-page"><Header/><main>
    <section className="cp-hero"><Image src="/figma/home-11.png" alt={`${title} collection`} fill priority sizes="100vw"/><div><span>REST EASY, LIVE BEAUTIFULLY</span><h1>Elevate Your {isBedding?"Bedroom":title}</h1><p>Discover beautifully crafted {title.toLowerCase()} designed for comfort, texture and timeless style.</p><Link href="#collection">EXPLORE {title.toUpperCase()}</Link></div></section>

    <section className="cp-section cp-categories"><header><h2>Shop by Category</h2><p>Explore our curated collections for every corner of your sanctuary.</p></header><div>{collections.map(([src,name,path])=><Link href={`/products/${slug}/${path}`} key={name}><Image src={src} alt={name} width={310} height={330}/><span>{name}</span></Link>)}</div></section>

    <section className="cp-section cp-fabrics"><header><h2>Shop by Fabric</h2><p>Choose the perfect texture for your preferred sleep surface.</p></header><div>{fabrics.map(([src,name])=><Link href="#collection" key={name}><Image src={src} alt={name} width={280} height={230}/><span>{name}</span></Link>)}</div></section>

    <section className="cp-catalog cp-section" id="collection"><div className="cp-catalog-head"><div><h2>Find Your Perfect Layer</h2><p>84 Designs</p></div><button>SORT BY: RECOMMENDED⌄</button></div><div className="cp-catalog-body"><aside><b>PRODUCT TYPE</b>{["Duvet Covers","Quilts & Coverlets","Comforters","Sheets"].map(x=><label key={x}><input type="checkbox"/> {x}</label>)}{["FABRIC","SIZE","COLOR"].map(x=><button key={x}>{x}<span>+</span></button>)}</aside><div className="cp-product-grid">{products.map(item=><ProductCard key={item[1]} item={item}/>)}</div></div></section>

    <section className="cp-section cp-favourites"><div className="cp-title-row"><div><h2>Customer Favorites</h2><p>Top-rated bedding loved by our community.</p></div><div>← &nbsp; →</div></div><div className="cp-four-products">{favourites.map(item=><ProductCard key={item[1]} item={item}/>)}</div></section>

    <section className="cp-layer cp-section"><Image src="/figma/home-15.jpeg" alt="Layered bed" width={640} height={720}/><div><span>STYLED SANCTUARY</span><h2>The Art of the Layered Bed</h2><p>Create a space that invites rest with our curated collection of soft, breathable layers. Combine textures and tonal shades for a bed that looks as good as it feels.</p><h4>Shop This Look</h4>{products.map(x=><Link href="/product/signature-linen" key={x[1]}><Image src={x[0]} alt="" width={58} height={58}/><span>{x[1]}<small>{x[2]}</small></span><b>${x[3]}</b></Link>)}</div></section>

    <section className="cp-section cp-bundles"><header><h2>Bestselling Bundles</h2><p>Save when you shop our expertly curated sets for a cohesive, complete look.</p></header><div>{products.map((x,i)=><ProductCard key={x[1]} item={[x[0],["The Core Linen Bundle","The Ultimate Sateen Set","The Layered Look Bundle"][i],x[2],["297","336","323"][i]]}/>)}</div></section>

    <section className="cp-guide cp-section"><header><h2>The Bedding Guide</h2><p>Expert advice for your best night's sleep.</p></header><div className="cp-guide-hero"><Image src="/figma/home-03.jpeg" alt="Bedding guide" fill sizes="100vw"/><div><span>EDITORIAL</span><h2>Treat Yourself to Better Bedding</h2><p>Invest in high-thread-count cotton sheets that feel better with every wash.</p><p>Experiment with rich textures like velvet or breathable linen for your duvet.</p></div></div><div className="cp-guide-cards">{[["Play with Color & Pattern","Layer neutral tones for a serene look."],["The Ultimate Comfort","Choose natural materials by the season."],["Seasonal Updates","Refresh your bedding as the seasons shift."]].map(([h,p])=><article key={h}><h3>{h}</h3><p>{p}</p></article>)}</div></section>
  </main><Footer/></div>;
}
