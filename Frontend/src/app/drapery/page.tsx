import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
import { CatalogCard, CatalogCategory, getCatalogCategory } from "@/lib/catalog";
import "../products/[slug]/category.css";

const FALLBACK_CATEGORY: CatalogCategory = {
  slug: "drapery",
  name: "Drapery",
  eyebrow: "THE DRAPERY COLLECTION",
  headline: "Frame Every View",
  description: "Thoughtfully crafted made-to-measure drapery tailored to your exact window measurements.",
  heroImage: "/figma/home-01.jpeg",
  guideTitle: "The Drapery Guide",
  guideCopy: "Expert advice for choosing headings, fabric yardage and linings.",
  subcategories: [
    {
      slug: "ripple-fold-drapery",
      name: "Ripple Fold Drapery",
      image: "/figma/home-hero-hd.png",
      description: "Clean S-fold design with whisper-quiet glide.",
      price: 545
    },
    {
      slug: "tailored-pleat-drapery",
      name: "Tailored Pleat Drapery",
      image: "/figma/home-15.jpeg",
      description: "Structured architectural waterfall pleat.",
      price: 585
    },
    {
      slug: "pinch-pleat-drapery",
      name: "Pinch Pleat Drapery",
      image: "/figma/home-11.png",
      description: "Timeless Parisian hand-sewn permanent triple pleats.",
      price: 620
    },
    {
      slug: "grommet-drapery",
      name: "Grommet Drapery",
      image: "/figma/home-10.jpeg",
      description: "Contemporary relaxed look with metal ring finish.",
      price: 510
    },
    {
      slug: "inverted-pleat-drapery",
      name: "Inverted Pleat Drapery",
      image: "/figma/home-01.jpeg",
      description: "Sleek flat face with concealed reverse box fullness.",
      price: 560
    }
  ],
  fabrics: [
    {
      slug: "belgian-linen",
      name: "Belgian Linen",
      image: "/figma/home-02.png",
      description: "100% Belgian flax with natural fluid drape.",
      price: 650
    },
    {
      slug: "organic-cotton",
      name: "Organic Cotton",
      image: "/figma/home-03.jpeg",
      description: "Crisp matte combed sateen finish.",
      price: 580
    },
    {
      slug: "silk-velvet",
      name: "Silk Velvet",
      image: "/figma/home-12.jpeg",
      description: "Opulent dense cotton-silk pile for blackout acoustic depth.",
      price: 850
    },
    {
      slug: "wool-blend",
      name: "Wool Blend",
      image: "/figma/home-04.jpeg",
      description: "Thermal and acoustic sound-softening architectural drape.",
      price: 720
    }
  ],
  products: [
    {
      slug: "signature-ripple-fold-drapery",
      name: "Signature Ripple Fold Drapery",
      image: "/figma/home-hero-hd.png",
      description: "Tailored in pure Belgian linen with fluid S-curve folds and smooth ceiling-track glide.",
      price: 545
    },
    {
      slug: "heritage-ripple-fold-drapery",
      name: "Heritage Ripple Fold Drapery",
      image: "/figma/home-03.jpeg",
      description: "Heavyweight textured linen with blackout interlining for luxurious bedroom retreats.",
      price: 620
    },
    {
      slug: "signature-tailored-pleat-drapery",
      name: "Signature Tailored Pleat Drapery",
      image: "/figma/home-15.jpeg",
      description: "Crisp architectural waterfall folds tailored to maintain proportion on tall ceilings.",
      price: 585
    },
    {
      slug: "heritage-pinch-pleat-drapery",
      name: "Heritage Pinch Pleat Drapery",
      image: "/figma/home-01.jpeg",
      description: "Classic hand-stitched triple pleats delivering timeless full-bodied elegance.",
      price: 650
    },
    {
      slug: "signature-grommet-drapery",
      name: "Signature Grommet Drapery",
      image: "/figma/home-10.jpeg",
      description: "Modern architectural metal eyelets sliding effortlessly over custom metal poles.",
      price: 510
    },
    {
      slug: "signature-inverted-pleat-drapery",
      name: "Signature Inverted Pleat Drapery",
      image: "/figma/home-04.jpeg",
      description: "Concealed reverse fullness offering an ultra-clean, minimalist front facade.",
      price: 560
    }
  ]
};

function ProductCard({ item }: { item: CatalogCard }) {
  return (
    <Link className="cp-product" href={`/product/${item.slug}`}>
      <div>
        <Image src={item.image} alt={item.name} fill sizes="30vw" />
        {item.customizable && <em>MADE TO MEASURE</em>}
      </div>
      <small>{item.productType || "DRAPERY COLLECTION"}</small>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <footer><b>From ${item.price}</b></footer>
      <span>VIEW DETAILS <i>→</i></span>
    </Link>
  );
}

export default async function DraperyPage() {
  const backendCategory = await getCatalogCategory("drapery").catch(() => null);
  const category = backendCategory || FALLBACK_CATEGORY;

  const subcategories = category.subcategories?.length
    ? category.subcategories
    : FALLBACK_CATEGORY.subcategories;

  const fabrics = category.fabrics?.length
    ? category.fabrics
    : FALLBACK_CATEGORY.fabrics;

  const products = category.products?.length
    ? category.products
    : FALLBACK_CATEGORY.products;

  return (
    <div className="category-page">
      <Header />
      <main>
        {/* Exact Drapery Intro Hero Requested by User */}
        <section className="editorial-hero">
          <Image
            src="/figma/home-01.jpeg"
            alt="Drapery, made for your space."
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div />
          <article>
            <small>MADE TO MEASURE</small>
            <h1>Drapery, made for your space.</h1>
            <p>
              Choose your fabric, heading, lining and finish. Every panel is tailored to your measurements and finished by hand.
            </p>
            <div className="cp-hero-actions">
              <Link href="/drapery/configure" className="cp-hero-link-white">
                START CUSTOMIZING <span className="arrow">→</span>
              </Link>
              <Link href="#collection" className="cp-hero-link-white">
                VIEW READY-MADE <span className="arrow">→</span>
              </Link>
            </div>
          </article>
        </section>

        {/* 1. Shop by Style / Drapery Headings (Same as Shades section) */}
        <section className="cp-section cp-categories">
          <header>
            <h2>Shop by Drapery Style</h2>
            <p>Explore our curated headings tailored for every architectural window.</p>
          </header>
          <div>
            {subcategories.map((item) => (
              <Link href={`/product/${item.slug}`} key={item.slug}>
                <Image src={item.image} alt={item.name} width={310} height={330} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. Shop by Material / Fabric Library (Same as Shades section) */}
        <section className="cp-section cp-fabrics">
          <header>
            <h2>Shop by Material</h2>
            <p>Choose the texture, performance and natural hand that suits your room.</p>
          </header>
          <div>
            {fabrics.map((item) => (
              <Link href="/drapery/configure/fabric" key={item.slug}>
                <Image src={item.image} alt={item.name} width={280} height={230} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Filterable Catalog & Made-to-Measure Designs (Same as Shades section) */}
        <section className="cp-catalog cp-section" id="collection">
          <div className="cp-catalog-head">
            <div>
              <h2>Find Your Perfect Drapery</h2>
              <p>{products.length} Atelier Custom Designs</p>
            </div>
            <button type="button">
              <span>SORT BY: RECOMMENDED</span> ⌄
            </button>
          </div>
          <div className="cp-catalog-body">
            <aside>
              <b>HEADING STYLE</b>
              {subcategories.slice(0, 4).map((item) => (
                <label key={item.slug}>
                  <input type="checkbox" defaultChecked={item.slug.includes("ripple")} />{" "}
                  {item.name}
                </label>
              ))}
              {["MATERIAL", "LINING TYPE", "COLOR", "PRICE"].map((filterName) => (
                <button type="button" key={filterName}>
                  {filterName}
                  <span>+</span>
                </button>
              ))}
            </aside>
            <div className="cp-product-grid">
              {products.map((item) => (
                <ProductCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Customer Favorites (Same as Shades section) */}
        <section className="cp-section cp-favourites">
          <div className="cp-title-row">
            <div>
              <h2>Customer Favorites</h2>
              <p>Top-rated bespoke draperies loved by our design community.</p>
            </div>
          </div>
          <div className="cp-four-products">
            {products.slice(0, 4).map((item) => (
              <ProductCard key={item.slug} item={item} />
            ))}
          </div>
        </section>

        {/* 5. Styled Sanctuary / Lookbook (Same as Shades section) */}
        <section className="cp-layer cp-section">
          <Image
            src={products[1]?.image || category.heroImage}
            alt="Styled sanctuary drapery"
            width={640}
            height={720}
          />
          <div>
            <span>STYLED SANCTUARY</span>
            <h2>Made to Live Beautifully</h2>
            <p>
              Layer complementary textures and tonal shades for a room that feels collected and personal. Custom ceiling-height treatments create effortless drama while softening acoustic glare.
            </p>
            <h4>Shop This Look</h4>
            {products.slice(0, 3).map((item) => (
              <Link href="/drapery/configure" key={item.slug}>
                <Image src={item.image} alt={item.name} width={58} height={58} />
                <span>
                  {item.name}
                  <small>{item.description}</small>
                </span>
                <b>${item.price}</b>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Curated Collections / Room Bundles (Same as Shades section) */}
        <section className="cp-section cp-bundles">
          <header>
            <h2>Curated Collections</h2>
            <p>Expertly composed pieces for a cohesive, complete interior.</p>
          </header>
          <div>
            {products.slice(0, 3).map((item) => (
              <ProductCard key={item.slug} item={item} />
            ))}
          </div>
        </section>

        {/* 7. Editorial Drapery Guide (Same as Shades section) */}
        <section className="cp-guide cp-section">
          <header>
            <h2>{category.guideTitle || "The Atelier Drapery Guide"}</h2>
            <p>{category.guideCopy || "Expert advice for choosing heading styles, fabrics and fullness."}</p>
          </header>
          <div className="cp-guide-hero">
            <Image
              src="/figma/home-01.jpeg"
              alt="Atelier Drapery Craftsmanship"
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
            {[
              [
                "Choose the Right Heading",
                "Ripple Fold offers modern simplicity, while French Pinch Pleats bring classic architectural presence."
              ],
              [
                "Measure with Confidence",
                "Follow our simple atelier measurement guide for finished width and drop, down to 1/8 inch."
              ],
              [
                "Layer with Intention",
                "Pair privacy or blackout lining with sheer panels for versatile, around-the-clock light control."
              ]
            ].map(([title, desc]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
