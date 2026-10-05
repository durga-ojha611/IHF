"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { useCommerce } from "@/components/commerce-context";

export default function CheckoutGuard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { openAuthModal } = useCommerce();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/cart");
        setTimeout(() => {
          openAuthModal("checkout");
        }, 150);
      } else {
        router.replace("/cart?checkout=true");
      }
    }
  }, [user, loading, router, openAuthModal]);

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "#666" }}>
      Connecting to Atelier Secure Checkout…
    </div>
  );
}
