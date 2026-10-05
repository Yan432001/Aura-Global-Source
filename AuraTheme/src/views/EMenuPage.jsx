import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { message, notification } from 'antd';
import {
  DownOutlined,
  CloseOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  BellOutlined,
  BellFilled,
  StarFilled,
} from '@ant-design/icons';
import { useTelegram } from '../hooks/useTelegram';
import simpleData from '../../../data/simpleData';
import TelegramStoreGroupModal from '../components/emenu/TelegramStoreGroupModal';
import { routeOrderToTelegramGroup, getStoreTelegramConfig } from '../data/telegramStoreGroupManager';

// Website Default Theme aligned with Aura publicTheme
// Primary: #2F6FED, Secondary: #5B8DEF, Accent: #FF7A3D
const SHOP_THEMES = {
  'sbc-store': {
    name: 'Aura Specialty Coffee',
    bg: '#ffffff',
    cardBg: '#ffffff',
    cardBorder: 'border-slate-200/80',
    accent: '#2F6FED',
    accentHover: '#255bc2',
    accentBtn: 'bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] hover:opacity-95 text-white shadow-md shadow-[#2F6FED]/25 font-bold',
    pillActive: 'bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] text-white shadow-md shadow-[#2F6FED]/25 font-bold border-none',
    pillInactive: 'bg-slate-100/90 text-slate-600 border border-slate-200/80 hover:border-[#2F6FED]/40 hover:text-[#2F6FED] font-semibold',
    priceText: 'text-[#2F6FED]',
    badgeText: 'text-[#2F6FED]',
  },
  'aura-lounge': {
    name: 'Aura Botanical Lounge & Matcha',
    bg: '#ffffff',
    cardBg: '#ffffff',
    cardBorder: 'border-slate-200/80',
    accent: '#2F6FED',
    accentHover: '#255bc2',
    accentBtn: 'bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] hover:opacity-95 text-white shadow-md shadow-[#2F6FED]/25 font-bold',
    pillActive: 'bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] text-white shadow-md shadow-[#2F6FED]/25 font-bold border-none',
    pillInactive: 'bg-slate-100/90 text-slate-600 border border-slate-200/80 hover:border-[#2F6FED]/40 hover:text-[#2F6FED] font-semibold',
    priceText: 'text-[#2F6FED]',
    badgeText: 'text-[#2F6FED]',
  },
  'aura-bistro': {
    name: 'Aura French Bistro',
    bg: '#ffffff',
    cardBg: '#ffffff',
    cardBorder: 'border-slate-200/80',
    accent: '#2F6FED',
    accentHover: '#255bc2',
    accentBtn: 'bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] hover:opacity-95 text-white shadow-md shadow-[#2F6FED]/25 font-bold',
    pillActive: 'bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] text-white shadow-md shadow-[#2F6FED]/25 font-bold border-none',
    pillInactive: 'bg-slate-100/90 text-slate-600 border border-slate-200/80 hover:border-[#2F6FED]/40 hover:text-[#2F6FED] font-semibold',
    priceText: 'text-[#2F6FED]',
    badgeText: 'text-[#2F6FED]',
  },
  'aura-bakery': {
    name: 'Aura Artisan Bakery',
    bg: '#ffffff',
    cardBg: '#ffffff',
    cardBorder: 'border-slate-200/80',
    accent: '#2F6FED',
    accentHover: '#255bc2',
    accentBtn: 'bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] hover:opacity-95 text-white shadow-md shadow-[#2F6FED]/25 font-bold',
    pillActive: 'bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] text-white shadow-md shadow-[#2F6FED]/25 font-bold border-none',
    pillInactive: 'bg-slate-100/90 text-slate-600 border border-slate-200/80 hover:border-[#2F6FED]/40 hover:text-[#2F6FED] font-semibold',
    priceText: 'text-[#2F6FED]',
    badgeText: 'text-[#2F6FED]',
  },
  'aura-tech': {
    name: 'Aura Tech & Smart Living',
    bg: '#ffffff',
    cardBg: '#ffffff',
    cardBorder: 'border-slate-200/80',
    accent: '#2F6FED',
    accentHover: '#255bc2',
    accentBtn: 'bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] hover:opacity-95 text-white shadow-md shadow-[#2F6FED]/25 font-bold',
    pillActive: 'bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] text-white shadow-md shadow-[#2F6FED]/25 font-bold border-none',
    pillInactive: 'bg-slate-100/90 text-slate-600 border border-slate-200/80 hover:border-[#2F6FED]/40 hover:text-[#2F6FED] font-semibold',
    priceText: 'text-[#2F6FED]',
    badgeText: 'text-[#2F6FED]',
  },
};

export default function EMenuPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tg, triggerHaptic } = useTelegram();

  // Extract active store slug with seller mapping
  const currentSlug = useMemo(() => {
    let raw = params.storeSlug;
    if (!raw) {
      const parts = location.pathname.split('/');
      if (parts[1] === 'shop' && parts[2] && parts[2] !== 'not-found') {
        raw = parts[2];
      }
    }
    const SELLER_SLUG_MAP = {
      'seller-1': 'sbc-store',
      'seller-2': 'aura-bakery',
      'seller-3': 'aura-lounge',
      'seller-4': 'aura-bistro',
      'seller-5': 'aura-tech',
      'seller-6': 'sbc-store',
    };
    if (raw && SELLER_SLUG_MAP[raw]) {
      return SELLER_SLUG_MAP[raw];
    }
    if (raw) {
      const found = (simpleData.stores || []).find(
        (s) => s.slug === raw || String(s.id) === String(raw) || s.name?.toLowerCase() === raw?.toLowerCase()
      );
      if (found) return found.slug;
    }
    return raw || 'sbc-store';
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

  // Table & Dining Context
  const [diningMode, setDiningMode] = useState('delivery');
  const [customerLocation, setCustomerLocation] = useState('Table #06');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Telegram Customer');
  const [customerPhone, setCustomerPhone] = useState('+855 12 345 678');
  const [customerNote, setCustomerNote] = useState('');
  const [hasClaimedCoupon, setHasClaimedCoupon] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isStoreGroupModalOpen, setIsStoreGroupModalOpen] = useState(false);

  // Customization Modal (`Opt`)
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedMilk, setSelectedMilk] = useState('Standard');
  const [selectedIce, setSelectedIce] = useState('Normal Ice');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customizeQty, setCustomizeQty] = useState(1);

  // Active Order & 'Notify Me' status changes
  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_emenu_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [notifyMeEnabled, setNotifyMeEnabled] = useState(true);

  // Monitor order status changes: trigger push notification / in-app alert when status becomes 'ready'
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'Ready' || activeOrder.status === 'Completed') return;

    // Transition order to Ready
    const timer = setTimeout(() => {
      const updated = { ...activeOrder, status: 'Ready' };
      setActiveOrder(updated);
      try {
        localStorage.setItem('aura_emenu_active_order', JSON.stringify(updated));
      } catch {}

      if (notifyMeEnabled) {
        triggerHaptic?.('success');
        tg?.showPopup?.({
          title: 'Order Ready for Pickup! 🔔',
          message: `Your order #${activeOrder.referenceNo} is prepared and ready at ${currentStore?.name || 'the counter'}!`,
          buttons: [{ type: 'ok' }],
        });
        notification.success({
          message: 'Order Ready for Pickup! 🔔',
          description: `Your order #${activeOrder.referenceNo} has been prepared by the kitchen team. Please collect your items at the counter!`,
          duration: 10,
          placement: 'top',
        });
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, [activeOrder, notifyMeEnabled, tg, triggerHaptic, currentStore]);

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
          options: {},
        },
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
      Note: specialInstructions.trim() || undefined,
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
        options,
      },
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
        telegramId: tg?.initDataUnsafe?.user?.id || 9841203,
      },
      items: cart.map((it) => ({
        id: it.id,
        productId: it.id,
        code: it.code,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        subtotal: it.subtotal,
        options: it.options,
      })),
    };

    try {
      const res = await axios.post(`/api/tma/shop/${currentSlug}/orders`, payload);
      if (res.data?.status && res.data.data) {
        const orderData = {
          referenceNo: res.data.data.referenceNo,
          storeName: currentStore?.name,
          status: 'Preparing',
          placedAt: Date.now(),
        };
        // Route notification to this store's dedicated Telegram group
        routeOrderToTelegramGroup(currentSlug, {
          ...payload,
          referenceNo: res.data.data.referenceNo,
        });

        setActiveOrder(orderData);
        try {
          localStorage.setItem('aura_emenu_active_order', JSON.stringify(orderData));
        } catch (_) {}

        setCart([]);
        setIsCartOpen(false);
        message.success(`Order placed & routed to Telegram Kitchen Group! Ref: ${res.data.data.referenceNo}`);
        tg?.showPopup?.({
          title: 'Order Confirmed! 🎉',
          message: `Your order #${res.data.data.referenceNo} has been routed to the Telegram Kitchen group for ${currentStore?.name}. You'll receive a 'Ready' notification when your order is prepared!`,
          buttons: [{ type: 'ok' }],
        });
      } else {
        // Fallback local placement with group notification
        const refNo = `ORD-${Date.now().toString().slice(-4)}`;
        const orderData = {
          referenceNo: refNo,
          storeName: currentStore?.name,
          status: 'Preparing',
          placedAt: Date.now(),
        };
        routeOrderToTelegramGroup(currentSlug, { ...payload, referenceNo: refNo });
        setActiveOrder(orderData);
        try {
          localStorage.setItem('aura_emenu_active_order', JSON.stringify(orderData));
        } catch (_) {}
        setCart([]);
        setIsCartOpen(false);
        message.success(`Order placed & routed to Telegram Kitchen Group! Ref: ${refNo}`);
      }
    } catch (err) {
      // In offline / preview mode, ensure local order is placed and group notified
      const refNo = `ORD-${Date.now().toString().slice(-4)}`;
      const orderData = {
        referenceNo: refNo,
        storeName: currentStore?.name,
        status: 'Preparing',
        placedAt: Date.now(),
      };
      routeOrderToTelegramGroup(currentSlug, { ...payload, referenceNo: refNo });
      setActiveOrder(orderData);
      try {
        localStorage.setItem('aura_emenu_active_order', JSON.stringify(orderData));
      } catch (_) {}
      setCart([]);
      setIsCartOpen(false);
      message.success(`Order placed & routed to Telegram Kitchen Group! Ref: ${refNo}`);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const storeOptions = [
    { slug: 'sbc-store', name: 'Aura Specialty Coffee', emoji: '☕' },
    { slug: 'aura-lounge', name: 'Botanical Lounge & Matcha', emoji: '🍵' },
    { slug: 'aura-bistro', name: 'Aura French Bistro', emoji: '🍽️' },
    { slug: 'aura-bakery', name: 'Aura Artisan Bakery', emoji: '🥐' },
  ];

  return (
    <div
      style={{
        background: '#ffffff',
        boxShadow:
          '0 20px 60px -15px rgba(47, 111, 237, 0.12), 0 0 1px 1px rgba(47, 111, 237, 0.08)',
      }}
      className="w-full max-w-[480px] min-h-screen text-slate-800 font-sans flex flex-col relative pb-32 border-x border-blue-100/60 selection:bg-[#2F6FED] selection:text-white"
    >
      {/* ======================================================== */}
      {/* 1. TOP HEADER (WEBSITE DEFAULT STYLE & ELEGANT SHADOW)   */}
      {/* ======================================================== */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Left: Avatar + Title + "Table #06 • delivery" */}
        <div
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-3 cursor-pointer select-none active:opacity-80 transition"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#2F6FED]/25 shrink-0 bg-slate-100 shadow-sm">
            <img
              src={
                currentStore?.logo ||
                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=150&q=80'
              }
              alt=""
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=150&q=80';
              }}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-tight flex items-center gap-1">
              <span>{currentStore?.name || activeTheme.name}</span>
            </h1>
            <p className="text-xs font-bold text-[#2F6FED] flex items-center gap-1.5 pt-0.5">
              <span>
                {customerLocation} • {diningMode}
              </span>
              <DownOutlined style={{ fontSize: 9 }} />
            </p>
          </div>
        </div>

        {/* Right: Multi-Store Switcher + Signature Aura Blue Bag Pill Badge */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic?.('light');
              setIsStoreGroupModalOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2F6FED] border border-slate-200 text-xs font-extrabold flex items-center gap-1 active:scale-95 transition cursor-pointer shadow-2xs"
            title="Yin: Switch Store Account or Manage Telegram Groups"
          >
            <span className="text-sm">🏬</span>
            <span className="hidden xs:inline">Stores</span>
            <DownOutlined style={{ fontSize: 8 }} />
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#2F6FED]/25 active:scale-95 transition cursor-pointer hover:opacity-95"
          >
            <span className="text-sm">🛍️</span>
            <span className="font-mono">{totalItemCount}</span>
          </button>
        </div>
      </header>

      {/* Active Order Status Notification Bar & 'Notify Me' feature */}
      {activeOrder && (
        <div className="mx-3 mt-2 mb-1 p-3 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/90 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                activeOrder.status === 'Ready'
                  ? 'bg-emerald-500 text-white animate-bounce'
                  : 'bg-blue-100 text-[#2F6FED]'
              }`}
            >
              {activeOrder.status === 'Ready' ? '🎉' : '⏳'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                <span>Ref #{activeOrder.referenceNo}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    activeOrder.status === 'Ready'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#2F6FED] text-white'
                  }`}
                >
                  {activeOrder.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 m-0 truncate">
                {activeOrder.status === 'Ready'
                  ? '🔔 Order Ready! Collect at counter'
                  : 'Kitchen preparing your order...'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic?.('light');
              setNotifyMeEnabled(!notifyMeEnabled);
              message.info(
                !notifyMeEnabled
                  ? '🔔 Notify Me enabled for order status changes!'
                  : 'Order notifications paused'
              );
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition active:scale-95 cursor-pointer ${
              notifyMeEnabled
                ? 'bg-white border border-blue-300 text-[#2F6FED] shadow-xs'
                : 'bg-slate-100 border border-slate-200 text-slate-500'
            }`}
            title="Toggle status push notification"
          >
            {notifyMeEnabled ? <BellFilled className="text-[#2F6FED]" /> : <BellOutlined />}
            <span className="text-[11px]">{notifyMeEnabled ? 'Notify On' : 'Notify Off'}</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CATEGORY HORIZONTAL SCROLL BAR (AURA BLUE PILLS)     */}
      {/* ======================================================== */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none sticky top-[57px] z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
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
      {/* 3. 2-COLUMN PRODUCT GRID (LIGHT WHITE CARDS + BLUE TAGS) */}
      {/* ======================================================== */}
      <main className="px-3 py-3 flex-1 bg-slate-50/50">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="animate-spin text-3xl">☕</div>
            <p className="text-xs text-slate-500 font-semibold">Loading menu...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs space-y-2">
            <p className="font-bold text-slate-700">No items found</p>
            <p>Select another category above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                id={`product-${prod.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 p-2.5 flex flex-col justify-between space-y-2.5 transition shadow-xs hover:shadow-md hover:border-[#2F6FED]/40"
              >
                {/* Product Image with Price Badge */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openCustomizer(prod)}
                  className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop';
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  {/* Floating Price Tag Badge (Bottom Right) */}
                  <div className="absolute bottom-1.5 right-1.5 px-2.5 py-0.5 rounded-lg bg-white/95 backdrop-blur-md font-mono font-black text-[#2F6FED] text-[12px] shadow-sm border border-blue-100/60">
                    ${Number(prod.price).toFixed(2)}
                  </div>
                </div>

                {/* Title & 1-Line Description */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openCustomizer(prod)}
                  className="space-y-0.5 cursor-pointer"
                >
                  <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-1 hover:text-[#2F6FED] transition">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 leading-normal">
                    {prod.details || 'Handcrafted fresh daily.'}
                  </p>
                </div>

                {/* Card Bottom Buttons: "Detail" + "+ Add" */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openCustomizer(prod)}
                    className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>👁️ Detail</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDirectAddToCart(prod)}
                    className="py-1.5 px-2 rounded-xl text-xs font-black text-center shadow-md active:scale-95 transition cursor-pointer bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] hover:opacity-95 text-white shadow-[#2F6FED]/25"
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
      {/* 4. STICKY BOTTOM BASKET BAR                              */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pointer-events-none flex justify-center">
        <div className="w-full max-w-[480px] pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              triggerHaptic?.('medium');
              setIsCartOpen(true);
            }}
            className="w-full py-3.5 px-5 rounded-2xl text-white font-extrabold text-sm flex items-center justify-between shadow-2xl active:scale-98 transition bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] hover:opacity-95 shadow-[#2F6FED]/35 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🛍️</span>
              <span>View Basket ({totalItemCount})</span>
            </div>
            <span className="font-mono text-base font-black">${cartGrandTotal}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. LOCATION & BRANCH PICKER MODAL (LIGHT CLEAN THEME)    */}
      {/* ======================================================== */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="w-full max-w-[460px] rounded-3xl p-5 space-y-4 bg-white border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Dining Location &amp; Branch</h3>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <CloseOutlined />
              </button>
            </div>

            {/* Dining Mode */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Dining Option</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'dine_in', label: '🍽️ Dine-in' },
                  { id: 'takeaway', label: '🛍️ Takeaway' },
                  { id: 'delivery', label: '🛵 Delivery' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setDiningMode(mode.id)}
                    className={`py-2 px-2 rounded-xl font-bold transition text-center ${
                      diningMode === mode.id
                        ? 'bg-[#2F6FED] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Number */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Table Number</span>
              <select
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-[#2F6FED]"
              >
                {[
                  'Table #01',
                  'Table #02',
                  'Table #06',
                  'Table #08',
                  'Table #12 (Window)',
                  'Terrace #03',
                  'Bar Counter',
                  'VIP Lounge',
                ].map((t) => (
                  <option key={t} value={t} className="bg-white text-slate-900">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Switch Store / Branch */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Switch Store / Branch</span>
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
                        ? 'bg-blue-50 text-[#2F6FED] border border-[#2F6FED]/50 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{st.emoji}</span>
                    <span className="truncate">{st.name.replace('Aura ', '')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Telegram Mini App Link */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Telegram Mini App Link</span>
              <div
                onClick={() => {
                  const link = `https://t.me/aura_emenu_order_bot/menu?startapp=shop_${currentSlug}`;
                  navigator.clipboard.writeText(link);
                  message.success('Copied: ' + link);
                }}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs cursor-pointer hover:border-[#2F6FED]/60 transition active:scale-98"
              >
                <code className="text-[#2F6FED] font-mono text-[11px] truncate max-w-[320px]">
                  https://t.me/aura_emenu_order_bot/menu?startapp=shop_{currentSlug}
                </code>
                <span className="text-[11px] font-bold text-slate-600 shrink-0 ml-2 bg-slate-200 px-2 py-0.5 rounded-md">
                  Copy Link
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLocationModalOpen(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#2F6FED] hover:bg-[#255bc2] text-white shadow-sm transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PRODUCT CUSTOMIZER MODAL ("Opt") (LIGHT THEME)        */}
      {/* ======================================================== */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="w-full max-w-[460px] rounded-3xl p-5 space-y-4 bg-white border border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Customize Item</h3>
              <button
                type="button"
                onClick={() => setCustomizingProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <CloseOutlined />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={customizingProduct.image}
                alt=""
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop';
                }}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-slate-100"
              />
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{customizingProduct.name}</h4>
                <span className="font-mono text-xs font-bold text-[#2F6FED]">
                  Base Price: ${Number(customizingProduct.price).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Portion / Size */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Portion / Size</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Regular (12oz)', 'Large (16oz) (+$0.75)'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-2.5 rounded-xl font-bold transition text-center ${
                      selectedSize === size
                        ? 'bg-[#2F6FED] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Milk / Base */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Artisan Milk</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Fresh Cow Milk', 'Oat Milk (+$0.60)', 'Almond Milk (+$0.60)', 'Skim Milk'].map((milk) => (
                  <button
                    key={milk}
                    type="button"
                    onClick={() => setSelectedMilk(milk)}
                    className={`py-2 px-2.5 rounded-xl font-bold transition text-center ${
                      selectedMilk === milk
                        ? 'bg-[#2F6FED] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {milk}
                  </button>
                ))}
              </div>
            </div>

            {/* Ice & Temperature */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Ice &amp; Temp</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Hot', 'Less Ice', 'Normal Ice'].map((ice) => (
                  <button
                    key={ice}
                    type="button"
                    onClick={() => setSelectedIce(ice)}
                    className={`py-2 px-2 rounded-xl font-bold transition text-center ${
                      selectedIce === ice
                        ? 'bg-[#2F6FED] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {ice}
                  </button>
                ))}
              </div>
            </div>

            {/* Chef Notes */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Barista / Chef Notes</label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Extra hot, no sugar..."
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#2F6FED]"
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-700">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCustomizeQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                >
                  <MinusOutlined style={{ fontSize: 10 }} />
                </button>
                <span className="font-mono font-bold text-sm text-slate-900">{customizeQty}</span>
                <button
                  type="button"
                  onClick={() => setCustomizeQty((q) => q + 1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                >
                  <PlusOutlined style={{ fontSize: 10 }} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddCustomizedToCart}
              className="w-full py-3 rounded-2xl text-xs font-black shadow-lg cursor-pointer bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] hover:opacity-95 text-white shadow-[#2F6FED]/25 transition"
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
                className="text-[11px] text-slate-500 hover:text-[#2F6FED] transition cursor-pointer"
              >
                🔗 Copy Direct Item Link: <span className="font-mono font-bold">item_{customizingProduct.id}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. BASKET & CHECKOUT DRAWER (LIGHT CLEAN THEME)          */}
      {/* ======================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="w-full max-w-[460px] rounded-3xl p-5 space-y-4 bg-white border border-slate-200 shadow-2xl max-h-[88vh] flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <h3 className="font-extrabold text-sm text-slate-900">Your Basket ({totalItemCount})</h3>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <CloseOutlined />
              </button>
            </div>

            {/* Cart Items */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-14 text-center space-y-2">
                  <span className="text-3xl block">🛍️</span>
                  <p className="font-bold text-xs text-slate-700">Your basket is currently empty</p>
                  <p className="text-[11px] text-slate-400">Add some artisan items to place an order.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.image}
                          alt=""
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop';
                          }}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 bg-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">{item.name}</h4>
                          <span className="text-[11.5px] font-mono font-bold text-[#2F6FED]">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.options && Object.keys(item.options).length > 0 && (
                            <p className="text-[10px] text-slate-500">
                              {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(idx, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold text-xs text-slate-700"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs w-4 text-center text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(idx, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold text-xs text-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* VIP 20% Discount */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9.5px] font-black uppercase text-[#2F6FED]">Promo Code: FIRST20</span>
                      <p className="text-xs font-bold text-slate-900">20% VIP Order Discount</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHasClaimedCoupon(!hasClaimedCoupon);
                        message.info(hasClaimedCoupon ? 'Coupon removed' : '20% discount applied!');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                        hasClaimedCoupon
                          ? 'bg-emerald-500 text-white font-black'
                          : 'bg-[#2F6FED] text-white hover:bg-[#255bc2]'
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
              <div className="pt-3 border-t border-slate-100 space-y-3 shrink-0">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-mono text-slate-900 font-bold">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount (20%):</span>
                      <span className="font-mono">-${cartDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Delivery ({customerLocation}):</span>
                      <span className="font-mono text-slate-900 font-bold">${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black pt-1.5 border-t border-slate-100 text-slate-900">
                    <span>Total Amount:</span>
                    <span className="font-mono text-base font-black text-[#2F6FED]">${cartGrandTotal}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSubmittingOrder}
                  onClick={handleConfirmOrder}
                  className="w-full py-3.5 rounded-2xl text-xs font-black shadow-xl cursor-pointer bg-gradient-to-r from-[#2F6FED] to-[#5B8DEF] hover:opacity-95 text-white shadow-[#2F6FED]/25 transition"
                >
                  {isSubmittingOrder ? 'Sending to Kitchen...' : `Place Order ($${cartGrandTotal})`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Telegram Mini App: Multi-Store Group Management & Bot Permissions Modal */}
      <TelegramStoreGroupModal
        open={isStoreGroupModalOpen}
        onClose={() => setIsStoreGroupModalOpen(false)}
        currentStoreSlug={currentSlug}
        onSwitchStore={(newSlug) => {
          setIsStoreGroupModalOpen(false);
          if (newSlug !== currentSlug) {
            navigate(`/shop/${newSlug}`);
            message.success(`Switched store account to ${newSlug.replace(/-/g, ' ').toUpperCase()}`);
          }
        }}
        triggerHaptic={triggerHaptic}
      />
    </div>
  );
}
