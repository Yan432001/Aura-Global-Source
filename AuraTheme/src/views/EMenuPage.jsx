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
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
  CameraOutlined,
  ReloadOutlined,
  PictureOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useTelegram } from '../hooks/useTelegram';
import { useFavorites } from '../hooks/useFavorites';
import simpleData from '../../../data/simpleData';
import MenuSearchBar, { HighlightMatch } from '../components/emenu/MenuSearchBar';
import OrderStatusMiniBanner from '../components/emenu/OrderStatusMiniBanner';
import { routeOrderToTelegramGroup, getStoreTelegramConfig, getAllStoreTelegramConfigs } from '../data/telegramStoreGroupManager';
import {
  isImageDeleted,
  deleteProductImage,
  restoreProductImage,
  isStoreLogoDeleted,
  deleteStoreLogo,
  restoreStoreLogo,
  getStoreDeletedCount,
} from '../data/menuImageManager';

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
  'nexus-mobile': {
    name: 'Nexus Mobile & Gadgets',
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
      'seller-6': 'nexus-mobile',
      'nexus-mobile': 'nexus-mobile',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Favorites Persistence
  const { isFavorite, toggleFavorite, favoritesCount } = useFavorites();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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

  // Customization Modal (`Opt`)
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedMilk, setSelectedMilk] = useState('Standard');
  const [selectedIce, setSelectedIce] = useState('Normal Ice');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customizeQty, setCustomizeQty] = useState(1);

  // Media deletion synchronization state
  const [mediaVersion, setMediaVersion] = useState(0);

  useEffect(() => {
    const handleMediaChange = () => setMediaVersion((v) => v + 1);
    window.addEventListener('aura_menu_image_updated', handleMediaChange);
    return () => window.removeEventListener('aura_menu_image_updated', handleMediaChange);
  }, []);

  const handleDeleteProductImage = (prod, e) => {
    e?.stopPropagation?.();
    triggerHaptic?.('medium');
    deleteProductImage(prod.id, currentSlug, prod.name, prod.image);
    message.success(`Image for "${prod.name}" deleted directly from E-Menu & synced to Telegram Store Manager!`);
  };

  const handleRestoreProductImage = (prod, e) => {
    e?.stopPropagation?.();
    triggerHaptic?.('light');
    restoreProductImage(prod.id, currentSlug);
    message.success(`Image for "${prod.name}" restored in E-Menu!`);
  };

  const handleToggleStoreLogo = (e) => {
    e?.stopPropagation?.();
    triggerHaptic?.('medium');
    const isDeleted = isStoreLogoDeleted(currentSlug);
    if (isDeleted) {
      restoreStoreLogo(currentSlug);
      message.success(`Restored logo for ${currentStore?.name || 'store'} in E-Menu!`);
    } else {
      deleteStoreLogo(currentSlug, currentStore?.name, currentStore?.logo);
      message.success(`Deleted logo for ${currentStore?.name || 'store'} from E-Menu & synced to Telegram Store Manager!`);
    }
  };

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

  // Map category ID to category name for fast category-based search
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c.id] = c.name || '';
    });
    return map;
  }, [categories]);

  // Total favorites count for current store items
  const currentStoreFavoritesCount = useMemo(() => {
    return products.filter((p) => isFavorite(p.id)).length;
  }, [products, isFavorite]);

  // Filter products by selected category, favorites bookmark filter, and real-time search query
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Real-time search query by product name (also checks details/category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const nameMatches = (p.name || '').toLowerCase().includes(q);
        const detailsMatches = (p.details || '').toLowerCase().includes(q);
        const catName = (categoryMap[p.category_id] || '').toLowerCase();
        const catMatches = catName.includes(q);
        return nameMatches || detailsMatches || catMatches;
      });

      if (showFavoritesOnly) {
        list = list.filter((p) => isFavorite(p.id));
      }

      // Sort matches with exact/prefix name matches first for fast product finding
      list.sort((a, b) => {
        const aName = (a.name || '').toLowerCase();
        const bName = (b.name || '').toLowerCase();
        const aStarts = aName.startsWith(q);
        const bStarts = bName.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return aName.localeCompare(bName);
      });

      return list;
    }

    if (showFavoritesOnly) {
      list = list.filter((p) => isFavorite(p.id));
    } else if (selectedCategory !== null) {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    return list;
  }, [products, selectedCategory, searchQuery, categoryMap, showFavoritesOnly, isFavorite]);

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
          sessionStorage.removeItem('aura_emenu_order_dismissed');
          window.dispatchEvent(new Event('aura_order_updated'));
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
          sessionStorage.removeItem('aura_emenu_order_dismissed');
          window.dispatchEvent(new Event('aura_order_updated'));
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
        sessionStorage.removeItem('aura_emenu_order_dismissed');
        window.dispatchEvent(new Event('aura_order_updated'));
      } catch (_) {}
      setCart([]);
      setIsCartOpen(false);
      message.success(`Order placed & routed to Telegram Kitchen Group! Ref: ${refNo}`);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // 8 Total Merchants across website:
  // - Merchant 'Yin' owns 2 stores: 'sbc-store' & 'aura-bakery'
  // - 7 other merchants own 1 store each (simple merchant: 1 store 1 merchant)
  const MERCHANT_OWNER_MAP = {
    'sbc-store': { owner: 'Yin', storeCount: 2 },
    'aura-bakery': { owner: 'Yin', storeCount: 2 },
    'aura-bistro': { owner: 'Pierre Dubois', storeCount: 1 },
    'aura-lounge': { owner: 'Kenji Sato', storeCount: 1 },
    'nexus-mobile': { owner: 'Alex Chen', storeCount: 1 },
    'aura-tech': { owner: 'David Kim', storeCount: 1 },
    'apex-pc': { owner: 'Elena Rostova', storeCount: 1 },
    'velour-apparel': { owner: 'Marcus Vance', storeCount: 1 },
  };

  const currentStoreOwner = MERCHANT_OWNER_MAP[currentSlug]?.owner || 'Yin';
  const [storeSwitchScope, setStoreSwitchScope] = useState('owner'); // 'owner' | 'all'

  // Master catalog of all 8 merchants across the website
  const allEightMerchantStores = useMemo(() => {
    return [
      { slug: 'sbc-store', name: 'Specialty Coffee', fullName: 'Aura Specialty Coffee', emoji: '☕', owner: 'Yin' },
      { slug: 'aura-bakery', name: 'Artisan Bakery', fullName: 'Aura Artisan Bakery', emoji: '🥐', owner: 'Yin' },
      { slug: 'aura-bistro', name: 'French Bistro', fullName: 'Aura French Bistro', emoji: '🍽️', owner: 'Pierre Dubois' },
      { slug: 'aura-lounge', name: 'Botanical Lounge & Matcha', fullName: 'Aura Botanical Lounge', emoji: '🍵', owner: 'Kenji Sato' },
      { slug: 'nexus-mobile', name: 'Nexus Mobile & Gadgets', fullName: 'Nexus Mobile & Gadgets', emoji: '📱', owner: 'Alex Chen' },
      { slug: 'aura-tech', name: 'Tech & Workstations', fullName: 'Aura Automation Tech', emoji: '💻', owner: 'David Kim' },
      { slug: 'apex-pc', name: 'Apex PC Hub', fullName: 'Apex PC & Workstation Hub', emoji: '🖥️', owner: 'Elena Rostova' },
      { slug: 'velour-apparel', name: 'Velour Apparel', fullName: 'Velour Minimalist Apparel', emoji: '👔', owner: 'Marcus Vance' },
    ];
  }, []);

  // Filtered store options: either current merchant's stores (Yin has 2, others have 1) or all 8 merchants
  const storeOptions = useMemo(() => {
    if (storeSwitchScope === 'all') {
      return allEightMerchantStores;
    }
    const ownerStores = allEightMerchantStores.filter((st) => st.owner === currentStoreOwner);
    return ownerStores.length > 0 ? ownerStores : allEightMerchantStores.slice(0, 2);
  }, [storeSwitchScope, currentStoreOwner, allEightMerchantStores]);

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
      {/* 0. PERSISTENT MINI-BANNER AT TOP (REAL-TIME ORDER STATUS) */}
      {/* ======================================================== */}
      <OrderStatusMiniBanner
        order={activeOrder}
        onOrderUpdate={setActiveOrder}
        storeName={currentStore?.name}
        triggerHaptic={triggerHaptic}
        className="sticky top-0 z-40"
      />

      {/* ======================================================== */}
      {/* 1. TOP HEADER (WEBSITE DEFAULT STYLE & ELEGANT SHADOW)   */}
      {/* ======================================================== */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Left: Avatar + Title + "Table #06 • delivery" */}
        <div
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-3 cursor-pointer select-none active:opacity-80 transition"
        >
          <div className="relative group shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#2F6FED]/25 bg-slate-100 shadow-sm relative">
              {isStoreLogoDeleted(currentSlug) ? (
                <div className="w-full h-full bg-blue-50 text-[#2F6FED] font-black text-xs flex items-center justify-center text-center p-1">
                  {currentStore?.name?.slice(0, 2)?.toUpperCase() || 'AS'}
                </div>
              ) : (
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
              )}
            </div>

            {/* Direct Logo Delete / Restore Button in Header */}
            {!isStoreLogoDeleted(currentSlug) ? (
              <button
                type="button"
                onClick={handleToggleStoreLogo}
                title="Delete store logo directly from E-Menu"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-[9px] shadow-sm cursor-pointer transition active:scale-90 border border-white"
              >
                <DeleteOutlined style={{ fontSize: 8 }} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleToggleStoreLogo}
                title="Restore store logo in E-Menu"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2F6FED] hover:bg-blue-600 text-white flex items-center justify-center text-[9px] shadow-sm cursor-pointer transition active:scale-90 border border-white"
              >
                <ReloadOutlined style={{ fontSize: 8 }} />
              </button>
            )}
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-tight flex items-center gap-1">
              <span>{currentStore?.name || activeTheme.name}</span>
            </h1>
            <p className="text-xs font-bold text-[#2F6FED] flex items-center gap-1.5 pt-0.5">
              <span>
                {customerLocation} • {diningMode}
              </span>
              <span className="text-[10px] bg-blue-50 text-[#2F6FED] px-1.5 py-0.5 rounded-md font-extrabold flex items-center gap-0.5 border border-blue-200/60">
                <span>Switch Store</span>
                <DownOutlined style={{ fontSize: 7 }} />
              </span>
            </p>
          </div>
        </div>

        {/* Right: Switch to Website View & Cart Badge */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => navigate(`/shop/menu/${currentSlug}`)}
            className="px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200/80 active:scale-95 transition cursor-pointer"
            title="Switch from App Preview to Website View"
          >
            <GlobalOutlined style={{ color: '#2563eb', fontSize: 13 }} />
            <span className="hidden sm:inline text-[11px] font-extrabold">Website View</span>
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

      {/* ======================================================== */}
      {/* 2. REAL-TIME SEARCH BAR COMPONENT AT TOP OF MENU         */}
      {/* ======================================================== */}
      <div className="px-3 sm:px-4 pt-3 pb-2 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <MenuSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder={`Search ${currentStore?.name || 'menu'} products by name...`}
          totalMatches={filteredProducts.length}
          totalItems={products.length}
          accentColor={activeTheme.accent || '#2F6FED'}
          showQuickTags={true}
          quickTags={['Croissant', 'Latte', 'Sourdough', 'Matcha', 'Cruffin']}
        />
      </div>

      {/* ======================================================== */}
      {/* 3. CATEGORY HORIZONTAL SCROLL BAR (AURA BLUE PILLS)     */}
      {/* ======================================================== */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none sticky top-[57px] z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        {/* All Items Pill */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic?.('light');
            setShowFavoritesOnly(false);
            setSelectedCategory(null);
          }}
          className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
            !showFavoritesOnly && selectedCategory === null
              ? activeTheme.pillActive
              : activeTheme.pillInactive
          }`}
        >
          All ({products.length})
        </button>

        {/* Favorites Filter Pill */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic?.('light');
            setShowFavoritesOnly(!showFavoritesOnly);
            setSelectedCategory(null);
          }}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer active:scale-95 shrink-0 flex items-center gap-1.5 ${
            showFavoritesOnly
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 border-none'
              : 'bg-rose-50/80 text-rose-600 border border-rose-200/90 hover:bg-rose-100/80 font-bold'
          }`}
          title="Filter bookmarked favorites"
        >
          <HeartFilled className={showFavoritesOnly ? 'text-white' : 'text-rose-500'} />
          <span>Favorites ({currentStoreFavoritesCount})</span>
        </button>

        {/* Category Pills */}
        {categories.map((cat) => {
          const isSelected = !showFavoritesOnly && selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                triggerHaptic?.('light');
                setShowFavoritesOnly(false);
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
      {/* 4. 2-COLUMN PRODUCT GRID (LIGHT WHITE CARDS + BLUE TAGS) */}
      {/* ======================================================== */}
      <main className="px-3 py-3 flex-1 bg-slate-50/50">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="animate-spin text-3xl">☕</div>
            <p className="text-xs text-slate-500 font-semibold">Loading menu...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs space-y-2">
            <span className="text-3xl block mb-1">{showFavoritesOnly ? '❤️' : '🔍'}</span>
            <p className="font-bold text-slate-700">
              {showFavoritesOnly
                ? 'No favorites bookmarked yet'
                : searchQuery
                ? `No items matching "${searchQuery}"`
                : 'No items found'}
            </p>
            <p className="text-slate-400">
              {showFavoritesOnly
                ? 'Tap the heart icon on any product card to bookmark it in your persistent favorites list.'
                : searchQuery
                ? 'Try searching by a different product name or category.'
                : 'Select another category above.'}
            </p>
            {(searchQuery || showFavoritesOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowFavoritesOnly(false);
                }}
                className="mt-3 px-4 py-1.5 rounded-full bg-[#2F6FED] hover:bg-[#255bc2] text-white text-xs font-bold transition cursor-pointer"
              >
                {showFavoritesOnly ? 'Browse All Menu Items' : 'Clear Search'}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                id={`product-${prod.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 p-2.5 flex flex-col justify-between space-y-2.5 transition shadow-xs hover:shadow-md hover:border-[#2F6FED]/40"
              >
                {/* Product Image with Price Badge, Favorite, and Direct Delete Image Button */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openCustomizer(prod)}
                  className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100 cursor-pointer group"
                >
                  {isImageDeleted(prod.id, currentSlug) ? (
                    <div className="w-full h-full bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-2 text-center select-none">
                      <CameraOutlined style={{ fontSize: 18 }} className="text-slate-400 mb-0.5" />
                      <span className="text-[10px] font-bold text-slate-500">Image Deleted</span>
                      <span className="text-[9px] text-slate-400">Tap to edit / restore</span>
                    </div>
                  ) : (
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
                  )}

                  {/* Direct Delete Image Button within E-Menu */}
                  {!isImageDeleted(prod.id, currentSlug) ? (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteProductImage(prod, e)}
                      className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 hover:bg-rose-600 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 transition active:scale-90 z-10 cursor-pointer shadow-sm border border-white/20"
                      title="Delete image directly within E-Menu"
                    >
                      <DeleteOutlined style={{ fontSize: 9 }} />
                      <span className="text-[9.5px]">Del Img</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleRestoreProductImage(prod, e)}
                      className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center gap-1 transition active:scale-90 z-10 cursor-pointer shadow-sm"
                      title="Restore product image"
                    >
                      <ReloadOutlined style={{ fontSize: 9 }} />
                      <span className="text-[9.5px]">Restore</span>
                    </button>
                  )}

                  {/* Bookmark Favorites Toggle Button (Top Right) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic?.('light');
                      toggleFavorite(prod.id, prod.name, e);
                    }}
                    aria-label={isFavorite(prod.id) ? `Remove ${prod.name} from favorites` : `Bookmark ${prod.name} to favorites`}
                    className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 z-10 cursor-pointer shadow-sm active:scale-90 ${
                      isFavorite(prod.id)
                        ? 'bg-rose-50 text-rose-500 border border-rose-200 shadow-rose-200/50 scale-105'
                        : 'bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-white border border-slate-200/80'
                    }`}
                    title={isFavorite(prod.id) ? 'Bookmarked in Favorites (Click to remove)' : 'Bookmark to Favorites'}
                  >
                    {isFavorite(prod.id) ? (
                      <HeartFilled className="text-rose-500 text-xs" />
                    ) : (
                      <HeartOutlined className="text-xs" />
                    )}
                  </button>

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
                    <HighlightMatch text={prod.name} query={searchQuery} />
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
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Switch Store / Branch
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setStoreSwitchScope('owner')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                        storeSwitchScope === 'owner' ? 'bg-white text-[#2F6FED] shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      {currentStoreOwner === 'Yin' ? "Yin (2 Stores)" : `${currentStoreOwner.split(' ')[0]} (1 Store)`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoreSwitchScope('all')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                        storeSwitchScope === 'all' ? 'bg-white text-[#2F6FED] shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      8 Merchants
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs max-h-52 overflow-y-auto pr-0.5 scrollbar-thin">
                {storeOptions.map((st) => (
                  <button
                    key={st.slug}
                    type="button"
                    onClick={() => {
                      setIsLocationModalOpen(false);
                      if (st.slug !== currentSlug) {
                        navigate(`/shop/${st.slug}`);
                        message.success(`Switched store to ${st.fullName || st.name}! (Owner: ${st.owner})`);
                      }
                    }}
                    className={`p-2.5 rounded-xl font-bold text-left transition flex items-center justify-between gap-1.5 cursor-pointer active:scale-95 ${
                      currentSlug === st.slug
                        ? 'bg-blue-50 text-[#2F6FED] border border-[#2F6FED]/50 shadow-xs ring-1 ring-[#2F6FED]/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm shrink-0">{st.emoji}</span>
                      <div className="truncate">
                        <span className="block truncate">{st.name}</span>
                        {storeSwitchScope === 'all' && (
                          <span className="block text-[9.5px] text-slate-400 font-normal truncate">
                            by {st.owner}
                          </span>
                        )}
                      </div>
                    </div>
                    {currentSlug === st.slug && (
                      <span className="text-[10px] text-blue-600 font-bold shrink-0">✓</span>
                    )}
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
                <span className="text-[#2F6FED] font-semibold text-[11px] truncate max-w-[320px]">
                  Telegram Mini App ({currentStore?.name || currentSlug})
                </span>
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
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    triggerHaptic?.('light');
                    toggleFavorite(customizingProduct.id, customizingProduct.name, e);
                  }}
                  className={`p-1.5 rounded-full flex items-center justify-center transition cursor-pointer ${
                    isFavorite(customizingProduct.id)
                      ? 'text-rose-500 bg-rose-50'
                      : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                  }`}
                  title={isFavorite(customizingProduct.id) ? 'Bookmarked in Favorites' : 'Bookmark to Favorites'}
                >
                  {isFavorite(customizingProduct.id) ? (
                    <HeartFilled className="text-rose-500 text-sm" />
                  ) : (
                    <HeartOutlined className="text-sm" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCustomizingProduct(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <CloseOutlined />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-3 min-w-0">
                {isImageDeleted(customizingProduct.id, currentSlug) ? (
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 select-none">
                    <CameraOutlined style={{ fontSize: 16 }} />
                    <span className="text-[9px] font-bold mt-0.5">Deleted</span>
                  </div>
                ) : (
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
                )}
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-900 truncate">{customizingProduct.name}</h4>
                  <span className="font-mono text-xs font-bold text-[#2F6FED]">
                    Base Price: ${Number(customizingProduct.price).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Direct Image Delete / Restore Action in Customizer Modal */}
              <div className="shrink-0">
                {!isImageDeleted(customizingProduct.id, currentSlug) ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteProductImage(customizingProduct)}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 shadow-2xs"
                    title="Delete image directly from E-Menu"
                  >
                    <DeleteOutlined />
                    <span>Delete Image</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRestoreProductImage(customizingProduct)}
                    className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2F6FED] border border-blue-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 shadow-2xs"
                    title="Restore image"
                  >
                    <ReloadOutlined />
                    <span>Restore Image</span>
                  </button>
                )}
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
    </div>
  );
}
