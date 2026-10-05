import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Typography,
  Row,
  Col,
  Card,
  Button,
  Avatar,
  Grid,
  Space,
  message,
  Spin,
  Progress
} from 'antd';
import {
  ArrowRightOutlined,
  SendOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  CustomerServiceOutlined,
  FireOutlined,
  ThunderboltOutlined,
  LockOutlined,
  SyncOutlined,
  StarFilled,
  HeartOutlined,
  HeartFilled,
  PlusOutlined,
  CheckOutlined,
  ShareAltOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import simpleData from '../../../../data/simpleData';
import { shops as defaultShops, products as defaultRetailProducts, shopCategories, getLiveProducts } from '../../data/shopData';
import { getLiveStores, getStorefrontSettings } from '../../data/frontEndControlStore';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { publicTheme, formatCurrency, formatCompact } from '../../utils/webTheme';
import { animateAddToCart } from '../../utils/helpers';
import TelegramMiniAppModal, { BOTFATHER_CONFIG } from '../../components/web/shared/TelegramMiniAppModal';
import RetailProductCard from '../../components/web/shared/RetailProductCard';
import RetailShopCard from '../../components/web/shared/RetailShopCard';
import ProductQuickViewModal from '../../components/web/shared/ProductQuickViewModal';
import ShopQuickViewModal from '../../components/web/shared/ShopQuickViewModal';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const useCountdown = (hours = 24) => {
  const [target] = useState(() => Date.now() + hours * 60 * 60 * 1000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = Math.max(target - now, 0);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

export default function Home() {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const countdown = useCountdown(18);
  const { addItem, addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRetailCategory, setActiveRetailCategory] = useState('all');
  const [telegramShop, setTelegramShop] = useState(null);
  const [previewShop, setPreviewShop] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [telegramProduct, setTelegramProduct] = useState(null);

  // Live Front End sync state
  const [shops, setShops] = useState(getLiveStores);
  const [retailProducts, setRetailProducts] = useState(getLiveProducts);
  const [storefrontSettings, setStorefrontSettings] = useState(getStorefrontSettings);

  useEffect(() => {
    const handleStoresUpdated = (e) => setShops(e.detail);
    const handleProductsUpdated = (e) => setRetailProducts(e.detail);
    const handleSettingsUpdated = (e) => setStorefrontSettings(e.detail);

    window.addEventListener('aura_frontend_stores_updated', handleStoresUpdated);
    window.addEventListener('aura_live_products_updated', handleProductsUpdated);
    window.addEventListener('aura_frontend_settings_updated', handleSettingsUpdated);

    return () => {
      window.removeEventListener('aura_frontend_stores_updated', handleStoresUpdated);
      window.removeEventListener('aura_live_products_updated', handleProductsUpdated);
      window.removeEventListener('aura_frontend_settings_updated', handleSettingsUpdated);
    };
  }, []);

  // Shop favorites & wishlist
  const [wishlistedShopIds, setWishlistedShopIds] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_favorite_shops');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleShopWishlist = (shop) => {
    const isSaved = wishlistedShopIds.includes(shop.id);
    const updated = isSaved
      ? wishlistedShopIds.filter((id) => id !== shop.id)
      : [...wishlistedShopIds, shop.id];

    setWishlistedShopIds(updated);
    try {
      localStorage.setItem('aura_favorite_shops', JSON.stringify(updated));
    } catch {}

    if (isSaved) {
      message.info(`${shop.name} removed from favorites`);
    } else {
      message.success(`${shop.name} added to favorites`);
    }
  };

  // Persistent shop social states (likes, follows)
  const [likedShops, setLikedShops] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aura_liked_shops') || '{}');
    } catch (_) {
      return {};
    }
  });

  const [followedShops, setFollowedShops] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aura_followed_shops') || '{}');
    } catch (_) {
      return {};
    }
  });

  const stores = simpleData.stores || [];
  const categories = simpleData.categories || [];
  const products = simpleData.products || [];

  const handleOpenTelegramModal = (storeOrShop) => {
    if (!storeOrShop) return;
    const SELLER_SLUG_MAP = {
      'seller-1': 'sbc-store',
      'seller-2': 'aura-bakery',
      'seller-3': 'aura-lounge',
      'seller-4': 'aura-bistro',
      'seller-5': 'aura-tech',
      'seller-6': 'sbc-store',
    };

    const resolvedSlug =
      storeOrShop.slug ||
      SELLER_SLUG_MAP[storeOrShop.id] ||
      (simpleData.stores || []).find(
        (s) =>
          s.id === storeOrShop.id ||
          s.slug === storeOrShop.id ||
          s.name?.toLowerCase() === storeOrShop.name?.toLowerCase()
      )?.slug ||
      'sbc-store';

    const matchedStore = (simpleData.stores || []).find((s) => s.slug === resolvedSlug);

    setTelegramShop({
      ...storeOrShop,
      id: storeOrShop.id || resolvedSlug,
      slug: resolvedSlug,
      name: storeOrShop.name || matchedStore?.name || 'Aura Store',
      branch: storeOrShop.branch || 'phnom-penh',
      rating: storeOrShop.rating || matchedStore?.rating || 4.9,
      followers: storeOrShop.followers || 12400,
      heroImage:
        storeOrShop.heroImage ||
        storeOrShop.banner ||
        matchedStore?.banner ||
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
      logo: storeOrShop.logo || matchedStore?.logo,
      logoText: storeOrShop.logoText || storeOrShop.name?.slice(0, 2)?.toUpperCase() || 'AS',
      summary:
        storeOrShop.summary ||
        storeOrShop.tagline ||
        matchedStore?.tagline ||
        'Digital contactless dining and takeaway e-menu.',
      specialties: ['E-Menu', 'Online Order', 'Telegram Mini App'],
      responseTime: storeOrShop.responseTime || 'instant',
    });
  };

  const handleToggleLikeShop = (storeId, storeName, e) => {
    if (e) e.stopPropagation();
    setLikedShops((prev) => {
      const next = { ...prev, [storeId]: !prev[storeId] };
      localStorage.setItem('aura_liked_shops', JSON.stringify(next));
      if (next[storeId]) {
        message.success(`❤️ Liked ${storeName}!`);
      } else {
        message.info(`Unliked ${storeName}`);
      }
      return next;
    });
  };

  const handleToggleFollowShop = (storeId, storeName, e) => {
    if (e) e.stopPropagation();
    setFollowedShops((prev) => {
      const next = { ...prev, [storeId]: !prev[storeId] };
      localStorage.setItem('aura_followed_shops', JSON.stringify(next));
      if (next[storeId]) {
        message.success(`➕ Following ${storeName}!`);
      } else {
        message.info(`Unfollowed ${storeName}`);
      }
      return next;
    });
  };

  const handleShareShop = async (storeOrShop, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const shopId = storeOrShop.id || storeOrShop.slug;
    const shareUrl = `${window.location.origin}/shops/${shopId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: storeOrShop.name,
          text: storeOrShop.summary || `Check out ${storeOrShop.name} on Aura Global!`,
          url: shareUrl,
        });
        return;
      } catch (_) {}
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      message.success(`🔗 ${storeOrShop.name} link copied to clipboard!`);
    }
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => Number(p.category_id) === Number(activeCategory));
  }, [products, activeCategory]);

  const filteredRetailProducts = useMemo(() => {
    const visibleOnly = retailProducts.filter((p) => p.visibleOnWebsite !== false);
    if (activeRetailCategory === 'all') return visibleOnly;
    return visibleOnly.filter((p) => p.category === activeRetailCategory);
  }, [retailProducts, activeRetailCategory]);

  // L192-Style Infinite Scroll & 3-Row Progressive Release for Fresh Selections
  // Default show 3 rows: on 6-col desktop that's 18 items (3 rows x 6 items)
  const [homeVisibleCount, setHomeVisibleCount] = useState(18);
  const [isHomeLoadingMore, setIsHomeLoadingMore] = useState(false);
  const homeSentinelRef = useRef(null);

  // Reset to 3 rows when category filter changes
  useEffect(() => {
    setHomeVisibleCount(18);
  }, [activeRetailCategory]);

  const handleLoadMoreHome = useCallback(() => {
    if (isHomeLoadingMore) return;
    setIsHomeLoadingMore(true);
    setTimeout(() => {
      setHomeVisibleCount((prev) => Math.min(prev + (screens.lg ? 12 : 6), filteredRetailProducts.length));
      setIsHomeLoadingMore(false);
    }, 450);
  }, [isHomeLoadingMore, filteredRetailProducts.length, screens.lg]);

  // IntersectionObserver for scroll-down auto release (L192 concept)
  useEffect(() => {
    const sentinel = homeSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isHomeLoadingMore && homeVisibleCount < filteredRetailProducts.length) {
          handleLoadMoreHome();
        }
      },
      { rootMargin: '250px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMoreHome, isHomeLoadingMore, homeVisibleCount, filteredRetailProducts.length]);

  const discountedProducts = useMemo(() => {
    return retailProducts.filter((p) => p.originalPrice && p.originalPrice > p.price);
  }, []);

  const handleOrderRetailProduct = (product, triggerElement) => {
    animateAddToCart({
      triggerElement,
      productImage: product.image,
    });
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    message.success(`${product.name} added to cart!`);
  };

  const handleShareProduct = async (product) => {
    const shareUrl = `${window.location.origin}/products#${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.description, url: shareUrl });
        return;
      } catch (_) {}
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      message.success(`Product link copied to clipboard!`);
    }
  };

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    message.success(`${product.name} added to cart!`);
  };

  return (
    <div style={{ width: '100%', paddingBottom: 48 }}>
      {/* 1. Full-Screen Hero Banner using Default Theme Colors */}
      <div
        className="stagger-rise"
        style={{
          width: '100%',
          borderRadius: 28,
          background: publicTheme.heroBackground,
          border: `1px solid ${publicTheme.border}`,
          boxShadow: publicTheme.shadow,
          position: 'relative',
          overflow: 'hidden',
          padding: screens.xs ? '32px 20px' : screens.md ? '48px 44px' : '56px 52px',
          marginBottom: 36,
        }}
      >
        {/* Decorative ambient color accents using default palette */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            top: -60,
            right: -60,
            background: publicTheme.primary,
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity: 0.12,
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: 280,
            height: 280,
            bottom: -60,
            left: '30%',
            background: publicTheme.accent,
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        />

        <Row gutter={[40, 36]} align="middle" style={{ position: 'relative', zIndex: 1 }}>
          <Col xs={24} lg={13}>
            {/* Header Kicker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: publicTheme.primary,
                  boxShadow: `0 0 10px ${publicTheme.primary}`,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: publicTheme.primary,
                  textTransform: 'uppercase',
                }}
              >
                Multi-Store E-Menu & Telegram Mini App
              </span>
            </div>

            <Title
              level={1}
              style={{
                color: publicTheme.text,
                fontSize: screens.xs ? 28 : screens.md ? 44 : 52,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: 16,
              }}
            >
              Order Seamlessly with{' '}
              <span style={{ color: publicTheme.primary }}>Telegram Mini App</span> & Multi-Store E-Menu
            </Title>

            <Paragraph
              style={{
                color: publicTheme.subtext,
                fontSize: screens.xs ? 13.5 : 16,
                lineHeight: 1.55,
                maxWidth: 580,
                marginBottom: 24,
              }}
            >
              Browse artisan food, specialty coffee, and curated lifestyle collections. Place orders
              directly inside Telegram or web, with instant automated dispatch to shop staff groups
              for fast contactless dining and takeaway.
            </Paragraph>

            <Space wrap size={12} style={{ width: screens.xs ? '100%' : 'auto' }}>
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={() => handleOpenTelegramModal(stores[0] || shops[0])}
                style={{
                  height: 46,
                  width: screens.xs ? '100%' : 'auto',
                  borderRadius: 14,
                  background: publicTheme.primary,
                  borderColor: publicTheme.primary,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: screens.xs ? 13 : 14,
                  paddingInline: 22,
                  boxShadow: '0 10px 24px rgba(47, 111, 237, 0.28)',
                }}
              >
                Launch Telegram Mini App E-Menu
              </Button>
              <Button
                size="large"
                icon={<ShopOutlined />}
                onClick={() => navigate('/products')}
                style={{
                  height: 46,
                  width: screens.xs ? '100%' : 'auto',
                  borderRadius: 14,
                  background: '#ffffff',
                  borderColor: publicTheme.accent,
                  color: publicTheme.accent,
                  fontWeight: 700,
                  fontSize: screens.xs ? 13 : 14,
                  paddingInline: 22,
                }}
              >
                Browse Web Catalog
              </Button>
            </Space>

            {/* Quick Metrics */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: screens.xs ? 14 : 24,
                marginTop: 32,
                paddingTop: 24,
                borderTop: `1px solid ${publicTheme.softBorder}`,
              }}
            >
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: publicTheme.text }}>4 Shops</div>
                <div style={{ fontSize: 12, color: publicTheme.subtext }}>Active Concepts</div>
              </div>
              <div style={{ width: 1, height: 28, background: publicTheme.softBorder }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: publicTheme.primary }}>&lt; 1s</div>
                <div style={{ fontSize: 12, color: publicTheme.subtext }}>Group Dispatch</div>
              </div>
              <div style={{ width: 1, height: 28, background: publicTheme.softBorder }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: publicTheme.accent }}>4.9 ★</div>
                <div style={{ fontSize: 12, color: publicTheme.subtext }}>User Satisfaction</div>
              </div>
            </div>
          </Col>

          {/* Live Telegram Kitchen Dispatch Preview Card using Default Theme */}
          <Col xs={24} lg={11}>
            <div
              style={{
                borderRadius: 24,
                background: 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${publicTheme.border}`,
                padding: 24,
                backdropFilter: 'blur(20px)',
                boxShadow: publicTheme.lightShadow,
              }}
            >
              {/* Telegram Card Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 14,
                  borderBottom: `1px solid ${publicTheme.softBorder}`,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=100&fit=crop"
                    size={40}
                    style={{ border: `2px solid ${publicTheme.primary}` }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: publicTheme.text }}>
                      ☕ Aura Coffee Kitchen Group
                    </div>
                    <div style={{ fontSize: 11, color: publicTheme.success, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: publicTheme.success }} />
                      Telegram Bot Live
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'rgba(47, 111, 237, 0.1)',
                    color: publicTheme.primary,
                  }}
                >
                  Auto-Sync
                </span>
              </div>

              {/* Sample Dispatched Order Receipt */}
              <div
                style={{
                  background: 'rgba(240, 244, 255, 0.85)',
                  borderRadius: 16,
                  padding: 16,
                  border: `1px solid ${publicTheme.softBorder}`,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: publicTheme.text,
                }}
              >
                <div style={{ color: publicTheme.primary, fontWeight: 'bold', marginBottom: 6 }}>
                  🔔 NEW SHOP ORDER #TMA-892410
                </div>
                <div>👤 Customer: Elena Rostova</div>
                <div>📍 Table #04 · Dine-In</div>
                <div>📝 Note: Extra oat milk & double shot</div>
                <div style={{ margin: '8px 0', borderTop: `1px dashed ${publicTheme.softBorder}` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>2x Spanish Iced Latte</span>
                  <span style={{ fontWeight: 'bold' }}>$8.50</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>1x Golden Almond Croissant</span>
                  <span style={{ fontWeight: 'bold' }}>$3.75</span>
                </div>
                <div style={{ margin: '8px 0', borderTop: `1px solid ${publicTheme.softBorder}` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: publicTheme.success, fontWeight: 'bold' }}>
                  <span>TOTAL TO COLLECT:</span>
                  <span>$12.25</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Connected Multi-Store Concept Showcase (Exact match to Shops Page with Visit shop button) */}
      <div style={{ width: '100%', marginBottom: screens.xs ? 28 : 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: screens.xs ? 'flex-start' : 'flex-end', marginBottom: screens.xs ? 12 : 20, flexDirection: screens.xs ? 'column' : 'row', gap: screens.xs ? 6 : 0 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: publicTheme.primary, textTransform: 'uppercase', marginBottom: 4 }}>
              Fulfillment Hubs & Specialty Stores
            </div>
            <Title level={screens.xs ? 3 : 2} style={{ margin: 0, fontWeight: 800, color: publicTheme.text }}>
              Explore Our Shops & Stores
            </Title>
            <Paragraph style={{ color: publicTheme.subtext, fontSize: 13, margin: '4px 0 0' }}>
              Direct supplier shops with instant Telegram Mini App dispatch, local inventory, and fast response times.
            </Paragraph>
          </div>
          <Button
            type="link"
            onClick={() => navigate('/shops')}
            style={{ fontWeight: 700, color: publicTheme.primary, padding: 0 }}
          >
            All Shops ({shops.length}) <ArrowRightOutlined />
          </Button>
        </div>

        {/* 6-Card Responsive Grid matching Shops Page exactly */}
        <Row gutter={screens.xs ? [12, 12] : screens.sm ? [14, 14] : [18, 18]} style={{ width: '100%' }}>
          {shops.map((shop) => {
            const shopProducts = retailProducts.filter((p) => p.shopId === shop.id);
            const isWishlisted = wishlistedShopIds.includes(shop.id);

            return (
              <Col xs={24} sm={12} md={8} lg={4} key={shop.id}>
                <RetailShopCard
                  shop={shop}
                  shopProducts={shopProducts}
                  gridMode={screens.xs ? 4 : 6}
                  onPreview={(s) => setPreviewShop(s)}
                  onWishlist={toggleShopWishlist}
                  isWishlisted={isWishlisted}
                  onLike={(s) => message.success(`You liked ${s.name}!`)}
                  onShare={handleShareShop}
                  onOpenTelegram={(s) => handleOpenTelegramModal(s)}
                />
              </Col>
            );
          })}
        </Row>
      </div>

      {/* 3. New Discount Items Section directly below Multi-Store E-Menu & Shops */}
      <div style={{ width: '100%', marginBottom: screens.xs ? 28 : 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: publicTheme.danger, textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FireOutlined style={{ color: publicTheme.danger }} />
              Exclusive Price Drops
            </div>
            <Title level={screens.xs ? 3 : 2} style={{ margin: 0, fontWeight: 800, color: publicTheme.text }}>
              Special Discount Items
            </Title>
            <Paragraph style={{ color: publicTheme.subtext, fontSize: 13, margin: '4px 0 0' }}>
              Handpicked fulfillment equipment, packaging supply, and hardware with limited-time price reductions.
            </Paragraph>
          </div>
          <Button
            type="link"
            onClick={() => navigate('/products')}
            style={{ fontWeight: 700, color: publicTheme.primary, padding: 0 }}
          >
            All Deals ({discountedProducts.length}) <ArrowRightOutlined />
          </Button>
        </div>

        {/* Discount Products Grid */}
        <Row gutter={screens.xs ? [12, 12] : [18, 18]} style={{ width: '100%' }}>
          {discountedProducts.slice(0, screens.xs ? 4 : 6).map((product) => (
            <Col xs={24} sm={12} md={8} lg={4} key={product.id}>
              <RetailProductCard
                product={product}
                onPreview={setPreviewProduct}
                onQuickView={setPreviewProduct}
                onOrder={handleOrderRetailProduct}
                onAddToCart={handleOrderRetailProduct}
                onWishlist={toggleWishlist}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist.some((item) => item.id === product.id)}
                onLike={() => message.success(`❤️ Liked ${product.name}`)}
                onShare={handleShareProduct}
                onOpenTelegram={(item) => setTelegramProduct(item)}
              />
            </Col>
          ))}
        </Row>
      </div>

      

      {/* 4. Full-Screen Products Showcase with Category Filters */}
      <div style={{ width: '100%', marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: publicTheme.primary, textTransform: 'uppercase', marginBottom: 4 }}>
              Fresh Selections
            </div>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: publicTheme.text }}>
              Featured Products & Items
            </Title>
          </div>
          <Button
            type="link"
            onClick={() => navigate('/products')}
            style={{ fontWeight: 700, color: publicTheme.primary, padding: 0 }}
          >
            View Full Menu <ArrowRightOutlined />
          </Button>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 12,
            marginBottom: 20,
          }}
        >
          <Button
            onClick={() => setActiveRetailCategory('all')}
            style={{
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 12,
              background: activeRetailCategory === 'all' ? publicTheme.primary : '#ffffff',
              color: activeRetailCategory === 'all' ? '#ffffff' : publicTheme.text,
              borderColor: activeRetailCategory === 'all' ? publicTheme.primary : publicTheme.border,
            }}
          >
            All Products ({retailProducts.length})
          </Button>
          {shopCategories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setActiveRetailCategory(cat.id)}
              style={{
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 12,
                background: activeRetailCategory === cat.id ? publicTheme.primary : '#ffffff',
                color: activeRetailCategory === cat.id ? '#ffffff' : publicTheme.text,
                borderColor: activeRetailCategory === cat.id ? publicTheme.primary : publicTheme.border,
              }}
            >
              {cat.icon ? `${cat.icon} ` : ''}{cat.name}
            </Button>
          ))}
        </div>

        {/* Count and Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 12, fontWeight: 700, color: publicTheme.subtext }}>
          <span>
            Showing <strong style={{ color: publicTheme.primary }}>{Math.min(homeVisibleCount, filteredRetailProducts.length)}</strong> of {filteredRetailProducts.length} products
          </span>
          <span style={{ fontSize: 11, background: 'rgba(47, 111, 237, 0.08)', color: publicTheme.primary, padding: '2px 8px', borderRadius: 999 }}>
            ⚡ Scroll down to auto-load rows
          </span>
        </div>

        {/* Full-Width Products Grid matching L192 3-Row Initial Display + Infinite Scroll */}
        <Row gutter={screens.xs ? [12, 12] : [18, 18]} style={{ width: '100%' }}>
          {filteredRetailProducts.slice(0, homeVisibleCount).map((product) => (
            <Col xs={24} sm={12} md={8} lg={4} key={product.id}>
              <RetailProductCard
                product={product}
                onPreview={setPreviewProduct}
                onQuickView={setPreviewProduct}
                onOrder={handleOrderRetailProduct}
                onAddToCart={handleOrderRetailProduct}
                onWishlist={toggleWishlist}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist.some((item) => item.id === product.id)}
                onLike={() => message.success(`❤️ Liked ${product.name}`)}
                onShare={handleShareProduct}
                onOpenTelegram={(item) => setTelegramProduct(item)}
              />
            </Col>
          ))}
        </Row>

        {/* Sentinel element to trigger scroll loading */}
        <div ref={homeSentinelRef} style={{ height: 16, width: '100%', margin: '8px 0' }} />

        {/* L192-Style Loading State and Load More Bar */}
        {isHomeLoadingMore && (
          <div
            style={{
              padding: '24px 0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: publicTheme.primary }} spin />} />
            <div style={{ fontSize: 13, fontWeight: 700, color: publicTheme.text }}>
              Loading more fresh selections...
            </div>
            <div style={{ fontSize: 11, color: publicTheme.subtext }}>
              Releasing verified store inventory &amp; updated pricing
            </div>
          </div>
        )}

        {/* Manual Trigger Button when more items exist and not loading */}
        {homeVisibleCount < filteredRetailProducts.length && !isHomeLoadingMore && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button
              size="large"
              icon={<SyncOutlined />}
              onClick={handleLoadMoreHome}
              style={{
                borderRadius: 999,
                height: 44,
                paddingInline: 28,
                fontWeight: 800,
                fontSize: 13,
                background: '#ffffff',
                borderColor: publicTheme.primary,
                color: publicTheme.primary,
                boxShadow: '0 4px 16px rgba(47, 111, 237, 0.12)',
              }}
            >
              Scroll down or tap to release next rows ({filteredRetailProducts.length - homeVisibleCount} more)
            </Button>
          </div>
        )}

        {/* End of Collection Notice */}
        {homeVisibleCount >= filteredRetailProducts.length && filteredRetailProducts.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '28px 0 10px',
              color: publicTheme.subtext,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            ✨ You've reached the end of Fresh Selections ({filteredRetailProducts.length} items loaded)
          </div>
        )}
      </div>

      {/* 5. Limited Flash Deal in Default Sunset Coral Gradient */}
      <div
        style={{
          width: '100%',
          borderRadius: 26,
          background: publicTheme.sunset,
          color: '#ffffff',
          padding: screens.xs ? '24px 20px' : '36px 40px',
          marginBottom: 36,
          boxShadow: '0 16px 36px rgba(255, 122, 61, 0.28)',
        }}
      >
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} md={14}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <FireOutlined style={{ fontSize: 16 }} />
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Daily Special Offers
              </span>
            </div>
            <Title level={2} style={{ color: '#ffffff', margin: '0 0 8px', fontWeight: 800 }}>
              Enjoy 20% Off Your First Telegram Order
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.92)', fontSize: 14, margin: 0, maxWidth: 520 }}>
              Use coupon code <b>AURATG</b> on checkout or mention it in your order notes.
            </Paragraph>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: screens.xs ? 'left' : 'right' }}>
            <div style={{ display: 'inline-flex', gap: 10, marginBottom: 14 }}>
              <div style={{ background: 'rgba(255,255,255,0.22)', padding: '8px 14px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{String(countdown.hours).padStart(2, '0')}</div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.85 }}>Hours</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.22)', padding: '8px 14px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{String(countdown.minutes).padStart(2, '0')}</div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.85 }}>Mins</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.22)', padding: '8px 14px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{String(countdown.seconds).padStart(2, '0')}</div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.85 }}>Secs</div>
              </div>
            </div>
            <div>
              <Button
                size="large"
                onClick={() => navigate('/shop/sbc-store')}
                style={{
                  height: 44,
                  borderRadius: 14,
                  background: '#ffffff',
                  color: publicTheme.accent,
                  border: 'none',
                  fontWeight: 800,
                  fontSize: 13,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                Claim Deal in Mini App
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* 6. Full-Width Trust & Quality Pillars */}
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        {[
          { icon: <SendOutlined />, title: 'Real-Time Telegram Dispatch', text: 'Kitchen tickets sent instantly to shop groups' },
          { icon: <SafetyCertificateOutlined />, title: 'Artisan Quality', text: 'Farm-to-cup beans & European sourdough' },
          { icon: <RocketOutlined />, title: 'Fast Contactless Service', text: 'Dine-in at your table or quick store pickup' },
          { icon: <CustomerServiceOutlined />, title: 'Direct Customer Support', text: 'Dedicated assistance anytime via Telegram' },
        ].map((item, idx) => (
          <Col xs={12} sm={12} md={6} key={idx} style={{ padding: '0 8px' }}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: 18,
                padding: 18,
                border: `1px solid ${publicTheme.softBorder}`,
                boxShadow: publicTheme.lightShadow,
                height: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 22, color: publicTheme.primary, marginTop: 2 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: publicTheme.text, marginBottom: 2 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: publicTheme.subtext, lineHeight: 1.45 }}>
                  {item.text}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Product Quick View Modal */}
      <ProductQuickViewModal
        product={previewProduct}
        open={Boolean(previewProduct)}
        onClose={() => setPreviewProduct(null)}
        onOrder={handleOrderRetailProduct}
      />

      {/* Shop Quick View Modal */}
      <ShopQuickViewModal
        shop={previewShop}
        open={Boolean(previewShop)}
        onClose={() => setPreviewShop(null)}
        onOpenTelegram={(s) => handleOpenTelegramModal(s)}
        shopProducts={previewShop ? retailProducts.filter((p) => p.shopId === previewShop.id) : []}
      />

      {/* Telegram Mini App Gateway Modal */}
      <TelegramMiniAppModal
        open={Boolean(telegramShop || telegramProduct)}
        onClose={() => {
          setTelegramShop(null);
          setTelegramProduct(null);
        }}
        shop={telegramShop}
        product={telegramProduct}
        allProducts={retailProducts}
      />
    </div>
  );
}
