import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTelegram } from "@/hooks/useTelegram";

export default function StoreFront() {
  const params = useParams();
  const { tg, user, startParam, triggerHaptic } = useTelegram();

  // Dynamic tenant slug resolution
  const activeSlug = startParam || (params.storeSlug as string) || (params.store_slug as string) || "sbc-store";

  // Navigation view state: 'catalog' | 'orders'
  const [activeTab, setActiveTab] = useState<"catalog" | "orders">("catalog");

  // Catalog state
  const [data, setData] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [address, setAddress] = useState("Table #04 (Dine-In)");
  const [phone, setPhone] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Past orders state
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Fetch store catalog
  useEffect(() => {
    fetch(`/api/tma/store/${activeSlug}`)
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error("Store loading error:", err));
  }, [activeSlug]);

  // Fetch past orders from /api/tma/orders
  const fetchPastOrders = useCallback(() => {
    setLoadingOrders(true);
    setOrdersError(null);
    fetch(`/api/tma/orders?storeSlug=${encodeURIComponent(activeSlug)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((resData) => {
        const list = resData.orders || resData.data || (Array.isArray(resData) ? resData : []);
        setPastOrders(list);
      })
      .catch((err) => {
        console.error("Orders fetching error:", err);
        setOrdersError(err.message || "Failed to load orders");
      })
      .finally(() => setLoadingOrders(false));
  }, [activeSlug]);

  // Load orders on initial mount and when switching to 'orders' tab
  useEffect(() => {
    fetchPastOrders();
  }, [fetchPastOrders]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchPastOrders();
    }
  }, [activeTab, fetchPastOrders]);

  // Pre-fill user data from Telegram context
  useEffect(() => {
    if (user) {
      if (user.username) setPhone(`@${user.username}`);
    }
  }, [user]);

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
      tg?.showAlert?.("Please provide delivery address/table and phone number.");
      return;
    }

    triggerHaptic("heavy");
    setIsSubmitting(true);

    try {
      const payload = {
        storeSlug: activeSlug,
        tgUserId: user?.id?.toString(),
        note: orderNote,
        customer: {
          name: [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Telegram Customer",
          phone,
          address,
          note: orderNote,
        },
        items: cart.map((item) => ({
          id: item.id,
          productId: item.id,
          code: item.code,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/tma/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok && result.status !== false) {
        const ref = result.referenceNo || result.data?.referenceNo || "TMA-ORDER";
        tg?.showAlert?.(`Order placed successfully!\nReference: #${ref}\nDispatched to shop group!`);
        setCart([]);
        setOrderNote("");
        // Refresh orders & switch to My Orders view to view placed order
        fetchPastOrders();
        setActiveTab("orders");
      } else {
        tg?.showAlert?.(`Error placing order: ${result.error || result.message || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      tg?.showAlert?.("Network error. Could not complete order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 space-y-4 animate-pulse">
        <div className="h-20 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-12 bg-slate-900 rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-40 bg-slate-900 rounded-xl" />
          <div className="h-40 bg-slate-900 rounded-xl" />
        </div>
      </div>
    );
  }

  const grandTotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 pb-48 font-sans">
      {/* Store Header */}
      <div className="flex items-center justify-between p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-3.5 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-3">
          {data.store?.logoUrl ? (
            <img
              src={data.store.logoUrl}
              alt="Store Logo"
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-lg">
              🏪
            </div>
          )}
          <div>
            <h1 className="text-base font-bold text-white leading-tight">{data.store?.name}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>@{user?.username || user?.first_name || "Guest Customer"}</span>
            </p>
          </div>
        </div>

        <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 font-semibold">
          Telegram Mini App
        </span>
      </div>

      {/* View Toggle Button: 'Catalog' vs 'My Orders' */}
      <div className="flex bg-slate-900/95 border border-slate-800 rounded-xl p-1 mb-4 shadow-sm">
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            setActiveTab("catalog");
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "catalog"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>🛍️ Catalog</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            setActiveTab("orders");
            fetchPastOrders();
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "orders"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>📋 My Orders</span>
          {pastOrders.length > 0 && (
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                activeTab === "orders"
                  ? "bg-white text-blue-700"
                  : "bg-blue-900/80 text-blue-300 border border-blue-700"
              }`}
            >
              {pastOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* ----------------- VIEW 1: CATALOG ----------------- */}
      {activeTab === "catalog" && (
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu Catalog</h2>
            <span className="text-xs text-slate-500">{data.products?.length || 0} items</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {data.products?.map((p: any) => (
              <div
                key={p.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col justify-between transition-colors shadow-sm"
              >
                <div>
                  {p.image && (
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-800">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <p className="text-[11px] font-semibold text-blue-400">{p.category_name || "General"}</p>
                  <h3 className="font-bold text-sm text-slate-100 line-clamp-1 mt-0.5">{p.name}</h3>
                  {p.details && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {p.details}
                    </p>
                  )}
                  <p className="text-emerald-400 font-mono font-bold text-sm mt-1.5">
                    ${Number(p.price).toFixed(2)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(p)}
                  className="w-full mt-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 py-2 text-xs font-bold rounded-lg transition-transform text-white shadow-sm flex items-center justify-center gap-1"
                >
                  <span>+ Add to Cart</span>
                </button>
              </div>
            ))}
          </div>

          {/* Sticky Bottom Cart & Checkout Bar */}
          {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/98 border-t border-slate-800 backdrop-blur-xl space-y-2.5 z-50 shadow-2xl">
              <div className="flex justify-between items-center text-sm font-bold border-b border-slate-800 pb-2">
                <span className="text-slate-300">
                  Cart: {cart.reduce((a, b) => a + b.quantity, 0)} items
                </span>
                <span className="text-emerald-400 font-mono text-base font-extrabold">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Phone Number / Handle"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Table No / Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <input
                type="text"
                placeholder="Optional Note: (e.g., Less ice, extra napkins)"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 active:scale-95 font-bold rounded-xl text-sm transition-transform text-white shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Dispatching to Shop Group..." : `Place Order ($${grandTotal.toFixed(2)})`}</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* ----------------- VIEW 2: MY ORDERS ----------------- */}
      {activeTab === "orders" && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Past Orders</h2>
              <p className="text-[11px] text-slate-500">Fetched from /api/tma/orders</p>
            </div>
            <button
              type="button"
              onClick={fetchPastOrders}
              disabled={loadingOrders}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center gap-1"
            >
              <span>{loadingOrders ? "Refreshing..." : "🔄 Refresh"}</span>
            </button>
          </div>

          {/* Loading indicator */}
          {loadingOrders && (
            <div className="space-y-3 animate-pulse">
              <div className="h-28 bg-slate-900 border border-slate-800 rounded-xl" />
              <div className="h-28 bg-slate-900 border border-slate-800 rounded-xl" />
            </div>
          )}

          {/* Error Message */}
          {ordersError && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300">
              Error fetching past orders: {ordersError}
            </div>
          )}

          {/* Empty Orders State */}
          {!loadingOrders && pastOrders.length === 0 && (
            <div className="text-center p-8 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-2xl">
                🧾
              </div>
              <h3 className="font-bold text-sm text-slate-200">No Past Orders Found</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                You haven&apos;t placed any orders in this store yet. Select items from the catalog to place your first order!
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("catalog")}
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Browse Catalog
              </button>
            </div>
          )}

          {/* Past Orders List */}
          {!loadingOrders &&
            pastOrders.map((order: any, idx: number) => {
              const orderDate = order.createdAt
                ? new Date(order.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                : "Recent Order";

              const isCompleted = order.status === "completed";
              const isConfirmed = order.status === "confirmed";
              const isPending = order.status === "pending" || !order.status;

              return (
                <div
                  key={order.id || order.referenceNo || idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md"
                >
                  {/* Order Top Bar: Ref, Status, and Date */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div>
                      <div className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1.5">
                        <span>#{order.referenceNo || `ORD-${order.id}`}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{orderDate}</div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCompleted
                          ? "bg-emerald-950 border border-emerald-700/60 text-emerald-400"
                          : isConfirmed
                          ? "bg-blue-950 border border-blue-700/60 text-blue-400"
                          : "bg-amber-950 border border-amber-700/60 text-amber-400"
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>

                  {/* Customer / Location Info */}
                  <div className="text-xs text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Customer:</span>
                      <span className="font-semibold text-white">
                        {order.customer?.name || "Telegram Guest"}
                      </span>
                    </div>
                    {order.customer?.address && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Location / Table:</span>
                        <span className="font-semibold text-slate-200">{order.customer.address}</span>
                      </div>
                    )}
                    {order.customer?.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Contact:</span>
                        <span className="text-slate-300 font-mono">{order.customer.phone}</span>
                      </div>
                    )}
                    {order.customer?.note && (
                      <div className="flex items-center justify-between text-amber-300/90 text-[11px] pt-0.5">
                        <span className="text-slate-400">Note:</span>
                        <span>{order.customer.note}</span>
                      </div>
                    )}
                  </div>

                  {/* Ordered Items List */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Items Ordered ({order.items?.length || 0})
                    </div>
                    <div className="space-y-1 divide-y divide-slate-800/50">
                      {order.items?.map((item: any, iIdx: number) => (
                        <div
                          key={item.id || iIdx}
                          className="flex items-center justify-between text-xs py-1"
                        >
                          <span className="text-slate-200">
                            <span className="font-bold text-blue-400 mr-1.5">{item.quantity}x</span>
                            {item.name || item.product_name}
                          </span>
                          <span className="font-mono font-semibold text-slate-300">
                            ${Number(item.subtotal || item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total & Dispatch Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                      <span>⚡ Dispatched to Shop Group</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 mr-2">Grand Total:</span>
                      <span className="text-base font-extrabold font-mono text-emerald-400">
                        ${Number(order.grandTotal || order.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </section>
      )}
    </div>
  );
}
