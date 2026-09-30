export type CatalogCard = { _id?: string; slug: string; name: string; image: string; description: string; price: number };
export type CatalogCategory = {
  slug: string; name: string; eyebrow: string; headline: string; description: string; heroImage: string;
  subcategories: CatalogCard[]; fabrics: CatalogCard[]; products: CatalogCard[]; guideTitle: string; guideCopy: string;
};
export type ProductRecord = {
  _id: string; title: string; slug: string; sku: string; shortDescription: string; description: string;
  category: { _id?: string; name: string; slug: string } | string; subCategory?: { _id?: string; name: string; slug: string } | string;
  basePrice: number; compareAtPrice?: number; currency?: string; fabricType: string;
  colors: { name: string; hexCode: string; image?: string; inStock?: boolean }[];
  styles: string[]; features: string[]; standardSizes: string[]; images: { url: string; alt: string; isPrimary?: boolean }[];
  materialComposition?: string; weaveConstruction?: string; finishingProcess?: string; origin?: string; weight?: string;
  careInstructions?: string[]; benefits?: { title: string; description: string; icon?: string }[];
  dimensions?: { size: string; metric: string; imperial: string }[]; faqs?: { question: string; answer: string }[];
  bundleItems?: { name: string; image: string; price: number; variant: string; selected?: boolean }[];
  reviews?: { title: string; body: string; author: string; rating: number; date: string }[];
  ratingAverage?: number; ratingCount?: number; editorial?: { eyebrow?: string; title?: string; description?: string; image?: string };
  stockStatus: string; inventoryCount: number; isCustomizable: boolean; isFeatured: boolean; isActive: boolean;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

async function apiData<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    const body = await response.json();
    return body?.data || null;
  } catch { return null; }
}

export async function getCatalogCategory(slug: string): Promise<CatalogCategory | null> {
  const data = await apiData<{ category: CatalogCategory }>(`/categories/${slug}/storefront`);
  return data?.category || null;
}

export async function getCatalogProducts(category: string, subcategory?: string): Promise<ProductRecord[]> {
  const query = new URLSearchParams({ category, limit: "60" });
  if (subcategory) query.set("subcategory", subcategory);
  const data = await apiData<{ products: ProductRecord[] }>(`/products?${query}`);
  return data?.products || [];
}

export async function getProductRecord(slug: string): Promise<ProductRecord | null> {
  const data = await apiData<{ product: ProductRecord }>(`/products/${slug}`);
  return data?.product || null;
}

export async function getRelatedProducts(id: string): Promise<ProductRecord[]> {
  const data = await apiData<{ related: ProductRecord[] }>(`/products/${id}/related`);
  return data?.related || [];
}
