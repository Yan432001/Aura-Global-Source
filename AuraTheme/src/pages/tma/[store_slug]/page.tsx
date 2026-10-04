import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import jsQR from 'jsqr';
import { message } from 'antd';
import {
  ShopOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
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
  CheckOutlined,
  FireOutlined,
  CopyOutlined,
  ThunderboltOutlined,
  BellOutlined,
  QrcodeOutlined,
  ScanOutlined,
  CameraOutlined,
  HeartOutlined,
  HeartFilled,
  HomeOutlined,
  AppstoreOutlined,
  DownOutlined,
  RightOutlined,
  TagOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import { useTelegram } from '../../../hooks/useTelegram';
import { useStoreCart } from '../../../hooks/useStoreCart';
import OrderReceiptModal from '../../../components/common/OrderReceiptModal';

export default function StoreFront() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tg, user, initData, startParam, triggerHaptic } = useTelegram();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<any>(null);

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

  // Navigation View: 'home' | 'menu' | 'cart' | 'checkout' | 'confirm' | 'success' | 'orders' | 'wishlist' | 'cms' | 'kitchen'
  const [viewMode, setViewMode] = useState<
    'home' | 'menu' | 'cart' | 'checkout' | 'confirm' | 'success' | 'orders' | 'wishlist' | 'cms' | 'kitchen'
  >('home');

  // CMS & Inquiry state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.post(`/api/tma/orders/${orderId}/status`, { status });
      message.success(`Order marked as ${status}`);
      fetchPastOrders(true);
    } catch (e: any) {
      message.error(e.response?.data?.error || 'Failed to update order');
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/cms/inquiries', {
        name: inquiryName,
        email: inquiryEmail,
        message: inquiryMessage
      });
      setInquirySent(true);
      message.success('Inquiry submitted!');
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
      setTimeout(() => setInquirySent(false), 4000);
    } catch (e: any) {
      message.error('Failed to send inquiry');
    }
  };

  // Fast food category filter matching image.png: 'all' | 'burger' | 'pizza' | 'chicken' | 'snacks' | 'drinks'
  const [selectedFastFoodCat, setSelectedFastFoodCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Branch Selector Modal
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('221B Baker Street, London');
  const [diningMode, setDiningMode] = useState<'delivery' | 'dine_in' | 'takeaway'>('delivery');

  // Wishlist state (persisted)
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('aura_emenu_wishlist');
      return saved ? JSON.parse(saved) : [101, 102];
    } catch {
      return [101, 102];
    }
  });

  // Flash Offer 20% discount coupon state
  const [hasClaimedFlashOffer, setHasClaimedFlashOffer] = useState(false);
  const [couponCode, setCouponCode] = useState('');

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
    restoreCartFromOrder,
    isDifferentStore,
    currentCartStoreSlug,
    currentCartStoreName
  } = useStoreCart(activeSlug, currentStore?.name || '');

  // Options / Variant Customization Modal State
  const [customizingProduct, setCustomizingProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [customizeQty, setCustomizeQty] = useState<number>(1);

  // Store Switch Warning Modal State
  const [pendingStoreSwitch, setPendingStoreSwitch] = useState<any>(null);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('221B Baker Street, London');
  const [customerNote, setCustomerNote] = useState('');

  // Confirmation & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<any>(null);

  // My Orders State & Real-Time Sync
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [syncSecondsAgo, setSyncSecondsAgo] = useState(0);
  const [expandedTimelineId, setExpandedTimelineId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Staff Mode Toggle for testing order status update & Telegram notification retry
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);

  // QR Code Scanner State & Camera Controls
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [manualQrInput, setManualQrInput] = useState('');
  const [scanSuccessBanner, setScanSuccessBanner] = useState<{
    message: string;
    storeName: string;
    table?: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Fetch Available Stores / Branches
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
      }
    } catch (err) {
      console.warn('Error loading store:', err);
    } finally {
      setLoadingStore(false);
    }
  }, []);

  // 3. Fetch Past Orders with silent mode for real-time background sync
  const fetchPastOrders = useCallback(async (silent = false) => {
    if (!silent) setLoadingOrders(true);
    try {
      const res = await axios.get('/api/tma/orders');
      if (res.data?.status) {
        const orderList = res.data.orders || res.data.data || [];
        setPastOrders(orderList);
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.warn('Error loading orders:', err);
    } finally {
      if (!silent) setLoadingOrders(false);
    }
  }, []);

  // Sync activeSlug when URL parameter changes (/shop/:storeSlug)
  useEffect(() => {
    const slug = (params.storeSlug as string) || (params.store_slug as string);
    if (slug && slug !== activeSlug) {
      setActiveSlug(slug);
      fetchStoreData(slug);
    }
  }, [params.storeSlug, params.store_slug, activeSlug, fetchStoreData]);

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
      setCustomerName((prev) => prev || 'Guest Customer');
    }
  }, [user]);

  // Timer to show relative time since last backend sync ("Synced 3s ago")
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncSecondsAgo(Math.floor((Date.now() - lastSyncTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastSyncTime]);

  // Real-time backend polling for orders
  useEffect(() => {
    let interval: any = null;
    const hasActiveOrders = pastOrders.some((o) =>
      ['pending', 'confirmed', 'preparing', 'ready'].includes((o.status || '').toLowerCase())
    );

    if (viewMode === 'orders' || hasActiveOrders) {
      interval = setInterval(() => {
        fetchPastOrders(true);
      }, 3500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [viewMode, pastOrders, fetchPastOrders]);

  // Save wishlist to localStorage
  const toggleWishlist = (prodId: number) => {
    triggerHaptic('light');
    setWishlistIds((prev) => {
      const next = prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId];
      try {
        localStorage.setItem('aura_emenu_wishlist', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Switch Store Branch
  const handleSelectBranch = (store: any) => {
    triggerHaptic('medium');
    setIsBranchModalOpen(false);

    if (cart.length > 0 && currentCartStoreSlug && currentCartStoreSlug !== store.slug) {
      setPendingStoreSwitch(store);
      return;
    }

    setActiveSlug(store.slug);
    fetchStoreData(store.slug);
    navigate(`/shop/${store.slug}`);
    setSelectedFastFoodCat('all');
  };

  const confirmStoreSwitch = () => {
    if (!pendingStoreSwitch) return;
    triggerHaptic('medium');
    clearAndSwitchStore(pendingStoreSwitch.slug, pendingStoreSwitch.name);
    setActiveSlug(pendingStoreSwitch.slug);
    fetchStoreData(pendingStoreSwitch.slug);
    navigate(`/shop/${pendingStoreSwitch.slug}`);
    setPendingStoreSwitch(null);
    setSelectedFastFoodCat('all');
  };

  // Stop camera tracks and animation loops cleanly
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
  }, []);

  const closeScanner = useCallback(() => {
    stopCamera();
    setIsScannerOpen(false);
    setScannerError(null);
  }, [stopCamera]);

  // Parse QR payload
  const parseQrPayload = useCallback((rawText: string) => {
    if (!rawText) return { targetSlug: '', targetTable: '' };
    const text = rawText.trim();
    let targetSlug = '';
    let targetTable = '';

    if (text.includes('sbc') || text.includes('coffee')) targetSlug = 'sbc-store';
    else if (text.includes('bakery')) targetSlug = 'aura-bakery';
    else if (text.includes('bistro')) targetSlug = 'aura-bistro';
    else if (text.includes('tech')) targetSlug = 'aura-tech';

    const matchTable = text.match(/(?:table|tbl|counter)[_:\s#-]*([a-zA-Z0-9]+)/i);
    if (matchTable && matchTable[1]) {
      targetTable = `Table #${matchTable[1].toUpperCase()}`;
    }

    return { targetSlug, targetTable };
  }, []);

  const handleProcessScannedQr = useCallback(
    (rawText: string) => {
      if (!rawText) return;
      const { targetSlug, targetTable } = parseQrPayload(rawText);
      const matched = stores.find((s) => s.slug === targetSlug) || stores[0];

      if (matched) {
        closeScanner();
        triggerHaptic('heavy');
        if (targetTable) {
          setCustomerAddress(targetTable);
          setDiningMode('dine_in');
          setOrderType('dine_in');
        }
        setScanSuccessBanner({
          message: `Scanned ${targetTable || 'Table'}! Switched to ${matched.name}`,
          storeName: matched.name,
          table: targetTable
        });
        setTimeout(() => setScanSuccessBanner(null), 5000);
        handleSelectBranch(matched);
      }
    },
    [stores, parseQrPayload, closeScanner, triggerHaptic, handleSelectBranch, setOrderType]
  );

  const handleOpenScanner = () => {
    triggerHaptic('medium');
    setScannerError(null);
    if (tg?.showScanQrPopup) {
      try {
        tg.showScanQrPopup(
          { text: 'Point camera at Table or Counter QR code' },
          (qrText: string) => {
            if (qrText) {
              tg.closeScanQrPopup?.();
              handleProcessScannedQr(qrText);
              return true;
            }
            return false;
          }
        );
        return;
      } catch (err) {
        console.warn('Native QR fallback:', err);
      }
    }
    setIsScannerOpen(true);
  };

  const startCamera = useCallback(async () => {
    stopCamera();
    setScannerError(null);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setScannerError('Live camera not available. Use the Table Presets below.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);

        const tick = () => {
          if (!videoRef.current || !canvasRef.current) return;
          const video = videoRef.current;
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const qr = jsQR(imgData.data, imgData.width, imgData.height);
              if (qr && qr.data) {
                handleProcessScannedQr(qr.data);
                return;
              }
            }
          }
          animFrameRef.current = requestAnimationFrame(tick);
        };
        animFrameRef.current = requestAnimationFrame(tick);
      }
    } catch (err: any) {
      setIsCameraActive(false);
      setScannerError('Camera permission not granted. Use the Table Presets below.');
    }
  }, [facingMode, handleProcessScannedQr, stopCamera]);

  useEffect(() => {
    if (isScannerOpen) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [isScannerOpen, startCamera, stopCamera]);

  // Flash Offer 20% Discount Application
  const handleClaimFlashOffer = () => {
    triggerHaptic('heavy');
    setHasClaimedFlashOffer(true);
    setCouponCode('FIRST20');
    message.success({
      content: '🎉 20% Flash Offer discount applied to your order!',
      duration: 3
    });
  };

  // Product Variants
  const getProductVariants = useCallback((product: any) => {
    if (!product) return [];
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants;
    }
    return [
      { id: 'v-reg', name: 'Regular', size: 'Standard Size', priceAdjustment: 0, default: true },
      { id: 'v-combo', name: 'Large Combo', size: 'With Fries & Drink', priceAdjustment: 2.50, default: false }
    ];
  }, []);

  // Open Customization Modal
  const openCustomizationModal = (product: any) => {
    triggerHaptic('light');
    setCustomizingProduct(product);
    setCustomizeQty(1);

    const variants = getProductVariants(product);
    setSelectedVariant(variants[0]);

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

  const customizedPriceDelta = useMemo(() => {
    let delta = 0;
    if (selectedVariant) {
      delta += Number(selectedVariant.priceAdjustment || 0);
    }
    if (customizingProduct?.options) {
      customizingProduct.options.forEach((optGroup: any) => {
        const chosenLabel = selectedOptions[optGroup.name];
        if (chosenLabel) {
          const choice = optGroup.choices?.find((c: any) => c.label === chosenLabel);
          const adj = Number(choice?.priceDelta || 0);
          if (adj) delta += adj;
        }
      });
    }
    return delta;
  }, [customizingProduct, selectedOptions, selectedVariant]);

  const modalUnitPrice = (Number(customizingProduct?.price || 0) + customizedPriceDelta).toFixed(2);
  const modalTotalPrice = (Number(modalUnitPrice) * customizeQty).toFixed(2);

  const handleAddCustomizedToCart = () => {
    if (!customizingProduct) return;
    triggerHaptic('medium');
    const combinedOptions = {
      ...(selectedVariant ? { 'Size': selectedVariant.name } : {}),
      ...selectedOptions
    };
    addItem(customizingProduct, combinedOptions, customizeQty, customizedPriceDelta);
    setCustomizingProduct(null);
    message.success(`Added ${customizeQty}x ${customizingProduct.name} to cart`);
  };

  const handleDirectAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    addItem(product, {}, 1, 0);
    message.success({
      content: `Added ${product.name} to cart!`,
      duration: 1.5
    });
  };

  // Filtered Food Items according to category & search
  const filteredFoodItems = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch =
        !searchQuery.trim() ||
        prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.details?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (selectedFastFoodCat === 'all') return true;

      const name = (prod.name || '').toLowerCase();
      const details = (prod.details || '').toLowerCase();
      const catId = Number(prod.category_id);

      if (selectedFastFoodCat === 'burger') {
        return catId === 21 || name.includes('burger') || name.includes('zinger');
      }
      if (selectedFastFoodCat === 'pizza') {
        return catId === 22 || name.includes('pizza');
      }
      if (selectedFastFoodCat === 'chicken') {
        return catId === 23 || name.includes('chicken');
      }
      if (selectedFastFoodCat === 'snacks') {
        return catId === 24 || name.includes('fries') || name.includes('hot dog') || name.includes('snack') || name.includes('croissant');
      }
      if (selectedFastFoodCat === 'drinks') {
        return catId === 25 || catId === 1 || catId === 2 || name.includes('shake') || name.includes('latte') || name.includes('tea') || name.includes('brew') || name.includes('juice');
      }

      return true;
    });
  }, [products, selectedFastFoodCat, searchQuery]);

  // Popular items (top 6 fast food items or best sellers)
  const popularFastFoodItems = useMemo(() => {
    if (activeSlug === 'sbc-store') {
      const targetCodes = ['PRD-FF-01', 'PRD-FF-02', 'PRD-FF-03', 'PRD-FF-04', 'PRD-FF-05', 'PRD-FF-06'];
      const matched = products.filter((p) => targetCodes.includes(p.code));
      if (matched.length >= 6) return matched;
    }
    return products.slice(0, 6);
  }, [products, activeSlug]);

  // Wishlisted Products
  const wishlistedProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Calculate Order Totals with 20% discount if claimed
  const calculatedDiscount = useMemo(() => {
    if (hasClaimedFlashOffer) {
      return Number((subtotal * 0.2).toFixed(2));
    }
    return discount || 0;
  }, [hasClaimedFlashOffer, subtotal, discount]);

  const finalTotal = useMemo(() => {
    const fee = diningMode === 'delivery' ? 1.50 : 0;
    return Math.max(0, subtotal - calculatedDiscount + fee).toFixed(2);
  }, [subtotal, calculatedDiscount, diningMode]);

  // Submit Order to Kitchen & Dispatch Telegram Notification
  const handleConfirmOrder = async () => {
    if (isSubmitting) return;
    triggerHaptic('heavy');
    setIsSubmitting(true);

    const idempotencyKey = `idemp_${user?.id || 'guest'}_${Date.now()}`;

    const payload = {
      storeSlug: activeSlug,
      idempotencyKey,
      orderType: diningMode,
      couponCode: hasClaimedFlashOffer ? 'FIRST20' : '',
      discountAmount: calculatedDiscount,
      customer: {
        name: customerName || 'Guest Customer',
        username: user?.username ? `@${user.username}` : (customerPhone.startsWith('@') ? customerPhone : '@telegram_guest'),
        phone: customerPhone || '+855 12 888 777',
        address: customerAddress || deliveryAddress,
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
        message.error(`Order error: ${res.data?.message || 'Could not place order'}`);
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      message.error(err.response?.data?.message || 'Network error while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatStepTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full min-h-full bg-[#FAF6F0] text-slate-900 font-sans pb-28 relative overflow-x-hidden selection:bg-[#FF5722] selection:text-white">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & DELIVER-TO LOCATION (Matches image.png) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-orange-100/70 shadow-2xs">
        {/* Deliver-to Location Dropdown */}
        <div
          onClick={() => setIsBranchModalOpen(true)}
          className="flex items-center gap-2 cursor-pointer group min-w-0"
        >
          <div className="w-8 h-8 rounded-full bg-[#FFF0E6] flex items-center justify-center text-[#FF5722] shrink-0 shadow-2xs">
            <EnvironmentOutlined style={{ fontSize: 14 }} />
          </div>
          <div className="min-w-0">
            <span className="text-[10.5px] font-semibold text-slate-500 block leading-tight">
              Deliver to
            </span>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xs text-slate-900 truncate max-w-[170px] sm:max-w-[210px]">
                {deliveryAddress}
              </span>
              <DownOutlined style={{ fontSize: 9, color: '#94a3b8' }} className="shrink-0 transition-transform group-hover:translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Top Right Actions: Search, Kitchen, Story, Profile / QR */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-8 h-8 rounded-full bg-white border border-orange-100/90 hover:border-orange-300 text-slate-700 flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Search Menu"
          >
            <SearchOutlined style={{ fontSize: 13 }} />
          </button>

          <button
            type="button"
            onClick={handleOpenScanner}
            className="w-8 h-8 rounded-full bg-[#FFF0E6] text-[#FF5722] border border-orange-200/80 flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Scan Table or Counter QR Code"
          >
            <ScanOutlined style={{ fontSize: 13 }} />
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'kitchen' ? 'home' : 'kitchen')}
            className={`px-2 py-1 rounded-xl text-[10px] font-black shadow-2xs active:scale-95 transition-all cursor-pointer ${
              viewMode === 'kitchen'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-orange-100 text-slate-700 hover:text-slate-900'
            }`}
            title="Kitchen Stream"
          >
            👨‍🍳 Kitchen
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'cms' ? 'home' : 'cms')}
            className={`px-2 py-1 rounded-xl text-[10px] font-black shadow-2xs active:scale-95 transition-all cursor-pointer ${
              viewMode === 'cms'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-orange-100 text-slate-700 hover:text-amber-600'
            }`}
            title="Brand Story & CMS"
          >
            ✨ Story
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'orders' ? 'home' : 'orders')}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer ${
              viewMode === 'orders'
                ? 'bg-[#FF5722] text-white'
                : 'bg-white border border-orange-100/90 text-slate-700 hover:text-[#FF5722]'
            }`}
            title="View Orders"
          >
            <UserOutlined style={{ fontSize: 13 }} />
          </button>
        </div>
      </header>

      {/* Instant Search Bar Toggle */}
      {isSearchOpen && (
        <div className="px-4 py-2 bg-white/95 border-b border-orange-100 animate-fadeIn">
          <div className="relative">
            <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search burgers, pizza, chicken, drinks..."
              className="w-full bg-[#FAF6F0] border border-orange-200/70 rounded-2xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="p-4 space-y-4">
        {/* ======================================================== */}
        {/* SCREEN: HOME & MENU BROWSING (Exact match to image.png)   */}
        {/* ======================================================== */}
        {(viewMode === 'home' || viewMode === 'menu') && (
          <div className="space-y-4 animate-fadeIn">
            {/* 1. HERO CARD BANNER: "Delicious Fast Food - Hot Deals" */}
            <div
              className="relative w-full rounded-3xl p-4.5 overflow-hidden shadow-sm border border-orange-100/80"
              style={{
                background: 'linear-gradient(135deg, #FFF1E6 0%, #FFE6D5 45%, #FDE1CE 100%)'
              }}
            >
              {/* Background ambient lighting */}
              <div className="absolute -right-8 -top-8 w-44 h-44 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between gap-3 relative z-10">
                {/* Left Text & Call To Action */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 text-[#FF5722] font-black text-[10px] shadow-2xs mb-2">
                    <span>🔥</span>
                    <span>Hot Deals</span>
                  </div>

                  <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-[1.15]">
                    Delicious<br />Fast Food
                  </h1>

                  <p className="text-xs text-slate-600 mt-1 leading-snug font-medium max-w-[160px]">
                    Get your favorite fast food at your door.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      const popularEl = document.getElementById('popular-items-heading');
                      if (popularEl) popularEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-3.5 px-4 py-2 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs inline-flex items-center gap-1.5 shadow-md shadow-orange-500/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Order Now</span>
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                      ➔
                    </span>
                  </button>
                </div>

                {/* Right Visual: Fast Food Combo (Burger, Fries, Cola with Tomato & Herbs) */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-400/20 to-orange-500/20 absolute -z-0 blur-md" />
                  <img
                    src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80"
                    alt="Fast Food Combo"
                    className="w-full h-full object-contain drop-shadow-xl relative z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                  />
                  {/* Floating garnish visual accents */}
                  <span className="absolute -top-1 left-2 text-base animate-pulse">🍅</span>
                  <span className="absolute bottom-1 right-2 text-xs">🌿</span>
                </div>
              </div>

              {/* Pagination Dots below hero */}
              <div className="flex items-center justify-center gap-1.5 mt-3 pt-1">
                <span className="w-5 h-1.5 rounded-full bg-[#FF5722] transition-all" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              </div>
            </div>

            {/* 2. CATEGORIES ROW (Circular Buttons Matching image.png) */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1 px-0.5">
              {[
                { id: 'all', label: 'All', icon: '🍔' },
                { id: 'burger', label: 'Burger', icon: '🍔' },
                { id: 'pizza', label: 'Pizza', icon: '🍕' },
                { id: 'chicken', label: 'Chicken', icon: '🍗' },
                { id: 'snacks', label: 'Snacks', icon: '🍟' },
                { id: 'drinks', label: 'Drinks', icon: '🥤' }
              ].map((cat) => {
                const isActive = selectedFastFoodCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedFastFoodCat(cat.id);
                    }}
                    className="flex flex-col items-center justify-center gap-1.5 min-w-[54px] py-1 cursor-pointer transition-transform active:scale-95 group"
                  >
                    <div
                      className={`w-13 h-13 rounded-full flex items-center justify-center text-xl shadow-2xs transition-all ${
                        isActive
                          ? 'bg-[#FF5722] text-white shadow-md shadow-orange-500/30 scale-105 ring-3 ring-orange-400/20'
                          : 'bg-white border border-orange-100/90 text-slate-700 hover:border-orange-300 group-hover:scale-102'
                      }`}
                    >
                      <span>{cat.icon}</span>
                    </div>
                    <span
                      className={`text-[11px] font-bold tracking-tight ${
                        isActive ? 'text-[#FF5722] font-black' : 'text-slate-600'
                      }`}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3. "POPULAR ITEMS" SECTION HEADER */}
            <div id="popular-items-heading" className="flex items-center justify-between pt-1">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Popular Items
              </h2>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedFastFoodCat('all');
                }}
                className="text-xs font-bold text-[#FF5722] hover:text-[#E64A19] flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <span className="text-xs">➔</span>
              </button>
            </div>

            {/* 4. 2-COLUMN FOOD CARD GRID (Exact match to image.png) */}
            <div className="grid grid-cols-2 gap-3.5">
              {filteredFoodItems.map((prod) => {
                const isLiked = wishlistIds.includes(prod.id);
                const inCartQty = items
                  .filter((i) => i.id === prod.id)
                  .reduce((acc, curr) => acc + curr.quantity, 0);

                return (
                  <div
                    key={prod.id}
                    onClick={() => openCustomizationModal(prod)}
                    className="bg-white rounded-3xl p-3 shadow-[0_4px_18px_rgba(0,0,0,0.04)] border border-orange-50 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between group active:scale-[0.99]"
                  >
                    {/* Top Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prod.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 shadow-2xs border border-orange-100 flex items-center justify-center z-10 active:scale-90 transition-transform cursor-pointer"
                      title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isLiked ? (
                        <HeartFilled style={{ color: '#FF5722', fontSize: 13 }} />
                      ) : (
                        <HeartOutlined style={{ color: '#94a3b8', fontSize: 13 }} />
                      )}
                    </button>

                    {/* Centered Food Image */}
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FFFDF9] mb-2 flex items-center justify-center">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {inCartQty > 0 && (
                        <span className="absolute bottom-1.5 left-1.5 bg-[#FF5722] text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-sm">
                          ✓ {inCartQty} in cart
                        </span>
                      )}
                    </div>

                    {/* Product Name & Short Description */}
                    <div className="space-y-0.5">
                      <h3 className="font-extrabold text-[13px] text-slate-900 leading-snug line-clamp-1 group-hover:text-[#FF5722] transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-[10.5px] text-slate-500 line-clamp-1 font-medium">
                        {prod.details}
                      </p>
                    </div>

                    {/* Price and Orange Plus Action Button */}
                    <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-orange-50">
                      <span className="font-black text-sm text-slate-900 tracking-tight">
                        ${Number(prod.price).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleDirectAddToCart(prod, e)}
                        className="w-7 h-7 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/25 active:scale-90 transition-all cursor-pointer"
                        title="Add to Cart"
                      >
                        <PlusOutlined style={{ fontSize: 11 }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 5. BOTTOM "FLASH OFFER" PROMO BANNER (Matches image.png) */}
            <div
              className="relative rounded-3xl p-4 overflow-hidden border border-orange-200/60 shadow-xs flex items-center justify-between gap-3 mt-4"
              style={{
                background: 'linear-gradient(135deg, #FFF3E8 0%, #FFE5D2 100%)'
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[#FF5722] font-black text-[9.5px] shadow-2xs mb-1.5">
                  <PercentageOutlined style={{ fontSize: 9 }} />
                  <span>Flash Offer</span>
                </div>

                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Get 20% OFF<br />on your first order
                </h3>

                {hasClaimedFlashOffer ? (
                  <span className="text-[10.5px] text-emerald-700 font-extrabold mt-1 block">
                    ✓ Code "FIRST20" Applied!
                  </span>
                ) : (
                  <p className="text-[10px] text-slate-600 mt-1 font-medium">
                    Tap to apply discount coupon
                  </p>
                )}
              </div>

              {/* Graphic + Round Arrow CTA */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-white/50 p-1">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80"
                    alt="Promo Combo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleClaimFlashOffer}
                  className="w-8 h-8 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white flex items-center justify-center font-black text-xs shadow-md shadow-orange-500/25 active:scale-90 transition-all cursor-pointer"
                  title="Claim 20% Discount"
                >
                  <RightOutlined style={{ fontSize: 11 }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN: WISHLIST / FAVORITES                             */}
        {/* ======================================================== */}
        {viewMode === 'wishlist' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-1 border-b border-orange-100">
              <button
                type="button"
                onClick={() => setViewMode('home')}
                className="text-xs text-[#FF5722] font-bold flex items-center gap-1"
              >
                <ArrowLeftOutlined /> Back
              </button>
              <h2 className="text-base font-black text-slate-900">Your Favorites</h2>
              <span className="text-xs text-slate-500 font-semibold">
                {wishlistedProducts.length} items
              </span>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-orange-100 p-6 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF0E6] text-[#FF5722] flex items-center justify-center text-2xl">
                  🤍
                </div>
                <h3 className="font-extrabold text-sm text-slate-800">No Favorites Yet</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click the heart icon on any food item to save your favorite dishes here.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode('home')}
                  className="px-4 py-2 rounded-full bg-[#FF5722] text-white font-bold text-xs"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5">
                {wishlistedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => openCustomizationModal(prod)}
                    className="bg-white rounded-3xl p-3 shadow-xs border border-orange-50 hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prod.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 shadow-2xs border border-orange-100 flex items-center justify-center z-10"
                    >
                      <HeartFilled style={{ color: '#FF5722', fontSize: 13 }} />
                    </button>

                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FFFDF9] mb-2">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900 line-clamp-1">
                        {prod.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{prod.details}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-orange-50">
                      <span className="font-black text-sm text-slate-900">${Number(prod.price).toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={(e) => handleDirectAddToCart(prod, e)}
                        className="w-7 h-7 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-xs"
                      >
                        <PlusOutlined style={{ fontSize: 10 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN: SHOPPING CART SCREEN                             */}
        {/* ======================================================== */}
        {viewMode === 'cart' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-1 border-b border-orange-100">
              <button
                type="button"
                onClick={() => setViewMode('home')}
                className="text-xs text-[#FF5722] font-bold flex items-center gap-1"
              >
                <ArrowLeftOutlined /> Back to Menu
              </button>
              <h2 className="text-base font-black text-slate-900">Your Basket</h2>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-500 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-orange-100 p-6 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF0E6] text-[#FF5722] flex items-center justify-center text-2xl">
                  🛒
                </div>
                <h3 className="font-extrabold text-sm text-slate-800">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Add some hot zinger burgers, cheesy pizza or crispy fries to get started.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode('home')}
                  className="px-5 py-2.5 rounded-full bg-[#FF5722] text-white font-bold text-xs shadow-md shadow-orange-500/25"
                >
                  Browse Delicious Food
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Cart Items List */}
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.itemKey}
                      className="bg-white rounded-2xl p-3 border border-orange-100 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{item.name}</h4>
                        {item.optionsText && (
                          <p className="text-[10px] text-slate-400 line-clamp-1">{item.optionsText}</p>
                        )}
                        <span className="font-black text-xs text-[#FF5722]">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-[#FAF6F0] px-2 py-1 rounded-xl border border-orange-100">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.itemKey, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-black text-xs text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.itemKey, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-[#FF5722] text-white flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Card */}
                <div className="bg-white rounded-2xl p-3 border border-orange-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏷️</span>
                    <div>
                      <span className="font-bold text-xs text-slate-800">Promo Discount</span>
                      <span className="text-[10.5px] text-slate-400 block">
                        {hasClaimedFlashOffer ? 'Flash 20% discount active' : 'Have a coupon code?'}
                      </span>
                    </div>
                  </div>

                  {hasClaimedFlashOffer ? (
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      -20% Applied
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleClaimFlashOffer}
                      className="px-3 py-1.5 rounded-xl bg-[#FFF0E6] text-[#FF5722] font-black text-xs"
                    >
                      Apply FIRST20
                    </button>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-4 border border-orange-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                  </div>
                  {calculatedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount (20% Off)</span>
                      <span>-${calculatedDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery / Service Fee</span>
                    <span className="font-bold text-slate-800">
                      {diningMode === 'delivery' ? '$1.50' : 'FREE'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-orange-100">
                    <span>Total Amount</span>
                    <span className="text-[#FF5722]">${finalTotal}</span>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  type="button"
                  onClick={() => setViewMode('checkout')}
                  className="w-full py-3.5 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-sm shadow-lg shadow-orange-500/25 flex items-center justify-between px-5 active:scale-98 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <span>${finalTotal} ➔</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN: CHECKOUT & CONFIRMATION                          */}
        {/* ======================================================== */}
        {viewMode === 'checkout' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-1 border-b border-orange-100">
              <button
                type="button"
                onClick={() => setViewMode('cart')}
                className="text-xs text-[#FF5722] font-bold flex items-center gap-1"
              >
                <ArrowLeftOutlined /> Back to Cart
              </button>
              <h2 className="text-base font-black text-slate-900">Checkout</h2>
              <span className="text-xs text-slate-400">{itemCount} items</span>
            </div>

            {/* Dining Mode Toggle */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-2xl border border-orange-100">
              {[
                { id: 'delivery', label: '🛵 Delivery' },
                { id: 'dine_in', label: '🍽️ Dine-In' },
                { id: 'takeaway', label: '🥡 Takeaway' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setDiningMode(mode.id as any);
                    setOrderType(mode.id as any);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    diningMode === mode.id
                      ? 'bg-[#FF5722] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Customer Information Form */}
            <div className="bg-white rounded-2xl p-4 border border-orange-100 space-y-3">
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Fulfillment Details
              </h3>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. John Watson"
                  className="w-full bg-[#FAF6F0] border border-orange-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Telegram Username or Phone
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. @john_telegram or +855..."
                  className="w-full bg-[#FAF6F0] border border-orange-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {diningMode === 'dine_in' ? 'Table Number' : 'Delivery Address / Apartment'}
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={diningMode === 'dine_in' ? 'e.g. Table #04' : 'e.g. 221B Baker Street, London'}
                  className="w-full bg-[#FAF6F0] border border-orange-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Kitchen Note (Optional)</label>
                <input
                  type="text"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="e.g. Extra spicy sauce, no onions please"
                  className="w-full bg-[#FAF6F0] border border-orange-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#FF5722]"
                />
              </div>
            </div>

            {/* Telegram Dispatch Notice */}
            <div className="bg-[#FFF0E6] rounded-2xl p-3 border border-orange-200/80 flex items-center gap-2.5 text-xs text-slate-700">
              <span className="text-xl">✈️</span>
              <p className="leading-snug text-[11px]">
                Your ticket will be instantly dispatched to <b>@aura_emenu_order_bot</b> and the kitchen station printer.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={isSubmitting || !customerName.trim()}
              onClick={handleConfirmOrder}
              className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-between px-5 shadow-lg shadow-orange-500/25 transition-all ${
                isSubmitting || !customerName.trim()
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#FF5722] hover:bg-[#E64A19] text-white active:scale-98'
              }`}
            >
              <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <span>${finalTotal}</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN: SUCCESSFUL ORDER PLACED                          */}
        {/* ======================================================== */}
        {viewMode === 'success' && (
          <div className="space-y-4 animate-fadeIn text-center py-6">
            <div className="w-18 h-18 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-sm">
              ✓
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">Order Placed Successfully!</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Ref: <b>{lastCreatedOrder?.referenceNo || 'ORD-NEW'}</b> • Sent to kitchen
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-orange-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Store:</span>
                <span className="font-bold text-slate-800">{currentStore?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fulfillment:</span>
                <span className="font-bold text-slate-800 capitalize">{diningMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination:</span>
                <span className="font-bold text-slate-800">{customerAddress}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-orange-100 font-black text-slate-900">
                <span>Total Paid:</span>
                <span className="text-[#FF5722]">${finalTotal}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setViewMode('orders')}
                className="flex-1 py-3 rounded-2xl bg-[#FF5722] text-white font-bold text-xs shadow-md shadow-orange-500/25"
              >
                Track Live Order
              </button>
              <button
                type="button"
                onClick={() => setViewMode('home')}
                className="flex-1 py-3 rounded-2xl bg-white border border-orange-100 text-slate-700 font-bold text-xs"
              >
                Order More
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN: LIVE TRACKER & MY ORDERS                         */}
        {/* ======================================================== */}
        {viewMode === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-1 border-b border-orange-100">
              <button
                type="button"
                onClick={() => setViewMode('home')}
                className="text-xs text-[#FF5722] font-bold flex items-center gap-1"
              >
                <ArrowLeftOutlined /> Back to Menu
              </button>
              <h2 className="text-base font-black text-slate-900">Order Tracker</h2>
              <button
                type="button"
                onClick={() => fetchPastOrders()}
                className="text-xs text-[#FF5722] font-bold"
              >
                Refresh
              </button>
            </div>

            {pastOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-orange-100 p-6 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF0E6] text-[#FF5722] flex items-center justify-center text-2xl">
                  📋
                </div>
                <h3 className="font-extrabold text-sm text-slate-800">No Past Orders Found</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  When you place an order, live preparation and kitchen status updates appear here.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode('home')}
                  className="px-5 py-2.5 rounded-full bg-[#FF5722] text-white font-bold text-xs"
                >
                  Start Ordering
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {pastOrders.map((ord: any) => {
                  const status = (ord.status || 'pending').toLowerCase();
                  const isReady = status === 'ready';
                  const isPreparing = status === 'preparing';

                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="bg-white rounded-3xl p-4 border border-orange-100 shadow-2xs space-y-3 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all active:scale-[0.99] group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 block group-hover:text-[#FF5722] transition-colors">
                            {ord.referenceNo || `ORD-${ord.id}`}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {ord.store_name || currentStore?.name} • {ord.createdAt ? new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase ${
                            isReady
                              ? 'bg-emerald-100 text-emerald-700 animate-pulse'
                              : isPreparing
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      {/* Items preview */}
                      <div className="bg-[#FAF6F0] rounded-xl p-2.5 space-y-1 text-xs">
                        {(ord.items || []).map((it: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-[11px] text-slate-700">
                            <span>{it.name} × {it.quantity}</span>
                            <span className="font-bold">${Number(it.subtotal || it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-orange-100">
                        <span className="text-[#FF5722] text-[11px] font-bold flex items-center gap-1 group-hover:underline">
                          🧾 View Order Receipt &rarr;
                        </span>
                        <span className="font-black text-sm text-[#FF5722]">
                          ${Number(ord.totalAmount || ord.grandTotal || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Customer Order Receipt Modal */}
        <OrderReceiptModal
          order={selectedReceiptOrder}
          open={Boolean(selectedReceiptOrder)}
          onClose={() => setSelectedReceiptOrder(null)}
          storeInfo={currentStore}
        />

        {/* ======================================================== */}
        {/* SCREEN: KITCHEN & TELEGRAM DISPATCH STREAM               */}
        {/* ======================================================== */}
        {viewMode === 'kitchen' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-orange-100">
              <div>
                <h2 className="text-base font-black text-slate-900">👨‍🍳 Kitchen Station & Telegram Dispatch</h2>
                <p className="text-[11px] text-slate-500">Live order fulfillment stream & Telegram bot status</p>
              </div>
              <button
                type="button"
                onClick={() => fetchPastOrders(false)}
                className="px-2.5 py-1 rounded-xl bg-orange-100 text-orange-700 text-xs font-bold hover:bg-orange-200"
              >
                🔄 Refresh
              </button>
            </div>

            {pastOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-orange-100 text-slate-400 text-xs">
                No orders active in kitchen station.
              </div>
            ) : (
              <div className="space-y-3">
                {pastOrders.map((ord: any) => {
                  const statusColors: any = {
                    Pending: 'bg-amber-100 text-amber-800 border-amber-300',
                    Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
                    Preparing: 'bg-purple-100 text-purple-800 border-purple-300',
                    Ready: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    Completed: 'bg-slate-100 text-slate-800 border-slate-300'
                  };
                  const nextStatusMap: any = {
                    Pending: 'Confirmed',
                    Confirmed: 'Preparing',
                    Preparing: 'Ready',
                    Ready: 'Completed'
                  };
                  const nextStatus = nextStatusMap[ord.status];

                  return (
                    <div key={ord.id || ord.referenceNo} className="bg-white rounded-3xl p-4 border border-orange-100 shadow-2xs space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-orange-50">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900">{ord.referenceNo}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[ord.status] || 'bg-slate-100'}`}>
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          Telegram: {ord.store_notification || 'Sent'}
                        </span>
                      </div>

                      <div className="text-slate-600 space-y-1">
                        <div className="font-bold text-slate-800">{ord.customer?.name} ({ord.customer?.username || '@guest'})</div>
                        <div className="text-[11px] text-slate-400">{ord.customer?.address || 'Dine-In'}</div>
                        <div className="space-y-0.5 pt-1">
                          {(ord.items || []).map((it: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-[11px]">
                              <span>{it.quantity}x {it.name}</span>
                              <span className="font-mono">${Number(it.subtotal || it.price * it.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-orange-50">
                        <span className="font-black text-slate-900">Total: ${Number(ord.grandTotal || ord.totalAmount || 0).toFixed(2)}</span>
                        {nextStatus ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.id, nextStatus)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs active:scale-95"
                          >
                            Mark as {nextStatus} →
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold">✓ Fulfilled</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN: BRAND STORY & CMS SHOWCASE                       */}
        {/* ======================================================== */}
        {viewMode === 'cms' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 shadow-xl">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Aura Heritage 2026
              </span>
              <h2 className="text-xl font-black mt-2 leading-tight">Artisan Highland Beans & European Viennoiserie</h2>
              <p className="text-xs text-slate-300 mt-1">Single-origin beans ethically harvested from Mondulkiri and Vietnam highlands.</p>
            </div>

            {/* Team Members */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Meet Our Artisans</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: 'Sophea Kim', role: 'Head of Roasting', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
                  { name: 'Dara Chan', role: 'Master Viennoisier', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
                ].map((m) => (
                  <div key={m.name} className="bg-white p-3 rounded-2xl border border-orange-100 text-center space-y-1.5 shadow-2xs">
                    <img src={m.img} alt="" className="w-12 h-12 rounded-full mx-auto object-cover ring-2 ring-orange-500/20" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">{m.name}</h4>
                      <p className="text-[10px] text-orange-600 font-bold">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact Inquiry */}
            <div className="bg-white p-4 rounded-3xl border border-orange-100 space-y-2.5 shadow-2xs">
              <h3 className="font-black text-xs text-slate-900">Send an Inquiry or Booking</h3>
              <form onSubmit={handleSendInquiry} className="space-y-2">
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-[#FAF6F0] border border-orange-100 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                />
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full bg-[#FAF6F0] border border-orange-100 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                />
                <textarea
                  required
                  rows={2}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Inquiry message or catering request..."
                  className="w-full bg-[#FAF6F0] border border-orange-100 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition"
                >
                  Submit Inquiry
                </button>
                {inquirySent && (
                  <p className="text-center text-[11px] font-bold text-emerald-600 pt-0.5">✓ Inquiry sent successfully!</p>
                )}
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* 5. FIXED BOTTOM NAVIGATION BAR (Exact match to image.png) */}
      {/* ======================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-orange-100/90 z-40 px-3 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setViewMode('home');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 text-center transition-all cursor-pointer ${
            viewMode === 'home' || viewMode === 'menu'
              ? 'text-[#FF5722] font-black'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <HomeOutlined style={{ fontSize: 20 }} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          {(viewMode === 'home' || viewMode === 'menu') && (
            <span className="w-4 h-1 rounded-full bg-[#FF5722] mt-0.5 shadow-xs" />
          )}
        </button>

        {/* 2. Menu / Categories */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setViewMode('menu');
            setSelectedFastFoodCat('all');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 text-center transition-all cursor-pointer ${
            viewMode === 'menu'
              ? 'text-[#FF5722] font-black'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <AppstoreOutlined style={{ fontSize: 20 }} />
          <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
        </button>

        {/* 3. Floating Center Cart Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setViewMode('cart');
          }}
          className="relative -top-3 w-13 h-13 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white flex items-center justify-center shadow-lg shadow-orange-500/35 transition-transform active:scale-90 cursor-pointer"
          title="Shopping Cart"
        >
          <ShoppingCartOutlined style={{ fontSize: 22 }} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#FF5722] text-[10px] font-black flex items-center justify-center shadow-xs border-2 border-[#FF5722] animate-bounce">
              {itemCount}
            </span>
          )}
        </button>

        {/* 4. Wishlist / Favorites */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setViewMode('wishlist');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 text-center transition-all cursor-pointer ${
            viewMode === 'wishlist'
              ? 'text-[#FF5722] font-black'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <HeartOutlined style={{ fontSize: 20 }} />
          <span className="text-[10px] mt-0.5 tracking-tight">Favorites</span>
          {viewMode === 'wishlist' && (
            <span className="w-4 h-1 rounded-full bg-[#FF5722] mt-0.5 shadow-xs" />
          )}
        </button>

        {/* 5. Profile / Orders */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setViewMode('orders');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 text-center transition-all cursor-pointer ${
            viewMode === 'orders'
              ? 'text-[#FF5722] font-black'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <UserOutlined style={{ fontSize: 20 }} />
          <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
          {viewMode === 'orders' && (
            <span className="w-4 h-1 rounded-full bg-[#FF5722] mt-0.5 shadow-xs" />
          )}
        </button>
      </nav>

      {/* ======================================================== */}
      {/* 6. BRANCH & DINING LOCATION SELECTOR MODAL               */}
      {/* ======================================================== */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-4 space-y-3.5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏬</span>
                <h3 className="font-black text-sm text-slate-900">Select Store Branch</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#FAF6F0] text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Delivery address change */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Deliver to Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="flex-1 bg-[#FAF6F0] border border-orange-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    message.success('Address updated');
                    setIsBranchModalOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#FF5722] text-white font-bold text-xs"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Available Branches */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Store Branches &amp; Hubs:
              </span>
              {stores.map((s) => {
                const isCurrent = s.slug === activeSlug;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectBranch(s)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-98 ${
                      isCurrent
                        ? 'bg-[#FFF0E6] border-[#FF5722] shadow-xs'
                        : 'bg-[#FAF6F0] border-orange-100 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0">
                        <img src={s.logo} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{s.name}</h4>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{s.tagline}</span>
                      </div>
                    </div>
                    {isCurrent ? (
                      <span className="text-xs font-black text-[#FF5722] bg-white px-2 py-0.5 rounded-full">
                        Active ✓
                      </span>
                    ) : (
                      <RightOutlined style={{ fontSize: 10, color: '#94a3b8' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. PRODUCT CUSTOMIZATION / OPTIONS MODAL                 */}
      {/* ======================================================== */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Image Header */}
            <div className="relative h-44 w-full bg-slate-100 shrink-0">
              <img src={customizingProduct.image} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCustomizingProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center font-bold text-xs shadow-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
              <div>
                <h3 className="font-black text-slate-900 text-base">{customizingProduct.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{customizingProduct.details}</p>
                <span className="font-black text-sm text-[#FF5722] mt-1 block">
                  ${Number(customizingProduct.price).toFixed(2)}
                </span>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-orange-100">
                <span className="text-xs font-extrabold text-slate-800">Quantity</span>
                <div className="flex items-center gap-2 bg-[#FAF6F0] px-2 py-1 rounded-xl border border-orange-100">
                  <button
                    type="button"
                    onClick={() => setCustomizeQty(Math.max(1, customizeQty - 1))}
                    className="w-7 h-7 rounded-lg bg-white text-slate-800 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-black text-xs text-slate-900">
                    {customizeQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomizeQty(customizeQty + 1)}
                    className="w-7 h-7 rounded-lg bg-[#FF5722] text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Action */}
            <div className="p-3.5 border-t border-orange-100 bg-white shrink-0">
              <button
                type="button"
                onClick={handleAddCustomizedToCart}
                className="w-full py-3.5 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-sm flex items-center justify-between px-5 shadow-lg shadow-orange-500/25 active:scale-98 transition-all"
              >
                <span>Add to Basket</span>
                <span>${modalTotalPrice}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. QR SCANNER MODAL                                      */}
      {/* ======================================================== */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <ScanOutlined className="text-[#FF5722]" />
                <h3 className="font-black text-sm text-slate-900">Scan Table / Branch QR</h3>
              </div>
              <button
                type="button"
                onClick={closeScanner}
                className="w-7 h-7 rounded-full bg-[#FAF6F0] text-slate-500 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Live Camera Viewfinder */}
            <div className="relative w-full aspect-square max-h-[220px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center">
              <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="absolute inset-4 border-2 border-dashed border-[#FF5722] rounded-xl pointer-events-none" />
            </div>

            {/* Test Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10.5px] font-bold text-slate-400 block">⚡ Instant Table Presets:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Table #04 (SBC Store)', code: 'sbc-store_table_4' },
                  { label: 'Table #08 (Bakery)', code: 'aura-bakery_table_8' }
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleProcessScannedQr(p.code)}
                    className="p-2 rounded-xl bg-[#FAF6F0] hover:bg-[#FFF0E6] text-xs font-bold text-slate-800 text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. SWITCH STORE CONFIRMATION WARNING MODAL               */}
      {/* ======================================================== */}
      {pendingStoreSwitch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF5722] flex items-center justify-center text-2xl mx-auto">
              ⚠️
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-900 text-base">Switch Store Branch?</h3>
              <p className="text-xs text-slate-600">
                You have items from <b>{currentCartStoreName}</b> in your cart. Switching to <b>{pendingStoreSwitch.name}</b> will clear your existing cart.
              </p>
            </div>
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={confirmStoreSwitch}
                className="w-full py-3 rounded-xl bg-[#FF5722] text-white font-bold text-xs"
              >
                Clear Cart &amp; Switch
              </button>
              <button
                type="button"
                onClick={() => setPendingStoreSwitch(null)}
                className="w-full py-2.5 rounded-xl bg-[#FAF6F0] text-slate-600 font-bold text-xs"
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
