import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { QRCode } from 'antd';
import { useTelegram } from '../hooks/useTelegram';
import { useStoreCart } from '../hooks/useStoreCart';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function EMenuPage() {
  const { storeSlug, billerId } = useParams();
  const identifier = storeSlug || billerId || 'sbc-store';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tg, user, initData, triggerHaptic } = useTelegram();
  const { cart, addItem, removeItem, clearCart, total, itemCount } = useStoreCart(identifier);

  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [allStores, setAllStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Checkout modal & state
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState('dine_in'); // 'dine_in' or 'delivery'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('Table #03');
  const [orderNote, setOrderNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // View toggle: 'catalog' vs 'orders'
  const [activeView, setActiveView] = useState('catalog');
  const [pastOrders, setPastOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch past orders from /api/tma/orders
  const fetchPastOrders = () => {
    setLoadingOrders(true);
    axios.get(`${API_BASE}/api/tma/orders?storeSlug=${encodeURIComponent(identifier)}`)
      .then((res) => {
        const list = res.data?.orders || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setPastOrders(list);
      })
      .catch((err) => console.warn('Past orders fetch notice:', err.message))
      .finally(() => setLoadingOrders(false));
  };

  useEffect(() => {
    fetchPastOrders();
  }, [identifier]);

  useEffect(() => {
    if (activeView === 'orders') {
      fetchPastOrders();
    }
  }, [activeView]);

  // Load stores list
  useEffect(() => {
    axios.get(`${API_BASE}/api/v1/emenu/stores`)
      .then((res) => {
        if (res.data?.status && Array.isArray(res.data.data)) {
          setAllStores(res.data.data);
        }
      })
      .catch((err) => console.warn('Stores list fetch notice:', err.message));
  }, []);

  // Pre-fill user data from Telegram if available
  useEffect(() => {
    if (user) {
      const tgFullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
      if (tgFullName) setCustomerName(tgFullName);
      if (user.username) setCustomerPhone(`@${user.username}`);
    } else {
      setCustomerName((prev) => prev || 'Guest Customer');
    }
  }, [user]);

  // Load current store menu
  useEffect(() => {
    setLoading(true);
    const url = `${API_BASE}/api/v1/emenu/store/${identifier}/menu`;
    axios.get(url)
      .then((res) => {
        if (res.data && res.data.status) {
          setStore(res.data.store);
          setCategories(res.data.data?.categories || []);
          setProducts(res.data.data?.products || []);
          setActiveCategory('all');
        } else {
          navigate('/shop/not-found', { replace: true });
        }
      })
      .catch(() => {
        navigate('/shop/not-found', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [identifier, navigate]);

  const handleSwitchStore = (newSlug) => {
    if (!newSlug || newSlug === identifier) return;
    triggerHaptic('light');
    navigate(`/shop/${newSlug}`);
  };

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');
    addItem(product);
  };

  const handleRemoveFromCart = (productId, e) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');
    removeItem(productId);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return;

    if (!customerName.trim()) {
      alert('Please enter your name.');
      return;
    }

    triggerHaptic('heavy');
    setIsSubmitting(true);

    const payload = {
      cartItems: cart.map((i) => ({
        id: i.id,
        code: i.code,
        name: i.name,
        price: Number(i.price),
        quantity: i.quantity,
        subtotal: Number(i.price) * i.quantity
      })),
      customerData: {
        name: customerName,
        phone: customerPhone,
        address: orderType === 'dine_in' ? `Dine-In (${customerAddress})` : `Takeaway/Delivery (${customerAddress})`,
        orderType,
        note: orderNote,
        telegramId: user?.id || null,
        telegramUsername: user?.username || null
      }
    };

    try {
      const res = await axios.post(
        `${API_BASE}/api/v1/emenu/store/${identifier}/checkout`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-telegram-init-data': initData || ''
          }
        }
      );

      if (res.data?.status) {
        const orderData = res.data.data;
        setConfirmedOrder({
          ...orderData,
          customer: payload.customerData,
          items: cart,
          total: total
        });
        clearCart();
        setCartOpen(false);

        if (tg) {
          tg.HapticFeedback?.notificationOccurred('success');
        }
      } else {
        alert(res.data?.message || 'Order submission failed.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err.response?.data?.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter products by category and search
  const filteredProducts = products.filter((prod) => {
    const matchCat = activeCategory === 'all' || Number(prod.category_id) === Number(activeCategory);
    const matchSearch = !searchQuery.trim() ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.details && prod.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const currency = store?.currency_symbol || '$';
  const themeColor = store?.theme_color || '#0d9488';

  if (loading) {
    return (
      <div className="flex-1 max-w-lg mx-auto w-full p-4 space-y-4">
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-52 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          <div className="h-52 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 max-w-lg mx-auto w-full pb-28 min-h-screen bg-slate-50 dark:bg-slate-900 shadow-sm relative">
      {/* Top Multi-Shop Selector Bar */}
      <div className="bg-slate-900 text-white px-3 py-2 flex items-center justify-between text-xs sticky top-0 z-30 shadow-md">
        <div className="flex items-center space-x-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Telegram Mini App E-Menu</span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-slate-400 text-[11px]">Shop:</label>
          <select
            value={identifier}
            onChange={(e) => handleSwitchStore(e.target.value)}
            className="bg-slate-800 text-white text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
          >
            {allStores.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Store Banner & Brand Header */}
      <div className="relative">
        <div className="h-36 sm:h-44 w-full overflow-hidden bg-slate-800 relative">
          <img
            src={store?.banner || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=400&fit=crop'}
            alt={store?.name}
            className="w-full h-full object-cover opacity-85 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Store Profile Floating Card */}
        <div className="px-4 -mt-10 relative z-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-700/60 flex items-start space-x-3.5">
            <img
              src={store?.logo || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop'}
              alt={store?.name}
              className="w-16 h-16 rounded-xl object-cover shadow-md border-2 border-white dark:border-slate-700 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {store?.name || store?.company}
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 flex items-center space-x-1">
                  <span>★</span>
                  <span>{store?.rating || '4.9'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {store?.tagline || store?.address}
              </p>
              <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  Open Now
                </span>
                <span>•</span>
                <span className="truncate">{store?.hours || '07:00 AM - 08:30 PM'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telegram Group Broadcast Notice Pill */}
      <div className="px-4 mt-3">
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 rounded-xl px-3 py-2 flex items-center space-x-2 text-xs text-blue-800 dark:text-blue-300">
          <span className="text-base">✈️</span>
          <div className="flex-1 min-w-0">
            <span className="font-semibold">Auto Telegram Dispatch:</span>
            <span className="opacity-90 ml-1 truncate block sm:inline">
              Orders send directly to {store?.telegram_group_name || 'Shop Staff Group'}
            </span>
          </div>
        </div>
      </div>

      {/* View Toggle: 'Catalog' vs 'My Orders' */}
      <div className="px-4 mt-3">
        <div className="flex bg-slate-200/80 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveView('catalog');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeView === 'catalog'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🛍️ Catalog</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveView('orders');
              fetchPastOrders();
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeView === 'orders'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>📋 My Orders</span>
            {pastOrders.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/80 dark:text-teal-200">
                {pastOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeView === 'catalog' ? (
        <>
          {/* Search Input Bar */}
      <div className="px-4 mt-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search items, ingredients, specials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition"
          />
          <span className="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-0.5"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="sticky top-[37px] z-20 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-200/60 dark:border-slate-800 overflow-x-auto no-scrollbar flex space-x-2">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveCategory('all');
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white dark:bg-teal-500 dark:text-slate-950 scale-105'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              triggerHaptic('light');
              setActiveCategory(cat.id);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white dark:bg-teal-500 dark:text-slate-950 scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.icon ? `${cat.icon} ` : ''}{cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="px-4 pt-3 flex-1">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mt-2 p-6">
            <span className="text-4xl">🍽️</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">No matching products found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try another category or search query.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-teal-600 dark:text-teal-400 font-semibold underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((prod) => {
              const inCart = cart.find((i) => i.id === prod.id);
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 p-2.5 flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer relative group"
                >
                  {/* Badge */}
                  {prod.badge && (
                    <span className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                      {prod.badge}
                    </span>
                  )}

                  {/* Product Image */}
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700/50 mb-2 relative">
                    <img
                      src={prod.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop'}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                        {prod.details || 'Freshly prepared upon order.'}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between pt-1">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {currency}{Number(prod.price).toFixed(2)}
                      </span>

                      {/* Add / Stepper buttons */}
                      {inCart ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 rounded-lg p-0.5"
                        >
                          <button
                            onClick={(e) => handleRemoveFromCart(prod.id, e)}
                            className="w-6 h-6 flex items-center justify-center font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-200/50 rounded active:scale-95 text-xs"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-teal-800 dark:text-teal-200 w-5 text-center">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={(e) => handleAddToCart(prod, e)}
                            className="w-6 h-6 flex items-center justify-center font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-200/50 rounded active:scale-95 text-xs"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleAddToCart(prod, e)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white transition active:scale-95 shadow-sm"
                          style={{ backgroundColor: themeColor }}
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
        </>
      ) : (
        /* My Orders View */
        <div className="px-4 pt-3 flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Past Orders
              </h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Fetched from /api/tma/orders
              </p>
            </div>
            <button
              onClick={fetchPastOrders}
              disabled={loadingOrders}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <span>{loadingOrders ? 'Refreshing...' : '🔄 Refresh'}</span>
            </button>
          </div>

          {loadingOrders && (
            <div className="space-y-3 animate-pulse">
              <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>
          )}

          {!loadingOrders && pastOrders.length === 0 && (
            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 mt-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl">
                🧾
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">No Past Orders Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                You haven&apos;t placed any orders in this store yet. Select items from the catalog to place your first order!
              </p>
              <button
                type="button"
                onClick={() => setActiveView('catalog')}
                className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Browse Catalog
              </button>
            </div>
          )}

          {!loadingOrders &&
            pastOrders.map((order, idx) => {
              const orderDate = order.createdAt
                ? new Date(order.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })
                : 'Recent Order';

              const isCompleted = order.status === 'completed';
              const isConfirmed = order.status === 'confirmed';

              return (
                <div
                  key={order.id || order.referenceNo || idx}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2.5">
                    <div>
                      <div className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                        #{order.referenceNo || `ORD-${order.id}`}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{orderDate}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : isConfirmed
                          ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Customer:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {order.customer?.name || 'Telegram Guest'}
                      </span>
                    </div>
                    {order.customer?.address && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Location / Table:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {order.customer.address}
                        </span>
                      </div>
                    )}
                    {order.customer?.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Contact:</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {order.customer.phone}
                        </span>
                      </div>
                    )}
                    {order.customer?.note && (
                      <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-[11px] pt-0.5">
                        <span className="text-slate-400">Note:</span>
                        <span>{order.customer.note}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Items Ordered ({order.items?.length || 0})
                    </div>
                    <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700/40">
                      {order.items?.map((item, iIdx) => (
                        <div key={item.id || iIdx} className="flex items-center justify-between text-xs py-1">
                          <span className="text-slate-800 dark:text-slate-200">
                            <span className="font-bold text-teal-600 dark:text-teal-400 mr-1.5">
                              {item.quantity}x
                            </span>
                            {item.name || item.product_name}
                          </span>
                          <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">
                            ${Number(item.subtotal || item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>⚡ Dispatched to Shop Group</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 mr-2">Grand Total:</span>
                      <span className="text-base font-extrabold font-mono text-teal-600 dark:text-teal-400">
                        ${Number(order.grandTotal || order.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Floating Cart Bottom Bar */}
      {itemCount > 0 && !cartOpen && !confirmedOrder && (
        <div className="fixed bottom-3 left-0 right-0 px-4 max-w-lg mx-auto z-30 pointer-events-none">
          <button
            onClick={() => {
              triggerHaptic('medium');
              setCartOpen(true);
            }}
            className="w-full h-13 text-white rounded-2xl shadow-xl flex items-center justify-between px-4 py-3 pointer-events-auto active:scale-[0.98] transition-all transform animate-bounce-subtle"
            style={{ backgroundColor: themeColor }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold bg-black/25 px-2.5 py-1 rounded-full">
                {itemCount} items
              </span>
              <span className="font-bold text-sm tracking-wide">View Order</span>
            </div>
            <div className="flex items-center space-x-1.5 font-extrabold text-sm">
              <span>{currency}{total.toFixed(2)}</span>
              <span>→</span>
            </div>
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] w-full max-w-md overflow-y-auto flex flex-col p-5 shadow-2xl">
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                {store?.name}
              </span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 my-2">
              <img
                src={selectedProduct.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop'}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {selectedProduct.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {selectedProduct.details || 'Artisan item prepared freshly with high-grade ingredients.'}
            </p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                {currency}{Number(selectedProduct.price).toFixed(2)}
              </span>
              <button
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition"
                style={{ backgroundColor: themeColor }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart & Checkout Sheet */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl max-h-[92vh] flex flex-col w-full max-w-lg mx-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <span>🛍️ Order Basket</span>
                  <span className="text-xs font-semibold text-slate-400">({itemCount} items)</span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Store: {store?.name}
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Items & Customer Form */}
            <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Order Type Toggle */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 block">
                  Service Option
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('dine_in');
                      setCustomerAddress('Table #03');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      orderType === 'dine_in'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    🍽️ Dine-In / Table
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('delivery');
                      setCustomerAddress('Pickup Counter');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      orderType === 'delivery'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    📦 Takeaway / Delivery
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                  Selected Items
                </label>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-xs"
                  >
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {currency}{Number(item.price).toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold w-14 text-right">
                        {currency}{(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Inputs */}
              <div className="space-y-2.5 pt-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                  Customer & Delivery Details
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full mt-0.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400">Phone / Telegram *</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+855 ... or @username"
                      className="w-full mt-0.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400">
                    {orderType === 'dine_in' ? 'Table Number *' : 'Delivery Address / Pickup Instructions *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder={orderType === 'dine_in' ? 'e.g. Table 4' : 'e.g. 123 Central Ave, Apt 4B'}
                    className="w-full mt-0.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400">Special Instructions / Notes</label>
                  <textarea
                    rows={2}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="e.g. Less sugar, extra napkins, oat milk..."
                    className="w-full mt-0.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Shop Telegram Group Notification Banner */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-900 dark:text-emerald-300">
                <div className="font-bold flex items-center space-x-1.5">
                  <span>📢</span>
                  <span>Instant Telegram Shop Notification</span>
                </div>
                <p className="text-[11px] opacity-85 mt-1 leading-snug">
                  Once confirmed, this order is transmitted to <b>{store?.telegram_group_name || 'the shop orders group'}</b> for kitchen preparation.
                </p>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Grand Total</span>
                  <span>{currency}{total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg active:scale-[0.98] transition disabled:opacity-60"
                  style={{ backgroundColor: themeColor }}
                >
                  {isSubmitting ? (
                    <span>Submitting & Dispatching to Telegram...</span>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Send Order to Shop Telegram Group ({currency}{total.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmed Receipt Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-5 shadow-2xl border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white flex flex-col space-y-3.5">
            <div className="text-center pt-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mx-auto shadow-inner">
                ✓
              </div>
              <h2 className="text-base font-extrabold mt-2.5">Order Placed Successfully!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ref No: <span className="font-mono font-bold text-slate-900 dark:text-white">{confirmedOrder.referenceNo}</span>
              </p>
            </div>

            {/* Telegram Dispatch Confirmation Badge */}
            <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-2xl p-3 text-xs">
              <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300 font-bold">
                <span>✈️</span>
                <span>Sent to Shop Telegram Group</span>
              </div>
              <p className="text-[11px] text-blue-700 dark:text-blue-300/90 mt-1">
                Target: <b>{confirmedOrder.dispatchInfo?.groupName || store?.telegram_group_name || 'Staff Group'}</b>
              </p>
              <div className="mt-2 bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg text-[10px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-28 overflow-y-auto">
                {confirmedOrder.dispatchInfo?.messageText?.replace(/<[^>]*>?/gm, '') || `New Order #${confirmedOrder.referenceNo} - ${currency}${confirmedOrder.total?.toFixed(2)}`}
              </div>
            </div>

            {/* Summary Details */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-3 text-xs space-y-1.5 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Shop:</span>
                <span className="font-semibold">{store?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Customer:</span>
                <span className="font-semibold">{confirmedOrder.customer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Location:</span>
                <span className="font-semibold">{confirmedOrder.customer?.address}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-600 font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{currency}{confirmedOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setConfirmedOrder(null)}
                className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs active:scale-95 transition"
              >
                Back to Menu
              </button>
              {tg && (
                <button
                  onClick={() => tg.close()}
                  className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
                >
                  Close Mini App
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
