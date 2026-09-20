"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTelegram } from "@/hooks/useTelegram";

export default function StoreFront() {
  const params = useParams();
  const { tg, user, startParam, triggerHaptic } = useTelegram();

  // Dynamic tenant slug resolution
  const activeSlug = startParam || (params.storeSlug as string) || "sbc-store";

  const [data, setData] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/tma/store/${activeSlug}`)
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error("Store loading error:", err));
  }, [activeSlug]);

  const addToCart = (product: any) => {
    triggerHaptic("light");
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0 || !address || !phone) {
      tg?.showAlert("Please provide delivery address and phone number.");
      return;
    }

    triggerHaptic("heavy");
    setIsSubmitting(true);

    try {
      const payload = {
        storeSlug: activeSlug,
        tgUserId: user?.id?.toString(),
        customer: {
          name: [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Telegram Customer",
          phone,
          address,
        },
        items: cart.map((item) => ({
          productId: item.id,
          code: item.code,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("http://localhost:8000/api/tma/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        tg?.showAlert(`Order placed successfully! Ref: ${result.referenceNo}`);
        setCart([]);
        setAddress("");
      } else {
        tg?.showAlert(`Error: ${result.error}`);
      }
    } catch (err) {
      tg?.showAlert("Network error. Could not complete order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 space-y-4 animate-pulse">
        <div className="h-20 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-40 bg-slate-900 rounded-xl" />
          <div className="h-40 bg-slate-900 rounded-xl" />
        </div>
      </div>
    );
  }

  const grandTotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 pb-44">
      {/* Header */}
      <div className="flex items-center space-x-3 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl mb-4 backdrop-blur-md">
        {data.store?.logoUrl && (
          <img src={data.store.logoUrl} alt="Store Logo" className="w-12 h-12 rounded-full border border-slate-700" />
        )}
        <div>
          <h1 className="text-lg font-bold">{data.store?.name}</h1>
          <p className="text-xs text-slate-400">Welcome, @{user?.username || user?.first_name || "Guest"}</p>
        </div>
      </div>

      {/* Catalog */}
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Catalog</h2>
      <div className="grid grid-cols-2 gap-3">
        {data.products?.map((p: any) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <p className="text-xs text-blue-400">{p.category_name || "General"}</p>
              <h3 className="font-semibold text-sm line-clamp-1">{p.name}</h3>
              <p className="text-amber-400 font-mono text-sm my-1">${Number(p.price).toFixed(2)}</p>
            </div>
            <button
              onClick={() => addToCart(p)}
              className="w-full mt-2 bg-blue-600 active:scale-95 py-1.5 text-xs font-semibold rounded-lg transition-transform"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Cart & Checkout */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 border-t border-slate-800 backdrop-blur-lg space-y-2">
          <div className="flex justify-between text-sm font-semibold mb-1">
            <span>Items: {cart.reduce((a, b) => a + b.quantity, 0)}</span>
            <span className="text-amber-400 font-mono">${grandTotal.toFixed(2)}</span>
          </div>
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
          />
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="w-full py-2.5 bg-emerald-600 active:scale-95 font-bold rounded-lg text-sm transition-transform"
          >
            {isSubmitting ? "Processing..." : `Place Order ($${grandTotal.toFixed(2)})`}
          </button>
        </div>
      )}
    </div>
  );
}