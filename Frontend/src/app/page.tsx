import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import { BenefitSection } from "@/components/benefit-section";
import { CustomerStoriesSection } from "@/components/customer-stories-section";
import { InTheirHomesSection } from "@/components/in-their-homes-section";
import { ConsultSection } from "@/components/consult-section";
import "./home.css";
import "./home-tuning.css";
import "./hero-tuning.css";
import "./figma-hero.css";
import "./category-showcase.css";

const finish = [
  ["/figma/home-04.jpeg", "A touch of grandeur", "Tassel Trims", "/blog/a-touch-of-grandeur"],
  ["/figma/home-12.jpeg", "A tailored accent", "Border Trims", "/blog/a-tailored-accent"],
  ["/figma/home-07.jpeg", "A beautiful edge", "Decorative Tapes", "/blog/a-beautiful-edge"],
  ["/figma/home-13.png", "Made by hand", "Custom Details", "/blog/made-by-hand"],
];

const romans = [
  ["/figma/home-15.jpeg", "Flat Fold Roman Shade", "Clean lines and a minimalist profile for a modern look."],
  ["/figma/home-17.jpeg", "Cascade Roman Shade", "Clean lines and a minimalist profile for a modern look."],
  ["/figma/home-09.png", "Relaxed Roman Shade", "Clean lines and a minimalist profile for a modern look."],
  ["/figma/home-20.jpeg", "Tulip Roman Shade", "Clean lines and a minimalist profile for a modern look."],
];

const valances = [
  ["/figma/home-09.png", "Scalloped Valance", "Clean lines and a minimalist profile for a modern look."],
  ["/figma/home-05.png", "Box Pleat Valance", "Clean lines and a minimalist profile for a modern look."],
  ["/figma/home-16.png", "Swag Valance", "Clean lines and a minimalist profile for a modern look."],
];

const cornices = [
  ["/figma/home-06.jpeg", "Upholstered Cornice"],
  ["/figma/home-10.jpeg", "Wooden Cornice"],
  ["/figma/home-15.jpeg", "Layered Cornice"],
  ["/figma/home-01.jpeg", "Decorative Cornice"],
];

const processSteps = [
  {
    step: "/ 01",
    title: "Choose Your Fabric",
    copy: "Explore our curated collections and select the fabric you love.",
    image: "/figma/step-1-choose-fabric.jpg",
  },
  {
    step: "/ 02",
    title: "Measure & Plan",
    copy: "Share your measurements or let our experts help you get them right.",
    image: "/figma/step-2-measure-plan.jpg",
  },
  {
    step: "/ 03",
    title: "Embellish With Trim & Fringe",
    copy: "Personalize your drapery with beautiful trims, borders, fringe and finishing details.",
    image: "/figma/step-3-embellish-trim.jpg",
  },
  {
    step: "/ 04",
    title: "Expert Craftsmanship",
    copy: "Our skilled artisans transform your selections into beautifully finished window treatments.",
    image: "/figma/step-4-expert-craftsmanship.jpg",
  },
  {
    step: "/ 05",
    title: "Beautifully Delivered",
    copy: "Your custom order arrives beautifully finished and ready for your home.",
    image: "/figma/step-5-beautifully-delivered.jpg",
  },
];

function ArrowLink({children, href="#"}:{children:React.ReactNode;href?:string}) {
  return <Link className="home-link" href={href}>{children}<span>↗</span></Link>;
}

export default function Home() {
  return <div className="home-v2">
    <Header />
    <main>
      <section className="home-hero">
        <Image src="/figma/home-hero-hd.png" alt="Custom made bedroom drapery" fill priority quality={92} sizes="100vw" style={{ objectFit: "cover", objectPosition: "center" }} />
        <div className="home-hero-copy">
          <span className="home-kicker hero-kicker">CUSTOM MADE · EST. 1998</span>
          <h1>Custom Made.<br/><em>Beautifully Yours.</em></h1>
          <p>Tailored drapery based on the natural principles of a modern home. Heritage weavers, in-house atelier, made-to-millimetre for every window.</p>
          <div className="hero-actions">
            <Link className="hero-button hero-button-solid" href="/drapery/configure">SHOP NOW <span>→</span></Link>
            <Link className="hero-button hero-button-outline" href="/swatches">ORDER SWATCHES</Link>
          </div>
        </div>
      </section>

      <section className="entrance home-shell">
        <span className="home-kicker">MADE TO MEASURE</span>
        <h2>Drapes That Make an Entrance.</h2>
        <div className="entrance-grid">
          <Image src="/figma/home-01.jpeg" alt="Grand custom drapery" width={760} height={620}/>
          <article><span className="home-kicker">TIMELESS CRAFT</span><h3>EXTRA-LARGE<br/>DRAPES</h3><p>Dramatic scale. Tailored to perfection. Our grand-scale drapes are engineered to handle soaring heights while maintaining beautiful, fluid folds from ceiling to floor.</p><ArrowLink href="/drapery">EXPLORE DRAPERY</ArrowLink></article>
        </div>
      </section>

      <section className="finish-block">
        <div className="home-heading"><span className="home-kicker">CRAFTED TO THE LAST DETAIL</span><h2>The Art of the Finish</h2><p>From hand-finished trims to considered details, every element is designed to make your window treatments unmistakably yours.</p></div>
        <div className="four-grid home-shell">{finish.map(([src,title,name,href])=><article key={name}><Link href={href}><Image src={src} alt={name} width={400} height={520}/></Link><span className="home-kicker">FINISHING TOUCHES</span><h3>{title}</h3><p>{name} with a refined, made-to-measure finish.</p><ArrowLink href={href}>EXPLORE</ArrowLink></article>)}</div>
      </section>

      <section className="product-family home-shell">
        <div className="section-number">01</div><div className="family-heading"><span className="home-kicker">SOFTLY TAILORED FOR EVERY WINDOW</span><h2>TYPES OF ROMAN SHADES</h2></div>
        <div className="four-grid">{romans.map(([src,title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p><Image src={src} alt={title} width={400} height={360}/><ArrowLink href="/roman-shades">SHOP</ArrowLink></article>)}</div>
      </section>

      <section className="product-family home-shell">
        <div className="section-number">02</div><div className="family-heading"><span className="home-kicker">THE FINISHING FRAME</span><h2>TYPES OF VALANCES</h2></div>
        <div className="three-grid">{valances.map(([src,title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p><Image src={src} alt={title} width={520} height={500}/><ArrowLink href="/valances">SHOP</ArrowLink></article>)}</div>
      </section>

      <section className="product-family home-shell cornice-family">
        <div className="section-number">03</div><div className="family-heading"><span className="home-kicker">A POLISHED ARCHITECTURAL FINISH</span><h2>TYPES OF CORNICES</h2><p>Designed to frame the view and conceal hardware beautifully.</p></div>
        <div className="four-grid">{cornices.map(([src,title])=><article key={title}><Image src={src} alt={title} width={420} height={520}/><h3>{title}</h3><p>Tailored proportions and impeccable detailing.</p><ArrowLink>EXPLORE</ArrowLink></article>)}</div>
      </section>

      <section className="craft-story">
        <div className="craft-copy"><span className="home-kicker">OUR PHILOSOPHY</span><h2><em>Beautifully</em> Made.<br/><em>Thoughtfully Delivered.</em></h2><p>We believe your home should be a true reflection of you — your story, your values, your way of life. Every piece is thoughtfully handcrafted in India, bringing together time-honoured craftsmanship, beautiful materials and contemporary design.</p><div className="craft-stats"><b>18<small>DAYS LEAD TIME</small></b><b>96%<small>NATURAL FIBRES</small></b><b>12k+<small>HOMES DRESSED</small></b></div></div>
        <Image src="/figma/home-13.png" alt="Hand finishing custom drapery" width={720} height={720}/>
        <div className="sample-card"><b>25</b><span>YEARS OF DESIGN EXPERTISE</span></div>
      </section>

      <section className="shop-category home-shell"><span className="home-kicker">EVERY DETAIL, BEAUTIFULLY CONSIDERED</span><h2>Shop By Category</h2><p>Discover the pieces that make a room feel complete.</p>
        <div className="category-showcase-grid">
          {/* Left Column: 2 Cards (Table Linen & Decor) */}
          <div className="cat-showcase-col">
            {/* Card 1: Table Linen */}
            <div className="cat-card cat-card-tall">
              <Image
                src="/figma/cat-table-linen.png"
                alt="Table Linen"
                fill
                quality={92}
                className="cat-card-bg-img object-cover object-right"
              />
              <div className="cat-card-overlay" />
              <div className="cat-card-content">
                <span className="cat-pill">30+ Items</span>
                <Link href="/products/table-linen" className="cat-title-link">
                  <h3 className="cat-title">Table Linen</h3>
                </Link>
                <ul className="cat-sublinks">
                  <li><Link href="/products/table-linen?type=dining-chairs">Dining Chairs</Link></li>
                  <li><Link href="/products/table-linen?type=lounge-chairs">Lounge Chairs</Link></li>
                  <li><Link href="/products/table-linen?type=armchairs">Armchairs</Link></li>
                  <li><Link href="/products/table-linen?type=bar-stools">Bar Stools</Link></li>
                  <li><Link href="/products/table-linen?type=office-chairs">Office Chairs</Link></li>
                </ul>
              </div>
            </div>

            {/* Card 2: Decor */}
            <div className="cat-card cat-card-medium">
              <Image
                src="/figma/cat-decor.png"
                alt="Decor"
                fill
                quality={92}
                className="cat-card-bg-img object-cover object-right"
              />
              <div className="cat-card-overlay" />
              <div className="cat-card-content">
                <span className="cat-pill">750+ Items</span>
                <Link href="/products/decor" className="cat-title-link">
                  <h3 className="cat-title">Decor</h3>
                </Link>
                <ul className="cat-sublinks">
                  <li><Link href="/products/decor?type=reception-sofa">Reception Sofa</Link></li>
                  <li><Link href="/products/decor?type=sectional-sofa">Sectional Sofa</Link></li>
                  <li><Link href="/products/decor?type=armless-sofa">Armless Sofa</Link></li>
                  <li><Link href="/products/decor?type=curved-sofa">Curved Sofa</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Cards (Bedding, Cushions, Shades & Blinds) */}
          <div className="cat-showcase-col">
            {/* Card 3: Bedding */}
            <div className="cat-card cat-card-short cat-card-bedding">
              <div className="cat-card-content">
                <span className="cat-pill">750+ Items</span>
                <Link href="/products/bedding" className="cat-title-link">
                  <h3 className="cat-title">Bedding</h3>
                </Link>
                <ul className="cat-sublinks">
                  <li><Link href="/products/bedding?type=reception-sofa">Reception Sofa</Link></li>
                  <li><Link href="/products/bedding?type=sectional-sofa">Sectional Sofa</Link></li>
                  <li><Link href="/products/bedding?type=armless-sofa">Armless Sofa</Link></li>
                  <li><Link href="/products/bedding?type=curved-sofa">Curved Sofa</Link></li>
                </ul>
              </div>
              <div className="cat-card-graphic cat-graphic-bedding">
                <Image
                  src="/figma/cat-bedding-transparent.png"
                  alt="Luxury Bedding Set"
                  width={370}
                  height={220}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Card 4: Cushions */}
            <div className="cat-card cat-card-short cat-card-cushions">
              <div className="cat-card-content">
                <span className="cat-pill">450+ Items</span>
                <Link href="/products/pillows" className="cat-title-link">
                  <h3 className="cat-title">Cushions</h3>
                </Link>
                <ul className="cat-sublinks">
                  <li><Link href="/products/pillows?type=table-lights">Table Lights</Link></li>
                  <li><Link href="/products/pillows?type=floor-lights">Floor Lights</Link></li>
                  <li><Link href="/products/pillows?type=ceiling-lights">Ceiling Lights</Link></li>
                  <li><Link href="/products/pillows?type=wall-lights">Wall Lights</Link></li>
                </ul>
              </div>
              <div className="cat-card-graphic cat-graphic-cushions">
                <Image
                  src="/figma/cat-cushions-new.png"
                  alt="Cushions"
                  width={255}
                  height={205}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Card 5: Shades & Blinds */}
            <div className="cat-card cat-card-short cat-card-shades">
              <div className="cat-card-content">
                <span className="cat-pill">750+ Items</span>
                <Link href="/roman-shades" className="cat-title-link">
                  <h3 className="cat-title">Shades &amp; Blinds</h3>
                </Link>
                <ul className="cat-sublinks">
                  <li><Link href="/roman-shades?type=reception-sofa">Reception Sofa</Link></li>
                  <li><Link href="/roman-shades?type=sectional-sofa">Sectional Sofa</Link></li>
                  <li><Link href="/roman-shades?type=armless-sofa">Armless Sofa</Link></li>
                  <li><Link href="/roman-shades?type=curved-sofa">Curved Sofa</Link></li>
                </ul>
              </div>
              <div className="cat-card-graphic cat-graphic-shades">
                <Image
                  src="/figma/cat-shades-new.png"
                  alt="Shades & Blinds"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="right-details home-shell">
        <div>
          <span className="home-kicker">DETAILS THAT TRANSFORM A ROOM</span>
          <h2>Every beautiful drape begins with the right details.</h2>
          <p>Explore the materials, trims and finishes that bring your vision together.</p>
        </div>
        <div className="three-grid">
          {[
            ["/figma/real-swatch-box-ihf.png", "FABRICS", "/swatches"],
            ["/figma/real-swatch-box-ihf.png", "SWATCHES", "/swatches"],
            ["/figma/home-07.jpeg", "TRIMS & FINISHES", "/drapery"]
          ].map(([src, label, targetHref]) => (
            <article key={label}>
              <Link href={targetHref} style={{ display: "block", color: "inherit", textDecoration: "none" }}>
                <Image src={src} alt={label} width={520} height={420} style={{ objectFit: "cover", width: "100%", height: "330px", borderRadius: "2px" }} />
                <span className="home-kicker" style={{ marginTop: "16px" }}>{label}</span>
                <h3>Chosen for the way you live.</h3>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="fabric-split home-shell">
        <Image src="/figma/real-swatch-box-ihf.png" alt="India Home Furnishings Swatch Box" width={1130} height={754} quality={90} style={{ objectFit: "cover", width: "100%", height: "500px", borderRadius: "2px" }} />
        <div>
          <span className="home-kicker">CURATED MATERIALS</span>
          <h2>Fabrics &amp; Finishes.<br />Chosen for You.</h2>
          <p>Explore a thoughtful collection of natural textures, elegant weaves and enduring colours—selected to work beautifully throughout your home.</p>
          <div className="fabric-split-actions">
            <Link href="/swatches" className="fabric-split-btn-solid">
              ORDER SWATCHES <span className="arrow">→</span>
            </Link>
            <Link href="/swatches" className="fabric-split-btn-link">
              EXPLORE FABRICS &amp; TRIMS <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="process-section home-shell">
        <div className="home-heading" style={{ marginBottom: "50px" }}>
          <span className="home-kicker">FROM FABRIC TO FINISH</span>
          <h2>
            Made With Intention. Delivered<br />
            Beautifully.
          </h2>
        </div>

        <div className="process-grid">
          {processSteps.map((item) => (
            <article key={item.step} className="process-card">
              <div className="process-img-wrap">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300}
                  quality={92}
                />
              </div>
              <div className="process-meta">
                <span className="process-step">{item.step}</span>
              </div>
              <h3 className="process-title">{item.title}</h3>
              <p className="process-copy">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <BenefitSection />

      <CustomerStoriesSection />

      <InTheirHomesSection />

      <ConsultSection />
    </main>
    <Footer />
  </div>;
}
