import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Drawer, Input, Row, Select, Slider, Space, Switch, Tag, Typography, message } from 'antd';
import {
  AppstoreOutlined,
  CloseOutlined,
  FilterOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import ProductQuickViewModal from '../../components/web/shared/ProductQuickViewModal';
import RetailProductCard from '../../components/web/shared/RetailProductCard';
import { brands, products, shopCategories, shops } from '../../data/shopData';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { animateAddToCart } from '../../utils/helpers';
import { formatCurrency, publicTheme } from '../../utils/webTheme';

const { Paragraph, Text, Title } = Typography;

const Products = () => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [brand, setBrand] = useState('all');
  const [shopId, setShopId] = useState('all');
  const [stockOnly, setStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1600]);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridMode, setGridMode] = useState(4);

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
  };

  const handleWishlist = (product) => {
    const added = toggleWishlist(product);
    messageApi.success(
      added ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`
    );
  };

  const productColumnProps =
    gridMode === 6
      ? { xs: 24, sm: 12, md: 8, lg: 8, xl: 4, xxl: 4 }
      : { xs: 24, sm: 12, md: 8, lg: 8, xl: 6, xxl: 6 };

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
      <Card
        className="frosted-panel stagger-rise"
        style={{
          borderRadius: 34,
          border: `1px solid ${publicTheme.border}`,
          boxShadow: publicTheme.shadow,
          background: publicTheme.heroBackground,
          marginBottom: 24,
        }}
        styles={{ body: { padding: 28 } }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Tag style={{ width: 'fit-content', borderRadius: 999, border: 'none', background: publicTheme.pill, color: publicTheme.primary, fontWeight: 700, padding: '8px 14px' }}>
            Retail products
          </Tag>
          <Title level={1} style={{ margin: 0, color: publicTheme.text, fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 1.05 }}>
            Full-width products with open and close filter sidebar.
          </Title>
          <Paragraph style={{ margin: 0, color: publicTheme.subtext, fontSize: 16, maxWidth: 860 }}>
            The product page now uses a left filter sidebar that can be opened and closed. Users can switch the product wall between 4 items per row or 6 items per row on wide screens.
          </Paragraph>
        </Space>
      </Card>

      <div
        style={{
          borderRadius: 24,
          border: `1px solid ${publicTheme.border}`,
          background: publicTheme.cardBackground,
          boxShadow: publicTheme.lightShadow,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} lg={10}>
            <Text style={{ color: publicTheme.subtext }}>
              Showing <Text strong style={{ color: publicTheme.text }}>{filteredProducts.length}</Text> products
            </Text>
          </Col>
          <Col xs={24} lg={14}>
            <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                icon={filtersOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                onClick={() => setFiltersOpen((current) => !current)}
                style={{ borderRadius: 14, fontWeight: 700 }}
              >
                {filtersOpen ? 'Close filter bar' : 'Open filter bar'}
              </Button>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setMobileFilterOpen(true)}
                style={{ borderRadius: 14, fontWeight: 700 }}
              >
                Mobile filters
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
            </Space>
          </Col>
        </Row>
      </div>

      <Row gutter={[20, 20]} align="top">
        {filtersOpen && (
          <Col xs={0} lg={6}>
            {filterPanel}
          </Col>
        )}

        <Col xs={24} lg={filtersOpen ? 18 : 24}>
          <Row gutter={[18, 18]}>
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
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <Drawer
        title="Product filters"
        placement="left"
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
    </div>
  );
};

export default Products;
