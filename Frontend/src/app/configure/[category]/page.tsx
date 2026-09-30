import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";
import { CATEGORY_CUSTOMIZER_CONFIGS } from "@/lib/customizer-configs";
import "@/app/drapery/configure/configure.css";

interface PageProps {
  params: Promise<{ category: string }>;
}

const ALLOWED_CUSTOM_CATEGORIES = Object.keys(CATEGORY_CUSTOMIZER_CONFIGS);

export function generateStaticParams() {
  return ALLOWED_CUSTOM_CATEGORIES.map((category) => ({
    category
  }));
}

export default async function CategoryConfigureStep1Page({ params }: PageProps) {
  const { category } = await params;
  if (!ALLOWED_CUSTOM_CATEGORIES.includes(category)) {
    notFound();
  }
  const config = CATEGORY_CUSTOMIZER_CONFIGS[category];

  if (!config) {
    notFound();
  }

  return (
    <div className="drape-flow">
      <Header />
      <main className="style-step">
        <header>
          <span>CUSTOM {config.name.toUpperCase()}</span>
          <h1>{config.customizerHeadline || `Choose Your ${config.name} Style`}</h1>
        </header>

        {config.styles.map((style) => (
          <article key={style.id}>
            <Image
              src={style.image}
              alt={style.name}
              width={690}
              height={480}
              priority
              style={{ objectFit: "cover" }}
            />
            <div>
              <h2>{style.name.toUpperCase()}</h2>
              <small>prices from ${style.price}&nbsp; ⓘ</small>
              <hr />
              <h3>{style.kicker}</h3>
              <p>{style.description}</p>
              <b>Key Features</b>
              <p>{style.features}</p>
              <Link href={`/configure/${category}/fabric?style=${style.slug}`}>
                START CUSTOMIZING
              </Link>
            </div>
          </article>
        ))}
      </main>

      <section className="craft-strip">
        <span>HERITAGE ATELIER &amp; CRAFTSMANSHIP</span>
        <h2>The Art of Custom {config.name}</h2>
        <p>
          {config.customizerSubhead ||
            "Handcrafted over precision systems, tailored with crisp architectural folds, seamless linings, and whisper-quiet control options."}
        </p>
        <div>
          {config.craftPillars.map((pillar) => (
            <article key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
