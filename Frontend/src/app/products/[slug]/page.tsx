import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";
import { CatalogCard, getCatalogCategory, getProductRecord } from "@/lib/catalog";
import { CATEGORY_CUSTOMIZER_CONFIGS } from "@/lib/customizer-configs";
import "./category.css";

const CUSTOMIZABLE_SLUGS = ["drapery", "shades", "valances"];

function ProductCard({
  item
}: {
  item: CatalogCard;
  isCustomizable?: boolean;
  customizerUrl?: string;
}) {
  const targetHref = `/product/${item.slug}`;

  return (
    <Link className="cp-product" href={targetHref}>
      <div>
        <Image src={item.image} alt={item.name} fill sizes="30vw" />
        {item.customizable && <em>MADE TO MEASURE</em>}
      </div>
      <small>{item.productType || "ATELIER COLLECTION"}</small>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <footer><b>From ${item.price}</b></footer>
      <span>VIEW DETAILS <i>→</i></span>
    </Link>
  );
}

export default async function Products({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = CATEGORY_CUSTOMIZER_CONFIGS[slug];
  const backendCategory = await getCatalogCategory(slug).catch(() => null);

  // If neither config nor backend category found, check if it's a product
  if (!config && !backendCategory) {
    const product = await getProductRecord(slug);
    if (product) {
      redirect(`/product/${slug}`);
    }
    notFound();
  }

  const categoryName = config?.name || backendCategory?.name || "Collection";
  const isCustomizable = CUSTOMIZABLE_SLUGS.includes(slug);
  const customizerUrl = slug === "drapery" ? "/drapery/configure" : `/configure/${slug}`;
  const fabricUrl = slug === "drapery" ? "/drapery/configure/fabric" : `/configure/${slug}/fabric`;

  // Merge backend data with mock schema for resilience
  const heroImage = config?.heroImage || backendCategory?.heroImage || "/figma/home-01.jpeg";
  const eyebrow = config?.eyebrow || backendCategory?.eyebrow || `THE ${categoryName.toUpperCase()} COLLECTION`;
  const headline = config?.headline || backendCategory?.headline || `Frame Every View`;
  const description = config?.description || backendCategory?.description || `Thoughtfully crafted designs tailored to your home.`;

  const subcategories: CatalogCard[] = config?.styles.map((s) => ({
    slug: s.slug,
    name: s.name,
    image: s.image,
    description: s.description,
    price: s.price
  })) || backendCategory?.subcategories || [];

  const fabrics: CatalogCard[] = config?.fabrics.map((f) => ({
    slug: f.slug,
    name: `${f.name} · ${f.color}`,
    image: f.image,
    description: f.description,
    price: f.price
  })) || backendCategory?.fabrics || [];

  const products: CatalogCard[] = config?.products.map((p) => ({
    slug: p.slug,
    name: p.name,
    image: p.image,
    description: p.description,
    price: p.price
  })) || backendCategory?.products || subcategories;

  const guideTitle = config?.guideTitle || backendCategory?.guideTitle || `The ${categoryName} Guide`;
  const guideImage = config?.guideImage || heroImage;
  const guideCopy = config?.guideCopy || backendCategory?.guideCopy || `Expert advice for choosing styles, fabrics, and caring for your pieces.`;
  const guideSteps = config?.guideSteps || [
    { title: "Choose the Right Material", desc: "Consider light, touch and everyday performance." },
    { title: "Measure with Confidence", desc: "Follow our atelier guide for a precise result." },
    { title: "Layer with Intention", desc: "Mix texture and tone for a collected interior." }
  ];

  return (
    <div className="category-page">
      <Header />
      <main>
        {/* Editorial Category Hero */}
        <section className={`cp-hero ${slug === "bedding" ? "cp-hero-bedding" : ""}`}>
          <Image
            src={heroImage}
            alt={`${categoryName} collection`}
            fill
            priority
            quality={92}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div>
            <span>{eyebrow}</span>
            <h1>{headline}</h1>
            <p>{description}</p>
            {isCustomizable ? (
              <div className="cp-hero-actions">
                <Link href={customizerUrl} className="cp-hero-link-white">
                  START CUSTOMIZING <span className="arrow">→</span>
                </Link>
                <Link href="#collection" className="cp-hero-link-white">
                  VIEW READY-MADE <span className="arrow">→</span>
                </Link>
              </div>
            ) : (
              <div className="cp-hero-actions">
                <Link href="#collection" className="cp-hero-link-white">
                  EXPLORE {categoryName.toUpperCase()} <span className="arrow">→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 1. Shop by Style / Silhouette */}
        <section className="cp-section cp-categories">
          <header>
            <h2>Shop by {categoryName} Style</h2>
            <p>Explore our curated headings and silhouettes tailored for every architectural space.</p>
          </header>
          <div>
            {subcategories.map((item) => {
              const itemHref = `/product/${item.slug}`;
              return (
                <Link href={itemHref} key={item.slug}>
                  <Image unoptimized src={item.image} alt={item.name} width={310} height={330} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 2. Shop by Material / Fabric Library */}
        <section className="cp-section cp-fabrics">
          <header>
            <h2>Shop by Material</h2>
            <p>Choose the texture, performance and natural hand that suits your room.</p>
          </header>
          <div>
            {fabrics.map((item) => {
              const itemFabricHref = isCustomizable ? fabricUrl : "/swatches";
              return (
                <Link href={itemFabricHref} key={item.slug}>
                  <Image src={item.image} alt={item.name} width={280} height={230} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. Filterable Catalog */}
        <section className="cp-catalog cp-section" id="collection">
          <div className="cp-catalog-head">
            <div>
              <h2>Find Your Perfect {categoryName}</h2>
              <p>{products.length} {isCustomizable ? "Atelier Custom Designs" : "Designs"}</p>
            </div>
            <button type="button">
              <span>SORT BY: RECOMMENDED</span> ⌄
            </button>
          </div>
          <div className="cp-catalog-body">
            <aside>
              <b>STYLE / TYPE</b>
              {subcategories.slice(0, 4).map((item, idx) => (
                <label key={item.slug}>
                  <input type="checkbox" defaultChecked={idx === 0} /> {item.name}
                </label>
              ))}
              {["MATERIAL", "SIZE", "COLOR", "PRICE"].map((filterName) => (
                <button type="button" key={filterName}>
                  {filterName}
                  <span>+</span>
                </button>
              ))}
            </aside>
            <div className="cp-product-grid">
              {products.map((item) => (
                <ProductCard
                  key={item.slug}
                  item={item}
                  isCustomizable={isCustomizable}
                  customizerUrl={customizerUrl}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Customer Favorites */}
        <section className="cp-section cp-favourites">
          <div className="cp-title-row">
            <div>
              <h2>Customer Favorites</h2>
              <p>Top-rated pieces loved by our design community.</p>
            </div>
            <div style={{ fontSize: 14, letterSpacing: 4, color: "#888" }}>
              ← &nbsp; →
            </div>
          </div>
          <div className="cp-four-products">
            {products.slice(0, 4).map((item) => (
              <ProductCard
                key={item.slug}
                item={item}
                isCustomizable={isCustomizable}
                customizerUrl={customizerUrl}
              />
            ))}
          </div>
        </section>

        {/* 5. Styled Sanctuary / Lookbook */}
        <section className="cp-layer cp-section">
          <Image
            src={products[1]?.image || heroImage}
            alt={`Styled sanctuary ${categoryName.toLowerCase()}`}
            width={640}
            height={720}
          />
          <div>
            <span>STYLED SANCTUARY</span>
            <h2>Made to Live Beautifully</h2>
            <p>
              Layer complementary textures and tonal shades for a room that feels collected and personal. Custom tailored treatments create effortless warmth while elevating architectural proportions.
            </p>
            <h4>Shop This Look</h4>
            {products.slice(0, 3).map((item) => {
              const lookHref = isCustomizable ? customizerUrl : `/product/${item.slug}`;
              return (
                <Link href={lookHref} key={item.slug}>
                  <Image src={item.image} alt={item.name} width={58} height={58} />
                  <span>
                    {item.name}
                    <small>{item.description}</small>
                  </span>
                  <b>${item.price}</b>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 6. Curated Collections / Room Bundles */}
        <section className="cp-section cp-bundles">
          <header>
            <h2>Curated Collections</h2>
            <p>Expertly composed pieces for a cohesive, complete interior.</p>
          </header>
          <div>
            {products.slice(0, 3).map((item) => (
              <ProductCard
                key={item.slug}
                item={item}
                isCustomizable={isCustomizable}
                customizerUrl={customizerUrl}
              />
            ))}
          </div>
        </section>

        {/* 7. Editorial Guide */}
        <section className="cp-guide cp-section">
          <header>
            <h2>{guideTitle}</h2>
            <p>{guideCopy}</p>
          </header>
          <div className="cp-guide-hero">
            <Image
              src={guideImage}
              alt={guideTitle}
              fill
              sizes="100vw"
            />
            <div>
              <span>EDITORIAL</span>
              <h2>Designed for the Way You Live</h2>
              <p>
                Start with proportion and purpose, then layer natural materials and quiet detail.
              </p>
              <p>
                Order swatches to experience every colour and texture in your own light before tailoring.
              </p>
            </div>
          </div>
          <div className="cp-guide-cards">
            {guideSteps.map((step) => (
              <article key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
