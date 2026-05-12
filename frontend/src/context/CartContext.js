import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  createCart,
  getCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
} from "../lib/shopify";

const CART_ID_KEY = "artem_shopify_cart_id";

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Load cart from Shopify on mount if cartId exists in localStorage
  useEffect(() => {
    const loadCart = async () => {
      const storedId = localStorage.getItem(CART_ID_KEY);
      if (storedId) {
        try {
          const fetched = await getCart(storedId);
          if (fetched && fetched.id) {
            setCart(fetched);
          } else {
            // cart expired/deleted server-side
            localStorage.removeItem(CART_ID_KEY);
          }
        } catch (err) {
          console.warn("Failed to load cart, clearing:", err.message);
          localStorage.removeItem(CART_ID_KEY);
        }
      }
      setInitializing(false);
    };
    loadCart();
  }, []);

  const ensureCart = useCallback(
    async (initialLines = []) => {
      if (cart?.id) return cart;
      const newCart = await createCart(initialLines);
      localStorage.setItem(CART_ID_KEY, newCart.id);
      setCart(newCart);
      return newCart;
    },
    [cart]
  );

  const addItem = useCallback(
    async (variantId, quantity = 1) => {
      if (!variantId) {
        toast.error("Variante de produit introuvable");
        return;
      }
      setLoading(true);
      try {
        let updated;
        if (!cart?.id) {
          updated = await createCart([{ merchandiseId: variantId, quantity }]);
          localStorage.setItem(CART_ID_KEY, updated.id);
        } else {
          updated = await addCartLines(cart.id, [
            { merchandiseId: variantId, quantity },
          ]);
        }
        setCart(updated);
        toast.success("Ajouté au panier");
        return updated;
      } catch (err) {
        toast.error(err.message || "Erreur lors de l'ajout au panier");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const updateItem = useCallback(
    async (lineId, quantity) => {
      if (!cart?.id) return;
      setLoading(true);
      try {
        const updated = await updateCartLines(cart.id, [
          { id: lineId, quantity },
        ]);
        setCart(updated);
      } catch (err) {
        toast.error(err.message || "Erreur lors de la mise à jour");
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId) => {
      if (!cart?.id) return;
      setLoading(true);
      try {
        const updated = await removeCartLines(cart.id, [lineId]);
        setCart(updated);
        toast.success("Produit retiré du panier");
      } catch (err) {
        toast.error(err.message || "Erreur lors de la suppression");
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY);
    setCart(null);
  }, []);

  const checkout = useCallback(() => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    } else {
      toast.error("Panier vide ou indisponible");
    }
  }, [cart]);

  // Derived values
  const totalQuantity = cart?.totalQuantity || 0;
  const items =
    cart?.lines?.edges?.map((e) => ({
      lineId: e.node.id,
      quantity: e.node.quantity,
      lineTotal: e.node.cost?.totalAmount,
      unitPrice: e.node.cost?.amountPerQuantity,
      variantId: e.node.merchandise?.id,
      variantTitle: e.node.merchandise?.title,
      available: e.node.merchandise?.availableForSale,
      image: e.node.merchandise?.image || e.node.merchandise?.product?.featuredImage,
      productHandle: e.node.merchandise?.product?.handle,
      productTitle: e.node.merchandise?.product?.title,
    })) || [];

  const value = {
    cart,
    items,
    totalQuantity,
    subtotal: cart?.cost?.subtotalAmount,
    total: cart?.cost?.totalAmount,
    taxes: cart?.cost?.totalTaxAmount,
    checkoutUrl: cart?.checkoutUrl,
    loading,
    initializing,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    checkout,
    ensureCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
