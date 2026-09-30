import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";
import { getCatalogCategory, getCatalogProducts } from "@/lib/catalog";
import "./listing.css";

const human = (value: string) => value.split("-").map(x => x[0].toUpperCase() + x.slice(1)).join(" ");

export default async function ProductListing({ params }: { params: Promise<{ slug: string; subcategory: string }> }) {
  const { slug, subcategory } = await params;
  const category = await getCatalogCategory(slug);
  if (!category) notFound();
  const selected = category.subcategories.find(x => x.slug === subcategory) || category.fabrics.find(x => x.slug === subcategory);
  const title = selected?.name || human(subcategory);
  const products = await getCatalogProducts(slug, subcategory);
  return <div className="archive-page"><Header/><main>
    <section className="archive-intro"><div className="archive-crumb">HOME / &nbsp;{category.name.toUpperCase()} / &nbsp;<b>{title.toUpperCase()}</b></div><span>THE {category.name.toUpperCase()} ARCHIVE</span><h1>{title}</h1><div className="archive-summary"><p>{selected?.description || category.description} Designed with lasting materials, meticulous finishing and quiet luxury.</p><div><b>100%<small>NATURAL MATERIALS</small></b><b>Hand<small>FINISHED DETAILS</small></b></div></div></section>
    <div className="archive-toolbar"><div><b>SHOWING {products.length} MASTERPIECES</b><span>NATURAL MATERIALS&nbsp; CLOSE</span><span>MADE TO ORDER&nbsp; CLOSE</span><button>RESET</button></div><div>SORT BY:&nbsp; <button>HIDE FILTERS</button></div></div>
    <section className="archive-products"><aside><div className="filter-title"><b>REFINE ARCHIVE</b><button>RESET ALL</button></div>{[["STYLE",["Contemporary Minimal","Modern Warmth","Architectural Traditional","Relaxed Heritage"]],["MATERIAL",category.fabrics.slice(0,5).map(x=>x.name)],["PRICE TIER",["$95 – $299","$300 – $599","$600 and above"]]].map(([heading,items])=><fieldset key={heading as string}><legend>{heading as string}<span>⌃</span></legend>{(items as string[]).map((x,i)=><label key={x}><input type="radio" defaultChecked={i===0}/><span>{x}</span><small>({14-i*3})</small></label>)}</fieldset>)}<fieldset><legend>COLOR NUANCE <span>⌃</span></legend><div className="color-options">{["#fff","#faf7e8","#d7cdb9","#888","#9b4f17","#111","#71818a","#687254"].map(c=><i key={c} style={{background:c}}/>)}</div></fieldset></aside>
      <div><div className="archive-grid">{products.map((item,i)=>{const primary=item.images.find(image=>image.isPrimary)||item.images[0];return <Link href={`/product/${item.slug}`} className="archive-card" key={item._id}><div><Image src={primary?.url} alt={primary?.alt||item.title} fill sizes="26vw"/><button>♡</button>{item.isFeatured&&<span>ATELIER EDIT</span>}</div><small>{category.name.toUpperCase()}</small><h2>{item.title}</h2><p>{item.colors.slice(0,2).map(color=><i key={color.name} style={{background:color.hexCode}}/>)} {item.colors.length} colours</p><div className="card-price"><b>${item.basePrice}</b><span>{item.ratingAverage||"NEW"} {item.ratingAverage?`★ (${item.ratingCount})`:""}</span></div></Link>})}</div>{products.length===0?<div className="archive-progress">No published products are assigned to this subcategory.</div>:<div className="archive-progress">Displaying {products.length} atelier creations<i/></div>}</div>
    </section>
    <section className="related-archive"><div><span>THE ATELIER {category.name.toUpperCase()} ARCHIVE</span><h2>Explore {category.name} Categories</h2><p>Discover complementary collections designed to work together in material, colour and proportion.</p></div><div className="related-grid">{category.subcategories.slice(0,6).map(item=><Link href={`/products/${slug}/${item.slug}`} key={item.slug}><div><Image src={item.image} alt={item.name} fill sizes="32vw"/><span>ATELIER COLLECTION</span></div><h3>{item.name}<b>From ${item.price}</b></h3><p>{item.description}</p><em>EXPLORE {item.name.toUpperCase()} &nbsp;→</em></Link>)}</div></section>
  </main><Footer/></div>;
}
