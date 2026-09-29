"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
import { customizerApi } from "@/lib/api";
import "./fabric.css";

export interface FabricItem {
  _id?: string;
  name: string;
  slug?: string;
  collectionType: string;
  materialGroup: string;
  materialDescription?: string;
  priceGroup: "A" | "B" | "C" | "D";
  fromPrice: number;
  color: {
    name: string;
    hexCode?: string;
  };
  image: string;
  closeupImage?: string;
  specs?: {
    composition?: string;
    weight?: string;
    durability?: string;
    lightFiltering?: string;
    care?: string;
  };
  isPopular?: boolean;
}

export interface MaterialSection {
  groupName: string;
  priceGroup: string;
  fromPrice: number;
  description: string;
  fabrics: FabricItem[];
}

const DEFAULT_COLLECTIONS = [
  "LINENS",
  "SHEERS",
  "WOOLS + BLENDS",
  "COTTONS",
  "SILKS",
  "SOLIDS",
  "PATTERNS",
  "KIDS",
  "DESIGNERS",
  "SUNBRELLA",
  "MOST POPULAR"
];

const INITIAL_FABRICS: FabricItem[] = [
  {
    _id: "fab-1",
    name: "White Linen",
    collectionType: "LINENS",
    materialGroup: "LINENS & NATURAL WEAVES",
    materialDescription:
      "Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.",
    priceGroup: "A",
    fromPrice: 650,
    color: { name: "White", hexCode: "#F5F5F0" },
    image: "/figma/home-02.png",
    closeupImage: "/figma/home-02.png",
    isPopular: true,
    specs: {
      composition: "100% Belgian Flax Linen",
      weight: "320 GSM (Heavyweight Architectural Drape)",
      durability: "30,000 Martindale Rubs (Commercial Grade)",
      lightFiltering: "Semi-Sheer to Light Filtering (Soft Glow)",
      care: "Professional dry clean or steam in situ."
    }
  },
  {
    _id: "fab-2",
    name: "Clay Linen",
    collectionType: "LINENS",
    materialGroup: "LINENS & NATURAL WEAVES",
    materialDescription:
      "Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.",
    priceGroup: "A",
    fromPrice: 650,
    color: { name: "Clay", hexCode: "#D2B48C" },
    image: "/figma/home-18.jpeg",
    closeupImage: "/figma/home-18.jpeg",
    isPopular: true,
    specs: {
      composition: "100% Belgian Flax Linen",
      weight: "320 GSM (Heavyweight Architectural Drape)",
      durability: "30,000 Martindale Rubs (Commercial Grade)",
      lightFiltering: "Light Filtering to Privacy (Warm Amber)",
      care: "Professional dry clean or steam in situ."
    }
  },
  {
    _id: "fab-3",
    name: "Slate Wool",
    collectionType: "WOOLS + BLENDS",
    materialGroup: "WOOL & BLENDS",
    materialDescription:
      "Finely spun virgin wool blend creating substantial drape with acoustic sound-dampening qualities and thermal insulation.",
    priceGroup: "B",
    fromPrice: 720,
    color: { name: "Slate", hexCode: "#708090" },
    image: "/figma/home-07.jpeg",
    closeupImage: "/figma/home-07.jpeg",
    isPopular: false,
    specs: {
      composition: "70% Wool, 30% Fine Cashmere Blend",
      weight: "440 GSM (Substantial Acoustic Weave)",
      durability: "45,000 Martindale Rubs (High Residential)",
      lightFiltering: "Dimout to Room Darkening",
      care: "Strictly professional dry clean only."
    }
  },
  {
    _id: "fab-4",
    name: "Oatmeal Linen",
    collectionType: "LINENS",
    materialGroup: "LINENS & NATURAL WEAVES",
    materialDescription:
      "A classic Belgian linen in a warm oatmeal hue, woven with a rich slub texture and soft fluid drape. Breathable, durable, and naturally elegant — designed for timeless interiors with effortless light filtering.",
    priceGroup: "A",
    fromPrice: 650,
    color: { name: "Oatmeal", hexCode: "#E6D7B9" },
    image: "/figma/home-03.jpeg",
    closeupImage: "/figma/home-03.jpeg",
    isPopular: true,
    specs: {
      composition: "100% Belgian Flax Linen",
      weight: "320 GSM (Heavyweight Architectural Drape)",
      durability: "30,000 Martindale Rubs (Commercial Grade)",
      lightFiltering: "Semi-Sheer to Light Filtering (Soft Glow)",
      care: "Professional dry clean or steam in situ."
    }
  },
  {
    _id: "fab-5",
    name: "Sand Wool Blend",
    collectionType: "WOOLS + BLENDS",
    materialGroup: "WOOL & BLENDS",
    materialDescription:
      "Finely spun virgin wool blend creating substantial drape with acoustic sound-dampening qualities and thermal insulation.",
    priceGroup: "B",
    fromPrice: 720,
    color: { name: "Sand", hexCode: "#C2B280" },
    image: "/figma/home-04.jpeg",
    closeupImage: "/figma/home-04.jpeg",
    isPopular: true,
    specs: {
      composition: "75% Merino Wool, 25% Organic Cotton",
      weight: "410 GSM (Thermal Insulation Drape)",
      durability: "40,000 Martindale Rubs",
      lightFiltering: "Room Darkening with Soft Warm Tone",
      care: "Professional dry clean."
    }
  },
  {
    _id: "fab-6",
    name: "Sky Cotton",
    collectionType: "COTTONS",
    materialGroup: "COTTON & BLENDS",
    materialDescription:
      "Crisp, matte organic cotton sateen with fluid hand and smooth contemporary finish for modern homes.",
    priceGroup: "A",
    fromPrice: 650,
    color: { name: "Sky", hexCode: "#87CEEB" },
    image: "/figma/home-17.jpeg",
    closeupImage: "/figma/home-17.jpeg",
    isPopular: false,
    specs: {
      composition: "100% Long-Staple Pima Cotton",
      weight: "290 GSM (Tailored Crisp Fold)",
      durability: "35,000 Martindale Rubs",
      lightFiltering: "Light Filtering to Privacy",
      care: "Dry clean or gentle spot wash."
    }
  },
  {
    _id: "fab-7",
    name: "Terracotta Cotton",
    collectionType: "COTTONS",
    materialGroup: "COTTON & BLENDS",
    materialDescription:
      "Crisp, matte organic cotton sateen with fluid hand and smooth contemporary finish for modern homes.",
    priceGroup: "A",
    fromPrice: 650,
    color: { name: "Terracotta", hexCode: "#E2725B" },
    image: "/figma/home-12.jpeg",
    closeupImage: "/figma/home-12.jpeg",
    isPopular: true,
    specs: {
      composition: "100% Organic Washed Cotton Canvas",
      weight: "310 GSM (Substantial Casual Hang)",
      durability: "38,000 Martindale Rubs",
      lightFiltering: "Medium Privacy Diffusion",
      care: "Machine wash delicate or dry clean."
    }
  },
  {
    _id: "fab-8",
    name: "Sage Linen",
    collectionType: "LINENS",
    materialGroup: "LINENS & NATURAL WEAVES",
    materialDescription:
      "Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.",
    priceGroup: "A",
    fromPrice: 650,
    color: { name: "Sage", hexCode: "#9DC183" },
    image: "/figma/home-15.jpeg",
    closeupImage: "/figma/home-15.jpeg",
    isPopular: true,
    specs: {
      composition: "100% French Natural Flax",
      weight: "330 GSM (Fluid Architectonic Fall)",
      durability: "32,000 Martindale Rubs",
      lightFiltering: "Semi-Sheer to Light Filtering",
      care: "Professional dry clean or steam in situ."
    }
  },
  {
    _id: "fab-9",
    name: "Forest Velvet",
    collectionType: "SOLIDS",
    materialGroup: "LUXURY VELVET",
    materialDescription:
      "Ultra-luxurious dense cotton-silk velvet pile offering extraordinary light extinction, thermal noise cancellation, and rich opulence.",
    priceGroup: "C",
    fromPrice: 850,
    color: { name: "Forest", hexCode: "#228B22" },
    image: "/figma/home-13.png",
    closeupImage: "/figma/home-13.png",
    isPopular: true,
    specs: {
      composition: "80% Cotton Velvet, 20% Natural Silk",
      weight: "540 GSM (Master Estate Velvet)",
      durability: "50,000 Martindale Rubs (Contract Grade)",
      lightFiltering: "Full Eclipse Blackout Compatible",
      care: "Specialist velvet dry clean only."
    }
  },
  {
    _id: "fab-10",
    name: "Charcoal Velvet",
    collectionType: "SOLIDS",
    materialGroup: "LUXURY VELVET",
    materialDescription:
      "Ultra-luxurious dense cotton-silk velvet pile offering extraordinary light extinction, thermal noise cancellation, and rich opulence.",
    priceGroup: "C",
    fromPrice: 850,
    color: { name: "Charcoal", hexCode: "#36454F" },
    image: "/figma/home-06.jpeg",
    closeupImage: "/figma/home-06.jpeg",
    isPopular: true,
    specs: {
      composition: "80% Cotton Velvet, 20% Natural Silk",
      weight: "540 GSM (Master Estate Velvet)",
      durability: "50,000 Martindale Rubs (Contract Grade)",
      lightFiltering: "Full Eclipse Blackout Compatible",
      care: "Specialist velvet dry clean only."
    }
  },
  {
    _id: "fab-11",
    name: "Airy Voile Sheer",
    collectionType: "SHEERS",
    materialGroup: "ARCHITECTURAL SHEERS",
    materialDescription:
      "Ethereal sheer open weave that gracefully floods spaces with natural light while softening glare and preserving panoramic views.",
    priceGroup: "A",
    fromPrice: 550,
    color: { name: "White", hexCode: "#FFFFF0" },
    image: "/figma/home-11.png",
    closeupImage: "/figma/home-11.png",
    isPopular: true,
    specs: {
      composition: "100% Fine Spun Linen Voile",
      weight: "160 GSM (Float Drape)",
      durability: "25,000 Martindale Rubs",
      lightFiltering: "Maximum Daylight Transmittance",
      care: "Gentle hand steam or dry clean."
    }
  },
  {
    _id: "fab-12",
    name: "Oyster Dupioni Silk",
    collectionType: "SILKS",
    materialGroup: "NATURAL RAW SILKS",
    materialDescription:
      "Hand-reeled mulberry silk with characteristic irregular slub texture that shimmers with multi-dimensional luster under sunlight.",
    priceGroup: "C",
    fromPrice: 890,
    color: { name: "Sand", hexCode: "#EAE6DF" },
    image: "/figma/home-05.png",
    closeupImage: "/figma/home-05.png",
    isPopular: true,
    specs: {
      composition: "100% Pure Hand-Spun Mulberry Silk",
      weight: "260 GSM (Lustrous Crisp Hang)",
      durability: "30,000 Martindale Rubs",
      lightFiltering: "Requires Interlining for Sun Protection",
      care: "Dry clean only."
    }
  },
  {
    _id: "fab-13",
    name: "Botanical Toile Linen",
    collectionType: "PATTERNS",
    materialGroup: "ARTISAN PATTERNS",
    materialDescription:
      "Hand-screened floral and architectural toile on rustic linen ground, tailored for statement library and salon treatments.",
    priceGroup: "B",
    fromPrice: 750,
    color: { name: "Clay", hexCode: "#D2B48C" },
    image: "/figma/home-18.jpeg",
    closeupImage: "/figma/home-18.jpeg",
    isPopular: false,
    specs: {
      composition: "100% Pure French Linen",
      weight: "340 GSM",
      durability: "35,000 Martindale Rubs",
      lightFiltering: "Privacy & Light Diffusion",
      care: "Dry clean only."
    }
  },
  {
    _id: "fab-14",
    name: "Pastel Cloud Cotton",
    collectionType: "KIDS",
    materialGroup: "COTTON & BLENDS",
    materialDescription:
      "OEKO-TEX certified chemical-free nursery and children drapery cotton with hypo-allergenic finish.",
    priceGroup: "A",
    fromPrice: 580,
    color: { name: "White", hexCode: "#F5F5F0" },
    image: "/figma/home-02.png",
    closeupImage: "/figma/home-02.png",
    isPopular: false,
    specs: {
      composition: "100% Organic Combed Cotton",
      weight: "280 GSM",
      durability: "40,000 Martindale Rubs",
      lightFiltering: "Pairs perfectly with 100% Blackout Lining",
      care: "Machine washable on cold gentle cycle."
    }
  },
  {
    _id: "fab-15",
    name: "Heritage Bouclé Drape",
    collectionType: "DESIGNERS",
    materialGroup: "DESIGNER COUTURE",
    materialDescription:
      "Architectural heavy looped yarn bouclé bringing high-fashion runway tactile depth to modern interior windows.",
    priceGroup: "C",
    fromPrice: 920,
    color: { name: "Sand", hexCode: "#C2B280" },
    image: "/figma/home-04.jpeg",
    closeupImage: "/figma/home-04.jpeg",
    isPopular: true,
    specs: {
      composition: "65% Alpaca Wool, 35% Textured Cotton Bouclé",
      weight: "560 GSM (Heavyweight Couture Weight)",
      durability: "45,000 Martindale Rubs",
      lightFiltering: "Heavy Light Dimout",
      care: "Professional dry clean only."
    }
  },
  {
    _id: "fab-16",
    name: "Sunbrella Sailcloth Salt",
    collectionType: "SUNBRELLA",
    materialGroup: "PERFORMANCE SUNBRELLA",
    materialDescription:
      "Bleach-cleanable, fade-proof solution-dyed acrylic fabric built for sunrooms, coastal estates, and high-UV exposure.",
    priceGroup: "B",
    fromPrice: 710,
    color: { name: "Oatmeal", hexCode: "#E6D7B9" },
    image: "/figma/home-03.jpeg",
    closeupImage: "/figma/home-03.jpeg",
    isPopular: true,
    specs: {
      composition: "100% Solution-Dyed Acrylic",
      weight: "380 GSM",
      durability: "50,000 Double Rubs (Heavy Duty)",
      lightFiltering: "UV 98% Blockage / Light Filtering",
      care: "Bleach cleanable & water repellent."
    }
  }
];

// Authentic Zoom-In SVG Icon with crosshair '+' inside the magnifying lens
function ZoomIcon({ size = 14, strokeWidth = 1.8 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1c1c1a"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

// Premium Rotating Vector Chevron Arrow
function DropdownChevron({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <span className={`dropdown-chevron-wrapper ${isOpen ? "open" : ""}`} aria-hidden="true">
      <svg
        className="dropdown-chevron-svg"
        width="8"
        height="5"
        viewBox="0 0 9 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 1.5L4.5 5L8 1.5" />
      </svg>
    </span>
  );
}

// Premium Vector Dual Sort Icon
function SortIcon({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <span className={`sort-icon-wrapper ${isOpen ? "open" : ""}`} aria-hidden="true">
      <svg
        width="10"
        height="11"
        viewBox="0 0 10 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 4L5 1.75L7 4" />
        <path d="M3 7L5 9.25L7 7" />
      </svg>
    </span>
  );
}

// Premium Checkmark Badge for Selected Filters
function CheckBadge() {
  return (
    <span className="check-badge" aria-hidden="true">
      <svg
        width="9"
        height="7"
        viewBox="0 0 9 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="1.5 3.5 3.5 5.5 7.5 1.5" />
      </svg>
    </span>
  );
}

export default function FabricStep() {
  const [collections, setCollections] = useState<string[]>(DEFAULT_COLLECTIONS);
  const [selectedCollection, setSelectedCollection] = useState<string>("LINENS");

  // Filter Dropdown States
  const [selectedColor, setSelectedColor] = useState<string>("ALL");
  const [selectedPriceGroup, setSelectedPriceGroup] = useState<string>("ALL");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("ALL");
  const [selectedSort, setSelectedSort] = useState<string>("popular");

  // Active Dropdown popover
  const [openDropdown, setOpenDropdown] = useState<
    "collection" | "color" | "price" | "material" | "sort" | null
  >(null);

  // Fabrics & Selected Fabric
  const [allFabrics, setAllFabrics] = useState<FabricItem[]>(INITIAL_FABRICS);
  const [selectedFabric, setSelectedFabric] = useState<FabricItem>(
    INITIAL_FABRICS.find((f) => f.name === "Oatmeal Linen") || INITIAL_FABRICS[3]
  );
  const [previewFabric, setPreviewFabric] = useState<FabricItem>(
    INITIAL_FABRICS.find((f) => f.name === "Oatmeal Linen") || INITIAL_FABRICS[3]
  );
  const [modal, setModal] = useState<boolean>(false);
  const [swatchCount, setSwatchCount] = useState<number>(1);
  const [swatchNotification, setSwatchNotification] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Filters and Fabrics from Backend API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [filtersRes, fabricsRes] = await Promise.all([
          customizerApi.getFilters().catch(() => null),
          customizerApi.getFabrics().catch(() => null)
        ]);

        if (filtersRes?.data?.collections?.length) {
          setCollections(filtersRes.data.collections);
        }

        if (fabricsRes?.data?.fabrics?.length) {
          setAllFabrics(fabricsRes.data.fabrics);
          const oatmeal = fabricsRes.data.fabrics.find(
            (f: FabricItem) => f.name === "Oatmeal Linen"
          );
          if (oatmeal) {
            setSelectedFabric(oatmeal);
            setPreviewFabric(oatmeal);
          }
        }
      } catch (err) {
        console.warn("[Customizer] Using local fallback fabrics", err);
      }
    }
    loadData();
  }, []);

  // Filter fabrics based on active filters
  const filteredFabrics = allFabrics.filter((fabric) => {
    if (selectedCollection !== "ALL") {
      if (selectedCollection === "MOST POPULAR") {
        if (!fabric.isPopular) return false;
      } else if (fabric.collectionType !== selectedCollection) {
        return false;
      }
    }

    if (selectedColor !== "ALL") {
      const match =
        fabric.color?.name?.toLowerCase() === selectedColor.toLowerCase() ||
        fabric.name.toLowerCase().includes(selectedColor.toLowerCase());
      if (!match) return false;
    }

    if (selectedPriceGroup !== "ALL") {
      const groupLetter = selectedPriceGroup.replace(/price\s*group\s*/i, "").trim();
      if (fabric.priceGroup !== groupLetter) return false;
    }

    if (selectedMaterial !== "ALL") {
      if (
        !fabric.materialGroup
          .toLowerCase()
          .includes(selectedMaterial.toLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });

  // Sort filtered fabrics
  const sortedFabrics = [...filteredFabrics].sort((a, b) => {
    if (selectedSort === "price-asc") {
      return a.fromPrice - b.fromPrice;
    } else if (selectedSort === "price-desc") {
      return b.fromPrice - a.fromPrice;
    } else if (selectedSort === "name-asc") {
      return a.name.localeCompare(b.name);
    }
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    return 0;
  });

  // Group sorted fabrics by materialGroup for display
  const materialGroupsMap = new Map<string, MaterialSection>();
  sortedFabrics.forEach((fabric) => {
    const key = fabric.materialGroup || "LINENS & NATURAL WEAVES";
    if (!materialGroupsMap.has(key)) {
      materialGroupsMap.set(key, {
        groupName: key,
        priceGroup: fabric.priceGroup || "A",
        fromPrice: fabric.fromPrice || 650,
        description:
          fabric.materialDescription ||
          "Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.",
        fabrics: []
      });
    }
    materialGroupsMap.get(key)!.fabrics.push(fabric);
  });

  const displayedGroups = Array.from(materialGroupsMap.values());

  const availableColors = [
    { label: "All Colors", value: "ALL", hex: "" },
    { label: "White", value: "White", hex: "#F5F5F0" },
    { label: "Oatmeal", value: "Oatmeal", hex: "#E6D7B9" },
    { label: "Clay", value: "Clay", hex: "#D2B48C" },
    { label: "Slate", value: "Slate", hex: "#708090" },
    { label: "Sand", value: "Sand", hex: "#C2B280" },
    { label: "Sky", value: "Sky", hex: "#87CEEB" },
    { label: "Terracotta", value: "Terracotta", hex: "#E2725B" },
    { label: "Sage", value: "Sage", hex: "#9DC183" },
    { label: "Forest", value: "Forest", hex: "#228B22" },
    { label: "Charcoal", value: "Charcoal", hex: "#36454F" }
  ];

  const priceOptions = [
    { label: "All Price Groups", value: "ALL" },
    { label: "Price Group A (From $650)", value: "A" },
    { label: "Price Group B (From $720)", value: "B" },
    { label: "Price Group C (From $850)", value: "C" }
  ];

  const materialOptions = [
    { label: "All Materials", value: "ALL" },
    { label: "Linens & Natural Weaves", value: "LINENS & NATURAL WEAVES" },
    { label: "Cotton & Blends", value: "COTTON & BLENDS" },
    { label: "Wool & Blends", value: "WOOL & BLENDS" },
    { label: "Luxury Velvet", value: "LUXURY VELVET" },
    { label: "Architectural Sheers", value: "ARCHITECTURAL SHEERS" },
    { label: "Performance Sunbrella", value: "PERFORMANCE SUNBRELLA" }
  ];

  const sortOptions = [
    { label: "Featured / Most Popular", value: "popular" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Alphabetical: A to Z", value: "name-asc" }
  ];

  const hasActiveFilters =
    selectedCollection !== "LINENS" ||
    selectedColor !== "ALL" ||
    selectedPriceGroup !== "ALL" ||
    selectedMaterial !== "ALL" ||
    selectedSort !== "popular";

  function handleResetFilters() {
    setSelectedCollection("LINENS");
    setSelectedColor("ALL");
    setSelectedPriceGroup("ALL");
    setSelectedMaterial("ALL");
    setSelectedSort("popular");
    setOpenDropdown(null);
  }

  function handleAddSwatch(fabricName: string) {
    if (swatchCount < 4) {
      setSwatchCount((prev) => prev + 1);
    }
    setSwatchNotification(`Added "${fabricName}" to your complimentary swatch set!`);
    setTimeout(() => setSwatchNotification(null), 3500);
  }

  // Opens the detailed reference modal on fabric click
  function openFabricDetails(fabric: FabricItem) {
    setPreviewFabric(fabric);
    setModal(true);
  }

  return (
    <div className="fabric-step">
      <Header />

      <main>
        <header>
          <span>CUSTOM DRAPERY</span>
          <h1>Ripple Fold Drapery</h1>
        </header>

        {/* 01 — CHOOSE YOUR COLLECTION */}
        <section className="collection">
          <h2>01 — CHOOSE YOUR COLLECTION</h2>

          <div className="collection-buttons">
            {collections.map((colName) => {
              const isActive = selectedCollection === colName;
              return (
                <button
                  key={colName}
                  className={isActive ? "active" : ""}
                  onClick={() => setSelectedCollection(colName)}
                  type="button"
                >
                  {colName}
                </button>
              );
            })}
          </div>

          {/* Filter Dropdowns Navigation */}
          <nav className="filter-nav" ref={navRef}>
            {/* 1. Collection Dropdown */}
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-toggle-btn ${
                  selectedCollection !== "ALL" ? "has-active" : ""
                } ${openDropdown === "collection" ? "is-open" : ""}`}
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "collection" ? null : "collection"
                  )
                }
              >
                <span>Collection</span>
                {selectedCollection !== "ALL" && selectedCollection !== "LINENS" && (
                  <span className="active-dot" />
                )}
                <DropdownChevron isOpen={openDropdown === "collection"} />
              </button>

              {openDropdown === "collection" && (
                <div className="filter-dropdown-menu">
                  <button
                    type="button"
                    className={`dropdown-item ${
                      selectedCollection === "ALL" ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedCollection("ALL");
                      setOpenDropdown(null);
                    }}
                  >
                    <span>All Collections</span>
                    {selectedCollection === "ALL" && <CheckBadge />}
                  </button>
                  {collections.map((col) => (
                    <button
                      key={col}
                      type="button"
                      className={`dropdown-item ${
                        selectedCollection === col ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedCollection(col);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{col}</span>
                      {selectedCollection === col && <CheckBadge />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Color Dropdown */}
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-toggle-btn ${
                  selectedColor !== "ALL" ? "has-active" : ""
                } ${openDropdown === "color" ? "is-open" : ""}`}
                onClick={() =>
                  setOpenDropdown(openDropdown === "color" ? null : "color")
                }
              >
                <span>Color</span>
                {selectedColor !== "ALL" && <span className="active-dot" />}
                <DropdownChevron isOpen={openDropdown === "color"} />
              </button>

              {openDropdown === "color" && (
                <div className="filter-dropdown-menu">
                  {availableColors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className={`dropdown-item ${
                        selectedColor === c.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedColor(c.value);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>
                        {c.hex && (
                          <span
                            className="color-circle"
                            style={{ backgroundColor: c.hex }}
                          />
                        )}
                        {c.label}
                      </span>
                      {selectedColor === c.value && <CheckBadge />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Price Dropdown */}
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-toggle-btn ${
                  selectedPriceGroup !== "ALL" ? "has-active" : ""
                } ${openDropdown === "price" ? "is-open" : ""}`}
                onClick={() =>
                  setOpenDropdown(openDropdown === "price" ? null : "price")
                }
              >
                <span>Price</span>
                {selectedPriceGroup !== "ALL" && <span className="active-dot" />}
                <DropdownChevron isOpen={openDropdown === "price"} />
              </button>

              {openDropdown === "price" && (
                <div className="filter-dropdown-menu">
                  {priceOptions.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`dropdown-item ${
                        selectedPriceGroup === p.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedPriceGroup(p.value);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{p.label}</span>
                      {selectedPriceGroup === p.value && <CheckBadge />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Material Dropdown */}
            <div className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-toggle-btn ${
                  selectedMaterial !== "ALL" ? "has-active" : ""
                } ${openDropdown === "material" ? "is-open" : ""}`}
                onClick={() =>
                  setOpenDropdown(openDropdown === "material" ? null : "material")
                }
              >
                <span>Material</span>
                {selectedMaterial !== "ALL" && <span className="active-dot" />}
                <DropdownChevron isOpen={openDropdown === "material"} />
              </button>

              {openDropdown === "material" && (
                <div className="filter-dropdown-menu">
                  {materialOptions.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      className={`dropdown-item ${
                        selectedMaterial === m.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedMaterial(m.value);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{m.label}</span>
                      {selectedMaterial === m.value && <CheckBadge />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Sort Dropdown */}
            <div className="filter-dropdown-wrapper filter-sort-btn">
              <button
                type="button"
                className={`filter-toggle-btn filter-sort-btn ${
                  openDropdown === "sort" ? "is-open" : ""
                }`}
                onClick={() =>
                  setOpenDropdown(openDropdown === "sort" ? null : "sort")
                }
              >
                <span>SORT</span>
                <SortIcon isOpen={openDropdown === "sort"} />
              </button>

              {openDropdown === "sort" && (
                <div className="filter-dropdown-menu sort-menu">
                  {sortOptions.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      className={`dropdown-item ${
                        selectedSort === s.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedSort(s.value);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{s.label}</span>
                      {selectedSort === s.value && <CheckBadge />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Active filter badges / Reset */}
          {hasActiveFilters && (
            <div className="filter-active-chips-bar">
              <span className="chips-label">
                Filtered ({filteredFabrics.length} fabric{filteredFabrics.length !== 1 ? "s" : ""}):
              </span>
              <div className="chips-list">
                {selectedCollection !== "ALL" && selectedCollection !== "LINENS" && (
                  <button
                    type="button"
                    className="filter-chip"
                    onClick={() => setSelectedCollection("LINENS")}
                    title="Remove collection filter"
                  >
                    <span>Collection: {selectedCollection}</span>
                    <span className="chip-remove">✕</span>
                  </button>
                )}
                {selectedColor !== "ALL" && (
                  <button
                    type="button"
                    className="filter-chip"
                    onClick={() => setSelectedColor("ALL")}
                    title="Remove color filter"
                  >
                    <span>Color: {selectedColor}</span>
                    <span className="chip-remove">✕</span>
                  </button>
                )}
                {selectedPriceGroup !== "ALL" && (
                  <button
                    type="button"
                    className="filter-chip"
                    onClick={() => setSelectedPriceGroup("ALL")}
                    title="Remove price filter"
                  >
                    <span>Price: Group {selectedPriceGroup}</span>
                    <span className="chip-remove">✕</span>
                  </button>
                )}
                {selectedMaterial !== "ALL" && (
                  <button
                    type="button"
                    className="filter-chip"
                    onClick={() => setSelectedMaterial("ALL")}
                    title="Remove material filter"
                  >
                    <span>Material: {selectedMaterial}</span>
                    <span className="chip-remove">✕</span>
                  </button>
                )}
                <button
                  type="button"
                  className="filter-clear-all-btn"
                  onClick={handleResetFilters}
                >
                  Reset All
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 02 — SELECT MATERIAL & COLOR */}
        <section className="materials">
          <h2>02 — SELECT MATERIAL &amp; COLOR</h2>

          {displayedGroups.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#f7f6f2",
                borderRadius: "8px",
                marginTop: "30px"
              }}
            >
              <p style={{ fontSize: "14px", color: "#555" }}>
                No fabrics match your selected filter criteria.
              </p>
              <button
                type="button"
                className="filter-reset-btn"
                style={{ marginTop: "12px", padding: "8px 16px", fontSize: "11px" }}
                onClick={handleResetFilters}
              >
                Reset Filters to Show All
              </button>
            </div>
          ) : (
            displayedGroups.map((group) => (
              <div className="material-group" key={group.groupName}>
                <h3>
                  MATERIAL: {group.groupName} <i /> PRICE GROUP:{" "}
                  {group.priceGroup} <i /> FROM: ${group.fromPrice}
                </h3>
                <p>{group.description}</p>

                <div className="fabrics-grid">
                  {group.fabrics.map((fabric) => {
                    const isSelected = selectedFabric?.name === fabric.name;
                    return (
                      <div
                        key={`${group.groupName}-${fabric.name}`}
                        className={`fabric-card ${isSelected ? "selected" : ""}`}
                        onClick={() => openFabricDetails(fabric)}
                      >
                        <span className="thumb-wrapper">
                          <Image
                            src={fabric.image}
                            alt={fabric.name}
                            fill
                            sizes="16vw"
                          />

                          {/* Crisp Circular Zoom Badge matching Image 1 */}
                          <span
                            className="zoom-badge"
                            title="Inspect fabric details"
                            onClick={(e) => {
                              e.stopPropagation();
                              openFabricDetails(fabric);
                            }}
                          >
                            <ZoomIcon size={14} strokeWidth={1.75} />
                          </span>

                          {/* Checkmark when selected */}
                          {isSelected && <span className="selected-check">✓</span>}
                        </span>

                        <strong>{fabric.name}</strong>
                        <small>Price Group {fabric.priceGroup}</small>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fabric-bar">
        <div>
          <b>RIPPLE FOLD DRAPERY</b>
          <span>
            {selectedFabric?.materialGroup?.split("&")[0]?.trim() || "Linen"} ·{" "}
            {selectedFabric?.color?.name || "Oatmeal"}
          </span>
        </div>
        <strong>Price from ${selectedFabric?.fromPrice || 650}</strong>
        <Link href="/drapery/configure/details">
          CONTINUE TO MOUNT &amp; CONFIGURATION&nbsp; →
        </Link>
      </div>

      <Footer />

      {/* Swatch Toast Notification */}
      {swatchNotification && (
        <div
          style={{
            position: "fixed",
            bottom: "105px",
            right: "24px",
            background: "#111",
            color: "#fff",
            padding: "14px 20px",
            borderRadius: "6px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            zIndex: 99,
            fontSize: "12px",
            letterSpacing: "0.5px"
          }}
        >
          {swatchNotification}
        </div>
      )}

      {/* Fabric Detail Modal - Exact Reference Image 2 Design */}
      {modal && previewFabric && (
        <div
          className="fabric-modal-backdrop"
          onClick={() => setModal(false)}
        >
          <section
            className="fabric-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="modal-close"
              onClick={() => setModal(false)}
              aria-label="Close"
            >
              ×
            </button>

            {/* Left Photo with Zoom Badge */}
            <div className="modal-photo">
              <Image
                src={previewFabric.closeupImage || previewFabric.image}
                alt={`${previewFabric.name} closeup`}
                fill
                sizes="50vw"
                priority
              />
              <span
                className="zoom-badge"
                title="Zoom Texture Preview"
              >
                <ZoomIcon size={15} strokeWidth={1.75} />
              </span>
            </div>

            {/* Right Details Column */}
            <div className="modal-copy">
              <span className="modal-price-group">
                PRICE GROUP {previewFabric.priceGroup}
              </span>
              <h2 className="modal-title">{previewFabric.name}</h2>
              <p className="modal-desc">
                {previewFabric.materialDescription ||
                  "A classic Belgian linen in a warm oatmeal hue, woven with a rich slub texture and soft fluid drape. Breathable, durable, and naturally elegant — designed for timeless interiors with effortless light filtering."}
              </p>

              {/* Specs List */}
              <div className="modal-specs-list">
                <div className="modal-spec-row">
                  <span className="modal-spec-label">COMPOSITION</span>
                  <span className="modal-spec-value">
                    {previewFabric.specs?.composition || "100% Belgian Flax Linen"}
                  </span>
                </div>

                <div className="modal-spec-row">
                  <span className="modal-spec-label">WEIGHT</span>
                  <span className="modal-spec-value">
                    {previewFabric.specs?.weight ||
                      "320 GSM (Heavyweight Architectural Drape)"}
                  </span>
                </div>

                <div className="modal-spec-row">
                  <span className="modal-spec-label">DURABILITY</span>
                  <span className="modal-spec-value">
                    {previewFabric.specs?.durability ||
                      "30,000 Martindale Rubs (Commercial Grade)"}
                  </span>
                </div>

                <div className="modal-spec-row">
                  <span className="modal-spec-label">LIGHT FILTERING</span>
                  <span className="modal-spec-value">
                    {previewFabric.specs?.lightFiltering ||
                      "Semi-Sheer to Light Filtering (Soft Glow)"}
                  </span>
                </div>

                <div className="modal-spec-row">
                  <span className="modal-spec-label">CARE &amp; MAINTENANCE</span>
                  <div className="care-maintenance-row">
                    <div className="care-symbols">
                      <span title="Dry Clean Only">Ⓟ</span>
                      <span title="Iron Low">▱</span>
                      <span title="Do Not Bleach">△</span>
                      <span title="Steam In Situ">☿</span>
                    </div>
                    <span className="care-text">
                      {previewFabric.specs?.care ||
                        "Professional dry clean or steam in situ."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                className="modal-select-btn"
                onClick={() => {
                  setSelectedFabric(previewFabric);
                  setModal(false);
                }}
              >
                SELECT THIS FABRIC →
              </button>

              <button
                type="button"
                className="modal-swatch-btn"
                onClick={() => handleAddSwatch(previewFabric.name)}
              >
                + ADD TO SWATCHES
              </button>

              {/* Base Swatch Set Box */}
              <div className="base-swatch-box">
                <div className="base-swatch-header">
                  <span>BASE SWATCH SET</span>
                  <span>$20 Flat Rate</span>
                </div>
                <div className="base-swatch-meta">
                  <span>Includes up to 4 swatches</span>
                  <span>{swatchCount} of 4 selected</span>
                </div>
                <div className="swatch-progress-bar">
                  <div
                    className="swatch-progress-fill"
                    style={{ width: `${Math.min(100, swatchCount * 25)}%` }}
                  />
                </div>
                <p className="base-swatch-info">
                  Order any quantity: 1 to 4 swatches are covered by the $20 flat rate.
                  Select 4 swatches to maximize your value. Complimentary shipping
                  included.
                </p>
              </div>

              <div className="modal-footer-note">
                Complimentary express delivery in 2–3 business days with physical
                texture cards &amp; prepaid return envelope.
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
