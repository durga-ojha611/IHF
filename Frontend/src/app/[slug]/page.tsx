import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";

const pages: Record<string,{title:string;kicker:string;copy:string;image:string;cta:string}> = {
  "drapery": {title:"Drapery, made for your space.",kicker:"MADE TO MEASURE",copy:"Choose your fabric, heading, lining and finish. Every panel is tailored to your measurements and finished by hand.",image:"/figma/home-01.jpeg",cta:"START CUSTOMISING"},
  "roman-shades": {title:"Tailored Roman Shades",kicker:"BEAUTIFUL LIGHT, PRECISELY CONTROLLED",copy:"A clean, considered silhouette made in your choice of fabric and finish.",image:"/figma/home-06.jpeg",cta:"SHOP ROMAN SHADES"},
  "valances": {title:"The finishing touch.",kicker:"CUSTOM VALANCES & CORNICES",copy:"Architectural framing and graceful fabric treatments, tailored to bring balance to every window.",image:"/figma/home-04.jpeg",cta:"EXPLORE VALANCES"},
  "resources": {title:"A guide to beautiful rooms.",kicker:"DESIGN RESOURCES",copy:"Everything you need to measure, choose and care for custom window treatments and fine home furnishings.",image:"/figma/home-18.jpeg",cta:"EXPLORE GUIDES"},
  "shipping": {title:"Delivery, handled with care.",kicker:"SHIPPING & RETURNS",copy:"Complimentary worldwide delivery, careful packaging and straightforward returns for every order.",image:"/figma/home-08.png",cta:"READ DELIVERY GUIDE"},
  "our-story": {title:"Beautifully made in India.",kicker:"OUR STORY",copy:"A family-led atelier bringing together time-honoured craftsmanship, beautiful materials and contemporary design.",image:"/figma/home-13.png",cta:"DISCOVER OUR CRAFT"},
  "journal": {title:"Stories for a considered home.",kicker:"THE JOURNAL",copy:"Design advice, material guides and inspiring rooms from our community around the world.",image:"/figma/home-15.jpeg",cta:"READ THE LATEST"},
  "privacy": {title:"Your privacy matters.",kicker:"PRIVACY POLICY",copy:"Learn how India Home Furnishings responsibly collects, uses and protects your information.",image:"/figma/home-19.png",cta:"CONTACT US"},
};

export function generateStaticParams(){return Object.keys(pages).map(slug=>({slug}));}

export default async function ContentPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const page=pages[slug]; if(!page) notFound();
  return <><Header/><main className="editorial-page"><section className="editorial-hero"><Image src={page.image} alt="" fill priority sizes="100vw"/><div/><article><small>{page.kicker}</small><h1>{page.title}</h1><p>{page.copy}</p><Link href={slug==="drapery"?"/drapery/configure":"/products"}>{page.cta} →</Link></article></section><section className="editorial-note"><small>CONSIDERED DESIGN. EXCEPTIONAL CRAFT.</small><h2>Made beautifully. Made for you.</h2><p>Our collection brings together timeless materials, nuanced colour and exacting craftsmanship for a home that feels entirely your own.</p></section></main><Footer/></>;
}
