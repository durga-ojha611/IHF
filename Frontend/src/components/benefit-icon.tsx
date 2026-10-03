type BenefitIconProps = { title: string };

const common = {
  width: 31,
  height: 31,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.35,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true
};

export function BenefitIcon({ title }: BenefitIconProps) {
  const value = title.toLowerCase();

  if (value.includes("order") || value.includes("fit")) {
    return <svg {...common}><path d="M4 7h16M7 4v6M17 4v6"/><rect x="4" y="7" width="16" height="13" rx="1.5"/><path d="m9 14 2 2 4-5"/></svg>;
  }

  if (value.includes("quality") || value.includes("finish")) {
    return <svg {...common}><path d="M4 4l16 16M14.5 4.5 19.5 9.5M14 10l6-6"/><circle cx="7" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>;
  }

  if (value.includes("support") || value.includes("service")) {
    return <svg {...common}><path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 13a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2v2ZM20 13a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2v2Z"/><path d="M17 15v1a3 3 0 0 1-3 3h-2"/></svg>;
  }

  if (value.includes("breath") || value.includes("temperature")) {
    return <svg {...common}><path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/></svg>;
  }

  if (value.includes("soft")) {
    return <svg {...common}><path d="M3 7c3-2 5-2 8 0s5 2 10 0M3 12c3-2 5-2 8 0s5 2 10 0M3 17c3-2 5-2 8 0s5 2 10 0"/></svg>;
  }

  return <svg {...common}><path d="m12 3 8 6-8 6-8-6 8-6Z"/><path d="m4 14 8 6 8-6"/></svg>;
}
