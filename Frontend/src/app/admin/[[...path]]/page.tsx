import { AdminApp } from "../admin-app";

const routes = [
  "commerce/orders", "commerce/products", "commerce/categories", "commerce/filters", "commerce/collections", "commerce/inventory", "commerce/promotions",
  "made-to-measure/builder", "made-to-measure/fabrics", "made-to-measure/pricing", "made-to-measure/dimensions", "made-to-measure/swatch-orders", "made-to-measure/consultations", "made-to-measure/production",
  "customers/all", "customers/reviews", "customers/support", "content/homepage", "content/pages", "content/navigation", "content/journal", "content/media",
  "operations/shipping", "operations/returns", "operations/taxes", "operations/suppliers", "operations/archives", "insights/sales", "insights/demand", "insights/activity",
  "settings/admins", "settings/roles", "settings/payments", "settings/notifications", "settings/store"
];

export function generateStaticParams() {
  return [{ path: undefined }, ...routes.map((route) => ({ path: route.split("/") }))];
}

export default async function AdminPage({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  return <AdminApp route={(path || []).join("/")} />;
}
