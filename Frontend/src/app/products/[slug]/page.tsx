import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";
import { CatalogCard, getCatalogCategory } from "@/lib/catalog";
import "./category.css";

function ProductCard({ item }: { item: CatalogCard }) {
  return <Link className="cp-product" href={`/product/${item.slug}`}><div><Image src={item.image} alt={item.name} fill sizes="30vw" /></div><small>★ ★ ★ ★ ★</small><h3>{item.name}</h3><p>{item.description}</p><b>From ${item.price}</b><span>EXPLORE PRODUCT ↗</span></Link>;
}

export default async function Products({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCatalogCategory(slug);
  if (!category) notFound();
  return <div className="category-page"><Header /><main>
    <section className="cp-hero"><Image src={category.heroImage} alt={`${category.name} collection`} fill priority quality={92} sizes="100vw" /><div><span>{category.eyebrow}</span><h1>{category.headline}</h1><p>{category.description}</p><Link href="#collection">EXPLORE {category.name.toUpperCase()}</Link></div></section>
    <section className="cp-section cp-categories"><header><h2>Shop by Category</h2><p>Explore our curated collections for every corner of your home.</p></header><div>{category.subcategories.map(item => <Link href={`/products/${slug}/${item.slug}`} key={item.slug}><Image src={item.image} alt={item.name} width={310} height={330}/><span>{item.name}</span></Link>)}</div></section>
    <section className="cp-section cp-fabrics"><header><h2>Shop by Material</h2><p>Choose the texture, performance and natural hand that suits your room.</p></header><div>{category.fabrics.map(item => <Link href={`/products/${slug}/${item.slug}`} key={item.slug}><Image src={item.image} alt={item.name} width={280} height={230}/><span>{item.name}</span></Link>)}</div></section>
    <section className="cp-catalog cp-section" id="collection"><div className="cp-catalog-head"><div><h2>Find Your Perfect {category.name}</h2><p>{category.products.length} Designs</p></div><button><span>SORT BY: RECOMMENDED</span>⌄</button></div><div className="cp-catalog-body"><aside><b>PRODUCT TYPE</b>{category.subcategories.slice(0,4).map(item=><label key={item.slug}><input type="checkbox"/> {item.name}</label>)}{["MATERIAL","SIZE","COLOR","PRICE"].map(x=><button key={x}>{x}<span>+</span></button>)}</aside><div className="cp-product-grid">{category.products.slice(0,3).map(item=><ProductCard key={item.slug} item={item}/>)}</div></div></section>
    <section className="cp-section cp-favourites"><div className="cp-title-row"><div><h2>Customer Favorites</h2><p>Top-rated pieces loved by our community.</p></div><div>← &nbsp; →</div></div><div className="cp-four-products">{category.products.map(item=><ProductCard key={item.slug} item={item}/>)}</div></section>
    <section className="cp-layer cp-section"><Image src={category.products[1]?.image||category.heroImage} alt={`Styled ${category.name}`} width={640} height={720}/><div><span>STYLED SANCTUARY</span><h2>Made to Live Beautifully</h2><p>{category.description} Layer complementary textures and tonal shades for a room that feels collected and personal.</p><h4>Shop This Look</h4>{category.products.slice(0,3).map(item=><Link href={`/product/${item.slug}`} key={item.slug}><Image src={item.image} alt="" width={58} height={58}/><span>{item.name}<small>{item.description}</small></span><b>${item.price}</b></Link>)}</div></section>
    <section className="cp-section cp-bundles"><header><h2>Curated Collections</h2><p>Expertly composed pieces for a cohesive, complete look.</p></header><div>{category.products.slice(0,3).map(item=><ProductCard key={item.slug} item={item}/>)}</div></section>
    <section className="cp-guide cp-section"><header><h2>{category.guideTitle}</h2><p>{category.guideCopy}</p></header><div className="cp-guide-hero"><Image src={category.heroImage} alt={category.guideTitle} fill sizes="100vw"/><div><span>EDITORIAL</span><h2>Designed for the Way You Live</h2><p>Start with proportion and purpose, then layer natural materials and quiet detail.</p><p>Order swatches to experience every colour and texture in your own light.</p></div></div><div className="cp-guide-cards">{[["Choose the Right Material","Consider light, touch and everyday performance."],["Measure with Confidence","Follow our atelier guide for a precise result."],["Layer with Intention","Mix texture and tone for a collected interior."]].map(([h,p])=><article key={h}><h3>{h}</h3><p>{p}</p></article>)}</div></section>
  </main><Footer /></div>;
}
