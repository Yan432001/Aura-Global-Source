import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import {
  ShoppingCartOutlined,
  ReloadOutlined,
  SearchOutlined,
  CheckOutlined,
  SendOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  StarFilled,
  ThunderboltFilled,
  CoffeeOutlined,
  FireOutlined,
  TagOutlined,
  ClockCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';

export default function EMenuPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract active store slug from URL or fallback
  const currentSlug = useMemo(() => {
    if (params.storeSlug) return params.storeSlug;
    const parts = location.pathname.split('/');
    if (parts[1] === 'shop' && parts[2] && parts[2] !== 'not-found') {
      return parts[2];
    }
    return 'aura-bakery';
  }, [params.storeSlug, location.pathname]);

  // Tab Navigation: 'menu' | 'tma' | 'kitchen' | 'story' | 'diagnostics'
  const [activeTab, setActiveTab] = useState('menu');

  // Stores & Catalog State
  const [stores, setStores] = useState([]);
  const [currentStore, setCurrentStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Cart Drawer State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_emenu_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [diningMode, setDiningMode] = useState('dine_in'); // 'dine_in' | 'takeaway' | 'delivery'
  const [customerLocation, setCustomerLocation] = useState('Table #06 (Main Hall)');
  const [customerName, setCustomerName] = useState('Sophie Laurent');
  const [customerPhone, setCustomerPhone] = useState('+855 12 345 679');
  const [customerTg, setCustomerTg] = useState('@sophie_bakery');
  const [customerNote, setCustomerNote] = useState('');
  const [hasClaimedCoupon, setHasClaimedCoupon] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Customization Modal State
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedMilk, setSelectedMilk] = useState('Whole Milk');
  const [selectedIce, setSelectedIce] = useState('Normal Ice (100%)');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customizeQty, setCustomizeQty] = useState(1);

  // Kitchen Stream State
  const [liveOrders, setLiveOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // CMS Brand Story & Inquiries State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // API Diagnostics State
  const [diagnosticLogs, setDiagnosticLogs] = useState([]);
  const [testingEndpoint, setTestingEndpoint] = useState(false);

  // Simulated TMA User State
  const [tmaUserId, setTmaUserId] = useState('9841203');
  const [tmaCategory, setTmaCategory] = useState('all');

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('aura_emenu_cart_v2', JSON.stringify(cart));
    } catch (e) {
      console.warn(e);
    }
  }, [cart]);

  // 1. Fetch Stores List
  const fetchStores = useCallback(async () => {
    try {
      const res = await axios.get('/api/tma/stores');
      if (res.data?.status && Array.isArray(res.data.data)) {
        setStores(res.data.data);
      }
    } catch (err) {
      console.warn('Error loading stores:', err);
    }
  }, []);

  // 2. Fetch Store Details & Products
  const fetchStoreData = useCallback(async (slug) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/tma/store/${slug}`);
      if (res.data?.status && res.data.store) {
        setCurrentStore(res.data.store);
        setCategories(res.data.categories || []);
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.warn('Error loading store data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Fetch Live Orders
  const fetchLiveOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get('/api/tma/orders');
      if (res.data?.status) {
        setLiveOrders(res.data.orders || res.data.data || []);
      }
    } catch (err) {
      console.warn('Error loading orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
    fetchStoreData(currentSlug);
    fetchLiveOrders();
  }, [fetchStores, fetchStoreData, fetchLiveOrders, currentSlug]);

  // Polling for live orders
  useEffect(() => {
    const timer = setInterval(() => {
      fetchLiveOrders();
    }, 12000);
    return () => clearInterval(timer);
  }, [fetchLiveOrders]);

  // Branch Switcher
  const handleSwitchStore = (slug) => {
    navigate(`/shop/${slug}`);
    setSelectedCategory(null);
    setSearchQuery('');
  };

  // Filter Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = !selectedCategory || p.category_id === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.details?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Open Customization Modal
  const openCustomizer = (product) => {
    setCustomizingProduct(product);
    setSelectedSize('Regular');
    setSelectedMilk('Whole Milk');
    setSelectedIce('Normal Ice (100%)');
    setSpecialInstructions('');
    setCustomizeQty(1);
  };

  // Add Direct to Cart
  const handleDirectAddToCart = (product) => {
    const existingIdx = cart.findIndex(
      (item) => item.id === product.id && Object.keys(item.options || {}).length === 0
    );

    if (existingIdx !== -1) {
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
    message.success({ content: `Added ${product.name} to basket!`, duration: 1.5 });
  };

  // Add Customized to Cart
  const handleAddCustomizedToCart = () => {
    if (!customizingProduct) return;
    let priceAdj = 0;
    if (selectedSize === 'Large (+ $1.00)') priceAdj += 1.0;
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
    message.success(`Added ${customizeQty}x ${customizingProduct.name} to basket!`);
  };

  // Cart Qty Modifiers
  const handleUpdateCartQty = (idx, delta) => {
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

  // Submit Order to Kitchen & Telegram Bot
  const handleConfirmOrder = async () => {
    if (cart.length === 0 || isSubmittingOrder) return;
    setIsSubmittingOrder(true);

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
        name: customerName || 'Sophie Laurent',
        username: customerTg || '@sophie_bakery',
        phone: customerPhone || '+855 12 345 679',
        address: customerLocation || 'Table #06',
        note: customerNote || `E-Menu Order (${diningMode.toUpperCase()})`,
        telegramId: Number(tmaUserId) || 9841203
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
        fetchLiveOrders();
        message.success(`Order placed! Ref: ${res.data.data.referenceNo}`);
        setActiveTab('kitchen');
      } else {
        message.error(`Order failed: ${res.data?.message || 'Server error'}`);
      }
    } catch (err) {
      message.error(err.response?.data?.message || err.message || 'Error submitting order');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Status Stepper in Kitchen Stream
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.post(`/api/tma/orders/${orderId}/status`, { status: newStatus });
      if (res.data?.status) {
        message.success(`Status updated: ${newStatus}`);
        fetchLiveOrders();
      }
    } catch (err) {
      message.error(err.response?.data?.error || 'Failed to update order');
    }
  };

  // Run API Diagnostics Test
  const runApiTest = async (name, url, method = 'GET') => {
    setTestingEndpoint(true);
    const start = performance.now();
    try {
      const res = await axios({ method, url });
      const duration = Math.round(performance.now() - start);
      setDiagnosticLogs((prev) => [
        {
          id: Date.now(),
          name,
          url,
          status: res.status,
          duration,
          success: true,
          data: res.data
        },
        ...prev
      ]);
      message.success(`${name}: 200 OK (${duration}ms)`);
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      setDiagnosticLogs((prev) => [
        {
          id: Date.now(),
          name,
          url,
          status: err.response?.status || 500,
          duration,
          success: false,
          error: err.message
        },
        ...prev
      ]);
      message.error(`${name}: Failed`);
    } finally {
      setTestingEndpoint(false);
    }
  };

  // Submit Inquiry
  const handleSendInquiry = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/cms/inquiries', {
        name: inquiryName,
        email: inquiryEmail,
        message: inquiryMsg
      });
      setInquirySent(true);
      message.success('Inquiry submitted to Aura Hospitality management!');
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMsg('');
      setTimeout(() => setInquirySent(false), 5000);
    } catch (err) {
      message.error('Failed to submit inquiry');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-stone-900 pb-24 font-sans selection:bg-amber-600 selection:text-white">
      
      {/* ======================================================== */}
      {/* 1. STORE HERO BANNER (Cinematic & High-End)              */}
      {/* ======================================================== */}
      <section className="relative w-full bg-stone-950 text-white overflow-hidden shadow-xl">
        {/* Ambient Hero Background with subtle dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40 scale-105"
          style={{
            backgroundImage: `url(${
              currentStore?.banner ||
              'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80'
            })`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Left: Store Branding, Avatar & Tagline */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden ring-4 ring-white/20 shadow-2xl bg-stone-800 shrink-0">
                <img
                  src={
                    currentStore?.logo ||
                    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={currentStore?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Open Now</span>
                  </span>
                  <span className="text-xs text-stone-300 font-medium">
                    {currentStore?.operating_hours || '7:00 AM - 7:00 PM'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-amber-300 font-bold bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    <StarFilled className="text-amber-400" />
                    <span>{currentStore?.rating || '4.9'}</span>
                    <span className="text-stone-300 text-[10px] font-normal">(480+ Reviews)</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {currentStore?.name || 'Aura Artisan Bakery'}
                </h1>

                <p className="text-xs sm:text-sm text-stone-200 max-w-2xl font-light leading-relaxed">
                  {currentStore?.description ||
                    'Artisanal bakery crafting slow-fermented sourdough, flaky French butter croissants, and seasonal pastries.'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <EnvironmentOutlined className="text-amber-400" />
                    <span>{currentStore?.address || 'Street 240, Daun Penh, Phnom Penh'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <PhoneOutlined className="text-amber-400" />
                    <span>{currentStore?.phone || '+855 12 345 679'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold bg-white/10 px-2.5 py-0.5 rounded-lg backdrop-blur-xs">
                    <SendOutlined />
                    <span>Telegram Order Dispatch Active</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Basket Summary Button */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF5722] to-amber-500 hover:from-[#E64A19] hover:to-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-3 shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer border border-white/20"
              >
                <ShoppingCartOutlined style={{ fontSize: 18 }} />
                <span>View Basket</span>
                <span className="bg-black/25 px-2 py-0.5 rounded-lg text-[11px] font-mono">
                  {totalItemCount} items
                </span>
                <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-[12px] font-mono font-black">
                  ${cartGrandTotal}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Suite Tab Switcher Toolbar */}
        <div className="bg-stone-900/90 border-t border-stone-800/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
              {[
                { id: 'menu', label: '🛍️ Store Catalog', count: products.length },
                { id: 'tma', label: '📱 Telegram Mini App', count: null },
                { id: 'kitchen', label: '👨‍🍳 Kitchen Station', count: liveOrders.length },
                { id: 'story', label: '✨ Heritage & Story', count: null },
                { id: 'diagnostics', label: '⚡ API Diagnostics', count: null }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#FF5722] text-white shadow-md shadow-orange-500/30'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-white text-[#FF5722]' : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. MAIN CONTAINER BY ACTIVE TAB                           */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* -------------------------------------------------------- */}
        {/* TAB 1: STORE CATALOG (STORE MENU)                        */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Category Filter Pills & Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === null
                      ? 'bg-[#FF5722] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
                  }`}
                >
                  All Items ({products.length})
                </button>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count = products.filter((p) => p.category_id === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF5722] text-white shadow-sm'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="ml-1.5 opacity-60 text-[10px]">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full md:w-72 shrink-0">
                <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pastries, sourdough, espresso..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-9 pr-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#FF5722] focus:bg-white transition-all"
                />
              </div>

            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="py-24 text-center text-stone-400 space-y-3">
                <div className="animate-spin text-3xl text-[#FF5722]">☕</div>
                <p className="text-sm font-semibold">Loading artisan catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-2 text-stone-400">
                <p className="text-sm font-bold text-stone-700">No items match your criteria</p>
                <p className="text-xs">Try selecting another category or clearing your search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image with Price Badge */}
                      <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-stone-950/85 backdrop-blur-md text-amber-300 font-mono font-black text-xs shadow-md">
                          ${Number(prod.price).toFixed(2)}
                        </div>
                        <div className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-lg bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold">
                          {prod.category_name || currentStore?.name?.split(' ')[1] || 'Artisan'}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-5 space-y-2">
                        <h3 className="font-extrabold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-[#FF5722] transition-colors">
                          {prod.name}
                        </h3>
                        <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                          {prod.details || 'Handmade fresh daily using authentic artisanal ingredients.'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-5 pb-5 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openCustomizer(prod)}
                        className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                      >
                        Customize
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDirectAddToCart(prod)}
                        className="px-4 py-2 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-black shadow-xs active:scale-95 transition-all cursor-pointer"
                      >
                        + Add to Basket
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 2: TELEGRAM MINI APP (TMA) SIMULATOR                 */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'tma' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Telegram Integration Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#FF5722] font-black text-xs uppercase tracking-wider">
                  <ThunderboltFilled />
                  <span>Real-time Telegram Mini App Simulator</span>
                </div>

                <h3 className="text-xl font-extrabold text-stone-900 leading-tight">
                  Seamless Ordering Inside Telegram
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Guests open the menu directly from their Telegram chat by clicking <code>/start</code> or following deep links like <code>https://t.me/aura_emenu_order_bot/menu?startapp=shop_{currentSlug}</code>. Orders dispatched here broadcast directly to the kitchen channel.
                </p>

                {/* Simulated Credentials Box */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-3">
                  <span className="text-[11px] font-black text-stone-800 uppercase tracking-wider block">
                    Simulated Telegram Customer Context
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Telegram ID</label>
                      <input
                        type="text"
                        value={tmaUserId}
                        onChange={(e) => setTmaUserId(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-white border border-stone-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Telegram Handle</label>
                      <input
                        type="text"
                        value={customerTg}
                        onChange={(e) => setCustomerTg(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-white border border-stone-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Full Customer Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Bot Commands */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-stone-800">Supported Bot Commands:</span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                      <span className="text-[#FF5722] font-bold">/start [store]</span>
                      <span className="text-stone-500">Launches store TMA</span>
                    </div>
                    <div className="flex justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                      <span className="text-[#FF5722] font-bold">/shops</span>
                      <span className="text-stone-500">List all branches</span>
                    </div>
                    <div className="flex justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                      <span className="text-[#FF5722] font-bold">/orders</span>
                      <span className="text-stone-500">Live order status</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Realistic Smartphone Simulator */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-[390px] bg-stone-900 rounded-[50px] p-3.5 shadow-2xl border-4 border-stone-700">
                <div className="relative bg-[#FAF7F2] rounded-[42px] overflow-hidden flex flex-col h-[740px] text-stone-900">
                  
                  {/* TMA Header */}
                  <div className="bg-stone-900 text-white px-5 py-3 flex items-center justify-between text-xs select-none shrink-0 z-30">
                    <span className="text-stone-400">Close</span>
                    <div className="text-center">
                      <div className="font-black text-xs truncate max-w-[180px]">
                        {currentStore?.name || 'Aura Artisan Bakery'}
                      </div>
                      <div className="text-[9px] text-amber-400">
                        Telegram Mini App • @aura_emenu_order_bot
                      </div>
                    </div>
                    <span className="text-stone-400">•••</span>
                  </div>

                  {/* Delivery / Table Bar */}
                  <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-stone-200 text-xs shrink-0">
                    <div>
                      <span className="text-[9px] font-bold text-stone-400 block uppercase">Fulfillment</span>
                      <span className="font-bold text-stone-800 text-[11px]">
                        {customerLocation}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-[#FF5722] text-[10px] font-bold">
                      {currentSlug}
                    </span>
                  </div>

                  {/* Phone Inner Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                    
                    {/* Voucher Banner */}
                    <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-[#FF5722] text-white p-3.5 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black uppercase">
                          VIP 20% DISCOUNT
                        </span>
                        <h4 className="font-black text-xs mt-0.5">Code: FIRST20</h4>
                        <p className="text-[10px] text-amber-100">Enjoy 20% off all handcrafted items</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHasClaimedCoupon(true);
                          message.success('20% coupon applied!');
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition ${
                          hasClaimedCoupon
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-white text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        {hasClaimedCoupon ? 'Claimed ✓' : 'Claim'}
                      </button>
                    </div>

                    {/* Products Grid in Phone */}
                    <div className="space-y-2">
                      <span className="font-extrabold text-stone-800 text-xs block">
                        Featured Items ({products.length})
                      </span>
                      <div className="grid grid-cols-2 gap-2.5">
                        {products.map((p) => (
                          <div
                            key={p.id}
                            className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between space-y-2"
                          >
                            <div className="relative h-24 rounded-xl overflow-hidden bg-stone-100">
                              <img src={p.image} alt="" className="w-full h-full object-cover" />
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-lg text-[9px] font-black bg-stone-950/80 text-white font-mono">
                                ${Number(p.price).toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-bold text-stone-900 text-[11px] truncate">
                                {p.name}
                              </h5>
                              <p className="text-[10px] text-stone-400 line-clamp-1">
                                {p.details || ''}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDirectAddToCart(p)}
                              className="w-full py-1 bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold rounded-lg text-[10px] active:scale-95 transition cursor-pointer"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Phone Bottom Cart Bar */}
                  <div className="p-3.5 bg-white border-t border-stone-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(true)}
                      className="w-full py-2.5 px-4 bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold rounded-2xl flex items-center justify-between text-xs shadow-md transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🛍️ View Basket</span>
                        <span className="bg-white/20 px-1.5 py-0.5 rounded-lg text-[10px]">
                          {totalItemCount}
                        </span>
                      </span>
                      <span className="font-mono">${cartGrandTotal}</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 3: KITCHEN STATION & ORDERS STREAM                   */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'kitchen' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <div>
                <h3 className="text-xl font-extrabold text-stone-900">
                  👨‍🍳 Kitchen Station &amp; Real-time Orders Feed
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Track orders through lifecycle (Pending → Confirmed → Preparing → Ready → Completed) &amp; Telegram dispatch status.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchLiveOrders}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <ReloadOutlined spin={loadingOrders} />
                <span>Refresh Stream</span>
              </button>
            </div>

            {liveOrders.length === 0 ? (
              <div className="p-20 text-center bg-white rounded-3xl border border-stone-200 text-stone-400 text-xs space-y-2">
                <span className="text-3xl block">📋</span>
                <p className="font-bold text-stone-700">No active kitchen orders</p>
                <p>Orders submitted from the Store Menu or Telegram app appear here immediately.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveOrders.map((ord) => {
                  const statusColors = {
                    Pending: 'bg-amber-100 text-amber-800 border-amber-300',
                    Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
                    Preparing: 'bg-purple-100 text-purple-800 border-purple-300',
                    Ready: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    Completed: 'bg-stone-100 text-stone-800 border-stone-300'
                  };

                  const nextStatusMap = {
                    Pending: 'Confirmed',
                    Confirmed: 'Preparing',
                    Preparing: 'Ready',
                    Ready: 'Completed'
                  };
                  const nextStatus = nextStatusMap[ord.status];

                  return (
                    <div
                      key={ord.id || ord.referenceNo}
                      className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-stone-900 text-sm">
                              {ord.referenceNo}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                                statusColors[ord.status] || 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <span className="text-xs text-stone-400">
                            {ord.created_at ? new Date(ord.created_at).toLocaleTimeString() : 'Just now'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-stone-400">Customer &amp; Table</span>
                          <p className="font-bold text-stone-800">{ord.customer?.name || 'Guest'}</p>
                          <p className="text-stone-500 font-mono text-[11px]">{ord.customer?.username || '@guest'}</p>
                          <p className="text-stone-600 font-medium">📍 {ord.customer?.address || 'Dine-In'}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-stone-400">Order Items</span>
                          <div className="space-y-1 bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                            {(ord.items || []).map((it, idx) => (
                              <div key={idx} className="flex justify-between text-xs py-0.5">
                                <span>{it.quantity}x {it.name}</span>
                                <span className="font-mono font-bold">
                                  ${Number(it.subtotal || it.price * it.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="font-black text-stone-900 text-sm font-mono">
                          Total: ${Number(ord.grandTotal || ord.totalAmount || 0).toFixed(2)}
                        </span>
                        {nextStatus ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.id, nextStatus)}
                            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs active:scale-95 transition cursor-pointer"
                          >
                            Mark as {nextStatus} →
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold text-xs">✓ Order Completed</span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 4: HERITAGE & BRAND STORY                            */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'story' && (
          <div className="space-y-8">
            <div className="relative rounded-3xl overflow-hidden bg-stone-950 text-white p-8 sm:p-12 shadow-xl min-h-[300px] flex items-center">
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ✨ ARTISAN HERITAGE
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                  Slow Fermentation, French Butter &amp; Highland Roasts
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Every loaf of sourdough undergoes a 72-hour cold fermentation process. Our viennoiserie is rolled with pure Normandy butter, delivering crisp golden layers with an airy honeycomb crumb.
                </p>
              </div>
            </div>

            {/* Concierge Inquiry Form */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs max-w-xl mx-auto space-y-4">
              <h3 className="text-lg font-extrabold text-stone-900 text-center">
                Private Orders &amp; Event Catering
              </h3>
              <p className="text-xs text-stone-500 text-center">
                Inquire about custom sourdough bread baskets, pastry catering, or specialty coffee popups.
              </p>
              <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:border-[#FF5722]"
                />
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:border-[#FF5722]"
                />
                <textarea
                  required
                  rows={3}
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  placeholder="Tell us about your event, date, or bakery requirements..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:border-[#FF5722]"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  Submit Inquiry
                </button>
                {inquirySent && (
                  <p className="text-center font-bold text-emerald-600 text-xs">
                    ✓ Your inquiry was received. We will respond shortly!
                  </p>
                )}
              </form>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 5: API DIAGNOSTICS                                   */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'diagnostics' && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-xs">
            <div>
              <h3 className="text-xl font-extrabold text-stone-900">
                ⚡ API Diagnostics &amp; Health Harness
              </h3>
              <p className="text-stone-500">Live endpoint inspection and latency testing.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { name: 'System Health', url: '/api/health' },
                { name: 'Stores List', url: '/api/tma/stores' },
                { name: `Active Store (${currentSlug})`, url: `/api/tma/shop/${currentSlug}` },
                { name: 'Kitchen Orders', url: '/api/tma/orders' },
                { name: 'CMS All Content', url: '/api/cms/all' }
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  disabled={testingEndpoint}
                  onClick={() => runApiTest(item.name, item.url)}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold border border-stone-200 transition cursor-pointer"
                >
                  Test {item.name}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">
                Diagnostics Results:
              </span>
              {diagnosticLogs.length === 0 ? (
                <p className="text-stone-400 italic">Click an endpoint above to run real-time checks.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {diagnosticLogs.map((log) => (
                    <div key={log.id} className="bg-stone-950 text-white rounded-2xl p-4 font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-amber-400 font-bold">{log.name}</span>
                        <span className="text-stone-400">{log.duration}ms • {log.status}</span>
                      </div>
                      <div className="text-[11px] text-stone-400">{log.url}</div>
                      <pre className="max-h-32 overflow-y-auto text-emerald-400 text-[10px] p-2 bg-black/40 rounded-xl">
                        {JSON.stringify(log.data || log.error, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* 3. PRODUCT CUSTOMIZER MODAL                               */}
      {/* ======================================================== */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-xs">
            
            <div className="relative h-44 w-full bg-stone-100 shrink-0">
              <img src={customizingProduct.image} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCustomizingProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-stone-800 flex items-center justify-center font-bold shadow-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">{customizingProduct.name}</h3>
                <p className="text-stone-500 mt-0.5">{customizingProduct.details}</p>
                <span className="font-black text-sm text-[#FF5722] mt-1 block font-mono">
                  Base Price: ${Number(customizingProduct.price).toFixed(2)}
                </span>
              </div>

              {/* Size selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-800 block">Serving Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Regular', 'Large (+ $1.00)'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`p-2 rounded-xl text-center font-bold transition cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#FF5722] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-800 block">Milk Choice</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Whole Milk', 'Oat (+$0.60)', 'Almond (+$0.60)'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMilk(m)}
                      className={`p-2 rounded-xl text-center font-bold transition cursor-pointer ${
                        selectedMilk === m
                          ? 'bg-[#FF5722] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {m.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="font-bold text-stone-800">Quantity</span>
                <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setCustomizeQty(Math.max(1, customizeQty - 1))}
                    className="w-6 h-6 rounded-lg bg-white text-stone-800 font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-black">{customizeQty}</span>
                  <button
                    type="button"
                    onClick={() => setCustomizeQty(customizeQty + 1)}
                    className="w-6 h-6 rounded-lg bg-[#FF5722] text-white font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 bg-white shrink-0">
              <button
                type="button"
                onClick={handleAddCustomizedToCart}
                className="w-full py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer"
              >
                Add Customized to Basket
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SLIDE-OUT CART DRAWER                                  */}
      {/* ======================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl text-xs">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛍️</span>
                <h3 className="font-extrabold text-stone-900 text-sm">Your Order Basket</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-[#FF5722]">
                  {totalItemCount} items
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="py-24 text-center text-stone-400 space-y-2">
                  <span className="text-4xl block">🧺</span>
                  <p className="font-bold text-stone-700">Your basket is empty</p>
                  <p className="text-[11px]">Select artisan pastries or coffee from the menu.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={item.image} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                        <div className="overflow-hidden">
                          <h4 className="font-extrabold text-stone-900 truncate">{item.name}</h4>
                          <span className="text-[10px] text-stone-500 block">
                            ${Number(item.price).toFixed(2)} each
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(idx, -1)}
                          className="w-6 h-6 rounded-lg bg-white font-bold text-stone-700 flex items-center justify-center cursor-pointer border border-stone-200"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-black">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(idx, 1)}
                          className="w-6 h-6 rounded-lg bg-[#FF5722] font-bold text-white flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fulfillment Options */}
              {cart.length > 0 && (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 mt-4">
                  <label className="font-black text-stone-800 text-[10px] uppercase tracking-wider block">
                    Dining Preference
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'dine_in', label: 'Dine-In' },
                      { id: 'takeaway', label: 'Takeaway' },
                      { id: 'delivery', label: 'Delivery' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setDiningMode(mode.id)}
                        className={`py-1.5 px-2 rounded-xl font-bold text-center transition cursor-pointer ${
                          diningMode === mode.id
                            ? 'bg-[#FF5722] text-white shadow-xs'
                            : 'bg-white text-stone-700 border border-stone-200'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      {diningMode === 'dine_in' ? 'Table Number' : 'Delivery / Pickup Address'}
                    </label>
                    <input
                      type="text"
                      value={customerLocation}
                      onChange={(e) => setCustomerLocation(e.target.value)}
                      placeholder={diningMode === 'dine_in' ? 'e.g. Table #06' : 'Street address'}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-stone-100 bg-white space-y-3 shrink-0">
                <div className="space-y-1 text-stone-600 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {hasClaimedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount (FIRST20 - 20%):</span>
                      <span className="font-mono">-${cartDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {diningMode === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="font-mono">$1.50</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-stone-900 pt-1.5 border-t border-stone-100">
                    <span>Total:</span>
                    <span className="text-[#FF5722] font-mono text-base">${cartGrandTotal}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSubmittingOrder}
                  onClick={handleConfirmOrder}
                  className="w-full py-3.5 bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-orange-500/25 transition active:scale-98 cursor-pointer flex items-center justify-between px-5"
                >
                  <span>{isSubmittingOrder ? 'Dispatching...' : 'Send Order to Kitchen ✈️'}</span>
                  <span>${cartGrandTotal}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
