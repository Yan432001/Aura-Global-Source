import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import {
  DownOutlined,
  CloseOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckOutlined,
  ShopOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useTelegram } from '../hooks/useTelegram';
import simpleData from '../../../data/simpleData';

// Theme configuration matched to each shop brand
const SHOP_THEMES = {
  'sbc-store': {
    name: 'Aura Specialty Coffee',
    bg: '#0C0704',
    cardBg: '#18100A',
    cardBorder: 'border-white/10',
    accent: '#EA580C', // Vibrant Orange matched to image.png
    accentHover: '#C2410C',
    accentBtn: 'bg-[#EA580C] hover:bg-[#C2410C] text-white',
    pillActive: 'bg-[#EA580C] text-white border-2 border-white shadow-md',
    pillInactive: 'bg-[#1E130C] text-stone-300 border border-white/5',
    priceText: 'text-amber-400',
    badgeText: 'text-amber-400'
  },
  'aura-lounge': {
    name: 'Aura Botanical Lounge & Matcha',
    bg: '#04170E',
    cardBg: '#092518',
    cardBorder: 'border-emerald-900/40',
    accent: '#10B981', // Botanical Matcha Jade
    accentHover: '#059669',
    accentBtn: 'bg-[#10B981] hover:bg-[#059669] text-slate-950 font-black',
    pillActive: 'bg-[#10B981] text-slate-950 border-2 border-white shadow-md font-black',
    pillInactive: 'bg-[#0E3524] text-emerald-200 border border-emerald-800/30',
    priceText: 'text-emerald-400',
    badgeText: 'text-emerald-300'
  },
  'aura-bistro': {
    name: 'Aura French Bistro',
    bg: '#080C14',
    cardBg: '#101726',
    cardBorder: 'border-amber-500/20',
    accent: '#F59E0B', // Luxury Gold
    accentHover: '#D97706',
    accentBtn: 'bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-black',
    pillActive: 'bg-[#F59E0B] text-slate-950 border-2 border-white shadow-md font-black',
    pillInactive: 'bg-[#182238] text-amber-200 border border-amber-500/10',
    priceText: 'text-amber-400',
    badgeText: 'text-amber-300'
  },
  'aura-bakery': {
    name: 'Aura Artisan Bakery',
    bg: '#18040E',
    cardBg: '#2A091A',
    cardBorder: 'border-rose-900/30',
    accent: '#F43F5E', // French Rose & Berry
    accentHover: '#E11D48',
    accentBtn: 'bg-[#F43F5E] hover:bg-[#E11D48] text-white font-black',
    pillActive: 'bg-[#F43F5E] text-white border-2 border-white shadow-md',
    pillInactive: 'bg-[#3A0F25] text-rose-200 border border-rose-800/20',
    priceText: 'text-rose-400',
    badgeText: 'text-rose-300'
  }
};

export default function EMenuPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tg, triggerHaptic } = useTelegram();

  // Extract active store slug
  const currentSlug = useMemo(() => {
    if (params.storeSlug) return params.storeSlug;
    const parts = location.pathname.split('/');
    if (parts[1] === 'shop' && parts[2] && parts[2] !== 'not-found') {
      return parts[2];
    }
    return 'sbc-store';
  }, [params.storeSlug, location.pathname]);

  const activeTheme = useMemo(() => {
    return SHOP_THEMES[currentSlug] || SHOP_THEMES['sbc-store'];
  }, [currentSlug]);

  // Ensure Telegram WebApp BackButton is hidden
  useEffect(() => {
    try {
      tg?.BackButton?.hide?.();
    } catch (_) {}
  }, [tg]);

  // Stores & Catalog State
  const [currentStore, setCurrentStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_emenu_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Table & Dining Context (defaults to "Table #06 • delivery" as shown in screenshot)
  const [diningMode, setDiningMode] = useState('delivery');
  const [customerLocation, setCustomerLocation] = useState('Table #06');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Telegram Customer');
  const [customerPhone, setCustomerPhone] = useState('+855 12 345 678');
  const [customerNote, setCustomerNote] = useState('');
  const [hasClaimedCoupon, setHasClaimedCoupon] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Customization Modal (`Opt`)
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedMilk, setSelectedMilk] = useState('Standard');
  const [selectedIce, setSelectedIce] = useState('Normal Ice');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customizeQty, setCustomizeQty] = useState(1);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('aura_emenu_cart_v2', JSON.stringify(cart));
    } catch (_) {}
  }, [cart]);

  // Fetch Store Details & Products
  const fetchStoreData = useCallback(async (slug) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/tma/store/${slug}`);
      if (res.data?.status && res.data.store) {
        setCurrentStore(res.data.store);
        setCategories(res.data.categories || []);
        setProducts(res.data.products || []);
      } else {
        // Fallback to local catalog
        const foundStore = (simpleData.stores || []).find((s) => s.slug === slug) || simpleData.stores[0];
        const storeProducts = (simpleData.products || []).filter((p) => Number(p.biller_id) === Number(foundStore?.id || 1));
        const catIds = new Set(storeProducts.map((p) => p.category_id));
        const storeCats = (simpleData.categories || []).filter((c) => catIds.has(c.id));

        setCurrentStore(foundStore);
        setCategories(storeCats);
        setProducts(storeProducts);
      }
    } catch (err) {
      console.warn(`Fallback to local catalog for ${slug}:`, err);
      const foundStore = (simpleData.stores || []).find((s) => s.slug === slug) || simpleData.stores[0];
      const storeProducts = (simpleData.products || []).filter((p) => Number(p.biller_id) === Number(foundStore?.id || 1));
      const catIds = new Set(storeProducts.map((p) => p.category_id));
      const storeCats = (simpleData.categories || []).filter((c) => catIds.has(c.id));

      setCurrentStore(foundStore);
      setCategories(storeCats);
      setProducts(storeProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoreData(currentSlug);
  }, [currentSlug, fetchStoreData]);

  // Handle Direct Product Deep Link (?item=1 or startapp=item_1)
  useEffect(() => {
    const paramsQuery = new URLSearchParams(location.search);
    const targetItemId = paramsQuery.get('item');
    if (targetItemId && products.length > 0) {
      const found = products.find((p) => String(p.id) === String(targetItemId));
      if (found) {
        setCustomizingProduct(found);
        setSelectedSize('Regular');
        setSelectedMilk('Fresh Cow Milk');
        setSelectedIce('Normal Ice');
        setCustomizeQty(1);

        // Smooth scroll to product
        setTimeout(() => {
          const el = document.getElementById(`product-${targetItemId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [location.search, products]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === null) return products;
    return products.filter((p) => p.category_id === selectedCategory);
  }, [products, selectedCategory]);

  // Open Customization Modal
  const openCustomizer = (product) => {
    triggerHaptic?.('light');
    setCustomizingProduct(product);
    setSelectedSize('Regular');
    setSelectedMilk('Fresh Cow Milk');
    setSelectedIce('Normal Ice');
    setSpecialInstructions('');
    setCustomizeQty(1);
  };

  // Quick Direct Add to Cart
  const handleDirectAddToCart = (product) => {
    triggerHaptic?.('medium');
    const existingIdx = cart.findIndex((item) => item.id === product.id && (!item.options || Object.keys(item.options).length === 0));
    if (existingIdx >= 0) {
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      updated[existingIdx].subtotal = Number(
        (updated[existingIdx].quantity * updated[existingIdx].price).toFixed(2)
      );
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          code: product.code,
          name: product.name,
          image: product.image,
          price: Number(Number(product.price).toFixed(2)),
          quantity: 1,
          subtotal: Number(Number(product.price).toFixed(2)),
          options: {}
        }
      ]);
    }
    message.success({ content: `Added ${product.name}!`, duration: 1 });
  };

  // Add Customized to Cart
  const handleAddCustomizedToCart = () => {
    if (!customizingProduct) return;
    triggerHaptic?.('success');
    let priceAdj = 0;
    if (selectedSize.includes('+$1') || selectedSize.includes('+$0.75')) priceAdj += 0.75;
    if (selectedMilk.includes('+$0.60')) priceAdj += 0.6;

    const unitPrice = Number((Number(customizingProduct.price) + priceAdj).toFixed(2));
    const subtotal = Number((unitPrice * customizeQty).toFixed(2));

    const options = {
      Size: selectedSize,
      Milk: selectedMilk,
      Ice: selectedIce,
      Note: specialInstructions.trim() || undefined
    };

    setCart([
      ...cart,
      {
        id: customizingProduct.id,
        code: customizingProduct.code,
        name: customizingProduct.name,
        image: customizingProduct.image,
        price: unitPrice,
        quantity: customizeQty,
        subtotal,
        options
      }
    ]);

    setCustomizingProduct(null);
    message.success(`Added ${customizeQty}x ${customizingProduct.name}!`);
  };

  // Cart Quantity Modifiers
  const handleUpdateCartQty = (idx, delta) => {
    triggerHaptic?.('light');
    const updated = [...cart];
    updated[idx].quantity += delta;
    if (updated[idx].quantity <= 0) {
      updated.splice(idx, 1);
    } else {
      updated[idx].subtotal = Number(
        (updated[idx].quantity * updated[idx].price).toFixed(2)
      );
    }
    setCart(updated);
  };

  // Cart Financials
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (hasClaimedCoupon) {
      return Number((cartSubtotal * 0.2).toFixed(2));
    }
    return 0;
  }, [cartSubtotal, hasClaimedCoupon]);

  const deliveryFee = diningMode === 'delivery' ? 1.5 : 0;
  const cartGrandTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee).toFixed(2);
  const totalItemCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  // Submit Order to Kitchen & Telegram
  const handleConfirmOrder = async () => {
    if (cart.length === 0 || isSubmittingOrder) return;
    setIsSubmittingOrder(true);
    triggerHaptic?.('heavy');

    const idempotencyKey = `ord_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const payload = {
      storeSlug: currentSlug,
      idempotencyKey,
      orderType: diningMode,
      couponCode: hasClaimedCoupon ? 'FIRST20' : '',
      discountAmount: cartDiscount,
      deliveryFee,
      grandTotal: parseFloat(cartGrandTotal),
      customer: {
        name: customerName || 'Telegram Guest',
        username: tg?.initDataUnsafe?.user?.username || '@telegram_user',
        phone: customerPhone || '+855 12 345 678',
        address: `${customerLocation} (${diningMode.toUpperCase()})`,
        note: customerNote || `Telegram Mini App Order`,
        telegramId: tg?.initDataUnsafe?.user?.id || 9841203
      },
      items: cart.map((it) => ({
        id: it.id,
        productId: it.id,
        code: it.code,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        subtotal: it.subtotal,
        options: it.options
      }))
    };

    try {
      const res = await axios.post(`/api/tma/shop/${currentSlug}/orders`, payload);
      if (res.data?.status && res.data.data) {
        setCart([]);
        setIsCartOpen(false);
        message.success(`Order placed! Ref: ${res.data.data.referenceNo}`);
        tg?.showPopup?.({
          title: 'Order Confirmed! 🎉',
          message: `Your order #${res.data.data.referenceNo} has been sent to the kitchen for ${currentStore?.name}.`,
          buttons: [{ type: 'ok' }]
        });
      } else {
        message.error(`Order failed: ${res.data?.message || 'Server error'}`);
      }
    } catch (err) {
      message.error(err.response?.data?.message || err.message || 'Error submitting order');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const storeOptions = [
    { slug: 'sbc-store', name: 'Aura Specialty Coffee', emoji: '☕' },
    { slug: 'aura-lounge', name: 'Botanical Lounge & Matcha', emoji: '🍵' },
    { slug: 'aura-bistro', name: 'Aura French Bistro', emoji: '🍽️' },
    { slug: 'aura-bakery', name: 'Aura Artisan Bakery', emoji: '🥐' }
  ];

  return (
    <div
      style={{ backgroundColor: activeTheme.bg }}
      className="w-full max-w-[480px] min-h-screen text-white font-sans flex flex-col relative pb-28 shadow-2xl selection:bg-orange-500 selection:text-white"
    >
      {/* ======================================================== */}
      {/* 1. TOP HEADER (EXACTLY MATCHING IMAGE.PNG)              */}
      {/* ======================================================== */}
      <header
        style={{ backgroundColor: activeTheme.bg }}
        className="px-4 py-3 flex items-center justify-between sticky top-0 z-30 border-b border-white/5 backdrop-blur-md"
      >
        {/* Left: Avatar + Title + "Table #06 • delivery" */}
        <div
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-3 cursor-pointer select-none active:opacity-80 transition"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0 bg-stone-900 shadow-md">
            <img
              src={
                currentStore?.logo ||
                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=150&q=80'
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-tight flex items-center gap-1">
              <span>{currentStore?.name || activeTheme.name}</span>
            </h1>
            <p className={`text-xs font-semibold ${activeTheme.badgeText} flex items-center gap-1.5 pt-0.5`}>
              <span>{customerLocation} • {diningMode}</span>
              <DownOutlined style={{ fontSize: 9 }} />
            </p>
          </div>
        </div>

        {/* Right: Orange Bag Pill Badge: 🛍️ 0 */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/30 active:scale-95 transition cursor-pointer"
        >
          <span className="text-sm">🛍️</span>
          <span className="font-mono">{totalItemCount}</span>
        </button>
      </header>

      {/* ======================================================== */}
      {/* 2. CATEGORY HORIZONTAL SCROLL BAR (MATCHING IMAGE.PNG)  */}
      {/* ======================================================== */}
      <div
        style={{ backgroundColor: activeTheme.bg }}
        className="px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none sticky top-[57px] z-20 border-b border-white/5 backdrop-blur-md"
      >
        {/* All Items Pill */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic?.('light');
            setSelectedCategory(null);
          }}
          className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
            selectedCategory === null
              ? activeTheme.pillActive
              : activeTheme.pillInactive
          }`}
        >
          All ({products.length})
        </button>

        {/* Category Pills */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                triggerHaptic?.('light');
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
                isSelected
                  ? activeTheme.pillActive
                  : activeTheme.pillInactive
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. 2-COLUMN PRODUCT GRID (EXACTLY MATCHING IMAGE.PNG)    */}
      {/* ======================================================== */}
      <main className="px-3 py-3 flex-1">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="animate-spin text-3xl">☕</div>
            <p className="text-xs text-stone-400 font-semibold">Loading menu...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-stone-400 text-xs space-y-2">
            <p className="font-bold text-stone-300">No items found</p>
            <p>Select another category above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                id={`product-${prod.id}`}
                style={{ backgroundColor: activeTheme.cardBg }}
                className={`rounded-2xl border ${activeTheme.cardBorder} p-2.5 flex flex-col justify-between space-y-2.5 transition shadow-xs`}
              >
                {/* Product Image with Price Badge */}
                <div className="relative h-28 w-full rounded-xl overflow-hidden bg-black/40">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Floating Price Tag Badge (Bottom Right) */}
                  <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/90 backdrop-blur-xs font-mono font-black text-amber-400 text-[11px] shadow">
                    ${Number(prod.price).toFixed(2)}
                  </div>
                </div>

                {/* Title & 1-Line Description */}
                <div className="space-y-0.5">
                  <h3 className="font-bold text-white text-xs leading-snug line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-stone-400 line-clamp-1 leading-normal">
                    {prod.details || 'Handcrafted fresh daily.'}
                  </p>
                </div>

                {/* Card Bottom Buttons: "Opt" + "+ Add" */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openCustomizer(prod)}
                    className="py-1.5 px-2 rounded-xl bg-[#2A1D15] hover:bg-[#38271D] text-stone-200 text-xs font-bold text-center active:scale-95 transition cursor-pointer"
                  >
                    Opt
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDirectAddToCart(prod)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-black text-center shadow-md active:scale-95 transition cursor-pointer ${activeTheme.accentBtn}`}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* 4. STICKY BOTTOM BAR (EXACTLY MATCHING IMAGE.PNG)        */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pointer-events-none flex justify-center">
        <div className="w-full max-w-[480px] pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              triggerHaptic?.('medium');
              setIsCartOpen(true);
            }}
            style={{ backgroundColor: activeTheme.accent }}
            className="w-full py-3.5 px-5 rounded-2xl text-white font-extrabold text-sm flex items-center justify-between shadow-2xl active:scale-98 transition shadow-orange-600/40 cursor-pointer"
          >
            <span>View Basket ({totalItemCount})</span>
            <span className="font-mono text-base font-black">${cartGrandTotal}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. LOCATION & BRANCH PICKER MODAL                        */}
      {/* ======================================================== */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-xs p-3">
          <div
            style={{ backgroundColor: activeTheme.cardBg }}
            className="w-full max-w-[460px] rounded-3xl p-5 space-y-4 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">Dining Location &amp; Branch</h3>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <CloseOutlined />
              </button>
            </div>

            {/* Dining Mode */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Dining Option</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'dine_in', label: '🍽️ Dine-in' },
                  { id: 'takeaway', label: '🛍️ Takeaway' },
                  { id: 'delivery', label: '🛵 Delivery' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setDiningMode(mode.id)}
                    className={`py-2 px-2 rounded-xl font-bold transition text-center ${
                      diningMode === mode.id
                        ? activeTheme.accentBtn
                        : 'bg-white/5 text-stone-300 border border-white/5'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Number */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Table Number</span>
              <select
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-bold text-amber-300 outline-none"
              >
                {[
                  'Table #01',
                  'Table #02',
                  'Table #06',
                  'Table #08',
                  'Table #12 (Window)',
                  'Terrace #03',
                  'Bar Counter',
                  'VIP Lounge'
                ].map((t) => (
                  <option key={t} value={t} className="bg-stone-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Switch Store / Branch */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Switch Store / Branch</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {storeOptions.map((st) => (
                  <button
                    key={st.slug}
                    type="button"
                    onClick={() => {
                      setIsLocationModalOpen(false);
                      navigate(`/shop/${st.slug}`);
                    }}
                    className={`p-2.5 rounded-xl font-bold text-left transition flex items-center gap-2 ${
                      currentSlug === st.slug
                        ? 'bg-white/20 text-white border border-white/40 shadow-sm'
                        : 'bg-white/5 text-stone-300 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span>{st.emoji}</span>
                    <span className="truncate">{st.name.replace('Aura ', '')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Telegram Mini App Link */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Telegram Mini App Link</span>
              <div
                onClick={() => {
                  const link = `https://t.me/aura_emenu_order_bot/menu?startapp=shop_${currentSlug}`;
                  navigator.clipboard.writeText(link);
                  message.success('Copied: ' + link);
                }}
                className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs cursor-pointer hover:border-amber-400/40 transition active:scale-98"
              >
                <code className="text-amber-400 font-mono text-[11px] truncate max-w-[320px]">
                  https://t.me/aura_emenu_order_bot/menu?startapp=shop_{currentSlug}
                </code>
                <span className="text-[11px] font-bold text-stone-300 shrink-0 ml-2 bg-white/10 px-2 py-0.5 rounded-md">
                  Copy Link
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLocationModalOpen(false)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold ${activeTheme.accentBtn}`}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PRODUCT CUSTOMIZER MODAL ("Opt")                      */}
      {/* ======================================================== */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-xs p-3">
          <div
            style={{ backgroundColor: activeTheme.cardBg }}
            className="w-full max-w-[460px] rounded-3xl p-5 space-y-4 border border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-extrabold text-sm text-white">Customize Item</h3>
              <button
                type="button"
                onClick={() => setCustomizingProduct(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <CloseOutlined />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={customizingProduct.image}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover shrink-0"
              />
              <div>
                <h4 className="font-extrabold text-sm text-white">{customizingProduct.name}</h4>
                <span className={`font-mono text-xs ${activeTheme.priceText}`}>
                  Base Price: ${Number(customizingProduct.price).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Portion / Size */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-400 uppercase block">Portion / Size</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Regular (12oz)', 'Large (16oz) (+$0.75)'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-2.5 rounded-xl font-bold transition text-center ${
                      selectedSize === size
                        ? activeTheme.accentBtn
                        : 'bg-white/5 text-stone-300 border border-white/5'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Milk / Base */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-400 uppercase block">Artisan Milk</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Fresh Cow Milk', 'Oat Milk (+$0.60)', 'Almond Milk (+$0.60)', 'Skim Milk'].map((milk) => (
                  <button
                    key={milk}
                    type="button"
                    onClick={() => setSelectedMilk(milk)}
                    className={`py-2 px-2.5 rounded-xl font-bold transition text-center ${
                      selectedMilk === milk
                        ? activeTheme.accentBtn
                        : 'bg-white/5 text-stone-300 border border-white/5'
                    }`}
                  >
                    {milk}
                  </button>
                ))}
              </div>
            </div>

            {/* Ice & Temperature */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-400 uppercase block">Ice &amp; Temp</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Hot', 'Less Ice', 'Normal Ice'].map((ice) => (
                  <button
                    key={ice}
                    type="button"
                    onClick={() => setSelectedIce(ice)}
                    className={`py-2 px-2 rounded-xl font-bold transition text-center ${
                      selectedIce === ice
                        ? activeTheme.accentBtn
                        : 'bg-white/5 text-stone-300 border border-white/5'
                    }`}
                  >
                    {ice}
                  </button>
                ))}
              </div>
            </div>

            {/* Chef Notes */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-400 uppercase block">Barista / Chef Notes</label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Extra hot, no sugar..."
                className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-stone-500 outline-none"
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-stone-300">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCustomizeQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold"
                >
                  <MinusOutlined style={{ fontSize: 10 }} />
                </button>
                <span className="font-mono font-bold text-sm">{customizeQty}</span>
                <button
                  type="button"
                  onClick={() => setCustomizeQty((q) => q + 1)}
                  className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold"
                >
                  <PlusOutlined style={{ fontSize: 10 }} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddCustomizedToCart}
              className={`w-full py-3 rounded-2xl text-xs font-black shadow-lg cursor-pointer ${activeTheme.accentBtn}`}
            >
              Add Customized Item to Basket
            </button>

            {/* Direct Telegram Item Link */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  const itemLink = `https://t.me/aura_emenu_order_bot/menu?startapp=item_${customizingProduct.id}`;
                  navigator.clipboard.writeText(itemLink);
                  message.success('Copied Direct Item Link: ' + itemLink);
                }}
                className="text-[11px] text-stone-400 hover:text-amber-400 transition cursor-pointer"
              >
                🔗 Copy Direct Item Link: <span className="font-mono">item_{customizingProduct.id}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. BASKET & CHECKOUT DRAWER                              */}
      {/* ======================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-xs p-3">
          <div
            style={{ backgroundColor: activeTheme.cardBg }}
            className="w-full max-w-[460px] rounded-3xl p-5 space-y-4 border border-white/10 shadow-2xl max-h-[88vh] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <h3 className="font-extrabold text-sm text-white">Your Basket ({totalItemCount})</h3>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <CloseOutlined />
              </button>
            </div>

            {/* Cart Items */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-14 text-center space-y-2">
                  <span className="text-3xl block">🛍️</span>
                  <p className="font-bold text-xs text-stone-300">Your basket is currently empty</p>
                  <p className="text-[11px] text-stone-500">Add some artisan items to place an order.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div>
                          <h4 className="font-bold text-xs text-white leading-tight">{item.name}</h4>
                          <span className={`text-[11px] font-mono ${activeTheme.priceText}`}>
                            ${item.price.toFixed(2)}
                          </span>
                          {item.options && Object.keys(item.options).length > 0 && (
                            <p className="text-[10px] text-stone-400">
                              {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(idx, -1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs w-4 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(idx, 1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* VIP 20% Discount */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase text-amber-400">Promo Code: FIRST20</span>
                      <p className="text-xs font-bold text-white">20% VIP Order Discount</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHasClaimedCoupon(!hasClaimedCoupon);
                        message.info(hasClaimedCoupon ? 'Coupon removed' : '20% discount applied!');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                        hasClaimedCoupon ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-white/10 text-white'
                      }`}
                    >
                      {hasClaimedCoupon ? 'Claimed ✓' : 'Apply'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary & Submit */}
            {cart.length > 0 && (
              <div className="pt-3 border-t border-white/10 space-y-3 shrink-0">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount (20%):</span>
                      <span className="font-mono">-${cartDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-stone-400">
                      <span>Delivery ({customerLocation}):</span>
                      <span className="font-mono text-white">${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black pt-1.5 border-t border-white/10 text-white">
                    <span>Total Amount:</span>
                    <span className={`font-mono text-base ${activeTheme.priceText}`}>${cartGrandTotal}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSubmittingOrder}
                  onClick={handleConfirmOrder}
                  className={`w-full py-3.5 rounded-2xl text-xs font-black shadow-xl cursor-pointer ${activeTheme.accentBtn}`}
                >
                  {isSubmittingOrder ? 'Sending to Kitchen...' : `Place Order ($${cartGrandTotal})`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
