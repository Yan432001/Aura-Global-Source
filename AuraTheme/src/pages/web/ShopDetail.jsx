import React, { useMemo, useState } from 'react';
import { Avatar, Button, Col, Grid, Input, Row, Space, Tag, Typography, message, notification } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, SendOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ProductQuickViewModal from '../../components/web/shared/ProductQuickViewModal';
import RetailProductCard from '../../components/web/shared/RetailProductCard';
import TelegramMiniAppModal, { BOTFATHER_CONFIG } from '../../components/web/shared/TelegramMiniAppModal';
import { products, shops } from '../../data/shopData';
import simpleData from '../../../../data/simpleData';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { animateAddToCart } from '../../utils/helpers';
import { publicTheme } from '../../utils/webTheme';

const { useBreakpoint } = Grid;
const { Paragraph, Text, Title } = Typography;

const ShopDetail = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const { shopId } = useParams();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [search, setSearch] = useState('');
  const [previewProduct, setPreviewProduct] = useState(null);
  const [telegramModal, setTelegramModal] = useState({ open: false, shop: null, product: null });

  // Resolve shop from simpleData or legacy shops
  const shop = useMemo(() => {
    const foundStore = (simpleData.stores || []).find(
      (s) => s.slug === shopId || String(s.id) === String(shopId)
    );
    if (foundStore) {
      return {
        id: foundStore.slug,
        slug: foundStore.slug,
        storeId: foundStore.id,
        name: foundStore.name,
        company: foundStore.company,
        summary: foundStore.tagline || 'Artisan store with live Telegram Mini App E-Menu ordering.',
        address: foundStore.address,
        rating: foundStore.rating || 4.9,
        reviews: foundStore.reviewsCount || 140,
        followers: 12400,
        responseTime: 'within 5 min',
        heroImage: foundStore.banner || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=400&fit=crop',
        logoText: foundStore.name.slice(0, 2),
        logo: foundStore.logo,
        telegram_group_name: foundStore.telegram_group_name || 'Kitchen Staff Group',
        specialties: ['Telegram E-Menu', 'Live Kitchen Dispatch', 'Instant Checkout'],
        established: '2022'
      };
    }
    return shops.find((item) => item.id === shopId || item.slug === shopId);
  }, [shopId]);

  const shopProducts = useMemo(() => {
    const query = search.toLowerCase();
    const simpleProducts = (simpleData.products || [])
      .filter((p) => {
        if (!shop) return false;
        if (shop.storeId) return Number(p.biller_id) === Number(shop.storeId);
        return false;
      })
      .map((p) => ({
        id: `sp-${p.id}`,
        name: p.name,
        price: p.price,
        image: p.image,
        brand: shop.name,
        category: p.category_id === 1 ? 'Coffee' : p.category_id === 2 ? 'Teas' : p.category_id === 3 ? 'Bakery' : 'Specialty',
        description: p.details || p.name,
        features: ['Freshly Prepared', 'Telegram Direct Dispatch'],
        inStock: true,
        rating: 4.9,
        reviews: 28,
        shopId: shop.slug
      }));

    const legacyProducts = products.filter(
      (product) => product.shopId === shopId || product.shopId === shop?.id
    );

    const merged = [...simpleProducts, ...legacyProducts];
    return merged.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query))
    );
  }, [search, shopId, shop]);

  if (!shop) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Title level={2}>Shop not found</Title>
        <Button type="primary" onClick={() => navigate('/shops')}>Back to shops</Button>
      </div>
    );
  }

  const handleShare = async (product) => {
    const shareUrl = `${window.location.origin}/products#${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.description, url: shareUrl });
        return;
      } catch {
        // Fall through to clipboard copy.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      messageApi.success('Product link copied');
    } catch {
      messageApi.error('Unable to copy link');
    }
  };

  const handleAddToCart = (product, event) => {
    const imageElement = event?.currentTarget
      ?.closest('.ant-card')
      ?.querySelector('img');
    if (imageElement) {
      animateAddToCart(imageElement);
    }
    addToCart(product);

    notificationApi.success({
      message: (
        <span style={{ fontWeight: 800, fontSize: 14 }}>
          {product.name} Added to Cart!
        </span>
      ),
      description: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, marginBottom: 8 }}>
          <img
            src={product.image}
            alt=""
            style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#2563eb' }}>
              ${Number(product.price).toFixed(2)}
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Item is saved in your cart</div>
          </div>
        </div>
      ),
      actions: (
        <Space size={8}>
          <Button size="small" onClick={() => notificationApi.destroy()} style={{ borderRadius: 8, fontSize: 12 }}>
            Continue
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              notificationApi.destroy();
              navigate('/cart');
            }}
            style={{
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              background: '#2563eb',
              borderColor: '#2563eb',
            }}
          >
            View Cart &amp; Checkout →
          </Button>
        </Space>
      ),
      duration: 5,
      placement: 'topRight',
    });
  };

  return (
    <div style={{ padding: 0 }}>
      {contextHolder}
      {notificationContextHolder}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: screens.xs ? 22 : 34,
          marginBottom: screens.xs ? 16 : 24,
          minHeight: screens.xs ? 220 : 320,
          background: '#183441',
        }}
      >
        <img
          src={shop.heroImage}
          alt={shop.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(18,37,48,0.88), rgba(20,92,114,0.72))' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: screens.xs ? 16 : 28 }}>
          <Space direction="vertical" size={screens.xs ? 12 : 16} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/shops')} style={{ borderRadius: 999, height: screens.xs ? 34 : 40 }}>
                Back to shops
              </Button>

              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => setTelegramModal({ open: true, shop, product: null })}
                style={{
                  borderRadius: 999,
                  height: screens.xs ? 34 : 42,
                  paddingInline: screens.xs ? 14 : 22,
                  background: '#2481cc',
                  borderColor: '#2481cc',
                  fontWeight: 700,
                  fontSize: screens.xs ? 12 : 13,
                  boxShadow: '0 8px 18px rgba(36, 129, 204, 0.4)',
                }}
              >
                Telegram Mini App
              </Button>
            </div>

            <Space align="center" size={screens.xs ? 10 : 14} wrap>
              <Avatar size={screens.xs ? 46 : 64} src={shop.logo} style={{ background: publicTheme.ribbon, fontWeight: 800 }}>
                {shop.logoText || shop.name.slice(0, 2)}
              </Avatar>
              <div>
                <Title level={1} style={{ margin: 0, color: 'white', fontSize: screens.xs ? 22 : 'clamp(28px, 4vw, 48px)' }}>
                  {shop.name}
                </Title>
                <Space size={6} wrap style={{ marginTop: 2 }}>
                  <Tag style={{ margin: 0, borderRadius: 999, background: 'rgba(255,255,255,0.14)', color: 'white', border: 'none', fontSize: screens.xs ? 10 : 12 }}>
                    Est. {shop.established}
                  </Tag>
                  <Tag style={{ margin: 0, borderRadius: 999, background: 'rgba(255,255,255,0.14)', color: 'white', border: 'none', fontSize: screens.xs ? 10 : 12 }}>
                    {shop.responseTime}
                  </Tag>
                  {shop.telegram_group_name && (
                    <Tag style={{ margin: 0, borderRadius: 999, background: 'rgba(47, 111, 237, 0.4)', color: 'white', border: 'none', fontSize: screens.xs ? 10 : 12 }}>
                      <SendOutlined style={{ marginRight: 4 }} />
                      {shop.telegram_group_name}
                    </Tag>
                  )}
                </Space>
              </div>
            </Space>
            <Paragraph style={{ maxWidth: 760, margin: 0, color: 'rgba(255,255,255,0.82)', fontSize: screens.xs ? 13 : 16 }}>
              {shop.summary}
            </Paragraph>
            <Space wrap size={[6, 6]}>
              {(shop.specialties || []).map((item) => (
                <Tag key={item} style={{ margin: 0, borderRadius: 999, background: 'rgba(255,255,255,0.14)', color: 'white', border: 'none', fontSize: screens.xs ? 10 : 12 }}>
                  {item}
                </Tag>
              ))}
            </Space>
            <Space size={14} wrap style={{ fontSize: screens.xs ? 12 : 14 }}>
              <Text style={{ color: 'white' }}><StarFilled style={{ color: '#ffd666' }} /> {shop.rating} rating</Text>
              <Text style={{ color: 'white' }}>{shop.followers.toLocaleString()} followers</Text>
              <Text style={{ color: 'white' }}>{shopProducts.length} items</Text>
            </Space>
          </Space>
        </div>
      </div>

      <div style={{ marginBottom: screens.xs ? 12 : 20 }}>
        <Input
          size={screens.xs ? 'middle' : 'large'}
          prefix={<SearchOutlined style={{ color: publicTheme.subtext }} />}
          placeholder={`Search ${shop.name} items...`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ maxWidth: 440, borderRadius: 999 }}
          allowClear
        />
      </div>

      <Row gutter={screens.xs ? [10, 10] : screens.sm ? [12, 12] : [16, 16]}>
        {shopProducts.map((product) => (
          <Col xs={12} sm={8} md={6} lg={6} xl={6} key={product.id}>
            <RetailProductCard
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={toggleWishlist}
              onQuickView={setPreviewProduct}
              onAddToCart={handleAddToCart}
              onShare={handleShare}
              onOpenTelegram={(item) => setTelegramModal({ open: true, shop, product: item })}
            />
          </Col>
        ))}
      </Row>

      <ProductQuickViewModal
        product={previewProduct}
        open={Boolean(previewProduct)}
        onCancel={() => setPreviewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={previewProduct ? wishlist.includes(previewProduct.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      <TelegramMiniAppModal
        open={telegramModal.open}
        onClose={() => setTelegramModal({ open: false, shop: null, product: null })}
        shop={telegramModal.shop || shop}
        product={telegramModal.product}
        allProducts={shopProducts}
      />
    </div>
  );
};

export default ShopDetail;
