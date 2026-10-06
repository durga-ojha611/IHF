import { notFound } from "next/navigation";
import { CustomizerScreen, type CustomizerStep } from "../customizer-screen";

const routeSteps: CustomizerStep[] = ["pleat", "fabric", "panels", "measurements", "lining", "decor", "tiebacks", "room", "review"];

export function generateStaticParams() {
  return routeSteps.map((step) => ({ step }));
}

export default async function CustomizerStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  if (!routeSteps.includes(step as CustomizerStep)) notFound();
  return <CustomizerScreen step={step as CustomizerStep} />;
}
