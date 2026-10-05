import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { BenefitIcon } from "@/components/benefit-icon";
import { ProductReviewsSection } from "@/components/product-reviews-section";
import { ShopTheLookSection } from "@/components/shop-the-look-section";
import { RelatedProductsSection } from "@/components/related-products-section";
import { DeliveryEstimateSection } from "@/components/delivery-estimate-section";
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
  
  const defaultFaqs = [
    { question: "How should I care for this piece?", answer: "We recommend professional dry cleaning or a gentle cold machine wash using a neutral liquid detergent. Line dry in the shade to preserve natural linen fibers and prevent direct tumble heat." },
    { question: "Can I order a custom size?", answer: "Yes, every piece can be tailored to your exact window or bed dimensions through our atelier customizer or by contacting our dedicated design concierge." },
    { question: "What is the difference between this and pure linen?", answer: "Our signature linen blend combines natural European flax with long-staple cotton for enhanced drape, reduced harsh wrinkling, and a softer initial hand-feel right out of the packaging." },
    { question: "How long will delivery and dispatch take?", answer: "Standard orders dispatch within 24-48 hours. Estimated delivery is typically 3-5 business days across major metro areas with complimentary white-glove packaging." },
    { question: "What is your return and exchange policy?", answer: "Due to the artisanal, small-batch nature of our textiles and hygiene standards, items are final sale. We strongly encourage ordering fabric swatches prior to placing custom orders." }
  ];
  const faqs = (product.faqs && product.faqs.length >= 5) ? product.faqs.slice(0, 5) : defaultFaqs;

  return <div className="detail-page"><Header/><main>
    <ProductPurchasePanel id={product._id} title={product.title} price={product.basePrice} description={product.shortDescription || product.description} eyebrow={product.fabricType} category={category} subcategory={subcategory} images={images} colors={product.colors} sizes={product.standardSizes} ratingCount={product.ratingCount}/>
    <section className="detail-benefits"><h2>Why You’ll Love It</h2><div>{benefits.map(benefit=><article key={benefit.title}><BenefitIcon title={benefit.title}/><h3>{benefit.title}</h3><p>{benefit.description}</p></article>)}</div></section>
    <section className="spec-section"><div><h2>Technical Specifications</h2>{specifications.map(([label,value])=><p key={label}><span>{label}</span><b>{value}</b></p>)}<h4>DESIGN DETAILS</h4><small>{product.features.slice(0,6).join(" · ")||"Made to order · Quality inspected · Carefully packed"}</small></div><div><h2>Available Dimensions</h2><table><thead><tr><th>SIZE</th><th>PRODUCTION</th><th>SELECTION</th></tr></thead><tbody>{dimensions.map(row=><tr key={row.size}><td>{row.size}</td><td>{row.metric}</td><td>{row.imperial}</td></tr>)}</tbody></table><h4>CARE INSTRUCTIONS</h4><p className="spec-care">{product.careInstructions?.join(" · ")||"Professional dry cleaning recommended. Follow the care label supplied with your order."}</p></div></section>
    <DeliveryEstimateSection />
    <section className="craft-detail"><div><span>{product.editorial?.eyebrow||"CRAFTED WITH INTENTION"}</span><h2>{product.editorial?.title||"The Story Behind the Piece"}</h2><p>{product.editorial?.description||product.description}</p><ul><li>{product.materialComposition||product.fabricType}</li>{product.features.slice(0,3).map(feature=><li key={feature}>{feature}</li>)}</ul></div><Image src={product.editorial?.image||primary.url} alt={product.editorial?.title||product.title} width={600} height={600}/></section>
    <ShopTheLookSection />
    <RelatedProductsSection relatedProducts={related} defaultCategoryName={category} />
    <ProductReviewsSection productId={product._id} productTitle={product.title} ratingAverage={product.ratingAverage} ratingCount={product.ratingCount} initialReviews={product.reviews} productImages={images} />
    <section className="faq">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map(item=>(
          <details key={item.question}>
            <summary>
              <span>{item.question}</span>
              <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 6L11 1" stroke="#666359" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  </main><Footer/></div>;
}


