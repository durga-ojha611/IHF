"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ordersApi } from "@/lib/api";
import { CartDrawer } from "./cart-drawer";
import { useAuth } from "./auth-context";

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
  isCartOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  addToCart: (item: Omit<CommerceItem, "quantity"> & { quantity?: number }) => void;
  toggleFavourite: (item: Omit<CommerceItem, "quantity">) => void;
  removeCart: (id: string) => void;
  removeFavourite: (id: string) => void;
  setQuantity: (id: string, q: number) => void;
  clearCart: () => void;
  checkout: (shippingAddress: CheckoutAddress) => Promise<{ success: boolean; order?: any; error?: string }>;
  openAuthModal: (reason?: "wishlist" | "checkout") => void;
  cartCount: number;
  favouriteCount: number;
  subtotal: number;
};

const CommerceContext = createContext<CommerceValue | null>(null);
const CART_KEY = "ihf-cart";
const FAV_KEY = "ihf-favourites";

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CommerceItem[]>([]);
  const [favourites, setFavourites] = useState<CommerceItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<"wishlist" | "checkout">("wishlist");

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

  const openCartDrawer = useCallback(() => setIsCartOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartOpen(false), []);
  const toggleCartDrawer = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const openAuthModal = useCallback((reason: "wishlist" | "checkout" = "wishlist") => {
    setAuthModalReason(reason);
    setAuthModalOpen(true);
  }, []);

  const value = useMemo<CommerceValue>(
    () => ({
      cart,
      favourites,
      isCartOpen,
      openCartDrawer,
      closeCartDrawer,
      toggleCartDrawer,
      openAuthModal,
      addToCart: (item) => {
        setCart((c) => {
          const qty = item.quantity || 1;
          const found = c.find((x) => x.id === item.id);
          return found
            ? c.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + qty } : x))
            : [...c, { ...item, quantity: qty }];
        });
        setIsCartOpen(true);
      },
      toggleFavourite: (item) => {
        if (!user) {
          openAuthModal("wishlist");
          return;
        }
        setFavourites((f) =>
          f.some((x) => x.id === item.id)
            ? f.filter((x) => x.id !== item.id)
            : [...f, { ...item, quantity: 1 }]
        );
      },
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
    [cart, favourites, isCartOpen, openCartDrawer, closeCartDrawer, toggleCartDrawer, openAuthModal, user]
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
      <CartDrawer />

      {authModalOpen && (
        <div className="auth-prompt-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div className="auth-prompt-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="auth-prompt-close"
              onClick={() => setAuthModalOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <span className="auth-prompt-kicker">
              {authModalReason === "checkout" ? "ATELIER CHECKOUT" : "ATELIER WISHLIST"}
            </span>
            <h3 className="auth-prompt-title">
              {authModalReason === "checkout" ? "Sign In to Complete Checkout" : "Sign In to Save Favourites"}
            </h3>
            <p className="auth-prompt-text">
              {authModalReason === "checkout"
                ? "Please sign in or create an account to proceed with your order, track your shipment, and receive client order updates."
                : "Please sign in or create an account to save your favorite products to your personal wishlist and access them anytime."}
            </p>

            <div className="auth-prompt-actions">
              <Link
                href="/account"
                className="auth-prompt-btn-primary"
                onClick={() => setAuthModalOpen(false)}
              >
                {authModalReason === "checkout" ? "SIGN IN TO CHECKOUT ↗" : "SIGN IN TO YOUR ACCOUNT ↗"}
              </Link>
              <Link
                href="/account"
                className="auth-prompt-btn-secondary"
                onClick={() => setAuthModalOpen(false)}
              >
                CREATE AN ACCOUNT
              </Link>
            </div>

            <button
              type="button"
              className="auth-prompt-dismiss"
              onClick={() => setAuthModalOpen(false)}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const value = useContext(CommerceContext);
  if (!value) throw new Error("CommerceProvider missing");
  return value;
}
