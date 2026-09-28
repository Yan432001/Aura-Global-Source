import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import jsQR from 'jsqr';
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
  CameraOutlined
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

  // Timer to show relative time since last backend sync ("Synced 3s ago")
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncSecondsAgo(Math.floor((Date.now() - lastSyncTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastSyncTime]);

  // Real-time backend polling: Automatically poll orders every 3.5s when viewing 'orders' or active orders exist
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

  const handleCopyOrderRef = (refNo: string) => {
    if (!refNo) return;
    navigator.clipboard?.writeText(refNo);
    setCopiedOrderId(refNo);
    triggerHaptic('light');
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

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

  // Robust QR payload parser: parses URLs, deep-links, JSON, or slug_table strings
  const parseQrPayload = useCallback(
    (rawText: string) => {
      if (!rawText) return { targetSlug: '', targetTable: '' };
      const text = rawText.trim();
      let targetSlug = '';
      let targetTable = '';

      // 1. Try parsing JSON if present: e.g. {"store":"sbc-store","table":"Table 4"}
      if (text.startsWith('{') && text.endsWith('}')) {
        try {
          const parsed = JSON.parse(text);
          if (parsed.store || parsed.slug) targetSlug = parsed.store || parsed.slug;
          if (parsed.table || parsed.tableNumber || parsed.counter || parsed.table_no) {
            targetTable = parsed.table || parsed.tableNumber || parsed.counter || parsed.table_no;
          }
        } catch {
          // not valid JSON
        }
      }

      // 2. If it's a URL or deep-link query
      if (!targetSlug && (text.startsWith('http://') || text.startsWith('https://') || text.includes('?') || text.includes('t.me') || text.includes('startapp='))) {
        try {
          const urlObj = new URL(text.startsWith('http') ? text : `https://${text}`);
          const startApp = urlObj.searchParams.get('startapp') || urlObj.searchParams.get('start');
          const storeParam = urlObj.searchParams.get('store') || urlObj.searchParams.get('store_slug') || urlObj.searchParams.get('slug');
          const tableParam = urlObj.searchParams.get('table') || urlObj.searchParams.get('table_no') || urlObj.searchParams.get('tbl') || urlObj.searchParams.get('seat') || urlObj.searchParams.get('counter');

          if (tableParam) targetTable = tableParam;

          if (startApp) {
            const cleaned = startApp.replace(/^shop_/, '').replace(/^store_/, '');
            if (cleaned.includes('_table_')) {
              const parts = cleaned.split('_table_');
              targetSlug = parts[0];
              if (!targetTable) targetTable = `Table #${parts[1]}`;
            } else if (cleaned.includes('_counter_')) {
              const parts = cleaned.split('_counter_');
              targetSlug = parts[0];
              if (!targetTable) targetTable = `Counter #${parts[1]}`;
            } else if (cleaned.includes('_station_')) {
              const parts = cleaned.split('_station_');
              targetSlug = parts[0];
              if (!targetTable) targetTable = `Station #${parts[1]}`;
            } else {
              targetSlug = cleaned;
            }
          } else if (storeParam) {
            targetSlug = storeParam;
          } else {
            // Path check e.g. /shop/aura-bakery or /tma/sbc-store
            const pathParts = urlObj.pathname.split('/').filter(Boolean);
            if (pathParts.includes('shop') || pathParts.includes('tma')) {
              const idx = Math.max(pathParts.indexOf('shop'), pathParts.indexOf('tma'));
              if (idx !== -1 && pathParts[idx + 1]) {
                targetSlug = pathParts[idx + 1];
              }
            }
          }
        } catch {
          // url parse failed
        }
      }

      // 3. Delimited string: e.g. "sbc-store_table_4" or "aura-bakery_counter_1"
      if (!targetSlug && (text.includes('_table_') || text.includes('_counter_') || text.includes('_station_'))) {
        if (text.includes('_table_')) {
          const parts = text.split('_table_');
          targetSlug = parts[0];
          targetTable = `Table #${parts[1]}`;
        } else if (text.includes('_counter_')) {
          const parts = text.split('_counter_');
          targetSlug = parts[0];
          targetTable = `Counter #${parts[1]}`;
        } else if (text.includes('_station_')) {
          const parts = text.split('_station_');
          targetSlug = parts[0];
          targetTable = `Station #${parts[1]}`;
        }
      }

      // 4. Fallback search slug tokens
      if (!targetSlug) {
        const lower = text.toLowerCase();
        if (lower.includes('sbc') || lower.includes('coffee')) targetSlug = 'sbc-store';
        else if (lower.includes('bakery')) targetSlug = 'aura-bakery';
        else if (lower.includes('bistro')) targetSlug = 'aura-bistro';
        else if (lower.includes('tech')) targetSlug = 'aura-tech';
      }

      // 5. Extract table from text if not extracted
      if (!targetTable) {
        const tableMatch = text.match(/(?:table|tbl|counter|seat|bar|station)[_:\s#-]*([a-zA-Z0-9]+)/i);
        if (tableMatch && tableMatch[1]) {
          const isCounter = text.toLowerCase().includes('counter');
          const isStation = text.toLowerCase().includes('station');
          const prefix = isCounter ? 'Counter' : isStation ? 'Station' : 'Table';
          targetTable = `${prefix} #${tableMatch[1].toUpperCase()}`;
        }
      }

      return { targetSlug, targetTable };
    },
    []
  );

  // Process scanned QR code
  const handleProcessScannedQr = useCallback(
    (rawText: string) => {
      if (!rawText) return;
      const { targetSlug, targetTable } = parseQrPayload(rawText);

      // Find matched store
      const matchedStore = stores.find(
        (s) =>
          s.slug.toLowerCase() === targetSlug.toLowerCase() ||
          s.name.toLowerCase().includes(targetSlug.toLowerCase()) ||
          String(s.id) === targetSlug
      );

      if (!matchedStore) {
        setScannerError(
          `QR Code "${rawText.slice(0, 35)}..." was not recognized as an Aura store. Please scan a table or counter QR from one of our locations.`
        );
        triggerHaptic('medium');
        return;
      }

      // Close scanner
      closeScanner();
      triggerHaptic('heavy');

      // Table / Counter assignment
      const finalTable = targetTable || 'Counter / Table Service';
      setCustomerAddress(finalTable);
      setOrderType('dine_in');

      // Banner feedback
      setScanSuccessBanner({
        message: `Scanned ${finalTable}! Switching to ${matchedStore.name}`,
        storeName: matchedStore.name,
        table: finalTable
      });
      setTimeout(() => setScanSuccessBanner(null), 5000);

      // Multi-Store Guard: If user has items from another store in cart
      if (cart.length > 0 && currentCartStoreSlug && currentCartStoreSlug !== matchedStore.slug) {
        setPendingStoreSwitch(matchedStore);
        return;
      }

      // Switch Store & Open Menu
      setActiveSlug(matchedStore.slug);
      fetchStoreData(matchedStore.slug);
      navigate(`/shop/${matchedStore.slug}`);
      setViewMode('menu');
    },
    [
      stores,
      parseQrPayload,
      closeScanner,
      triggerHaptic,
      setCustomerAddress,
      setOrderType,
      cart.length,
      currentCartStoreSlug,
      fetchStoreData,
      navigate
    ]
  );

  // Open QR Scanner (Telegram Native Popup if supported, or custom Viewfinder Modal)
  const handleOpenScanner = () => {
    triggerHaptic('medium');
    setScannerError(null);

    // If running in Telegram client with native scanner
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
        console.warn('Native Telegram QR failed, fallback to modal:', err);
      }
    }
    // Web / in-app viewfinder modal
    setIsScannerOpen(true);
  };

  // Start Camera & Frame Analysis
  const startCamera = useCallback(async () => {
    stopCamera();
    setScannerError(null);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setScannerError(
          'Live camera video is not accessible in this environment. Use the quick Table Presets or manual entry below.'
        );
        return;
      }
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);

        const track = stream.getVideoTracks()[0];
        const capabilities: any = track?.getCapabilities?.() || {};
        setHasTorch(Boolean(capabilities.torch));

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
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const qr = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert'
              });
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
      console.warn('Camera stream error:', err);
      setIsCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setScannerError('Camera permission was denied. Please allow camera permissions or test with the Table Presets below.');
      } else {
        setScannerError(`Camera not available (${err.message || 'not found'}). You can use the instant Table Presets or manual input below.`);
      }
    }
  }, [facingMode, handleProcessScannedQr, stopCamera]);

  useEffect(() => {
    if (isScannerOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isScannerOpen, startCamera, stopCamera]);

  // Flashlight / Torch toggle
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    try {
      const track = streamRef.current.getVideoTracks()[0];
      const nextTorch = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setIsTorchOn(nextTorch);
      triggerHaptic('light');
    } catch (err) {
      console.warn('Torch failed:', err);
    }
  };

  // Flip camera (back / front)
  const flipCamera = () => {
    triggerHaptic('light');
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Handle Photo Upload from Gallery
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    triggerHaptic('light');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qr = jsQR(imgData.data, imgData.width, imgData.height);
          if (qr && qr.data) {
            handleProcessScannedQr(qr.data);
          } else {
            setScannerError('Could not detect a valid QR code in this image. Please try another photo or use the presets.');
            triggerHaptic('medium');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Store Selection
  const handleSelectStore = (store: any, tableInfo?: string) => {
    triggerHaptic('light');

    if (tableInfo) {
      setCustomerAddress(tableInfo);
      setOrderType('dine_in');
    }

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

  // Dynamically aggregated Best Sellers for current store
  const bestSellerProducts = useMemo(() => {
    const tagged = products.filter(
      (p) =>
        p.popular ||
        p.is_best_seller ||
        (p.badge && ['best', 'popular', 'signature', 'top'].some((b) => p.badge.toLowerCase().includes(b)))
    );
    if (tagged.length > 0) return tagged.slice(0, 6);
    return products.slice(0, 4);
  }, [products]);

  // Order Lifecycle Milestones Configuration
  const ORDER_STATUS_STEPS = useMemo(() => [
    {
      key: 'pending',
      label: 'Order Placed',
      shortLabel: 'Placed',
      subtitle: 'Sent to store',
      icon: '📋',
      estTime: '~15-20 min',
      desc: 'Order registered via Telegram and transmitted to store queue.'
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      shortLabel: 'Confirmed',
      subtitle: 'Store accepted',
      icon: '👨‍🍳',
      estTime: '~12-15 min',
      desc: 'Store team confirmed ticket and queued it in kitchen station.'
    },
    {
      key: 'preparing',
      label: 'Preparing',
      shortLabel: 'Preparing',
      subtitle: 'In the kitchen',
      icon: '🍳',
      estTime: '~5-8 min',
      desc: 'Baristas & chefs are crafting your food and beverages fresh.'
    },
    {
      key: 'ready',
      label: 'Ready for Pickup',
      shortLabel: 'Ready',
      subtitle: 'At counter',
      icon: '🔔',
      estTime: 'Ready now!',
      desc: 'Your order is packaged, fresh, and waiting at pickup counter / table.'
    },
    {
      key: 'completed',
      label: 'Completed',
      shortLabel: 'Done',
      subtitle: 'Fulfilled',
      icon: '✨',
      estTime: 'Fulfilled',
      desc: 'Order handed over. Enjoy your artisan meal & drinks!'
    }
  ], []);

  const formatStepTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

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

        {/* Quick Scan QR & Staff / Testing Mode Switch */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={handleOpenScanner}
            className="px-2.5 py-1 rounded-xl text-[10.5px] font-extrabold bg-sky-500/15 text-sky-400 border border-sky-500/30 hover:bg-sky-500/25 active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
            title="Scan Table or Counter QR Code"
          >
            <ScanOutlined style={{ fontSize: 11 }} />
            <span>Scan QR</span>
          </button>
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
            {isStaffMode ? '⚡ Staff' : 'Customer'}
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
            {/* Success Banner if QR code just scanned */}
            {scanSuccessBanner && (
              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-slate-950 p-3.5 rounded-3xl font-black text-xs flex items-center justify-between shadow-2xl shadow-emerald-500/30 animate-bounce">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-950/20 flex items-center justify-center text-lg shrink-0">
                    ⚡
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black truncate">{scanSuccessBanner.message}</div>
                    <div className="text-[10px] text-slate-900/80 font-bold truncate">
                      Assigned to {scanSuccessBanner.table} • Ready to order
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScanSuccessBanner(null)}
                  className="text-slate-950 hover:bg-black/10 px-2 py-1 rounded-lg font-black text-xs shrink-0"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Store Selection Hero Banner with QR Scanner Action */}
            <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900/90 border border-blue-800/40 rounded-3xl p-4 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShopOutlined /> Store Selection
                </span>
                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-500/30">
                  {stores.length} Locations
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-white mt-0.5 mb-1 tracking-tight">
                  Choose Store &amp; E-Menu
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Select a store or scan your table / counter QR code to instantly load that location's digital menu and route kitchen tickets.
                </p>
              </div>

              {/* DEDICATED QR CODE SCANNER BUTTON & CARD */}
              <div className="bg-slate-950/80 border border-sky-500/35 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg ring-1 ring-sky-500/20">
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500/25 to-blue-600/25 border border-sky-500/40 flex items-center justify-center text-sky-400 text-xl shrink-0 shadow-inner">
                    <QrcodeOutlined />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white text-xs">At a Table or Counter?</span>
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ⚡ Quick Scan
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-tight mt-0.5">
                      Scan printed QR to auto-load menu &amp; assign table number
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenScanner}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <ScanOutlined style={{ fontSize: 13 }} />
                  <span>Scan Table / Counter QR</span>
                </button>
              </div>

              {/* Currently Linked Table Info (if any) */}
              {customerAddress && customerAddress.toLowerCase().includes('table') && (
                <div className="flex items-center justify-between text-[11px] px-2.5 text-slate-300 bg-slate-900/60 rounded-xl py-1.5 border border-slate-800">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="text-emerald-400 font-bold">📍 Linked:</span>
                    <b className="text-white truncate">{customerAddress}</b>
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenScanner}
                    className="text-sky-400 font-extrabold text-[10.5px] underline hover:text-sky-300 shrink-0 ml-2"
                  >
                    Rescan QR
                  </button>
                </div>
              )}
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

            {/* 4b. DYNAMIC BEST SELLERS SECTION */}
            {bestSellerProducts.length > 0 && !searchQuery && activeCategory === 'all' && (
              <div className="space-y-2 pt-1 pb-0.5 bg-gradient-to-b from-amber-500/5 via-slate-900/40 to-transparent p-2.5 rounded-2xl border border-amber-500/15 shadow-sm">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 text-sm">🔥</span>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">
                      Best Sellers
                    </h3>
                    <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Popular Picks
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Customer favorites
                  </span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {bestSellerProducts.map((prod, idx) => {
                    const inCartCount = items
                      .filter((i) => i.id === prod.id)
                      .reduce((acc, curr) => acc + curr.quantity, 0);

                    return (
                      <div
                        key={prod.id}
                        onClick={() => openCustomizationModal(prod)}
                        className="w-36 shrink-0 bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-2 cursor-pointer transition-all active:scale-95 shadow-md flex flex-col justify-between group"
                      >
                        <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-950 mb-1.5">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-1 left-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded shadow">
                            #{idx + 1} Best
                          </span>
                          {inCartCount > 0 && (
                            <span className="absolute bottom-1 right-1 bg-emerald-500 text-white font-black text-[9px] px-1.5 py-0.2 rounded shadow">
                              ✓ {inCartCount}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-extrabold text-white text-[11.5px] leading-tight line-clamp-1">
                            {prod.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                            {prod.details}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-800/80">
                          <span className="font-black text-xs text-sky-400">
                            ${Number(prod.price).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic('medium');
                              if (prod.options && prod.options.length > 0) {
                                openCustomizationModal(prod);
                              } else {
                                addItem(prod, {}, 1, 0);
                              }
                            }}
                            className="px-2.5 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] flex items-center gap-0.5 shadow-sm active:scale-90 transition-all"
                          >
                            <PlusOutlined style={{ fontSize: 9 }} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                {/* Items List (Smaller, Compact Rows) */}
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.itemKey}
                      className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-2.5 flex items-center gap-2.5 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-11 h-11 rounded-xl object-cover border border-slate-700/80 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-white text-xs truncate leading-tight">
                          {item.name}
                        </h4>
                        {item.optionsText && (
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                            {item.optionsText}
                          </p>
                        )}
                        <span className="font-black text-[11px] text-sky-400 mt-0.5 block">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-1 shrink-0 bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.itemKey, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center active:scale-95 text-[10px]"
                        >
                          <MinusOutlined style={{ fontSize: 9 }} />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.itemKey, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center active:scale-95 text-[10px]"
                        >
                          <PlusOutlined style={{ fontSize: 9 }} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.itemKey)}
                        className="text-slate-500 hover:text-rose-400 p-1 text-xs ml-0.5 active:scale-90 transition-transform"
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
            {/* Top Navigation & Real-Time Sync Bar */}
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 space-y-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setViewMode('menu')}
                  className="text-xs text-sky-400 font-extrabold flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <ArrowLeftOutlined /> Back to Menu
                </button>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-black text-white">My Orders</h2>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {pastOrders.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchPastOrders(false)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700/80 active:scale-95"
                  title="Force refresh status from backend"
                >
                  <ReloadOutlined spin={loadingOrders} style={{ fontSize: 11 }} />
                  <span className="text-[10.5px]">Sync</span>
                </button>
              </div>

              {/* Real-Time Live Status Pill */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80 text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-semibold text-emerald-400 text-[10.5px]">
                    Real-Time Tracking Active
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {syncSecondsAgo === 0 ? 'Synced just now' : `Synced ${syncSecondsAgo}s ago`}
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
              {(
                [
                  { id: 'all', label: 'All Orders', count: pastOrders.length },
                  {
                    id: 'pending',
                    label: '⚡ In Progress',
                    count: pastOrders.filter((o) =>
                      ['pending', 'confirmed', 'preparing', 'ready'].includes((o.status || '').toLowerCase())
                    ).length
                  },
                  {
                    id: 'completed',
                    label: 'Completed',
                    count: pastOrders.filter((o) =>
                      ['completed', 'cancelled'].includes((o.status || '').toLowerCase())
                    ).length
                  }
                ] as const
              ).map((filter) => {
                const isActive = orderFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setOrderFilter(filter.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 border active:scale-95 ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                        : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span
                      className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Orders Feed */}
            {loadingOrders && pastOrders.length === 0 ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <div key={n} className="h-44 bg-slate-900 rounded-3xl animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : pastOrders.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-slate-800/80 p-6 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl mx-auto text-slate-400">
                  📋
                </div>
                <h3 className="font-extrabold text-white text-sm">No orders yet</h3>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">
                  Browse our artisanal menus and place an order to track real-time kitchen progress!
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode('menu')}
                  className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-xs shadow-md shadow-blue-600/30"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
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
                  .map((order, orderIdx) => {
                    const statusStr = (order.status || 'Pending').toLowerCase();
                    const isCancelled = statusStr === 'cancelled';
                    const currentStepIdx = ORDER_STATUS_STEPS.findIndex(
                      (s) => s.key === statusStr
                    );
                    const activeStepConfig = ORDER_STATUS_STEPS[currentStepIdx] || ORDER_STATUS_STEPS[0];
                    const orderRefNo = order.referenceNo || `ORD-${order.id}`;
                    const isCopied = copiedOrderId === orderRefNo;
                    const isTimelineExpanded = expandedTimelineId === orderRefNo;
                    const isOrderActive = ['pending', 'confirmed', 'preparing', 'ready'].includes(statusStr);

                    // Calculate progress percentage along the 5 milestones (0% to 100%)
                    const progressPercentage = isCancelled
                      ? 100
                      : currentStepIdx >= 0
                      ? Math.min(100, Math.max(0, (currentStepIdx / (ORDER_STATUS_STEPS.length - 1)) * 100))
                      : 0;

                    return (
                      <div
                        key={orderRefNo}
                        className={`bg-slate-900/90 border rounded-3xl p-4 space-y-3.5 shadow-xl transition-all relative overflow-hidden ${
                          isOrderActive
                            ? 'border-blue-500/40 ring-1 ring-blue-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950'
                            : 'border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {/* Top Card Header: Order Reference, Store Name & Live Status Badge */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-sm text-sky-400 truncate">
                                {orderRefNo}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyOrderRef(orderRefNo)}
                                className="text-slate-500 hover:text-sky-400 p-0.5 text-xs transition-colors"
                                title="Copy order number"
                              >
                                {isCopied ? (
                                  <CheckOutlined className="text-emerald-400 font-bold" />
                                ) : (
                                  <CopyOutlined />
                                )}
                              </button>
                            </div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5 truncate">
                              <span className="truncate">{order.store_name || currentStore?.name}</span>
                              <span className="text-[10px] text-slate-500">•</span>
                              <span className="text-[10px] text-slate-400 font-medium shrink-0">
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-black text-base text-white block">
                              ${Number(order.grandTotal || 0).toFixed(2)}
                            </span>
                            {/* Live Status Pill */}
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mt-0.5 shadow-sm ${
                                isCancelled
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : statusStr === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : statusStr === 'ready'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 ring-1 ring-emerald-500/20 animate-pulse'
                                  : statusStr === 'preparing'
                                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 ring-1 ring-indigo-500/20'
                                  : statusStr === 'confirmed'
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {!isCancelled && isOrderActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                              )}
                              <span>{order.status || 'Pending'}</span>
                            </span>
                          </div>
                        </div>

                        {/* ======================================================== */}
                        {/* STEP-BY-STEP PROGRESS VISUALIZER RAIL                    */}
                        {/* ======================================================== */}
                        {isCancelled ? (
                          <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg shrink-0">
                              ✕
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-black text-rose-300 text-xs">Order Cancelled</h4>
                              <p className="text-[11px] text-rose-200/80 mt-0.5">
                                This order was cancelled. Please speak with store staff or place a new order.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 space-y-3 shadow-inner">
                            {/* Visual Progress Steps Track with Connecting Gradient Line */}
                            <div className="relative pt-2 pb-1">
                              {/* Background Connecting Rail */}
                              <div className="absolute top-[17px] left-5 right-5 h-1.5 bg-slate-800 rounded-full" />

                              {/* Active Filled Gradient Progress Rail */}
                              <div
                                className="absolute top-[17px] left-5 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-sm shadow-sky-500/30"
                                style={{ width: `calc(${progressPercentage}% * 0.9 + 5px)` }}
                              />

                              {/* Milestones Nodes Strip */}
                              <div className="relative flex items-center justify-between z-10">
                                {ORDER_STATUS_STEPS.map((step, idx) => {
                                  const isCompleted = currentStepIdx > idx;
                                  const isCurrent = currentStepIdx === idx;
                                  const isUpcoming = currentStepIdx < idx;

                                  // Extract timestamp from status history if this step was completed
                                  const historyItem = (order.statusHistory || []).find(
                                    (h: any) => (h.status || '').toLowerCase() === step.key
                                  );
                                  const stepTime = historyItem ? formatStepTime(historyItem.timestamp) : '';

                                  return (
                                    <div
                                      key={step.key}
                                      className="flex flex-col items-center text-center w-14 shrink-0"
                                    >
                                      {/* Node Circle */}
                                      <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                                          isCurrent
                                            ? 'bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-black text-xs ring-4 ring-sky-500/30 shadow-lg shadow-sky-500/40 scale-110'
                                            : isCompleted
                                            ? 'bg-emerald-500 text-slate-950 font-black text-xs shadow-sm shadow-emerald-500/30'
                                            : 'bg-slate-900 border-2 border-slate-700/80 text-slate-500 text-[10px] font-bold'
                                        }`}
                                      >
                                        {isCurrent && (
                                          <span className="absolute -inset-1 rounded-full bg-sky-400 opacity-40 animate-ping pointer-events-none" />
                                        )}
                                        {isCompleted ? (
                                          <CheckOutlined style={{ fontSize: 11 }} />
                                        ) : (
                                          <span className="text-xs">{step.icon}</span>
                                        )}
                                      </div>

                                      {/* Step Label */}
                                      <span
                                        className={`text-[9.5px] mt-1.5 leading-tight font-extrabold truncate w-full ${
                                          isCurrent
                                            ? 'text-sky-300 font-black'
                                            : isCompleted
                                            ? 'text-emerald-400'
                                            : 'text-slate-500'
                                        }`}
                                      >
                                        {step.shortLabel}
                                      </span>

                                      {/* Timestamp or Stage Meta */}
                                      <span className="text-[8.5px] text-slate-400 font-medium leading-none mt-0.5 truncate w-full">
                                        {stepTime || (isCurrent ? 'Now' : '')}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Current Stage Context Banner */}
                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-lg shrink-0">{activeStepConfig.icon}</span>
                                <div className="min-w-0">
                                  <div className="font-extrabold text-white text-[11.5px] truncate">
                                    {activeStepConfig.label}
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-medium line-clamp-1">
                                    {activeStepConfig.desc}
                                  </p>
                                </div>
                              </div>

                              {isOrderActive && (
                                <div className="shrink-0 text-right">
                                  <span className="text-[10px] font-black text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg whitespace-nowrap">
                                    ⏱️ {activeStepConfig.estTime}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Order Items Preview (Compact Rows) */}
                        <div className="bg-slate-950/60 rounded-2xl p-2.5 text-xs text-slate-300 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider px-0.5">
                            <span>Items Ordered ({(order.items || []).length})</span>
                            <span className="text-slate-400">{order.orderType === 'takeaway' ? '🥡 Takeaway' : '🍽️ Dine-In'}</span>
                          </div>

                          <div className="space-y-1 pt-0.5">
                            {(order.items || []).map((it: any, i: number) => (
                              <div
                                key={i}
                                className="flex justify-between items-center text-[11px] bg-slate-900/60 px-2.5 py-1.5 rounded-xl border border-slate-800/60"
                              >
                                <div className="min-w-0 flex-1 pr-2">
                                  <div className="font-bold text-slate-200 truncate">
                                    {it.name} <span className="text-sky-400 font-black">× {it.quantity}</span>
                                  </div>
                                  {it.selectedOptions && Object.keys(it.selectedOptions).length > 0 && (
                                    <div className="text-[9.5px] text-slate-400 truncate mt-0.5">
                                      {Object.entries(it.selectedOptions)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(' • ')}
                                    </div>
                                  )}
                                </div>
                                <span className="font-black text-white shrink-0">
                                  ${Number(it.subtotal || it.price * it.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {order.customer?.note && (
                            <div className="text-[10px] text-amber-300/90 italic pt-1 border-t border-slate-800/80 px-1">
                              Note: "{order.customer.note}"
                            </div>
                          )}
                        </div>

                        {/* Store Telegram Notification Destination Status */}
                        <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-0.5 px-0.5">
                          <span className="flex items-center gap-1.5 font-medium">
                            <SendOutlined className="text-sky-400" />
                            <span>Telegram Alert:</span>
                            <b
                              className={
                                order.store_notification === 'Sent'
                                  ? 'text-emerald-400'
                                  : 'text-amber-400'
                              }
                            >
                              {order.store_notification === 'Sent' ? 'Dispatched ✓' : order.store_notification || 'Dispatched'}
                            </b>
                          </span>

                          {/* Toggle History Milestones Log */}
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedTimelineId(isTimelineExpanded ? null : orderRefNo)
                            }
                            className="text-[10.5px] text-sky-400 font-extrabold underline hover:text-sky-300 transition-colors"
                          >
                            {isTimelineExpanded ? 'Hide History ▲' : 'View Milestones ▼'}
                          </button>
                        </div>

                        {/* Expandable Step-by-Step History Log (Audited Timestamps) */}
                        {isTimelineExpanded && (
                          <div className="mt-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-2 text-xs animate-fadeIn">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                              Live Status Audit History
                            </span>
                            <div className="space-y-2 border-l-2 border-slate-800 pl-3 ml-1.5 py-0.5">
                              {(order.statusHistory || [
                                { status: order.status || 'Pending', timestamp: order.createdAt, note: 'Order placed by customer via Telegram Mini App' }
                              ]).map((item: any, histIdx: number) => (
                                <div key={histIdx} className="space-y-0.5 relative">
                                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-slate-900" />
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-black text-white capitalize">
                                      {item.status}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-tight">
                                    {item.note || `Order advanced to ${item.status}`}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Staff Mode Controls: Status Transitions & Retry Notification */}
                        {isStaffMode && (
                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2 bg-slate-950/90 p-3 rounded-2xl">
                            <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                              <span className="flex items-center gap-1 font-extrabold">
                                <span>⚡</span> Staff Live State Control:
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRetryNotification(orderRefNo)}
                                className="text-[10.5px] text-sky-400 underline font-bold flex items-center gap-1"
                              >
                                <SendOutlined /> Resend Bot Alert
                              </button>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                              {['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStaffUpdateStatus(orderRefNo, st)}
                                  className={`py-1.5 px-2 rounded-xl text-[10px] font-black border transition-all active:scale-95 ${
                                    order.status?.toLowerCase() === st.toLowerCase()
                                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white'
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

      {/* 7. QR CODE SCANNER MODAL (Table & Counter Scanner) */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-base">
                  <QrcodeOutlined />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm">Scan Table / Counter QR</h3>
                  <p className="text-[10px] text-slate-400">Point camera at QR code or pick a test preset</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeScanner}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90 transition-transform"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Camera Viewfinder */}
            <div className="p-4 space-y-3.5 overflow-y-auto">
              {/* Camera Stream Viewfinder */}
              <div className="relative w-full aspect-square max-h-[250px] bg-black rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* Laser Scanning Reticle & Corner Brackets */}
                <div className="absolute inset-4 pointer-events-none flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="w-6 h-6 border-t-2 border-l-2 border-sky-400 rounded-tl-lg" />
                    <span className="w-6 h-6 border-t-2 border-r-2 border-sky-400 rounded-tr-lg" />
                  </div>

                  {/* Animated Scanning Laser Line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-pulse" />

                  <div className="flex justify-between">
                    <span className="w-6 h-6 border-b-2 border-l-2 border-sky-400 rounded-bl-lg" />
                    <span className="w-6 h-6 border-b-2 border-r-2 border-sky-400 rounded-br-lg" />
                  </div>
                </div>

                {/* Fallback Viewfinder if video inactive */}
                {!isCameraActive && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-2">
                    <CameraOutlined style={{ fontSize: 32, color: '#38bdf8' }} />
                    <span className="text-xs font-bold text-slate-300">
                      Camera viewfinder inactive
                    </span>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs active:scale-95 transition-transform"
                    >
                      Start Camera
                    </button>
                  </div>
                )}
              </div>

              {/* Viewfinder Controls (Torch, Flip Camera, Upload Image) */}
              <div className="flex items-center justify-center gap-2">
                {hasTorch && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                      isTorchOn
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span>💡</span>
                    <span>{isTorchOn ? 'Flash On' : 'Flashlight'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={flipCamera}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                >
                  <SyncOutlined />
                  <span>Flip ({facingMode === 'environment' ? 'Rear' : 'Front'})</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                >
                  <span>🖼️</span>
                  <span>Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Error feedback if any */}
              {scannerError && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[11px] leading-relaxed">
                  ⚠️ {scannerError}
                </div>
              )}

              {/* FAST TEST: 1-Tap Table & Counter QR Presets */}
              <div className="space-y-2 pt-1 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider">
                    ⚡ Instant Table Presets:
                  </span>
                  <span className="text-[10px] text-sky-400 font-semibold">1-Tap Test</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: 'Table #04',
                      store: 'Aura Coffee',
                      emoji: '☕',
                      code: 'https://t.me/aura_emenu_order_bot/app?startapp=sbc-store_table_4'
                    },
                    {
                      label: 'Counter #01',
                      store: 'Aura Bakery',
                      emoji: '🥐',
                      code: 'https://t.me/aura_emenu_order_bot/app?startapp=aura-bakery_counter_1'
                    },
                    {
                      label: 'Table #12',
                      store: 'Aura Bistro',
                      emoji: '🥗',
                      code: 'https://t.me/aura_emenu_order_bot/app?startapp=aura-bistro_table_12'
                    },
                    {
                      label: 'Station #01',
                      store: 'Aura Tech',
                      emoji: '⚡',
                      code: 'https://t.me/aura_emenu_order_bot/app?startapp=aura-tech_station_1'
                    }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleProcessScannedQr(preset.code)}
                      className="p-2 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 text-left transition-all active:scale-95 group shadow-sm cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                        <span>{preset.emoji}</span>
                        <span className="group-hover:text-sky-400 transition-colors">{preset.label}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{preset.store}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual URL or Table String input fallback */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                <span className="text-[10.5px] font-bold text-slate-400 block">
                  Or enter URL / Table Code manually:
                </span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={manualQrInput}
                    onChange={(e) => setManualQrInput(e.target.value)}
                    placeholder="e.g. sbc-store_table_4 or /shop/aura-bakery"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (manualQrInput.trim()) {
                        handleProcessScannedQr(manualQrInput.trim());
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shrink-0 active:scale-95 transition-all cursor-pointer"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex justify-end shrink-0">
              <button
                type="button"
                onClick={closeScanner}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer active:scale-98"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
