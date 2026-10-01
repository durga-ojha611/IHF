export type PanelConfiguration = "pair" | "single";

export type DraperyConfig = {
  fabric: string;
  color: string;
  pleat: string;
  panel: PanelConfiguration;
  width: number;
  length: number;
  lining: string;
  liningPrivacyChoice: "none" | "increase";
  border: string;
  trimType: string;
  trimPlacement: string;
  trimDesign: string;
  tasselDesign: string;
  tasselColor: string;
  tiebackType: string;
  tiebackStyle: string;
  tiebackDesign: string;
  tiebackColor: string;
  tiebackQty: number;
};

export const FABRICS = [
  { id: "velvet", name: "Velvet", description: "Luxurious weight & sheen", basePrice: 459.99, image: "/curtains/fabric-velvet.png", colors: ["navy", "charcoal", "emerald", "burgundy", "ivory"] },
  { id: "linen", name: "Linen", description: "Natural, breathable texture", basePrice: 329.99, image: "/curtains/fabric-linen.png", colors: ["ivory", "sage", "natural", "dusty-blue", "stone"] },
  { id: "silk", name: "Silk", description: "Lustrous, elegant drape", basePrice: 589.99, image: "/curtains/fabric-silk.png", colors: ["ivory", "champagne", "midnight", "burgundy", "dove-grey"] },
  { id: "sheer", name: "Sheer", description: "Light & airy filter", basePrice: 249.99, image: "/curtains/fabric-sheer.png", colors: ["white", "pale-gold", "blush", "dove-grey", "dusty-blue"] },
  { id: "blackout", name: "Blackout", description: "Full light block, structured", basePrice: 399.99, image: "/curtains/fabric-blackout.png", colors: ["black", "white", "grey", "emerald", "burgundy"] },
  { id: "jacquard", name: "Jacquard", description: "Woven pattern, opulent look", basePrice: 519.99, image: "/curtains/fabric-jacquard.png", colors: ["gold", "ivory", "navy", "burgundy", "taupe"] },
] as const;

export const COLORS: Record<string, { label: string; hex: string }> = {
  navy: { label: "Navy", hex: "#1e3a5f" }, charcoal: { label: "Charcoal", hex: "#3a3a45" }, emerald: { label: "Emerald", hex: "#2d6a4f" },
  burgundy: { label: "Burgundy", hex: "#7a1f2e" }, ivory: { label: "Ivory", hex: "#d8ceb6" }, sage: { label: "Sage", hex: "#82947d" },
  natural: { label: "Natural", hex: "#ae9678" }, "dusty-blue": { label: "Dusty Blue", hex: "#71889a" }, stone: { label: "Stone", hex: "#887d73" },
  champagne: { label: "Champagne", hex: "#c9b77c" }, midnight: { label: "Midnight", hex: "#1d223b" }, white: { label: "White", hex: "#f2f0e9" },
  "dove-grey": { label: "Dove Grey", hex: "#a6a5a1" }, "pale-gold": { label: "Pale Gold", hex: "#c8b162" }, blush: { label: "Blush", hex: "#d7a4a2" },
  black: { label: "Black", hex: "#232323" }, grey: { label: "Grey", hex: "#777" }, gold: { label: "Gold", hex: "#b8933f" }, taupe: { label: "Taupe", hex: "#95806d" },
};

export const PLEATS = [
  { id: "pinch", label: "Pinch Pleat", description: "Classic three-finger pleat" }, { id: "pencil", label: "Pencil Pleat", description: "Tight, tailored gathers" },
  { id: "box", label: "Box Pleat", description: "Structured and geometric" }, { id: "goblet", label: "Goblet Pleat", description: "Wide-mouthed formal fold" },
  { id: "eyelet", label: "Eyelet / Grommet", description: "Modern, clean movement" }, { id: "none", label: "No Pleat", description: "Rod pocket or flat panel" },
] as const;

export const LININGS = [
  { id: "none", label: "Unlined", basePrice: 0, description: "Natural fabric movement" },
  { id: "privacy", label: "Privacy Lining", basePrice: 45, description: "Soft cotton light filter" },
  { id: "blackout", label: "Blackout Lining", basePrice: 85, description: "Full light control" },
  { id: "interlining", label: "Privacy Lining + Interlining", basePrice: 130, description: "Extra body and insulation" },
] as const;

export const BORDERS = [
  { id: "none", label: "None", basePrice: 0 }, { id: "leading-edge-one", label: '3" Leading Edge · One Side', basePrice: 50 },
  { id: "leading-edge-both", label: '3" Leading Edge · Both Sides', basePrice: 80 }, { id: "leading-bottom", label: '3" Leading Edge + Bottom', basePrice: 110 },
  { id: "bottom-only", label: "Bottom Border Only", basePrice: 40 }, { id: "top-only", label: "Top Border Only", basePrice: 40 },
  { id: "top-bottom", label: "Top & Bottom Border", basePrice: 70 },
] as const;

export const TRIMS = [
  { id: "floral", label: "Floral Embroidery", basePrice: 90 }, { id: "geometric", label: "Geometric Tape Trim", basePrice: 80 },
  { id: "classic", label: "Classic Greek Key", basePrice: 70 }, { id: "cotton-tassel", label: "Cotton Tassel Trim", basePrice: 60 },
  { id: "beaded-fringe", label: "Beaded Fringe Trim", basePrice: 75 }, { id: "metallic-fringe", label: "Metallic Fringe Trim", basePrice: 90 },
] as const;

export const TASSELS = [
  { id: "design-1", label: "Premium Cord Tassel", price: 40 }, { id: "design-2", label: "Crystal Bead Tassel", price: 55 },
  { id: "design-3", label: "Royal Velvet Tassel", price: 70 }, { id: "design-4", label: "Metallic Thread Tassel", price: 85 },
  { id: "design-5", label: "Luxury Silk Tassel", price: 100 },
] as const;

export function lengthIncrement(length: number) {
  const rounded = Math.round(length);
  if (rounded < 10) return 0;
  if (rounded <= 54) return Math.floor((rounded - 10) / 9) * 20;
  if (rounded <= 72) return 80 + Math.floor((rounded - 55) / 9) * 40 + 40;
  return 160 + Math.ceil((rounded - 72) / 6) * 40;
}

export function widthMultiplier(width: number, pleated: boolean) {
  if (pleated) return width <= 20 ? 1 : 1 + Math.ceil((width - 20) / 10) * 0.5;
  return width <= 50 ? 1 : 1 + Math.ceil((width - 50) / 25) * 0.5;
}

export function calculateDraperyPrice(config: DraperyConfig) {
  const fabric = FABRICS.find((item) => item.id === config.fabric);
  const pleated = config.pleat !== "none";
  const maxWidth = pleated ? 400 : 1000;
  if (!fabric || config.width < 12 || config.width > maxWidth || config.length < 10 || config.length > 400) return null;
  const increment = lengthIncrement(config.length);
  const rawMultiplier = widthMultiplier(config.width, pleated);
  const multiplier = config.panel === "single" ? (rawMultiplier === 1 ? 0.5 : Math.ceil(rawMultiplier)) : rawMultiplier;
  const curtain = (base: number) => (base + increment) * multiplier;
  const lengthwise = (base: number, sides: number) => (base + increment) * (config.panel === "single" ? sides * 0.5 : sides);
  const base = curtain(fabric.basePrice);
  const liningOption = LININGS.find((item) => item.id === config.lining);
  const lining = config.fabric === "sheer" || !liningOption || config.lining === "none" || (config.lining === "privacy" && config.liningPrivacyChoice !== "increase") ? 0 : curtain(liningOption.basePrice);
  const borderOption = BORDERS.find((item) => item.id === config.border);
  let border = 0;
  if (borderOption && config.border !== "none") border = config.border === "leading-edge-one" ? lengthwise(borderOption.basePrice, 1) : config.border === "leading-edge-both" ? lengthwise(borderOption.basePrice, 2) : curtain(borderOption.basePrice);
  let trim = 0;
  if (!border && config.trimType !== "none") {
    if (config.trimType === "tassel-tieback") trim = TASSELS.find((item) => item.id === config.tasselDesign)?.price || 0;
    else {
      const option = TRIMS.find((item) => item.id === config.trimDesign);
      if (option) trim = config.trimPlacement === "leading-one" ? lengthwise(option.basePrice, 1) : config.trimPlacement === "leading-both" ? lengthwise(option.basePrice, 2) : curtain(option.basePrice);
    }
  }
  let eachTieback = 0;
  if (config.tiebackType === "fabric") eachTieback = 30;
  if (config.tiebackType === "fabric-trim") eachTieback = config.tiebackStyle === "style-2" ? 55 : 45;
  if (config.tiebackType === "fabric-fringe") eachTieback = config.tiebackStyle === "style-2" ? 60 : 50;
  if (config.tiebackType === "tassel") eachTieback = TASSELS.find((item) => item.id === config.tiebackDesign)?.price || 0;
  const tiebacks = eachTieback * Math.max(1, config.tiebackQty);
  return { base, lining, border, trim, tiebacks, multiplier, panels: config.panel === "pair" ? 2 : 1, total: base + lining + border + trim + tiebacks };
}
