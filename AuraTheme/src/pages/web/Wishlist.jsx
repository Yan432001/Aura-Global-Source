import React from 'react';
import { Button, Card, Col, Image, Row, Space, Typography } from 'antd';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { formatCurrency, publicTheme } from '../../utils/webTheme';

const { Paragraph, Text, Title } = Typography;

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, wishlistItemCount } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div style={{ padding: 0 }}>
        <Card
          style={{
            borderRadius: 24,
            textAlign: 'center',
            padding: 60,
            border: `1px solid ${publicTheme.border}`,
            background: publicTheme.cardBackground,
            boxShadow: publicTheme.lightShadow,
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 24, color: publicTheme.primary }}>
            <HeartOutlined />
          </div>
          <Title level={3} style={{ color: publicTheme.text }}>Your wishlist is empty</Title>
          <Paragraph style={{ color: publicTheme.subtext, marginBottom: 24 }}>
            Save products you want to remember, compare, or buy later.
          </Paragraph>
          <Button type="primary" size="large" onClick={() => navigate('/products')} style={{ borderRadius: 12, height: 44, background: publicTheme.ribbon, border: 'none' }}>
            Explore products
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 0 }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #d7566f 0%, #ef7c8e 100%)',
          padding: '40px 32px',
          borderRadius: 24,
          color: 'white',
          marginBottom: 32,
          boxShadow: publicTheme.shadow,
        }}
      >
        <Title level={1} style={{ fontSize: '40px', margin: '0 0 12px 0', color: 'white', fontWeight: 700 }}>
          Your Wishlist
        </Title>
        <Paragraph style={{ fontSize: '16px', margin: '0', color: 'rgba(255,255,255,0.9)' }}>
          {wishlistItemCount} saved item{wishlistItemCount !== 1 ? 's' : ''} ready for later
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {wishlist.map((item) => (
              <Card
                key={item.id}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: `1px solid ${publicTheme.border}`,
                  background: publicTheme.cardBackground,
                  boxShadow: publicTheme.lightShadow,
                }}
              >
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={6}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      preview={false}
                      style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 12 }}
                    />
                  </Col>
                  <Col xs={24} sm={18}>
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} sm={12}>
                        <div>
                          <Title level={4} style={{ margin: '0 0 8px 0', fontSize: 18, color: publicTheme.text }}>
                            {item.name}
                          </Title>
                          <Text style={{ color: publicTheme.subtext, display: 'block' }}>
                            Shop: {item.shopName}
                          </Text>
                          <Text style={{ color: publicTheme.subtext }}>
                            Brand: {item.brand}
                          </Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Price</Text>
                        <Text style={{ fontSize: 18, fontWeight: 700, color: publicTheme.primary }}>
                          {formatCurrency(item.price)}
                        </Text>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Stock</Text>
                        <Text style={{ color: item.inStock ? publicTheme.success : publicTheme.danger, fontWeight: 700 }}>
                          {item.inStock ? 'Available' : 'Pre-order'}
                        </Text>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => addToCart(item)}
                            style={{ borderRadius: 10, background: publicTheme.ribbon, border: 'none', width: '100%' }}
                          >
                            Add
                          </Button>
                          <Button
                            danger
                            onClick={() => removeFromWishlist(item.id)}
                            style={{ borderRadius: 10, width: '100%' }}
                          >
                            Remove
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </Col>

        <Col xs={24} md={8}>
          <Card
            style={{
              borderRadius: 20,
              position: 'sticky',
              top: 90,
              border: `1px solid ${publicTheme.border}`,
              background: publicTheme.cardBackground,
              boxShadow: publicTheme.lightShadow,
            }}
            title={<div style={{ fontSize: 16, fontWeight: 700, color: publicTheme.text }}>Wishlist Summary</div>}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${publicTheme.softBorder}` }}>
                <Text>Saved items</Text>
                <Text strong>{wishlistItemCount}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${publicTheme.softBorder}` }}>
                <Text>Ready to buy</Text>
                <Text strong>{wishlist.filter((item) => item.inStock).length}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 16 }}>Next step</Text>
                <Text strong style={{ color: publicTheme.primary }}>Add to cart</Text>
              </div>
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                <Button type="primary" size="large" block onClick={() => navigate('/products')} style={{ borderRadius: 12, height: 44, background: publicTheme.ribbon, border: 'none', fontWeight: 600 }}>
                  Continue shopping
                </Button>
                <Button size="large" block onClick={() => navigate('/cart')} style={{ borderRadius: 12, height: 44 }}>
                  Open cart
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Wishlist;
