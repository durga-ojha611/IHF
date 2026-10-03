import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { BenefitIcon } from "@/components/benefit-icon";
import { getCatalogProducts, getProductRecord, getRelatedProducts } from "@/lib/catalog";
import "./product-detail.css";
import "./product-light.css";

export default async function ProductDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const product=await getProductRecord(slug); if(!product&&slug==="signature-linen"){const current=await getCatalogProducts("bedding");if(current[0])redirect(`/product/${current[0].slug}`)} if(!product) notFound();
  const related=await getRelatedProducts(product._id); const images=product.images||[]; const primary=images.find(image=>image.isPrimary)||images[0]; if(!primary) notFound();
  const category=typeof product.category==="string"?"Collection":product.category.name; const subcategory=typeof product.subCategory==="string"?"":product.subCategory?.name||"";
  const benefits=product.benefits?.length?product.benefits:[
    {icon:"◇",title:"Made to Order",description:"Prepared specifically for your selected size and finish."},
    {icon:"✦",title:"Atelier Quality",description:"Carefully finished by specialist makers and inspected by hand."},
    {icon:"↔",title:"Considered Fit",description:"A wide size library for a more precise, beautifully proportioned result."},
    {icon:"○",title:"Design Support",description:"Our team can help confirm material, sizing and installation details."}
  ];
  const dimensions=product.dimensions?.length?product.dimensions:product.standardSizes.slice(0,4).map(size=>({size,metric:"Made to order",imperial:size}));
  const specifications=[["Product Type",product.fabricType],["Material",product.materialComposition||product.fabricType],["Finish",product.finishingProcess||"Atelier finished"],["Origin",product.origin||"India Home Furnishings atelier"]];
  return <div className="detail-page"><Header/><main>
    <ProductPurchasePanel id={product._id} title={product.title} price={product.basePrice} description={product.shortDescription || product.description} eyebrow={product.fabricType} category={category} subcategory={subcategory} images={images} colors={product.colors} sizes={product.standardSizes} ratingCount={product.ratingCount}/>
    <section className="detail-benefits"><h2>Why You’ll Love It</h2><div>{benefits.map(benefit=><article key={benefit.title}><BenefitIcon title={benefit.title}/><h3>{benefit.title}</h3><p>{benefit.description}</p></article>)}</div></section>
    <section className="spec-section"><div><h2>Technical Specifications</h2>{specifications.map(([label,value])=><p key={label}><span>{label}</span><b>{value}</b></p>)}<h4>DESIGN DETAILS</h4><small>{product.features.slice(0,6).join(" · ")||"Made to order · Quality inspected · Carefully packed"}</small></div><div><h2>Available Dimensions</h2><table><thead><tr><th>SIZE</th><th>PRODUCTION</th><th>SELECTION</th></tr></thead><tbody>{dimensions.map(row=><tr key={row.size}><td>{row.size}</td><td>{row.metric}</td><td>{row.imperial}</td></tr>)}</tbody></table><h4>CARE INSTRUCTIONS</h4><p className="spec-care">{product.careInstructions?.join(" · ")||"Professional dry cleaning recommended. Follow the care label supplied with your order."}</p></div></section>
    <section className="delivery-section"><div><h2>Delivery Estimate</h2><label>Enter Pincode <button>CHECK</button></label><p>Enter your pincode to view production and delivery estimates for this product.</p></div><div><h3>Inventory & Availability</h3><p>{product.inventoryCount} units currently available · Status: {product.stockStatus.replaceAll("_"," ")}.</p><h3>Complimentary Delivery</h3><p>Every order is inspected, carefully wrapped and dispatched from our atelier.</p><h3>Considered Returns</h3><p>Eligible standard-size pieces may be returned in their original condition.</p></div></section>
    <section className="craft-detail"><div><span>{product.editorial?.eyebrow||"CRAFTED WITH INTENTION"}</span><h2>{product.editorial?.title||"The Story Behind the Piece"}</h2><p>{product.editorial?.description||product.description}</p><ul><li>{product.materialComposition||product.fabricType}</li>{product.features.slice(0,3).map(feature=><li key={feature}>{feature}</li>)}</ul></div><Image src={product.editorial?.image||primary.url} alt={product.editorial?.title||product.title} width={600} height={600}/></section>
    <section className="detail-recs"><div className="detail-section-head"><div><span>COMPLETE YOUR ROOM</span><h2>You May Also Like</h2><p>Products selected from the same category and material family.</p></div><b>← &nbsp; →</b></div><div>{related.map(item=>{const image=item.images.find(x=>x.isPrimary)||item.images[0];const relatedCategory=typeof item.category==="string"?category:item.category?.name||category;return image?<Link href={`/product/${item.slug}`} key={item._id}><div><Image src={image.url} alt={image.alt||item.title} fill sizes="25vw"/><button>♡</button></div><span>{relatedCategory}</span><h3>{item.title}</h3><p>From ${item.basePrice}</p></Link>:null})}</div></section>
    <section className="reviews"><div className="detail-section-head"><div><span>AUTHENTIC STORIES FROM REAL HOMES</span><h2>Customer Reviews</h2></div><button>WRITE A REVIEW</button></div><div className="review-gallery">{images.slice(0,5).map(image=><Image key={image.url} src={image.url} alt={image.alt||product.title} width={230} height={150}/>)}</div><div className="review-body"><aside><b>{product.ratingAverage||"—"}</b><div>★★★★★</div><p>{product.ratingCount||0} REVIEWS</p></aside><div>{product.reviews?.map(review=><article key={`${review.title}-${review.date}`}><div>{"★".repeat(review.rating)} <span>{review.date}</span></div><h3>{review.title}</h3><p>{review.body}</p><small>{review.author}</small></article>)}</div></div></section>
    <section className="faq"><h2>Frequently Asked Questions</h2>{product.faqs?.map(item=><details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</section>
  </main><Footer/></div>;
}
