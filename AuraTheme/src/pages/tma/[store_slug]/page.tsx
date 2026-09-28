import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  ShopOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleFilled,
  SyncOutlined,
  CloseCircleFilled,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
  UserOutlined,
  EnvironmentOutlined,
  SendOutlined,
  ReloadOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useTelegram } from '../../../hooks/useTelegram';
import { useStoreCart } from '../../../hooks/useStoreCart';

export default function StoreFront() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tg, user, initData, startParam, triggerHaptic } = useTelegram();

  // Active store slug from param, deep link, or default
  const routeSlug = (params.storeSlug as string) || (params.store_slug as string) || startParam || '';
  const [activeSlug, setActiveSlug] = useState<string>(routeSlug || 'sbc-store');

  // Multi-Store Stores List
  const [stores, setStores] = useState<any[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);

  // Current Store Menu Data
  const [currentStore, setCurrentStore] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingStore, setLoadingStore] = useState(true);

  // Navigation View: 'stores' | 'menu' | 'cart' | 'checkout' | 'confirm' | 'success' | 'orders'
  const [viewMode, setViewMode] = useState<
    'stores' | 'menu' | 'cart' | 'checkout' | 'confirm' | 'success' | 'orders'
  >(routeSlug ? 'menu' : 'stores');

  // Category & Search Filter
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'popular' | 'iced' | 'organic'>('all');

  // Cart Hook with multi-store guard
  const {
    cart,
    items,
    itemCount,
    subtotal,
    deliveryFee,
    discount,
    total,
    orderType,
    setOrderType,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    clearAndSwitchStore,
    isDifferentStore,
    currentCartStoreSlug,
    currentCartStoreName
  } = useStoreCart(activeSlug, currentStore?.name || '');

  // Options / Variant Customization Modal State
  const [customizingProduct, setCustomizingProduct] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [customizeQty, setCustomizeQty] = useState<number>(1);

  // Store Switch Warning Modal State
  const [pendingStoreSwitch, setPendingStoreSwitch] = useState<any>(null);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('Table #03 (Dine-In)');
  const [customerNote, setCustomerNote] = useState('');

  // Confirmation & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<any>(null);

  // My Orders State
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Staff Mode Toggle for testing order status update & Telegram notification retry
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);

  // 1. Fetch Available Stores
  const fetchStores = useCallback(async () => {
    setLoadingStores(true);
    try {
      const res = await axios.get('/api/tma/stores');
      if (res.data?.status && Array.isArray(res.data.data)) {
        setStores(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching stores:', err);
    } finally {
      setLoadingStores(false);
    }
  }, []);

  // 2. Fetch Selected Store Menu & Products
  const fetchStoreData = useCallback(async (slugToLoad: string) => {
    setLoadingStore(true);
    try {
      const res = await axios.get(`/api/tma/store/${slugToLoad}`);
      if (res.data?.status && res.data.store) {
        setCurrentStore(res.data.store);
        setCategories(res.data.categories || []);
        setProducts(res.data.products || []);
        setActiveCategory('all');
      } else {
        setViewMode('stores');
      }
    } catch (err) {
      console.warn('Error loading store:', err);
      setViewMode('stores');
    } finally {
      setLoadingStore(false);
    }
  }, []);

  // 3. Fetch Past Orders
  const fetchPastOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get('/api/tma/orders');
      if (res.data?.status) {
        setPastOrders(res.data.orders || res.data.data || []);
      }
    } catch (err) {
      console.warn('Error loading orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Sync activeSlug when URL parameter changes (/shop/:storeSlug)
  useEffect(() => {
    const slug = (params.storeSlug as string) || (params.store_slug as string);
    if (slug && slug !== activeSlug) {
      setActiveSlug(slug);
      fetchStoreData(slug);
      setViewMode('menu');
    }
  }, [params.storeSlug, params.store_slug, activeSlug, fetchStoreData]);

  // Support deep link startParam (e.g. startapp=shop_aura-bakery, startapp=aura-bakery, etc.)
  useEffect(() => {
    if (startParam) {
      let target = '';
      if (startParam.startsWith('shop_') && !startParam.includes('_item_')) {
        target = startParam.replace('shop_', '');
      } else if (startParam.startsWith('store_')) {
        target = startParam.replace('store_', '');
      } else if (startParam.startsWith('biller_')) {
        const bId = startParam.replace('biller_', '');
        const matched = stores.find((s) => String(s.id) === String(bId));
        if (matched) target = matched.slug;
      } else if (['aura-bakery', 'sbc-store', 'aura-bistro', 'aura-tech'].includes(startParam)) {
        target = startParam;
      }

      if (target && target !== activeSlug) {
        setActiveSlug(target);
        fetchStoreData(target);
        navigate(`/shop/${target}`, { replace: true });
      }
    }
  }, [startParam, activeSlug, fetchStoreData, navigate, stores]);

  // Initial Load
  useEffect(() => {
    fetchStores();
    if (activeSlug) {
      fetchStoreData(activeSlug);
    }
    fetchPastOrders();
  }, [fetchStores, fetchStoreData, fetchPastOrders, activeSlug]);

  // Pre-fill user data from Telegram context
  useEffect(() => {
    if (user) {
      const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
      if (fullName) setCustomerName(fullName);
      if (user.username) setCustomerPhone(`@${user.username}`);
      else if (user.phone_number) setCustomerPhone(user.phone_number);
    } else {
      setCustomerName((prev) => prev || 'Telegram Guest');
    }
  }, [user]);

  // Deep-link query param check (?item=)
  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId && products.length > 0) {
      const matched = products.find((p) => String(p.id) === String(itemId));
      if (matched) {
        openCustomizationModal(matched);
      }
    }
  }, [searchParams, products]);

  // Handle Store Selection
  const handleSelectStore = (store: any) => {
    triggerHaptic('light');

    // Multi-Store Guard: If user has items from another store in cart
    if (cart.length > 0 && currentCartStoreSlug && currentCartStoreSlug !== store.slug) {
      setPendingStoreSwitch(store);
      return;
    }

    setActiveSlug(store.slug);
    fetchStoreData(store.slug);
    navigate(`/shop/${store.slug}`);
    setViewMode('menu');
  };

  const confirmStoreSwitch = () => {
    if (!pendingStoreSwitch) return;
    triggerHaptic('medium');
    clearAndSwitchStore(pendingStoreSwitch.slug, pendingStoreSwitch.name);
    setActiveSlug(pendingStoreSwitch.slug);
    fetchStoreData(pendingStoreSwitch.slug);
    navigate(`/shop/${pendingStoreSwitch.slug}`);
    setPendingStoreSwitch(null);
    setViewMode('menu');
  };

  // Open Customization Modal for Product
  const openCustomizationModal = (product: any) => {
    triggerHaptic('light');
    setCustomizingProduct(product);
    setCustomizeQty(1);

    // Initial default option choices
    const initialOpts: { [key: string]: string } = {};
    if (product.options && Array.isArray(product.options)) {
      product.options.forEach((optGroup: any) => {
        const defaultChoice = optGroup.choices?.find((c: any) => c.default) || optGroup.choices?.[0];
        if (defaultChoice) {
          initialOpts[optGroup.name] = defaultChoice.label;
        }
      });
    }
    setSelectedOptions(initialOpts);
  };

  // Calculate live price delta in customization modal
  const customizedPriceDelta = useMemo(() => {
    if (!customizingProduct?.options) return 0;
    let delta = 0;
    customizingProduct.options.forEach((optGroup: any) => {
      const chosenLabel = selectedOptions[optGroup.name];
      if (chosenLabel) {
        const choice = optGroup.choices?.find((c: any) => c.label === chosenLabel);
        if (choice?.priceDelta) delta += Number(choice.priceDelta);
      }
    });
    return delta;
  }, [customizingProduct, selectedOptions]);

  const modalUnitPrice = (Number(customizingProduct?.price || 0) + customizedPriceDelta).toFixed(2);
  const modalTotalPrice = (Number(modalUnitPrice) * customizeQty).toFixed(2);

  const handleAddCustomizedToCart = () => {
    if (!customizingProduct) return;
    triggerHaptic('medium');
    addItem(customizingProduct, selectedOptions, customizeQty, customizedPriceDelta);
    setCustomizingProduct(null);
  };

  const handleAddAndCheckout = () => {
    if (!customizingProduct) return;
    triggerHaptic('medium');
    addItem(customizingProduct, selectedOptions, customizeQty, customizedPriceDelta);
    setCustomizingProduct(null);
    setViewMode('checkout');
  };

  // Adaptive quick filter options based on active store
  const quickFilterOptions = useMemo(() => {
    if (activeSlug === 'aura-bakery') {
      return [
        { id: 'all', label: 'All Baked Goods' },
        { id: 'popular', label: '🔥 Best Sellers' },
        { id: 'croissant', label: '🥐 Croissants & Buns' },
        { id: 'sourdough', label: '🥖 Sourdough & Bread' },
        { id: 'sweets', label: '🍰 Cheesecakes & Tarts' },
      ];
    }
    if (activeSlug === 'aura-bistro') {
      return [
        { id: 'all', label: 'All Bowls' },
        { id: 'popular', label: '🔥 Best Sellers' },
        { id: 'bowls', label: '🥗 Grain & Poke Bowls' },
        { id: 'juices', label: '🥤 Cold-Pressed Juices' },
      ];
    }
    return [
      { id: 'all', label: 'All Items' },
      { id: 'popular', label: '🔥 Best Sellers' },
      { id: 'iced', label: '❄️ Cold Drinks' },
      { id: 'organic', label: '🌱 Plant-Based' },
    ];
  }, [activeSlug]);

  // Filtered Products for selected store
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat = activeCategory === 'all' || Number(prod.category_id) === Number(activeCategory);
      const matchSearch =
        !searchQuery.trim() ||
        prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.code?.toLowerCase().includes(searchQuery.toLowerCase());

      let matchQuick = true;
      if (quickFilter === 'popular') {
        matchQuick = Boolean(prod.popular || prod.badge);
      } else if (quickFilter === 'croissant') {
        matchQuick =
          prod.name?.toLowerCase().includes('croissant') ||
          prod.name?.toLowerCase().includes('bun') ||
          prod.name?.toLowerCase().includes('chocolat');
      } else if (quickFilter === 'sourdough') {
        matchQuick =
          prod.name?.toLowerCase().includes('sourdough') ||
          prod.name?.toLowerCase().includes('loaf') ||
          prod.name?.toLowerCase().includes('baguette');
      } else if (quickFilter === 'sweets') {
        matchQuick =
          prod.name?.toLowerCase().includes('cheesecake') ||
          prod.name?.toLowerCase().includes('tart') ||
          prod.name?.toLowerCase().includes('cake') ||
          Number(prod.category_id) === 5;
      } else if (quickFilter === 'bowls') {
        matchQuick =
          prod.name?.toLowerCase().includes('bowl') ||
          prod.name?.toLowerCase().includes('poke') ||
          prod.name?.toLowerCase().includes('quinoa');
      } else if (quickFilter === 'juices') {
        matchQuick =
          prod.name?.toLowerCase().includes('juice') ||
          prod.name?.toLowerCase().includes('smoothie');
      } else if (quickFilter === 'iced') {
        matchQuick =
          prod.name?.toLowerCase().includes('iced') ||
          prod.name?.toLowerCase().includes('cold') ||
          prod.details?.toLowerCase().includes('iced') ||
          prod.details?.toLowerCase().includes('cold');
      } else if (quickFilter === 'organic') {
        matchQuick =
          prod.name?.toLowerCase().includes('matcha') ||
          prod.name?.toLowerCase().includes('organic') ||
          prod.details?.toLowerCase().includes('organic') ||
          prod.details?.toLowerCase().includes('oat');
      }

      return matchCat && matchSearch && matchQuick;
    });
  }, [products, activeCategory, searchQuery, quickFilter]);

  // Proceed to Order Confirmation Screen
  const handleProceedToConfirmation = () => {
    if (!customerName.trim()) {
      tg?.showAlert?.('Please enter customer name');
      return;
    }
    triggerHaptic('light');
    setViewMode('confirm');
  };

  // Submit Final Order (Step 7: Create Order with duplicate protection)
  const handleConfirmOrder = async () => {
    if (isSubmitting) return; // Prevent double click immediately
    triggerHaptic('heavy');
    setIsSubmitting(true);

    const idempotencyKey = `idemp_${user?.id || 'guest'}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const payload = {
      storeSlug: activeSlug,
      idempotencyKey,
      orderType,
      customer: {
        name: customerName,
        username: user?.username ? `@${user.username}` : (customerPhone.startsWith('@') ? customerPhone : '@guest'),
        phone: customerPhone,
        address: customerAddress,
        note: customerNote,
        telegramId: user?.id || 999999
      },
      note: customerNote,
      items: cart.map((item) => ({
        id: item.id,
        productId: item.id,
        code: item.code,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions
      }))
    };

    try {
      const res = await axios.post('/api/tma/orders', payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-init-data': initData || ''
        }
      });

      if (res.data?.status && res.data.data) {
        setLastCreatedOrder(res.data.data);
        clearCart();
        fetchPastOrders();
        setViewMode('success');
        triggerHaptic('success');
      } else {
        tg?.showAlert?.(`Order error: ${res.data?.message || 'Could not place order'}`);
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      tg?.showAlert?.(err.response?.data?.message || 'Network error while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Staff: Update Order Status
  const handleStaffUpdateStatus = async (orderRef: string, newStatus: string) => {
    try {
      const res = await axios.put(`/api/tma/orders/${orderRef}/status`, { status: newStatus });
      if (res.data?.status) {
        triggerHaptic('medium');
        fetchPastOrders();
      }
    } catch (err: any) {
      tg?.showAlert?.(err.response?.data?.message || 'Status update failed');
    }
  };

  // Staff: Retry Telegram Notification
  const handleRetryNotification = async (orderRef: string) => {
    setRetryingOrderId(orderRef);
    try {
      const res = await axios.post(`/api/tma/orders/${orderRef}/retry-notification`);
      if (res.data?.status) {
        triggerHaptic('success');
        fetchPastOrders();
        tg?.showAlert?.(`Notification dispatched! Status: ${res.data.notification_status}`);
      }
    } catch (err) {
      tg?.showAlert?.('Failed to retry notification');
    } finally {
      setRetryingOrderId(null);
    }
  };

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 font-sans pb-28 relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* 1. TOP TELEGRAM APP BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-900/90 px-3.5 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-white text-xs">
              {currentStore?.name ? currentStore.name.slice(0, 2).toUpperCase() : 'AS'}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-sm text-white tracking-tight truncate">
                {currentStore?.name || 'Aura Mini App'}
              </span>
              <span className="text-[9.5px] font-black px-1.5 py-0.5 rounded-full bg-blue-500/20 text-sky-400 border border-blue-500/30 shrink-0">
                TMA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate">{user?.username ? `@${user.username}` : user?.first_name || '@telegram_guest'}</span>
            </p>
          </div>
        </div>

        {/* Staff / Testing Mode Switch & Store Switcher */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsStaffMode(!isStaffMode)}
            className={`px-2.5 py-1 rounded-xl text-[10.5px] font-extrabold transition-all border shadow-sm active:scale-95 ${
              isStaffMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/20'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Staff Management Controls"
          >
            {isStaffMode ? '⚡ Staff Mode' : 'Customer'}
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTENT ROUTER */}
      <main className="p-3.5 space-y-4">
        {/* ======================================================== */}
        {/* SCREEN 1: STORE SELECTION SCREEN                         */}
        {/* ======================================================== */}
        {viewMode === 'stores' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-slate-900/90 border border-blue-800/40 rounded-3xl p-4 shadow-xl">
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">
                Store Selection
              </span>
              <h2 className="text-xl font-black text-white mt-0.5 mb-1 tracking-tight">
                Choose Store &amp; E-Menu
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Each location features its own artisan catalog, real-time kitchen queue, and direct Telegram notification dispatch.
              </p>
            </div>

            {loadingStores ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-44 bg-slate-900/80 rounded-3xl animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : (
              <div className="space-y-3.5">
                {stores.map((s) => {
                  const isCurrent = s.slug === activeSlug;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectStore(s)}
                      className={`relative bg-slate-900/90 border rounded-3xl overflow-hidden cursor-pointer transition-all active:scale-[0.98] shadow-xl ${
                        isCurrent
                          ? 'border-blue-500 ring-2 ring-blue-500/30'
                          : 'border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Store Banner */}
                      <div className="relative h-32 w-full overflow-hidden">
                        <img
                          src={s.banner}
                          alt={s.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                        <div className="absolute top-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10.5px] font-extrabold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {s.status_text || 'Open Now'}
                        </div>
                        <div className="absolute bottom-2.5 left-3 flex items-center space-x-2.5">
                          <img
                            src={s.logo}
                            alt=""
                            className="w-11 h-11 rounded-2xl border-2 border-slate-900 shadow-xl object-cover ring-1 ring-white/10"
                          />
                          <div>
                            <h3 className="font-black text-white text-base leading-tight drop-shadow-md">
                              {s.name}
                            </h3>
                            <span className="text-[11px] text-slate-300 flex items-center gap-1 font-medium mt-0.5">
                              <EnvironmentOutlined style={{ fontSize: 10 }} />
                              {s.location || 'Phnom Penh'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Store Meta & Catalog preview */}
                      <div className="p-3.5 space-y-2.5 bg-slate-900/80">
                        <p className="text-xs text-slate-300 line-clamp-1 font-medium">
                          {s.tagline}
                        </p>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center gap-2.5">
                            <span className="text-amber-400 font-black">
                              ★ {s.rating || '4.9'}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-300 font-semibold text-[11px]">
                              {s.productsCount || 4} Items
                            </span>
                          </div>
                          <span className="text-xs text-sky-400 font-black flex items-center gap-1">
                            Open Menu <ArrowRightOutlined style={{ fontSize: 10 }} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 2: E-MENU / PRODUCT BROWSING                      */}
        {/* ======================================================== */}
        {viewMode === 'menu' && (
          <div className="space-y-3.5 animate-fadeIn">
            {/* 1. ATMOSPHERIC STORE HERO BANNER */}
            <div className="relative w-full rounded-[28px] overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900">
              {/* Cover Photography */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={
                    currentStore?.banner ||
                    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=400&fit=crop'
                  }
                  alt={currentStore?.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30" />

                {/* Top Status & Rating Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10.5px] font-black shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{currentStore?.is_open ? 'Open Now' : 'Open'}</span>
                    <span className="text-slate-400 text-[10px] hidden xs:inline">• {currentStore?.hours || '07:00 AM - 08:30 PM'}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-black shadow-lg">
                    <span>⭐ {currentStore?.rating || '4.9'}</span>
                    <span className="text-slate-400 text-[10px] font-bold">({currentStore?.reviewsCount || '342'})</span>
                  </div>
                </div>

                {/* Bottom Store Avatar & Headline */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl shrink-0 bg-slate-900 ring-2 ring-slate-950">
                      <img
                        src={
                          currentStore?.logo ||
                          'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop'
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h1 className="text-base font-black text-white tracking-tight truncate drop-shadow-md">
                          {currentStore?.name || 'Aura Specialty Coffee'}
                        </h1>
                        <span className="text-sky-400 text-xs font-black shrink-0">✓</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-semibold truncate drop-shadow">
                        {currentStore?.tagline || 'Farm-to-cup artisan coffee & matcha bar'}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-0.5">
                        <span className="flex items-center gap-0.5 truncate font-medium">
                          <EnvironmentOutlined style={{ fontSize: 9 }} />
                          {currentStore?.location || 'BKK1, Phnom Penh'}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-emerald-400 font-extrabold shrink-0">⚡ 15-20m prep</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewMode('stores')}
                    className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-sky-400 border border-sky-500/30 text-[10.5px] font-black shrink-0 hover:bg-sky-600/20 active:scale-95 transition-all shadow-md"
                  >
                    All Stores
                  </button>
                </div>
              </div>
            </div>

            {/* 2. MULTI-STORE QUICK SWITCHER PILLS */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <span className="text-[10px] font-black text-slate-400 shrink-0 uppercase tracking-widest pl-0.5">
                Stores:
              </span>
              {stores.map((s) => {
                const isActive = s.slug === activeSlug;
                const emoji =
                  s.slug === 'sbc-store'
                    ? '☕'
                    : s.slug === 'aura-bistro'
                    ? '🥗'
                    : s.slug === 'aura-bakery'
                    ? '🥐'
                    : s.slug === 'aura-tech'
                    ? '⚡'
                    : '🏬';
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectStore(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border active:scale-95 ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30 ring-2 ring-blue-500/20'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{s.name.replace('Aura ', '').replace(' Systems', '')}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. SEARCH BAR */}
            <div className="relative">
              <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeSlug === 'aura-bakery'
                    ? 'Search croissants, sourdough, morning bun...'
                    : activeSlug === 'aura-bistro'
                    ? 'Search poke bowls, detox juices...'
                    : 'Search coffee, drinks, matcha, bites...'
                }
                className="w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 4. QUICK FILTER TAG CHIPS */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {quickFilterOptions.map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setQuickFilter(pill.id as any);
                  }}
                  className={`px-3 py-1 rounded-xl text-[11px] font-black whitespace-nowrap transition-all border active:scale-95 ${
                    quickFilter === pill.id
                      ? 'bg-slate-100 text-slate-950 border-white shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800/80 hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* 5. STICKY CATEGORY NAV PILLS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none sticky top-12 z-20 bg-slate-950/90 backdrop-blur-xl pt-1">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActiveCategory('all');
                }}
                className={`px-3 py-1.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>✨</span>
                <span>All Menu</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-bold">
                  {products.length}
                </span>
              </button>
              {categories.map((cat) => {
                const catProds = products.filter((p) => p.category_id === cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setActiveCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 ${
                      activeCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon || '☕'}</span>
                    <span>{cat.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-bold">
                      {catProds.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 6. PRODUCTS LIST (Appetizing Food & Drink Mobile Cards) */}
            {loadingStore ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-28 bg-slate-900 rounded-3xl animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-slate-800/80 p-6">
                <p className="text-slate-400 text-sm font-semibold">No products match this filter</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setQuickFilter('all');
                  }}
                  className="mt-2 text-xs text-sky-400 font-bold underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => {
                  const cartCount = items
                    .filter((i) => i.id === product.id)
                    .reduce((acc, curr) => acc + curr.quantity, 0);

                  return (
                    <div
                      key={product.id}
                      onClick={() => openCustomizationModal(product)}
                      className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-3xl p-3 flex gap-3 cursor-pointer active:scale-[0.99] transition-all shadow-lg relative overflow-hidden group"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-950 border border-slate-800 shadow-md">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.badge && (
                          <span className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-lg shadow-md">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-black text-white text-sm leading-tight line-clamp-1">
                              {product.name}
                            </h4>
                          </div>

                          <p className="text-[11.5px] text-slate-400 line-clamp-2 mt-1 leading-snug font-medium">
                            {product.details}
                          </p>

                          {/* In Cart Indicator */}
                          {cartCount > 0 && (
                            <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-lg">
                              <span>✓</span>
                              <span>{cartCount} in order</span>
                            </div>
                          )}
                        </div>

                        {/* Price & Add Action */}
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/70">
                          <div>
                            <span className="font-black text-white text-sm">
                              ${Number(product.price).toFixed(2)}
                            </span>
                            {product.unit && (
                              <span className="text-[10.5px] text-slate-400 font-medium ml-1">
                                /{product.unit}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic('medium');
                              if (product.options && product.options.length > 0) {
                                openCustomizationModal(product);
                              } else {
                                addItem(product, {}, 1, 0);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1 shadow-md shadow-blue-600/30 active:scale-95 transition-all"
                          >
                            <PlusOutlined style={{ fontSize: 10 }} />
                            <span>{product.options && product.options.length > 0 ? 'Options' : 'Add'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 3: SHOPPING CART SCREEN                           */}
        {/* ======================================================== */}
        {viewMode === 'cart' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('menu')}
                className="text-xs text-blue-400 font-bold flex items-center gap-1"
              >
                <ArrowLeftOutlined /> Back to Menu
              </button>
              <h2 className="text-base font-black text-white">Your Cart</h2>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-400 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Store Isolation Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShopOutlined className="text-blue-400" />
                Ordering from: <b className="text-white">{currentStore?.name}</b>
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-2xl">
                  🛒
                </div>
                <h3 className="font-bold text-white text-base">Your cart is empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Add specialty coffee, pastries, or lifestyle items to begin your order.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode('menu')}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30"
                >
                  Browse E-Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Items List */}
                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.itemKey}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 shadow-md"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-white text-xs truncate">
                          {item.name}
                        </h4>
                        {item.optionsText && (
                          <p className="text-[10.5px] text-slate-400 line-clamp-1 mt-0.5">
                            {item.optionsText}
                          </p>
                        )}
                        <span className="font-black text-xs text-blue-400 mt-1 block">
                          ${Number(item.price).toFixed(2)} each
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-1.5 shrink-0 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.itemKey, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center active:scale-95 text-xs"
                        >
                          <MinusOutlined style={{ fontSize: 10 }} />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.itemKey, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center active:scale-95 text-xs"
                        >
                          <PlusOutlined style={{ fontSize: 10 }} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.itemKey)}
                        className="text-slate-500 hover:text-rose-400 p-1 text-sm ml-1"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery / Service Fee</span>
                    <span className="font-bold text-white">${deliveryFee.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                    <span>Total Amount</span>
                    <span className="text-blue-400 font-black text-base">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Proceed Action */}
                <button
                  type="button"
                  onClick={() => setViewMode('checkout')}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-98 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightOutlined />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 4: CHECKOUT SCREEN                                */}
        {/* ======================================================== */}
        {viewMode === 'checkout' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('cart')}
                className="text-xs text-blue-400 font-bold flex items-center gap-1"
              >
                <ArrowLeftOutlined /> Back to Cart
              </button>
              <h2 className="text-base font-black text-white">Order Checkout</h2>
              <div className="w-10" />
            </div>

            {/* Store Information */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
                Store Destination
              </span>
              <h3 className="font-extrabold text-white text-sm">{currentStore?.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <EnvironmentOutlined style={{ fontSize: 11 }} />
                {currentStore?.address}
              </p>
            </div>

            {/* Fulfillment Type Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Fulfillment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'dine_in', label: '🍽️ Dine-In', desc: 'Table service' },
                  { key: 'takeaway', label: '🥡 Takeaway', desc: 'Pickup counter' },
                  { key: 'delivery', label: '🛵 Delivery', desc: '+$2.00 fee' }
                ].map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setOrderType(type.key);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      orderType === type.key
                        ? 'bg-blue-600/20 border-blue-500 text-white font-black'
                        : 'bg-slate-900 border-slate-800 text-slate-400 font-medium'
                    }`}
                  >
                    <div className="text-xs font-bold">{type.label}</div>
                    <div className="text-[9.5px] text-slate-400 mt-0.5">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider block">
                Customer Information
              </span>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Telegram Username</label>
                  <input
                    type="text"
                    value={user?.username ? `@${user.username}` : '@guest'}
                    disabled
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 012345678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {orderType === 'dine_in' ? 'Table Number / Dine-In Location' : 'Delivery Address / Table'}
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={orderType === 'dine_in' ? 'Table #03' : 'Address details'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Customer Note */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-semibold text-slate-300">Customer Note</label>
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Please prepare the order without ice."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Total Recap */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Total with {orderType.replace('_', ' ')}</span>
              <span className="text-base font-black text-blue-400">${total.toFixed(2)}</span>
            </div>

            {/* Proceed to Review Confirmation */}
            <button
              type="button"
              onClick={handleProceedToConfirmation}
              className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-98 transition-all"
            >
              <span>Review Order Confirmation</span>
              <ArrowRightOutlined />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 5: DEDICATED ORDER CONFIRMATION SCREEN            */}
        {/* ======================================================== */}
        {viewMode === 'confirm' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center py-2">
              <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-widest block">
                Final Step
              </span>
              <h2 className="text-xl font-black text-white mt-0.5 tracking-tight">
                CONFIRM YOUR ORDER
              </h2>
              <p className="text-xs text-slate-400">
                Please review everything carefully before submitting.
              </p>
            </div>

            {/* Store Block */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Store
              </span>
              <div className="font-extrabold text-white text-sm">{currentStore?.name}</div>
              <div className="text-xs text-slate-400">{currentStore?.address}</div>
            </div>

            {/* Items Block */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Items ({itemCount})
              </span>

              <div className="space-y-2 border-b border-slate-800 pb-3">
                {cart.map((it) => (
                  <div key={it.itemKey} className="flex justify-between items-start text-xs">
                    <div>
                      <div className="font-bold text-white">
                        {it.name} <span className="text-slate-400">× {it.quantity}</span>
                      </div>
                      {it.optionsText && (
                        <div className="text-[10.5px] text-slate-400">
                          {it.optionsText}
                        </div>
                      )}
                    </div>
                    <div className="font-extrabold text-white text-right">
                      ${Number(it.subtotal || it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                  <span>Total</span>
                  <span className="text-blue-400 text-base font-black">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details Block */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Customer
              </span>
              <div className="font-extrabold text-white">{customerName}</div>
              <div className="text-blue-400">
                {user?.username ? `@${user.username}` : (customerPhone.startsWith('@') ? customerPhone : '@guest')}
                {customerPhone && !customerPhone.startsWith('@') ? ` • ${customerPhone}` : ''}
              </div>
              <div className="text-slate-400">
                {orderType === 'dine_in' ? 'Dine-In: ' : 'Delivery: '}
                {customerAddress}
              </div>
              {customerNote && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-amber-300/90 italic">
                  Note: "{customerNote}"
                </div>
              )}
            </div>

            {/* Actions: Edit Order vs CONFIRM ORDER */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmOrder}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-blue-600/40 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <SyncOutlined spin />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>CONFIRM ORDER</span>
                    <ArrowRightOutlined />
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setViewMode('checkout')}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Edit Order
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 6: ORDER SUCCESS SCREEN                           */}
        {/* ======================================================== */}
        {viewMode === 'success' && (
          <div className="text-center py-6 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/20">
              ✓
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white tracking-tight">
                ✓ ORDER CONFIRMED
              </h2>
              <p className="text-xs text-slate-300">
                Thank you for your order!
              </p>
            </div>

            {/* Success Details Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Order Number
                </span>
                <span className="font-mono text-base font-black text-blue-400">
                  {lastCreatedOrder?.referenceNo || 'ORD-000123'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Store
                </span>
                <span className="font-bold text-white text-xs">
                  {lastCreatedOrder?.store_name || currentStore?.name}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total
                  </span>
                  <span className="font-black text-white text-sm">
                    ${Number(lastCreatedOrder?.grandTotal || total).toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Status
                  </span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px]">
                    ● {lastCreatedOrder?.status || 'Pending'}
                  </span>
                </div>
              </div>

              {lastCreatedOrder?.dispatchInfo && (
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-900/50 text-[11px] text-blue-300 space-y-0.5">
                  <div className="font-bold flex items-center gap-1">
                    <SendOutlined /> Telegram Store Notification:
                  </div>
                  <div>
                    Destination: <b>{lastCreatedOrder.dispatchInfo.groupName}</b>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Status: {lastCreatedOrder.store_notification || 'Dispatched'}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveOrderId(lastCreatedOrder?.referenceNo);
                  setViewMode('orders');
                }}
                className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>View Order</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('menu')}
                className="w-full py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 font-bold text-xs"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 7: CUSTOMER ORDER STATUS ("MY ORDERS")           */}
        {/* ======================================================== */}
        {viewMode === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('menu')}
                className="text-xs text-blue-400 font-bold flex items-center gap-1"
              >
                <ArrowLeftOutlined /> Back to Menu
              </button>
              <h2 className="text-base font-black text-white">My Orders</h2>
              <button
                type="button"
                onClick={fetchPastOrders}
                className="text-xs text-slate-400 hover:text-white"
              >
                <ReloadOutlined spin={loadingOrders} />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2">
              {(['all', 'pending', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setOrderFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    orderFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {loadingOrders ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <div key={n} className="h-36 bg-slate-900 rounded-2xl animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : pastOrders.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800/80 p-6">
                <p className="text-slate-400 text-xs">No orders found.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {pastOrders
                  .filter((o) => {
                    if (orderFilter === 'all') return true;
                    const st = (o.status || 'pending').toLowerCase();
                    if (orderFilter === 'pending') {
                      return ['pending', 'confirmed', 'preparing', 'ready'].includes(st);
                    }
                    if (orderFilter === 'completed') {
                      return ['completed', 'cancelled'].includes(st);
                    }
                    return true;
                  })
                  .map((order) => {
                    const statusStr = (order.status || 'Pending').toLowerCase();
                    const steps = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'];
                    const currentStepIdx = steps.findIndex(
                      (s) => s.toLowerCase() === statusStr
                    );

                    return (
                      <div
                        key={order.referenceNo || order.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg"
                      >
                        {/* Header: Order Ref & Store */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono font-black text-sm text-blue-400 block">
                              {order.referenceNo || `ORD-${order.id}`}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {order.store_name}
                            </span>
                          </div>
                          <span className="font-black text-sm text-white">
                            ${Number(order.grandTotal || 0).toFixed(2)}
                          </span>
                        </div>

                        {/* Status Pipeline Step Indicator */}
                        <div className="py-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                            {steps.map((st, idx) => {
                              const isCompleted = currentStepIdx >= idx;
                              const isCurrent = currentStepIdx === idx;
                              return (
                                <span
                                  key={st}
                                  className={
                                    isCurrent
                                      ? 'text-blue-400 font-black'
                                      : isCompleted
                                      ? 'text-emerald-400'
                                      : 'text-slate-600'
                                  }
                                >
                                  {isCompleted ? '●' : '○'} {st}
                                </span>
                              );
                            })}
                          </div>

                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden flex">
                            <div
                              className="bg-blue-500 h-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, Math.max(10, ((currentStepIdx + 1) / steps.length) * 100))}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="bg-slate-950/60 rounded-xl p-2.5 text-xs text-slate-300 space-y-1">
                          {(order.items || []).map((it: any, i: number) => (
                            <div key={i} className="flex justify-between text-[11.5px]">
                              <span>
                                {it.name} × {it.quantity}
                              </span>
                              <span className="font-bold text-slate-200">
                                ${Number(it.subtotal || it.price * it.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          {order.customer?.note && (
                            <div className="text-[10.5px] text-amber-300/80 italic pt-1 border-t border-slate-800">
                              Note: "{order.customer.note}"
                            </div>
                          )}
                        </div>

                        {/* Store Telegram Notification Destination Status */}
                        <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-1">
                          <span>
                            Telegram Dispatch: <b>{order.store_notification || 'Dispatched'}</b>
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Staff Mode Controls: Status Transitions & Retry Notification */}
                        {isStaffMode && (
                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2 bg-slate-950/80 p-2.5 rounded-xl">
                            <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                              <span>Staff Controls (Live Status Update):</span>
                              <button
                                type="button"
                                onClick={() => handleRetryNotification(order.referenceNo || order.id)}
                                className="text-[10.5px] text-blue-400 underline font-bold flex items-center gap-1"
                              >
                                <SendOutlined /> Retry Telegram Alert
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStaffUpdateStatus(order.referenceNo || order.id, st)}
                                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                                    order.status?.toLowerCase() === st.toLowerCase()
                                      ? 'bg-blue-600 text-white border-blue-500'
                                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. STICKY FLOATING CART ISLAND (When browsing menu and cart has items) */}
      {viewMode === 'menu' && itemCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-3.5 z-30 animate-slideUp">
          <div
            onClick={() => {
              triggerHaptic('medium');
              setViewMode('cart');
            }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl p-3 flex items-center justify-between shadow-[0_12px_32px_rgba(37,99,235,0.45)] border border-blue-400/40 cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center space-x-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-black text-sm shadow-inner">
                🛒
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 text-slate-950 font-black text-[9.5px] flex items-center justify-center shadow">
                  {itemCount}
                </span>
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wide text-blue-200">
                  {currentStore?.name} • Live Cart
                </div>
                <div className="text-sm font-black text-white">${total.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setViewMode('cart');
                }}
                className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-xl backdrop-blur-sm transition-all active:scale-95"
              >
                View Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  setViewMode('checkout');
                }}
                className="flex items-center gap-1 text-xs font-black bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                <span>Checkout</span>
                <ArrowRightOutlined style={{ fontSize: 10 }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FIXED BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-slate-950/90 backdrop-blur-xl border-t border-slate-900 z-40 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setViewMode('menu');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 text-center transition-all active:scale-95 relative ${
            viewMode === 'menu' ? 'text-sky-400 font-black' : 'text-slate-400 hover:text-slate-200 font-semibold'
          }`}
        >
          <div className="text-lg leading-none">
            {activeSlug === 'sbc-store'
              ? '☕'
              : activeSlug === 'aura-bistro'
              ? '🥗'
              : activeSlug === 'aura-bakery'
              ? '🥐'
              : activeSlug === 'aura-tech'
              ? '⚡'
              : '🏪'}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">E-Menu</span>
          {viewMode === 'menu' && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-0.5 shadow-sm shadow-sky-400/50" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setViewMode('stores');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 text-center transition-all active:scale-95 relative ${
            viewMode === 'stores' ? 'text-sky-400 font-black' : 'text-slate-400 hover:text-slate-200 font-semibold'
          }`}
        >
          <ShopOutlined style={{ fontSize: 18 }} />
          <span className="text-[10px] mt-0.5 tracking-tight">Stores</span>
          {viewMode === 'stores' && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-0.5 shadow-sm shadow-sky-400/50" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setViewMode('cart');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 text-center relative transition-all active:scale-95 ${
            viewMode === 'cart' || viewMode === 'checkout' || viewMode === 'confirm'
              ? 'text-sky-400 font-black'
              : 'text-slate-400 hover:text-slate-200 font-semibold'
          }`}
        >
          <div className="relative">
            <ShoppingCartOutlined style={{ fontSize: 18 }} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shadow-md shadow-blue-600/40 animate-pulse">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
          {(viewMode === 'cart' || viewMode === 'checkout' || viewMode === 'confirm') && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-0.5 shadow-sm shadow-sky-400/50" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            fetchPastOrders();
            setViewMode('orders');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 text-center transition-all active:scale-95 relative ${
            viewMode === 'orders' ? 'text-sky-400 font-black' : 'text-slate-400 hover:text-slate-200 font-semibold'
          }`}
        >
          <ClockCircleOutlined style={{ fontSize: 18 }} />
          <span className="text-[10px] mt-0.5 tracking-tight">Orders</span>
          {viewMode === 'orders' && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-0.5 shadow-sm shadow-sky-400/50" />
          )}
        </button>
      </nav>

      {/* 5. PRODUCT CUSTOMIZATION / OPTIONS MODAL */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-[32px] overflow-hidden max-h-[92vh] flex flex-col shadow-2xl ring-1 ring-white/10">
            {/* Top Sheet Drag Indicator Pill */}
            <div className="w-12 h-1 bg-slate-700/80 rounded-full mx-auto my-2.5 shrink-0 sm:hidden" />

            {/* Modal Image Header */}
            <div className="relative h-48 w-full shrink-0 bg-slate-950">
              <img
                src={customizingProduct.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

              <button
                type="button"
                onClick={() => setCustomizingProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg backdrop-blur-md transition-all active:scale-90 border border-white/10"
              >
                ✕
              </button>
              <div className="absolute bottom-2.5 left-3.5">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-blue-600/90 text-white backdrop-blur-md border border-blue-400/30 shadow">
                  {currentStore?.name}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              <div>
                <h3 className="font-black text-white text-base leading-tight">
                  {customizingProduct.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                  {customizingProduct.details}
                </p>
                <div className="text-sky-400 font-black text-sm mt-1.5 flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-semibold">Base:</span>
                  <span>${Number(customizingProduct.price).toFixed(2)}</span>
                </div>
              </div>

              {/* Options Groups */}
              {customizingProduct.options &&
                customizingProduct.options.map((optGroup: any) => (
                  <div key={optGroup.id || optGroup.name} className="space-y-2">
                    <label className="text-xs font-black text-slate-200 block uppercase tracking-wider">
                      {optGroup.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {optGroup.choices?.map((choice: any) => {
                        const isSelected = selectedOptions[optGroup.name] === choice.label;
                        return (
                          <button
                            key={choice.label}
                            type="button"
                            onClick={() => {
                              triggerHaptic('light');
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [optGroup.name]: choice.label
                              }));
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <span>{choice.label}</span>
                            {choice.price_delta && Number(choice.price_delta) > 0 && (
                              <span className="ml-1 opacity-80 text-[11px]">
                                (+${Number(choice.price_delta).toFixed(2)})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider">Quantity</span>
                <div className="flex items-center space-x-2 bg-slate-950 px-2 py-1 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCustomizeQty(Math.max(1, customizeQty - 1))}
                    className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold active:scale-90 transition-transform"
                  >
                    <MinusOutlined style={{ fontSize: 10 }} />
                  </button>
                  <span className="w-8 text-center font-black text-sm text-white">
                    {customizeQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomizeQty(customizeQty + 1)}
                    className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold active:scale-90 transition-transform"
                  >
                    <PlusOutlined style={{ fontSize: 10 }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Buttons */}
            <div className="p-3.5 border-t border-slate-800/90 bg-slate-950/90 shrink-0 space-y-2">
              <button
                type="button"
                onClick={handleAddAndCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-between px-4 shadow-xl shadow-emerald-500/25 active:scale-98 transition-all"
              >
                <span>⚡ Order &amp; Checkout Now</span>
                <span className="bg-slate-950/20 px-2 py-0.5 rounded-lg">${modalTotalPrice}</span>
              </button>

              <button
                type="button"
                onClick={handleAddCustomizedToCart}
                className="w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700/80 active:scale-98 transition-all"
              >
                <span>Add to Cart &amp; Keep Browsing</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. STORE SWITCH CONFIRMATION MODAL (Prevents mixing products between different stores) */}
      {pendingStoreSwitch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mx-auto">
              <ExclamationCircleOutlined />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-white text-base">Switch Store?</h3>
              <p className="text-xs text-slate-300">
                Your cart currently contains <b>{itemCount} item(s)</b> from{' '}
                <b>{currentCartStoreName}</b>.
              </p>
              <p className="text-xs text-slate-400">
                Products from different stores cannot be mixed in one order. Switching to{' '}
                <b>{pendingStoreSwitch.name}</b> will clear your existing cart.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={confirmStoreSwitch}
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20"
              >
                Clear Cart &amp; Switch Store
              </button>
              <button
                type="button"
                onClick={() => setPendingStoreSwitch(null)}
                className="w-full py-2.5 rounded-xl border border-slate-800 text-slate-400 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
