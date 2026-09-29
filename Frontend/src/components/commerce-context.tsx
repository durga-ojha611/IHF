"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ordersApi } from "@/lib/api";

export interface CustomSpecs {
  width: string;
  height: string;
  fullness?: string;
  lining?: string;
  pleat?: string;
  mount?: string;
  hardware?: string;
  railSystem?: string;
  trim?: string;
  valance?: string;
  tieBack?: string;
  panelConfiguration?: string;
  priceBreakdown?: Record<string, any>;
}

export type CommerceItem = {
  id: string;
  productId?: string;
  name: string;
  price: number;
  image: string;
  variant?: string;
  quantity: number;
  isCustom?: boolean;
  specs?: CustomSpecs;
};

interface CheckoutAddress {
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

type CommerceValue = {
  cart: CommerceItem[];
  favourites: CommerceItem[];
  addToCart: (item: Omit<CommerceItem, "quantity"> & { quantity?: number }) => void;
  toggleFavourite: (item: Omit<CommerceItem, "quantity">) => void;
  removeCart: (id: string) => void;
  removeFavourite: (id: string) => void;
  setQuantity: (id: string, q: number) => void;
  clearCart: () => void;
  checkout: (shippingAddress: CheckoutAddress) => Promise<{ success: boolean; order?: any; error?: string }>;
  cartCount: number;
  favouriteCount: number;
  subtotal: number;
};

const CommerceContext = createContext<CommerceValue | null>(null);
const CART_KEY = "ihf-cart";
const FAV_KEY = "ihf-favourites";

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CommerceItem[]>([]);
  const [favourites, setFavourites] = useState<CommerceItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
      setFavourites(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(FAV_KEY, JSON.stringify(favourites));
  }, [favourites, ready]);

  const value = useMemo<CommerceValue>(
    () => ({
      cart,
      favourites,
      addToCart: (item) =>
        setCart((c) => {
          const qty = item.quantity || 1;
          const found = c.find((x) => x.id === item.id);
          return found
            ? c.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + qty } : x))
            : [...c, { ...item, quantity: qty }];
        }),
      toggleFavourite: (item) =>
        setFavourites((f) =>
          f.some((x) => x.id === item.id)
            ? f.filter((x) => x.id !== item.id)
            : [...f, { ...item, quantity: 1 }]
        ),
      removeCart: (id) => setCart((c) => c.filter((x) => x.id !== id)),
      removeFavourite: (id) => setFavourites((f) => f.filter((x) => x.id !== id)),
      setQuantity: (id, q) =>
        setCart((c) =>
          q < 1 ? c.filter((x) => x.id !== id) : c.map((x) => (x.id === id ? { ...x, quantity: q } : x))
        ),
      clearCart: () => setCart([]),
      checkout: async (shippingAddress: CheckoutAddress) => {
        try {
          if (cart.length === 0) {
            return { success: false, error: "Your cart is empty." };
          }

          // Format items for backend Order API
          const orderItems = cart.map((item) => {
            if (item.isCustom) {
              return {
                itemType: "custom_curtain",
                productId: item.productId || "660000000000000000000006",
                width: item.specs?.width || "54 1/2\"",
                height: item.specs?.height || "96\"",
                fullnessId: item.specs?.fullness || "standard",
                liningId: item.specs?.lining || "privacy",
                pleatId: item.specs?.pleat || "pinch-pleat",
                panelConfiguration: item.specs?.panelConfiguration || "pair",
                quantity: item.quantity
              };
            }
            return {
              itemType: "standard_product",
              productId: item.productId || "660000000000000000000006",
              title: item.name,
              unitPrice: item.price,
              quantity: item.quantity
            };
          });

          // 1. Create Payment Intent with server-side recalculated price
          const paymentRes = await ordersApi.createPaymentIntent(orderItems).catch(() => null);

          // 2. Place Order in backend
          const orderRes = await ordersApi.placeOrder({
            items: orderItems,
            shippingAddress,
            paymentIntentId: paymentRes?.data?.paymentIntentId || `mock_pi_${Date.now()}`
          });

          // 3. Clear cart on success
          setCart([]);

          return {
            success: true,
            order: orderRes.data?.order
          };
        } catch (err: any) {
          return {
            success: false,
            error: err.message || "Failed to process checkout"
          };
        }
      },
      cartCount: cart.reduce((n, x) => n + x.quantity, 0),
      favouriteCount: favourites.length,
      subtotal: cart.reduce((n, x) => n + x.price * x.quantity, 0)
    }),
    [cart, favourites]
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const value = useContext(CommerceContext);
  if (!value) throw new Error("CommerceProvider missing");
  return value;
}
