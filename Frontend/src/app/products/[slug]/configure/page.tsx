import { notFound } from "next/navigation";
import { CATEGORY_CUSTOMIZER_CONFIGS } from "@/lib/customizer-configs";
import CategoryCustomizerClient from "@/app/configure/[category]/category-customizer-client";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ style?: string; fabric?: string }>;
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_CUSTOMIZER_CONFIGS).map((slug) => ({
    slug
  }));
}

export default async function ProductConfigurePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { style, fabric } = await searchParams;

  const config = CATEGORY_CUSTOMIZER_CONFIGS[slug];
  if (!config) {
    notFound();
  }

  return (
    <CategoryCustomizerClient
      config={config}
      initialStyleSlug={style}
      initialFabricSlug={fabric}
    />
  );
}
