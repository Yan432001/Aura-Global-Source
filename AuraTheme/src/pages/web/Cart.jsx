import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Space,
  Button,
  Image,
  Input,
  Typography,
  Tag,
  Modal,
  Form,
  Radio,
  Divider,
  QRCode,
  message,
  Result,
  Badge,
} from 'antd';
import { useCart } from '../../contexts/CartContext';
import {
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  CreditCardOutlined,
  DollarOutlined,
  QrcodeOutlined,
  CarOutlined,
  ShoppingOutlined,
  SendOutlined,
  PrinterOutlined,
  DisconnectOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { formatCurrency, publicTheme } from '../../utils/webTheme';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import OfflineWarningBanner from '../../components/common/OfflineWarningBanner';
import { exportSingleOrderPdf } from '../../utils/orderPdfExporter';
import OftenOrderedTogetherWidget from '../../components/web/cart/OftenOrderedTogetherWidget';

const { Title, Paragraph, Text } = Typography;

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartItemCount } = useCart();
  const { isOnline, isChecking, retryConnection } = useNetworkStatus();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('Customer Guest');
  const [customerPhone, setCustomerPhone] = useState('+855 12 345 678');
  const [customerEmail, setCustomerEmail] = useState('customer@example.com');
  const [shippingAddress, setShippingAddress] = useState('Street 240, Daun Penh, Phnom Penh');
  const [deliveryMethod, setDeliveryMethod] = useState('standard'); // standard | express | pickup
  const [paymentMethod, setPaymentMethod] = useState('khqr'); // khqr | cod | card
  const [orderNotes, setOrderNotes] = useState('');

  // Shipping cost calculation
  const shippingFee = deliveryMethod === 'pickup' ? 0 : deliveryMethod === 'express' ? 15 : cartTotal >= 100 ? 0 : 10;
  const taxFee = Number((cartTotal * 0.1).toFixed(2));
  const grandTotal = Number((cartTotal + shippingFee + taxFee).toFixed(2));

  const handleOpenCheckout = () => {
    if (!isOnline) {
      message.error('You are currently offline. Please restore your internet connection to proceed with checkout.');
      return;
    }
    if (cart.length === 0) {
      message.warning('Your cart is empty. Add products to continue!');
      return;
    }
    setCheckoutModalOpen(true);
  };

  const handlePlaceOrder = () => {
    if (!isOnline) {
      message.error('Cannot submit order: You are currently offline. Please restore internet connection.');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      message.error('Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderRef = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        orderId: orderRef,
        createdAt: new Date().toLocaleString(),
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          address: shippingAddress,
          notes: orderNotes,
        },
        deliveryMethod,
        paymentMethod,
        items: [...cart],
        subtotal: cartTotal,
        shipping: shippingFee,
        tax: taxFee,
        total: grandTotal,
      };

      // Save order in localStorage history
      try {
        const historyKey = 'aura_web_order_history';
        const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
        localStorage.setItem(historyKey, JSON.stringify([orderData, ...existing]));
      } catch (_) {}

      // Clear the active cart
      clearCart();

      setIsSubmitting(false);
      setCheckoutModalOpen(false);
      setCompletedOrder(orderData);
      message.success(`Order ${orderRef} placed successfully!`);
    }, 900);
  };

  // SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div style={{ padding: '24px 0', maxWidth: 760, margin: '0 auto' }}>
        <Card
          style={{
            borderRadius: 24,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.07)',
            overflow: 'hidden',
          }}
        >
          <Result
            status="success"
            title={
              <div style={{ fontWeight: 800, fontSize: 24, color: '#0f172a' }}>
                🎉 Order Successfully Confirmed!
              </div>
            }
            subTitle={
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                Thank you for your order! Your confirmation reference is{' '}
                <strong style={{ color: '#2563eb' }}>{completedOrder.orderId}</strong>.
              </div>
            }
            extra={[
              <Button
                type="primary"
                key="shop"
                size="large"
                onClick={() => {
                  setCompletedOrder(null);
                  navigate('/products');
                }}
                style={{
                  borderRadius: 14,
                  height: 46,
                  fontWeight: 700,
                  background: '#2563eb',
                  borderColor: '#2563eb',
                  padding: '0 24px',
                }}
              >
                Continue Shopping
              </Button>,
              <Button
                key="pdf"
                size="large"
                icon={<FilePdfOutlined />}
                onClick={() => {
                  exportSingleOrderPdf(completedOrder);
                  message.success(`Downloaded PDF Summary for ${completedOrder.orderId}!`);
                }}
                style={{
                  borderRadius: 14,
                  height: 46,
                  fontWeight: 700,
                  borderColor: '#ef4444',
                  color: '#b91c1c',
                  background: '#fff5f5',
                  padding: '0 20px',
                }}
              >
                Download PDF Summary
              </Button>,
              <Button
                key="telegram"
                size="large"
                icon={<SendOutlined style={{ color: '#2481cc' }} />}
                onClick={() => navigate('/shop/aura-bakery')}
                style={{
                  borderRadius: 14,
                  height: 46,
                  fontWeight: 700,
                  borderColor: '#bae6fd',
                  color: '#0369a1',
                  background: '#f0f9ff',
                  padding: '0 20px',
                }}
              >
                Open Telegram
              </Button>,
            ]}
          >
            {/* Order Details Receipt Box */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: 18,
                padding: '20px 24px',
                border: '1px solid #e2e8f0',
                marginTop: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>Order Breakdown</span>
                <Tag color="green" style={{ margin: 0, fontWeight: 700, borderRadius: 999 }}>
                  Payment: {completedOrder.paymentMethod.toUpperCase()}
                </Tag>
              </div>

              <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 16 }}>
                {completedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px dashed #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={item.image}
                        alt=""
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#334155' }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                  <span>Subtotal</span>
                  <span>${completedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                  <span>Shipping ({completedOrder.deliveryMethod})</span>
                  <span>{completedOrder.shipping === 0 ? 'FREE' : `$${completedOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                  <span>Estimated Tax (10%)</span>
                  <span>${completedOrder.tax.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#0f172a',
                    paddingTop: 8,
                    borderTop: '1px solid #cbd5e1',
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: '#2563eb' }}>${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Result>
        </Card>
      </div>
    );
  }

  // EMPTY CART SCREEN
  if (cart.length === 0) {
    return (
      <div style={{ padding: '40px 0', maxWidth: 640, margin: '0 auto' }}>
        <Card
          style={{
            borderRadius: 24,
            textAlign: 'center',
            padding: '48px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <Title level={3} style={{ marginBottom: 8, fontWeight: 800 }}>
            Your cart is empty
          </Title>
          <Paragraph style={{ color: '#64748b', fontSize: 14, maxWidth: 380, margin: '0 auto 28px' }}>
            Explore our curated catalog of specialty coffees, bakery artisan loaves, tech goods, and lifestyle products!
          </Paragraph>
          <Space size={12}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/products')}
              style={{
                borderRadius: 14,
                height: 48,
                padding: '0 28px',
                fontWeight: 700,
                background: '#2563eb',
                borderColor: '#2563eb',
              }}
            >
              Start Shopping
            </Button>
            <Button
              size="large"
              icon={<SendOutlined style={{ color: '#2481cc' }} />}
              onClick={() => navigate('/shop/aura-bakery')}
              style={{
                borderRadius: 14,
                height: 48,
                padding: '0 22px',
                fontWeight: 700,
                borderColor: '#bae6fd',
                color: '#0369a1',
                background: '#f0f9ff',
              }}
            >
              Browse Bakery Menu
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  // ACTIVE CART SCREEN
  return (
    <div style={{ padding: '16px 0 40px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '36px 32px',
          borderRadius: 24,
          color: 'white',
          marginBottom: 32,
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38bdf8', fontWeight: 800, marginBottom: 6 }}>
            Aura Marketplace Cart
          </div>
          <Title level={2} style={{ margin: '0 0 8px 0', color: 'white', fontWeight: 900 }}>
            🛒 Review Your Items &amp; Checkout
          </Title>
          <Paragraph style={{ fontSize: 14, margin: 0, color: '#94a3b8' }}>
            You have <strong style={{ color: '#f8fafc' }}>{cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</strong> ready for order dispatch
          </Paragraph>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cart Item List */}
        <Col xs={24} lg={15}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#1e293b' }}>
              Items in Cart ({cartItemCount})
            </span>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: 'Clear Cart',
                  content: 'Are you sure you want to remove all items from your cart?',
                  okText: 'Clear All',
                  okType: 'danger',
                  onOk: clearCart,
                });
              }}
              style={{ fontWeight: 600, fontSize: 12 }}
            >
              Clear Cart
            </Button>
          </div>

          <Space direction="vertical" style={{ width: '100%' }} size={10}>
            {cart.map((item) => (
              <Card
                key={item.id}
                style={{
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                }}
                styles={{ body: { padding: '10px 14px' } }}
              >
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={5} sm={3}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        maxWidth: 64,
                        aspectRatio: '1 / 1',
                        objectFit: 'cover',
                        borderRadius: 10,
                        border: '1px solid #f1f5f9',
                        display: 'block',
                      }}
                    />
                  </Col>

                  <Col xs={19} sm={11}>
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', fontSize: 13.5, fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                        {item.name}
                      </h4>
                      {(item.selectedSize || item.selectedVariant) && (
                        <div style={{ fontSize: 11.5, color: '#2563eb', fontWeight: 700, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ background: '#eff6ff', padding: '1px 6px', borderRadius: 6, border: '1px solid #bfdbfe' }}>
                            Size: {item.selectedSize || item.selectedVariant?.name}
                            {item.priceAdjustment > 0 && ` (+$${Number(item.priceAdjustment).toFixed(2)})`}
                          </span>
                        </div>
                      )}
                      {item.seller && (
                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                          Store: <strong style={{ color: '#334155' }}>{item.seller}</strong>
                        </div>
                      )}
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#2563eb' }}>
                        ${Number(item.price).toFixed(2)}
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} sm={5}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Button
                        type="default"
                        size="small"
                        onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                        style={{ borderRadius: 6, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        icon={<MinusOutlined style={{ fontSize: 9 }} />}
                      />
                      <span style={{ fontWeight: 800, fontSize: 13, minWidth: 22, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <Button
                        type="default"
                        size="small"
                        onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                        style={{ borderRadius: 6, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        icon={<PlusOutlined style={{ fontSize: 9 }} />}
                      />
                    </div>
                  </Col>

                  <Col xs={12} sm={5} style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: 13.5, color: '#0f172a', marginBottom: 2 }}>
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined style={{ fontSize: 11 }} />}
                      onClick={() => removeFromCart(item.cartItemId || item.id)}
                      style={{ fontSize: 11, padding: 0 }}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>

          {/* Often Ordered Together Widget */}
          <OftenOrderedTogetherWidget />
        </Col>

        {/* Order Summary Sidebar */}
        <Col xs={24} lg={9}>
          <Card
            style={{
              borderRadius: 22,
              position: 'sticky',
              top: 88,
              border: '1px solid #e2e8f0',
              boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
            }}
            title={
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                📋 Order Summary
              </div>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size={14}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                <span>Subtotal ({cartItemCount} item{cartItemCount !== 1 ? 's' : ''})</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>${cartTotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                <span>Delivery (Standard)</span>
                <span style={{ fontWeight: 700, color: shippingFee === 0 ? '#10b981' : '#1e293b' }}>
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                <span>Estimated Tax (10%)</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>${taxFee.toFixed(2)}</span>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Grand Total</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#2563eb' }}>
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <Space direction="vertical" style={{ width: '100%', marginTop: 8 }} size={10}>
                {!isOnline && (
                  <OfflineWarningBanner variant="inline" style={{ borderRadius: 12, marginBottom: 4 }} />
                )}
                <Button
                  type="primary"
                  size="large"
                  block
                  disabled={!isOnline}
                  onClick={handleOpenCheckout}
                  style={{
                    borderRadius: 14,
                    height: 50,
                    fontWeight: 800,
                    fontSize: 15,
                    background: isOnline ? '#2563eb' : '#94a3b8',
                    borderColor: isOnline ? '#2563eb' : '#94a3b8',
                    boxShadow: isOnline ? '0 10px 25px rgba(37, 99, 235, 0.3)' : 'none',
                  }}
                >
                  {isOnline
                    ? `Proceed to Checkout ($${grandTotal.toFixed(2)})`
                    : 'Offline — Order Submissions Disabled'}
                </Button>

                <Button
                  size="large"
                  block
                  onClick={() => navigate('/products')}
                  style={{
                    borderRadius: 14,
                    height: 44,
                    fontWeight: 700,
                    borderColor: '#cbd5e1',
                    color: '#475569',
                  }}
                >
                  Continue Shopping
                </Button>
              </Space>

              <div
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: 12,
                  padding: '10px 12px',
                  fontSize: 12,
                  color: '#0369a1',
                  marginTop: 6,
                }}
              >
                🚚 <strong>Free Shipping:</strong> Automatically applied on orders over $100!
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* ========================================================= */}
      {/* CHECKOUT MODAL                                            */}
      {/* ========================================================= */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', paddingBottom: 6 }}>
            🛍️ Complete Your Order Checkout
          </div>
        }
        open={checkoutModalOpen}
        onCancel={() => setCheckoutModalOpen(false)}
        footer={null}
        width={680}
        centered
        styles={{
          content: {
            borderRadius: 24,
            overflow: 'hidden',
            padding: 24,
          },
        }}
      >
        <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: 4 }}>
          {/* Section 1: Customer Details */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>1</span>
              Customer &amp; Contact Info
            </div>

            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Full Name *
                </label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  style={{ borderRadius: 10, height: 38 }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Phone Number *
                </label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +855 12 345 678"
                  style={{ borderRadius: 10, height: 38 }}
                />
              </Col>
              <Col xs={24}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Delivery Address / Table Location *
                </label>
                <Input
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street address, building, or table number"
                  style={{ borderRadius: 10, height: 38 }}
                />
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Section 2: Delivery Method */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>2</span>
              Delivery &amp; Fulfillment
            </div>

            <Radio.Group
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              style={{ width: '100%' }}
            >
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={8}>
                  <Card
                    hoverable
                    onClick={() => setDeliveryMethod('standard')}
                    style={{
                      borderRadius: 14,
                      borderColor: deliveryMethod === 'standard' ? '#2563eb' : '#e2e8f0',
                      background: deliveryMethod === 'standard' ? '#eff6ff' : '#ffffff',
                    }}
                    styles={{ body: { padding: 12, textAlign: 'center' } }}
                  >
                    <Radio value="standard" style={{ display: 'none' }} />
                    <div style={{ fontSize: 18, marginBottom: 4 }}>🛵</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Standard Delivery</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{cartTotal >= 100 ? 'FREE' : '$10.00'} • 24-48h</div>
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card
                    hoverable
                    onClick={() => setDeliveryMethod('express')}
                    style={{
                      borderRadius: 14,
                      borderColor: deliveryMethod === 'express' ? '#2563eb' : '#e2e8f0',
                      background: deliveryMethod === 'express' ? '#eff6ff' : '#ffffff',
                    }}
                    styles={{ body: { padding: 12, textAlign: 'center' } }}
                  >
                    <Radio value="express" style={{ display: 'none' }} />
                    <div style={{ fontSize: 18, marginBottom: 4 }}>⚡</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Express 2h</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>+$15.00 • Same day</div>
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card
                    hoverable
                    onClick={() => setDeliveryMethod('pickup')}
                    style={{
                      borderRadius: 14,
                      borderColor: deliveryMethod === 'pickup' ? '#2563eb' : '#e2e8f0',
                      background: deliveryMethod === 'pickup' ? '#eff6ff' : '#ffffff',
                    }}
                    styles={{ body: { padding: 12, textAlign: 'center' } }}
                  >
                    <Radio value="pickup" style={{ display: 'none' }} />
                    <div style={{ fontSize: 18, marginBottom: 4 }}>🏪</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Store Pickup</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>FREE • Ready in 15m</div>
                  </Card>
                </Col>
              </Row>
            </Radio.Group>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Section 3: Payment Method */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>3</span>
              Payment Method
            </div>

            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '100%', marginBottom: 12 }}
            >
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={8}>
                  <Card
                    hoverable
                    onClick={() => setPaymentMethod('khqr')}
                    style={{
                      borderRadius: 14,
                      borderColor: paymentMethod === 'khqr' ? '#2563eb' : '#e2e8f0',
                      background: paymentMethod === 'khqr' ? '#eff6ff' : '#ffffff',
                    }}
                    styles={{ body: { padding: 12, textAlign: 'center' } }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>📱</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>ABA KHQR Pay</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Instant Mobile Scan</div>
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card
                    hoverable
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      borderRadius: 14,
                      borderColor: paymentMethod === 'cod' ? '#2563eb' : '#e2e8f0',
                      background: paymentMethod === 'cod' ? '#eff6ff' : '#ffffff',
                    }}
                    styles={{ body: { padding: 12, textAlign: 'center' } }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>💵</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Cash on Delivery</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Pay upon arrival</div>
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card
                    hoverable
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      borderRadius: 14,
                      borderColor: paymentMethod === 'card' ? '#2563eb' : '#e2e8f0',
                      background: paymentMethod === 'card' ? '#eff6ff' : '#ffffff',
                    }}
                    styles={{ body: { padding: 12, textAlign: 'center' } }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>💳</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Credit / Debit Card</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Visa, MasterCard</div>
                  </Card>
                </Col>
              </Row>
            </Radio.Group>

            {paymentMethod === 'khqr' && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 16,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{ background: 'white', padding: 8, borderRadius: 12, border: '1px solid #cbd5e1' }}>
                  <QRCode
                    value={`https://khqr.bakong.nbc.org.kh/pay?amount=${grandTotal}&currency=USD&ref=AURA`}
                    size={90}
                    bordered={false}
                  />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a', marginBottom: 2 }}>
                    Scan with any Bakong or Banking App
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                    Compatible with ABA Bank, Wing, ACLEDA, Sathapana, and all Cambodian mobile banking apps.
                  </div>
                  <Tag color="red" style={{ marginTop: 6, fontWeight: 700, borderRadius: 6 }}>
                    Amount: ${grandTotal.toFixed(2)} USD
                  </Tag>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Notes */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
              Order Notes (Optional)
            </label>
            <Input.TextArea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Please ring doorbell, leave at front desk, etc."
              rows={2}
              style={{ borderRadius: 10 }}
            />
          </div>

          {/* Offline Guard Banner inside modal */}
          {!isOnline && (
            <div style={{ marginBottom: 16 }}>
              <OfflineWarningBanner variant="inline" style={{ borderRadius: 12 }} />
            </div>
          )}

          {/* Total & Submit Button */}
          <div
            style={{
              background: '#0f172a',
              borderRadius: 18,
              padding: '16px 20px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.2)',
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total to Pay
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#38bdf8' }}>
                ${grandTotal.toFixed(2)}
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              loading={isSubmitting}
              disabled={!isOnline || isSubmitting}
              onClick={handlePlaceOrder}
              style={{
                borderRadius: 12,
                height: 44,
                fontWeight: 800,
                fontSize: 14,
                background: isOnline ? '#2563eb' : '#64748b',
                borderColor: isOnline ? '#2563eb' : '#64748b',
                padding: '0 24px',
              }}
            >
              {isOnline ? 'Place Order Now' : 'Offline — Order Submissions Disabled'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
