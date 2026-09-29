import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import "./home.css";
import "./home-tuning.css";
import "./hero-tuning.css";
import "./figma-hero.css";

const finish = [
  ["/figma/home-04.jpeg", "A touch of grandeur", "Tassel Trims"],
  ["/figma/home-12.jpeg", "A tailored accent", "Border Trims"],
  ["/figma/home-07.jpeg", "A beautiful edge", "Decorative Tapes"],
  ["/figma/home-13.png", "Made by hand", "Custom Details"],
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

function ArrowLink({children, href="#"}:{children:React.ReactNode;href?:string}) {
  return <Link className="home-link" href={href}>{children}<span>↗</span></Link>;
}

export default function Home() {
  return <div className="home-v2">
    <Header />
    <main>
      <section className="home-hero">
        <Image src="/figma/home-hero-hd.png" alt="Custom made bedroom drapery" fill priority quality={92} sizes="100vw" />
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
        <div className="four-grid home-shell">{finish.map(([src,title,name])=><article key={name}><Image src={src} alt={name} width={400} height={520}/><span className="home-kicker">FINISHING TOUCHES</span><h3>{title}</h3><p>{name} with a refined, made-to-measure finish.</p><ArrowLink>EXPLORE</ArrowLink></article>)}</div>
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
        <div className="sample-card"><Image src="/figma/home-02.png" alt="Fabric samples" width={230} height={150}/><b>25</b><span>YEARS OF DESIGN EXPERTISE</span></div>
      </section>

      <section className="shop-category home-shell"><span className="home-kicker">EVERY DETAIL, BEAUTIFULLY CONSIDERED</span><h2>Shop By Category</h2><p>Discover the pieces that make a room feel complete.</p>
        <div className="category-mosaic">
          <Link className="mosaic-tall" href="/products/table-linen"><Image src="/figma/home-03.jpeg" alt="Natural linen table textile" fill quality={90} sizes="45vw"/><span>Table Linen <b>↗</b></span></Link>
          <Link href="/products/bedding"><Image src="/figma/home-11.png" alt="Bedding" fill sizes="25vw"/><span>Bedding <b>↗</b></span></Link>
          <Link href="/products/pillows"><Image src="/figma/home-14.png" alt="Cushions" fill sizes="25vw"/><span>Cushions <b>↗</b></span></Link>
          <Link href="/products/decor"><Image src="/figma/home-18.jpeg" alt="Decor" fill sizes="25vw"/><span>Decor <b>↗</b></span></Link>
          <Link href="/roman-shades"><Image src="/figma/home-16.png" alt="Blinds and shades" fill sizes="25vw"/><span>Blinds &amp; Shades <b>↗</b></span></Link>
        </div>
      </section>

      <section className="right-details home-shell"><div><span className="home-kicker">DETAILS THAT TRANSFORM A ROOM</span><h2>Every beautiful drape begins with the right details.</h2><p>Explore the materials, trims and finishes that bring your vision together.</p></div><div className="three-grid">{[["/figma/home-18.jpeg","FABRICS"],["/figma/home-02.png","SWATCHES"],["/figma/home-07.jpeg","TRIMS & FINISHES"]].map(([src,label])=><article key={label}><Image src={src} alt={label} width={520} height={420}/><span className="home-kicker">{label}</span><h3>Chosen for the way you live.</h3><ArrowLink>DISCOVER</ArrowLink></article>)}</div></section>

      <section className="fabric-split"><Image src="/figma/home-03.jpeg" alt="Natural linen fabric finish" width={1130} height={754} quality={90}/><div><span className="home-kicker">CURATED MATERIALS</span><h2>Fabrics &amp; Finishes.<br/>Chosen for You.</h2><p>Explore a thoughtful collection of natural textures, elegant weaves and enduring colours—selected to work beautifully throughout your home.</p><ArrowLink href="/swatches">ORDER COMPLIMENTARY SWATCHES</ArrowLink></div></section>

      <section className="intention home-shell"><div className="home-heading"><span className="home-kicker">FROM OUR HANDS TO YOUR HOME</span><h2>Made With Intention. Delivered Beautifully.</h2></div><div className="five-grid">{[["/figma/home-13.png","Made For You"],["/figma/home-02.png","Material First"],["/figma/home-04.jpeg","Finished By Hand"],["/figma/home-08.png","Delivered With Care"],["/figma/home-18.jpeg","Beautifully At Home"]].map(([src,title],i)=><article key={title}><Image src={src} alt={title} width={300} height={330}/><span>0{i+1}</span><h3>{title}</h3><p>Every detail considered, from first idea to final placement.</p></article>)}</div></section>

      <section className="love"><div className="home-heading"><span className="home-kicker">THE DIFFERENCE IS IN THE DETAILS</span><h2>Why Homeowners Love<br/><em>Us</em></h2></div><div className="benefit-grid home-shell">{[["✦","Made to Measure"],["●","Free Shipping"],["◇","Premium Fabrics"],["♙","Expert Craftsmanship"],["↗","Thoughtful Design"],["○","Easy Experience"]].map(([icon,title])=><article key={title}><i>{icon}</i><h3>{title}</h3><p>Considered service, exceptional quality and support from people who truly care.</p></article>)}</div></section>

      <section className="real-homes"><div className="home-shell"><div className="real-brand"><b>IHF</b><span>INSTAGRAM</span><ArrowLink>FOLLOW US</ArrowLink></div><div className="real-head"><span className="home-kicker">FROM OUR COMMUNITY</span><h2>Real Homes, Real Words.</h2></div><div className="three-grid">{["/figma/home-15.jpeg","/figma/home-10.jpeg","/figma/home-17.jpeg"].map((src,i)=><article key={src}><Image src={src} alt="A real India Home Furnishings interior" width={520} height={430}/><p>“Beautiful quality and the whole process felt effortless.”</p><small>HOMEOWNER STORY 0{i+1}</small></article>)}</div></div></section>

      <section className="instagram"><div><span className="home-kicker">IN THEIR HOMES</span><h2>In Their Homes</h2><p>Follow along for beautiful rooms, thoughtful details and everyday inspiration.</p><ArrowLink>FOLLOW @INDIAHOMEFURNISHINGS</ArrowLink></div><div className="insta-grid">{["/figma/home-15.jpeg","/figma/home-10.jpeg","/figma/home-01.jpeg"].map(src=><Image key={src} src={src} alt="Customer home" width={420} height={440}/>)}</div></section>

      <section className="consult"><div><span className="home-kicker">PERSONAL DESIGN GUIDANCE</span><h2>Consult with Our<br/><em>Designers.</em></h2><p>Not sure where to begin? Our design team will help you choose the right styles, fabrics and finishes for your space.</p><div><ArrowLink>BOOK A COMPLIMENTARY CALL</ArrowLink><ArrowLink>CHAT WITH A DESIGNER</ArrowLink></div></div><Image src="/figma/home-02.png" alt="Design consultation fabric samples" fill sizes="100vw"/></section>
    </main>
    <Footer />
  </div>;
}
