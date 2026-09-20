import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTelegram } from "../../../hooks/useTelegram";

export default function TmaStoreFront() {
  const router = useRouter();
  const { store_slug } = router.query;
  const { user, startParam, triggerHaptic } = useTelegram();

  // Prefer startParam (?startapp=slug) from Telegram URL context
  const activeSlug = startParam || store_slug;

  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeSlug) return;

    async function fetchData() {
      try {
        const [resStore, resProducts] = await Promise.all([
          fetch(`/api/v1/tma/store/${activeSlug}`),
          fetch(`/api/v1/tma/store/${activeSlug}/catalog`)
        ]);

        const storeData = await resStore.json();
        const productsData = await resProducts.json();

        if (storeData.status) setStore(storeData.data);
        if (productsData.status) setProducts(productsData.data);
      } catch (err) {
        console.error("Error loading store:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeSlug]);

  const addToCart = (product: any) => {
    triggerHaptic();
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    triggerHaptic();

    const payload = {
      customer: {
        name: user ? `${user.first_name} ${user.last_name || ""}`.trim() : "Walk-in Guest",
        phone: "",
        telegram_user_id: user?.id ? String(user.id) : null
      },
      items: cart
    };

    const res = await fetch(`/api/v1/tma/store/${activeSlug}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.status) {
      alert(`Order Placed: Ref #${data.data.referenceNo}`);
      setCart([]);
    }
  };

  if (loading) return <div className="p-6 text-center text-white">Loading Catalog...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 pb-24">
      {/* Store Header */}
      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
        <h1 className="text-xl font-bold">{store?.store_name}</h1>
        <p className="text-sm text-slate-400">Shopping as {user?.first_name || "Guest"}</p>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((item) => (
          <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-full h-28 bg-slate-800 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={`/assets/uploads/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-500">No Image</span>
                )}
              </div>
              <h2 className="text-sm font-semibold truncate">{item.name}</h2>
              <p className="text-sm text-emerald-400 font-mono">${Number(item.price).toFixed(2)}</p>
            </div>
            <button
              onClick={() => addToCart(item)}
              className="mt-3 w-full py-1.5 bg-emerald-600 active:bg-emerald-700 text-xs font-semibold rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-slate-900 border border-emerald-500/50 p-4 rounded-xl shadow-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Items: {cart.reduce((a, b) => a + b.quantity, 0)}</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">
              ${cart.reduce((a, b) => a + b.price * b.quantity, 0).toFixed(2)}
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-sm rounded-lg"
          >
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
}