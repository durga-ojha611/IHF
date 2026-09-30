import { notFound } from "next/navigation";
import { CATEGORY_CUSTOMIZER_CONFIGS } from "@/lib/customizer-configs";
import CategoryFabricCustomizerClient from "./fabric-customizer-client";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ style?: string; fabric?: string }>;
}

const ALLOWED_CUSTOM_CATEGORIES = Object.keys(CATEGORY_CUSTOMIZER_CONFIGS);

export function generateStaticParams() {
  return ALLOWED_CUSTOM_CATEGORIES.map((category) => ({
    category
  }));
}

export default async function CategoryFabricPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  if (!ALLOWED_CUSTOM_CATEGORIES.includes(category)) {
    notFound();
  }
  const { style, fabric } = await searchParams;

  const config = CATEGORY_CUSTOMIZER_CONFIGS[category];
  if (!config) {
    notFound();
  }

  return (
    <CategoryFabricCustomizerClient
      config={config}
      initialStyleSlug={style}
      initialFabricSlug={fabric}
      category={category}
    />
  );
}
