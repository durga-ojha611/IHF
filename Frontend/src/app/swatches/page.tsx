"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/site-chrome";
import { swatchesApi } from "@/lib/api";
import { useAuth } from "@/components/auth-context";
import "../commerce.css";

export default function SwatchesPage() {
  const { user } = useAuth();
  const [swatches, setSwatches] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [orderResult, setOrderResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Shipping Form
  const defaultAddr = user?.addresses?.[0];
  const [name, setName] = useState(defaultAddr?.fullName || user?.name || "Eleanor Vance");
  const [email, setEmail] = useState(user?.email || "client@luxurydrapes.com");
  const [street, setStreet] = useState(defaultAddr?.street || "740 Park Avenue");
  const [city, setCity] = useState(defaultAddr?.city || "New York");
  const [state, setState] = useState(defaultAddr?.state || "NY");
  const [zipCode, setZipCode] = useState(defaultAddr?.zipCode || "10021");

  useEffect(() => {
    swatchesApi
      .getAll()
      .then((res) => {
        const list = res.data?.swatches || [];
        setSwatches(list);
        if (list.length > 0) {
          setSelectedIds([list[0]._id]);
        }
      })
      .catch(() => {
        // Fallback swatches
        setSwatches([
          {
            _id: "660000000000000000000007",
            fabricName: "Belgian Flax Linen",
            colorName: "Champagne Oat",
            hexCode: "#E6D7B9",
            material: "100% European Flax Linen",
            image: { url: "/figma/home-02.png" }
          },
          {
            _id: "660000000000000000000072",
            fabricName: "Monaco Royal Velvet",
            colorName: "Emerald Forest",
            hexCode: "#046307",
            material: "Heavyweight Cotton Velvet",
            image: { url: "/figma/home-13.png" }
          },
          {
            _id: "660000000000000000000073",
            fabricName: "Monaco Royal Velvet",
            colorName: "Midnight Navy",
            hexCode: "#002366",
            material: "Heavyweight Cotton Velvet",
            image: { url: "/figma/home-06.jpeg" }
          },
          {
            _id: "660000000000000000000074",
            fabricName: "Artisan Sheer Voile",
            colorName: "Pure Ivory",
            hexCode: "#FFFFF0",
            material: "100% Fine Spun Linen Sheer",
            image: { url: "/figma/home-17.jpeg" }
          }
        ]);
        setSelectedIds(["660000000000000000000007"]);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSwatch = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length >= 4) {
        setError("You can select up to 4 complimentary swatches per kit.");
        return;
      }
      setError(null);
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      setError("Please select at least one swatch for your sample kit.");
      return;
    }

    setOrdering(true);
    setError(null);

    try {
      const res = await swatchesApi.requestSampleKit({
        customerInfo: {
          name,
          email,
          shippingAddress: {
            street,
            city,
            state,
            zipCode,
            country: "US"
          }
        },
        swatchIds: selectedIds,
        notes: "Complimentary Luxury Sample Kit via IHF Web Atelier"
      });

      setOrderResult(res.data?.swatchOrder || { orderNumber: `SW-${Date.now().toString().slice(-6)}` });
    } catch (err: any) {
      setError(err.message || "Failed to submit swatch sample kit request.");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <>
      <Header />
      <main className="commerce-page">
        <header className="commerce-head">
          <span>ATELIER MATERIAL PALETTES</span>
          <h1>Complimentary Swatch Studio</h1>
          <p>Feel the weave, assess the weight, and inspect natural light filtering before commissioning your drapery.</p>
        </header>

        {orderResult ? (
          <div style={{ maxWidth: 640, margin: "0 auto", background: "white", padding: 48, border: "1px solid #ddd8cf", textAlign: "center" }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: "#7b803e", fontWeight: 600 }}>SWATCH KIT DISPATCHED</span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 32, margin: "12px 0 6px" }}>Sample Box on its Way</h2>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>
              Your {selectedIds.length} curated swatch samples have been packaged in our signature linen presentation box.
            </p>
            <div style={{ background: "#faf9f6", padding: 18, border: "1px solid #eee", marginBottom: 24, fontSize: 12 }}>
              <b>Tracking Number: {orderResult.orderNumber}</b>
              <p style={{ margin: "6px 0 0", color: "#666" }}>Delivery within 2-4 business days via expedited courier.</p>
            </div>
            <Link href="/drapery/configure" style={{ background: "#111", color: "white", padding: "14px 28px", fontSize: 10, letterSpacing: 1.5 }}>
              EXPLORE DRAPERY STYLES →
            </Link>
          </div>
        ) : (
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, margin: 0 }}>Select Up To 4 Complimentary Swatches</h3>
                <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0" }}>Each sample arrives cut to 8&quot; × 8&quot; with finished serged edges.</p>
              </div>
              <div style={{ fontSize: 11, background: "#f5f4ef", padding: "6px 14px", border: "1px solid #e0ded8" }}>
                <b>{selectedIds.length} of 4 Selected</b>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", padding: "10px 14px", fontSize: 11, marginBottom: 18 }}>
                {error}
              </div>
            )}

            {/* Swatch Selection Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20, marginBottom: 44 }}>
              {loading ? (
                <p style={{ fontSize: 12, color: "#777" }}>Loading swatches from atelier...</p>
              ) : (
                swatches.map((sw) => {
                  const isChecked = selectedIds.includes(sw._id);
                  return (
                    <div
                      key={sw._id}
                      onClick={() => toggleSwatch(sw._id)}
                      style={{
                        background: "white",
                        border: isChecked ? "2px solid #7b803e" : "1px solid #ddd8cf",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ position: "relative", width: "100%", height: 180 }}>
                        <Image
                          src={sw.image?.url || "/figma/home-02.png"}
                          alt={sw.fabricName}
                          fill
                          sizes="20vw"
                          style={{ objectFit: "cover" }}
                        />
                        {isChecked && (
                          <div style={{ position: "absolute", top: 10, right: 10, background: "#7b803e", color: "white", width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                            ✓
                          </div>
                        )}
                      </div>
                      <div style={{ padding: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ width: 14, height: 14, borderRadius: "50%", background: sw.hexCode || "#ddd", border: "1px solid #ccc" }} />
                          <b style={{ fontSize: 12 }}>{sw.colorName}</b>
                        </div>
                        <h4 style={{ fontFamily: "var(--font-serif)", fontSize: 16, margin: "0 0 4px" }}>{sw.fabricName}</h4>
                        <p style={{ fontSize: 11, color: "#666", margin: 0 }}>{sw.material || "100% Fine Fiber"}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Delivery Form */}
            <div style={{ background: "white", border: "1px solid #ddd8cf", padding: 36, maxWidth: 650, margin: "0 auto" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginBottom: 8 }}>Order Your Complimentary Swatch Kit</h3>
              <p style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>
                No credit card required. Free standard courier shipping worldwide.
              </p>
              <form onSubmit={handleOrderSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input
                    placeholder="Recipient Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: "10px 12px", fontSize: 12, border: "1px solid #ccc" }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: "10px 12px", fontSize: 12, border: "1px solid #ccc" }}
                  />
                </div>
                <input
                  placeholder="Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  style={{ padding: "10px 12px", fontSize: 12, border: "1px solid #ccc" }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
                  <input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    style={{ padding: "10px 12px", fontSize: 12, border: "1px solid #ccc" }}
                  />
                  <input
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    style={{ padding: "10px 12px", fontSize: 12, border: "1px solid #ccc" }}
                  />
                  <input
                    placeholder="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    style={{ padding: "10px 12px", fontSize: 12, border: "1px solid #ccc" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={ordering}
                  style={{ background: "#111", color: "white", padding: 16, border: 0, fontSize: 10, letterSpacing: 1.5, marginTop: 10, cursor: "pointer" }}
                >
                  {ordering ? "ORDERING SWATCH BOX..." : `REQUEST COMPLIMENTARY BOX (${selectedIds.length} SWATCHES)`}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
