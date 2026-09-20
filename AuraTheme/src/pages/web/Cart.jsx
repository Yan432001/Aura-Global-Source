import React from 'react';
import { Row, Col, Card, Space, Button, Image, Input, Typography, Tag } from 'antd';
import { useCart } from '../../contexts/CartContext';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartItemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div style={{ padding: 0 }}>
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
          <Title level={3}>Your cart is empty</Title>
          <Paragraph style={{ color: '#64748B', marginBottom: 24 }}>Add some amazing products from our shop to get started!</Paragraph>
          <Button type="primary" size="large" onClick={() => {/* Navigate to shop */}} style={{ borderRadius: 12, height: 44 }}>Start Shopping</Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 0 }}>
      <div style={{
        background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        padding: '48px 32px',
        textAlign: 'center',
        borderRadius: 24,
        color: 'white',
        marginBottom: 48,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <Title level={1} style={{ fontSize: '42px', margin: '0 0 16px 0', color: 'white', fontWeight: 700 }}>🛒 Your Shopping Cart</Title>
        <Paragraph style={{ fontSize: '16px', margin: '0', color: 'rgba(255,255,255,0.9)' }}>{cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in your cart</Paragraph>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {cart.map((item) => (
              <Card key={item.id} style={{ borderRadius: 16, overflow: 'hidden' }}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={6}>
                    <Image src={item.image} alt={item.name} preview={false} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
                  </Col>
                  <Col xs={24} sm={18}>
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} sm={12}>
                        <div>
                          <Title level={4} style={{ margin: '0 0 8px 0', fontSize: 16 }}>{item.name}</Title>
                          <Text type="secondary">Seller: {item.seller}</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={4}>
                        <div>
                          <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Price</Text>
                          <Text style={{ fontSize: 16, fontWeight: 700, color: '#6366F1' }}>${item.price}</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={4}>
                        <div>
                          <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Qty</Text>
                          <Space>
                            <Button type="default" size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ borderRadius: 4 }} icon={<MinusOutlined />} />
                            <Input value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)} style={{ width: 50, textAlign: 'center', borderRadius: 4 }} type="number" min={1} />
                            <Button type="default" size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ borderRadius: 4 }} icon={<PlusOutlined />} />
                          </Space>
                        </div>
                      </Col>
                      <Col xs={24} sm={4}>
                        <div>
                          <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Total</Text>
                          <Text style={{ fontSize: 16, fontWeight: 700, color: '#6366F1' }}>${(item.price * item.quantity).toFixed(2)}</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Button danger onClick={() => removeFromCart(item.id)} style={{ borderRadius: 8, width: '100%' }}>Delete</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 16, position: 'sticky', top: 80, background: 'linear-gradient(135deg, #F1F5F9 0%, #FFFFFF 100%)' }} title={<div style={{ fontSize: 16, fontWeight: 700 }}>📋 Order Summary</div>}>
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #E2E8F0' }}>
                <Text>Subtotal ({cartItemCount} items)</Text>
                <Text strong>${cartTotal.toFixed(2)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #E2E8F0' }}>
                <Text>Shipping</Text>
                <Text strong>$10.00</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #E2E8F0' }}>
                <Text>Tax (10%)</Text>
                <Text strong>${(cartTotal * 0.1).toFixed(2)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 16 }}>Total</Text>
                <Text strong style={{ fontSize: 18, color: '#6366F1' }}>${(cartTotal + 10 + (cartTotal * 0.1)).toFixed(2)}</Text>
              </div>
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                <Button type="primary" size="large" block style={{ borderRadius: 12, height: 44, fontWeight: 600 }}>Proceed to Checkout</Button>
                <Button size="large" block style={{ borderRadius: 12, height: 44 }}>Continue Shopping</Button>
              </Space>
              <Card size="small" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>💳 Free shipping on orders over $100. 🎁 Get exclusive discounts on bulk orders!</Text>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;