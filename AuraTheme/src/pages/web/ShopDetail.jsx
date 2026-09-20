import React, { useMemo, useState } from 'react';
import { Avatar, Button, Col, Input, Row, Space, Tag, Typography, message } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, ShopOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ProductQuickViewModal from '../../components/web/shared/ProductQuickViewModal';
import RetailProductCard from '../../components/web/shared/RetailProductCard';
import { products, shops } from '../../data/shopData';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { animateAddToCart } from '../../utils/helpers';
import { publicTheme } from '../../utils/webTheme';

const { Paragraph, Text, Title } = Typography;

const ShopDetail = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState('');
  const [previewProduct, setPreviewProduct] = useState(null);

  const shop = shops.find((item) => item.id === shopId);

  const shopProducts = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter(
      (product) =>
        product.shopId === shopId &&
        (product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query))
    );
  }, [search, shopId]);

  if (!shop) {
    return (
      <div>
        <Title level={2}>Shop not found</Title>
        <Button onClick={() => navigate('/shop')}>Back to shops</Button>
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

  return (
    <div style={{ padding: 0 }}>
      {contextHolder}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 34,
          marginBottom: 24,
          minHeight: 320,
          background: '#183441',
        }}
      >
        <img
          src={shop.heroImage}
          alt={shop.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(18,37,48,0.88), rgba(20,92,114,0.72))' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: 28 }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/shop')} style={{ width: 'fit-content', borderRadius: 999 }}>
              Back to shops
            </Button>
            <Space align="center" size={14} wrap>
              <Avatar size={64} style={{ background: publicTheme.ribbon, fontWeight: 800 }}>
                {shop.logoText}
              </Avatar>
              <div>
                <Title level={1} style={{ margin: 0, color: 'white', fontSize: 'clamp(28px, 4vw, 48px)' }}>
                  {shop.name}
                </Title>
                <Space size={10} wrap>
                  <Tag style={{ margin: 0, borderRadius: 999, background: 'rgba(255,255,255,0.14)', color: 'white', border: 'none' }}>
                    Established {shop.established}
                  </Tag>
                  <Tag style={{ margin: 0, borderRadius: 999, background: 'rgba(255,255,255,0.14)', color: 'white', border: 'none' }}>
                    {shop.responseTime}
                  </Tag>
                </Space>
              </div>
            </Space>
            <Paragraph style={{ maxWidth: 760, margin: 0, color: 'rgba(255,255,255,0.82)', fontSize: 16 }}>
              {shop.summary}
            </Paragraph>
            <Space wrap size={[8, 8]}>
              {shop.specialties.map((item) => (
                <Tag key={item} style={{ margin: 0, borderRadius: 999, background: 'rgba(255,255,255,0.14)', color: 'white', border: 'none' }}>
                  {item}
                </Tag>
              ))}
            </Space>
            <Space size={18} wrap>
              <Text style={{ color: 'white' }}><StarFilled style={{ color: '#ffd666' }} /> {shop.rating} rating</Text>
              <Text style={{ color: 'white' }}>{shop.followers.toLocaleString()} followers</Text>
              <Text style={{ color: 'white' }}>{shopProducts.length} products</Text>
            </Space>
          </Space>
        </div>
      </div>

      <div
        style={{
          borderRadius: 28,
          border: `1px solid ${publicTheme.border}`,
          background: publicTheme.cardBackground,
          boxShadow: publicTheme.lightShadow,
          padding: 18,
          marginBottom: 24,
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} lg={16}>
            <Input
              size="large"
              prefix={<SearchOutlined style={{ color: publicTheme.subtext }} />}
              placeholder={`Search inside ${shop.name}`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{ borderRadius: 999, height: 48 }}
            />
          </Col>
          <Col xs={24} lg={8}>
            <Button
              block
              icon={<ShopOutlined />}
              onClick={() => navigate('/products')}
              style={{ height: 48, borderRadius: 16, fontWeight: 700 }}
            >
              Open all retail products
            </Button>
          </Col>
        </Row>
      </div>

      <Row gutter={[18, 18]}>
        {shopProducts.map((product) => (
          <Col xs={24} sm={12} xl={8} key={product.id}>
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

      <ProductQuickViewModal
        product={previewProduct}
        open={Boolean(previewProduct)}
        onClose={() => setPreviewProduct(null)}
        onOrder={handleOrder}
      />
    </div>
  );
};

export default ShopDetail;
