import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Drawer, Grid, Input, Row, Select, Slider, Space, Switch, Tag, Typography, message, notification } from 'antd';
import {
  AppstoreOutlined,
  CloseOutlined,
  FilterOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductQuickViewModal from '../../components/web/shared/ProductQuickViewModal';
import RetailProductCard from '../../components/web/shared/RetailProductCard';
import TelegramMiniAppModal from '../../components/web/shared/TelegramMiniAppModal';
import { brands, products, shopCategories, shops } from '../../data/shopData';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { animateAddToCart } from '../../utils/helpers';
import { formatCurrency, publicTheme } from '../../utils/webTheme';

const { useBreakpoint } = Grid;
const { Paragraph, Text, Title } = Typography;

const Products = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [search, setSearch] = useState(urlQuery);
  const [telegramProduct, setTelegramProduct] = useState(null);

  useEffect(() => {
    if (urlQuery !== undefined) {
      setSearch(urlQuery);
    }
  }, [urlQuery]);

  const [category, setCategory] = useState('all');
  const [brand, setBrand] = useState('all');
  const [shopId, setShopId] = useState('all');
  const [stockOnly, setStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1600]);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridMode, setGridMode] = useState(4);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (category !== 'all') count++;
    if (brand !== 'all') count++;
    if (shopId !== 'all') count++;
    if (stockOnly) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1600) count++;
    if (search.trim()) count++;
    return count;
  }, [category, brand, shopId, stockOnly, priceRange, search]);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || product.category === category;
      const matchesBrand = brand === 'all' || product.brand === brand;
      const matchesShop = shopId === 'all' || product.shopId === shopId;
      const matchesStock = !stockOnly || product.inStock;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesBrand && matchesShop && matchesStock && matchesPrice;
    });
  }, [search, category, brand, shopId, stockOnly, priceRange]);

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
      messageApi.info('Share is not available in this browser');
    }
  };

  const handleOrder = (product, triggerElement) => {
    animateAddToCart({
      triggerElement,
      productImage: product.image,
    });
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
            Continue Shopping
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

  const handleWishlist = (product) => {
    const added = toggleWishlist(product);
    messageApi.success(
      added ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`
    );
  };

  const productColumnProps =
    gridMode === 6
      ? { xs: 12, sm: 8, md: 6, lg: 6, xl: 4, xxl: 4 }
      : { xs: 12, sm: 8, md: 8, lg: 6, xl: 6, xxl: 6 };

  const filterPanel = (
    <Card
      style={{
        borderRadius: 24,
        border: `1px solid ${publicTheme.border}`,
        background: publicTheme.cardBackground,
        boxShadow: publicTheme.lightShadow,
      }}
      styles={{ body: { padding: 18 } }}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Text strong style={{ color: publicTheme.text, fontSize: 16 }}>
          Filters
        </Text>
        <Input
          size="large"
          prefix={<SearchOutlined style={{ color: publicTheme.subtext }} />}
          placeholder="Search products, brand, or product use"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ borderRadius: 999, height: 48 }}
        />
        <Select
          size="large"
          value={category}
          onChange={setCategory}
          style={{ width: '100%' }}
          options={[
            { label: 'All categories', value: 'all' },
            ...shopCategories.map((item) => ({ label: item.name, value: item.id })),
          ]}
        />
        <Select
          size="large"
          value={brand}
          onChange={setBrand}
          style={{ width: '100%' }}
          options={[
            { label: 'All brands', value: 'all' },
            ...brands.map((item) => ({ label: item, value: item })),
          ]}
        />
        <Select
          size="large"
          value={shopId}
          onChange={setShopId}
          style={{ width: '100%' }}
          options={[
            { label: 'All shops', value: 'all' },
            ...shops.map((item) => ({ label: item.name, value: item.id })),
          ]}
        />

        <div
          style={{
            borderRadius: 18,
            border: `1px solid ${publicTheme.softBorder}`,
            background: publicTheme.cardMuted,
            padding: '12px 16px',
          }}
        >
          <Text style={{ display: 'block', marginBottom: 12, color: publicTheme.text, fontWeight: 600 }}>
            Price range
          </Text>
          <Slider
            range
            min={0}
            max={1600}
            value={priceRange}
            onChange={setPriceRange}
            tooltip={{ formatter: (value) => formatCurrency(value) }}
          />
          <Text style={{ color: publicTheme.subtext }}>
            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
          </Text>
        </div>

        <div
          style={{
            borderRadius: 18,
            border: `1px solid ${publicTheme.softBorder}`,
            background: publicTheme.cardMuted,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <Text strong style={{ display: 'block', color: publicTheme.text }}>
              Stock in only
            </Text>
            <Text style={{ color: publicTheme.subtext }}>Show only products available now</Text>
          </div>
          <Switch checked={stockOnly} onChange={setStockOnly} />
        </div>
      </Space>
    </Card>
  );

  return (
    <div style={{ padding: 0 }}>
      {contextHolder}
      {notificationContextHolder}
      <Card
        className="frosted-panel stagger-rise"
        style={{
          borderRadius: screens.xs ? 22 : 34,
          border: `1px solid ${publicTheme.border}`,
          boxShadow: publicTheme.shadow,
          background: publicTheme.heroBackground,
          marginBottom: screens.xs ? 16 : 24,
        }}
        styles={{ body: { padding: screens.xs ? 18 : 28 } }}
      >
        <Space direction="vertical" size={screens.xs ? 10 : 16} style={{ width: '100%' }}>
          <Tag style={{ width: 'fit-content', borderRadius: 999, border: 'none', background: publicTheme.pill, color: publicTheme.primary, fontWeight: 700, padding: screens.xs ? '4px 10px' : '8px 14px', fontSize: screens.xs ? 11 : 12 }}>
            Retail products
          </Tag>
          <Title level={1} style={{ margin: 0, color: publicTheme.text, fontSize: 'clamp(24px, 4vw, 48px)', lineHeight: 1.1 }}>
            Full-width products with open and close filter sidebar.
          </Title>
          <Paragraph style={{ margin: 0, color: publicTheme.subtext, fontSize: screens.xs ? 13 : 16, maxWidth: 860 }}>
            Browse verified catalog lines. On mobile and tablet, products adapt to a compact, app-like 2-column view with quick order and Telegram E-Menu integration.
          </Paragraph>
        </Space>
      </Card>

      <div
        style={{
          borderRadius: screens.xs ? 18 : 24,
          border: `1px solid ${publicTheme.border}`,
          background: publicTheme.cardBackground,
          boxShadow: publicTheme.lightShadow,
          padding: screens.xs ? 12 : 16,
          marginBottom: screens.xs ? 16 : 24,
        }}
      >
        <Row gutter={[12, 12]} align="middle" justify="space-between">
          <Col xs={12} sm={12} lg={10}>
            <Text style={{ color: publicTheme.subtext, fontSize: screens.xs ? 12 : 14 }}>
              Showing <Text strong style={{ color: publicTheme.text }}>{filteredProducts.length}</Text> products
            </Text>
          </Col>
          <Col xs={12} sm={12} lg={14}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {/* Mobile / Tablet Filter Button */}
              {!screens.lg && (
                <Badge count={activeFiltersCount} size="small">
                  <Button
                    type={activeFiltersCount > 0 ? 'primary' : 'default'}
                    icon={<FilterOutlined />}
                    onClick={() => setMobileFilterOpen(true)}
                    style={{
                      borderRadius: 12,
                      fontWeight: 700,
                      height: 36,
                      fontSize: screens.xs ? 12 : 13,
                    }}
                  >
                    Filters
                  </Button>
                </Badge>
              )}

              {/* Desktop Filters and Grid Buttons */}
              {screens.lg && (
                <>
                  <Button
                    icon={filtersOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    onClick={() => setFiltersOpen((current) => !current)}
                    style={{ borderRadius: 14, fontWeight: 700 }}
                  >
                    {filtersOpen ? 'Close filter bar' : 'Open filter bar'}
                  </Button>
                  <Space.Compact>
                    <Button
                      type={gridMode === 4 ? 'primary' : 'default'}
                      onClick={() => setGridMode(4)}
                      style={{ fontWeight: 700 }}
                    >
                      4 per row
                    </Button>
                    <Button
                      type={gridMode === 6 ? 'primary' : 'default'}
                      onClick={() => setGridMode(6)}
                      style={{ fontWeight: 700 }}
                    >
                      6 per row
                    </Button>
                  </Space.Compact>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={screens.xs ? [12, 12] : [20, 20]} align="top">
        {filtersOpen && screens.lg && (
          <Col xs={0} lg={6}>
            {filterPanel}
          </Col>
        )}

        <Col xs={24} lg={filtersOpen ? 18 : 24}>
          <Row gutter={screens.xs ? [10, 10] : screens.sm ? [12, 12] : [16, 16]}>
            {filteredProducts.map((product) => (
              <Col {...productColumnProps} key={product.id}>
                <RetailProductCard
                  product={product}
                  onPreview={setPreviewProduct}
                  onOrder={handleOrder}
                  onWishlist={handleWishlist}
                  isWishlisted={wishlist.some((item) => item.id === product.id)}
                  onLike={() => messageApi.success(`You liked ${product.name}`)}
                  onShare={handleShare}
                  onOpenTelegram={(item) => setTelegramProduct(item)}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <Drawer
        title="Product filters"
        placement="left"
        closable={false}
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        width={340}
        extra={<Button type="text" icon={<CloseOutlined />} onClick={() => setMobileFilterOpen(false)} />}
      >
        {filterPanel}
      </Drawer>

      <ProductQuickViewModal
        product={previewProduct}
        open={Boolean(previewProduct)}
        onClose={() => setPreviewProduct(null)}
        onOrder={handleOrder}
      />

      <TelegramMiniAppModal
        open={Boolean(telegramProduct)}
        onClose={() => setTelegramProduct(null)}
        product={telegramProduct}
        allProducts={products}
      />
    </div>
  );
};

export default Products;
