'use client';

import { FullScreenLoader } from "@/components/layout/FullScreenLoader";
import { CartView } from "@/components/products/CartView";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type SKU = {
  id: number;
  price: number;
  quantity: number;
  cover: string;
  attribute_name: string;
  attribute_value: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  cover: string;
  products_skus: SKU[];
};

export default function CartPage() {
  const { id } = useParams<{ id: string }>();

  // This flag makes sure the *first* client render still
  // matches the server (both show the loader).
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<{ product: Product; sku: SKU }[]>([]);

  const sortCart = (items /* : CartItem[] */) =>
    items.sort((a, b) => a.sku.id - b.sku.id);

  /** read localStorage once */
  useEffect(() => {
    setMounted(true);

    try {
      const raw = localStorage.getItem("cart");
      const stored = raw ? JSON.parse(raw) : [];
      setCart(sortCart(stored));         // ✨ always sorted in memory
    } catch (err) {
      console.error("failed to read cart", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // whenever `cart` changes, write it back to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (err) {
      console.error('failed to save cart', err);
    }
  }, [cart, mounted]);

  const handleUpdateItem = (
    product: Product,
    sku: SKU,
    newQty: number
  ) => {
    //console.log('product: ', product)
    const filtered = cart.filter(
      (ci) => !(ci.product.id === product.id && ci.sku.id === sku.id)
    );
    const rebuilt: { product: Product; sku: SKU }[] = [];
    for (let i = 0; i < newQty; i++) rebuilt.push({ product, sku });
    setCart(sortCart([...filtered, ...rebuilt]));
  };

  // until we've run the client-only effect, keep showing the
  // exact same loader on client *and* server
  if (!mounted || isLoading) return <FullScreenLoader />;

  return (
    <CartView
      storeId={id}
      cart={cart}
      onUpdateItem={handleUpdateItem}
    />
  );
}