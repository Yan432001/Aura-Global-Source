import React from 'react';
import { Button, Card, Space, Tag, Typography } from 'antd';
import {
  CheckCircleFilled,
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { branches, sellers } from '../../../data/shopData';
import { formatCurrency, publicTheme } from '../../../utils/webTheme';

const { Paragraph, Text, Title } = Typography;

const readProductNumber = (productId) => Number(String(productId).replace(/[^0-9]/g, '')) || 1;

const getOrderMeta = (product) => {
  const seed = readProductNumber(product.id);
  return {
    minOrder: product.price > 1200 ? 1 : product.price > 500 ? 2 : 4 + (seed % 4),
    leadTime: product.inStock ? 2 + (seed % 4) : 7 + (seed % 5),
    responseRate: 91 + (seed % 7),
  };
};

const ProductCard = ({
  product,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
}) => {
  const seller = sellers.find((item) => item.id === product.seller);
  const branch = branches.find((item) => item.id === product.branch);
  const orderMeta = getOrderMeta(product);
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      hoverable
      style={{
        borderRadius: 28,
        overflow: 'hidden',
        border: `1px solid ${publicTheme.border}`,
        background: publicTheme.cardBackground,
        boxShadow: publicTheme.lightShadow,
        height: '100%',
      }}
      styles={{ body: { padding: 18 } }}
      cover={
        <div style={{ padding: 16 }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              background: publicTheme.cardMuted,
              aspectRatio: '1 / 1',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {discountPercent > 0 && (
                <Tag
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    border: 'none',
                    background: publicTheme.ribbon,
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  -{discountPercent}%
                </Tag>
              )}
              <Tag
                style={{
                  margin: 0,
                  borderRadius: 999,
                  border: 'none',
                  background: 'rgba(255,255,255,0.88)',
                  color: publicTheme.text,
                  fontWeight: 700,
                }}
              >
                MOQ {orderMeta.minOrder}
              </Tag>
            </div>

            <Button
              type="text"
              shape="circle"
              icon={isFavorite ? <HeartFilled style={{ color: publicTheme.danger }} /> : <HeartOutlined />}
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite?.(product.id);
              }}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 38,
                height: 38,
                background: 'rgba(255,255,255,0.9)',
                color: isFavorite ? publicTheme.danger : publicTheme.subtext,
              }}
            />

            {!product.inStock && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(255,255,255,0.85)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Tag
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    border: 'none',
                    background: publicTheme.danger,
                    color: 'white',
                    fontWeight: 700,
                    padding: '8px 14px',
                  }}
                >
                  Backorder only
                </Tag>
              </div>
            )}
          </div>
        </div>
      }
    >
      <Space direction="vertical" size={12} style={{ width: '100%', height: '100%' }}>
        <div>
          <Space align="center" size={8} wrap>
            <Tag
              style={{
                margin: 0,
                borderRadius: 999,
                border: 'none',
                background: 'rgba(20,92,114,0.12)',
                color: publicTheme.primary,
                fontWeight: 700,
              }}
            >
              Verified supplier
            </Tag>
            <Text style={{ color: publicTheme.subtext, fontSize: 12 }}>
              {branch?.name}
            </Text>
          </Space>

          <Title level={4} style={{ margin: '10px 0 8px', color: publicTheme.text, fontSize: 18, lineHeight: 1.3 }}>
            {product.name}
          </Title>

          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{ color: publicTheme.subtext, marginBottom: 0, minHeight: 44 }}
          >
            {product.description}
          </Paragraph>
        </div>

        <div
          style={{
            borderRadius: 18,
            background: publicTheme.cardMuted,
            border: `1px solid ${publicTheme.softBorder}`,
            padding: 14,
          }}
        >
          <Space direction="vertical" size={10} style={{ width: '100%' }}>
            <Space wrap size={[8, 8]}>
              {(product.features || []).slice(0, 3).map((feature) => (
                <Tag
                  key={feature}
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    background: 'white',
                    border: `1px solid ${publicTheme.softBorder}`,
                    color: publicTheme.text,
                  }}
                >
                  {feature}
                </Tag>
              ))}
            </Space>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              <div>
                <Text style={{ display: 'block', fontSize: 11, color: publicTheme.subtext }}>Lead time</Text>
                <Text strong style={{ color: publicTheme.text }}>{orderMeta.leadTime} days</Text>
              </div>
              <div>
                <Text style={{ display: 'block', fontSize: 11, color: publicTheme.subtext }}>Response</Text>
                <Text strong style={{ color: publicTheme.text }}>{orderMeta.responseRate}%</Text>
              </div>
              <div>
                <Text style={{ display: 'block', fontSize: 11, color: publicTheme.subtext }}>Rating</Text>
                <Text strong style={{ color: publicTheme.text }}>{product.rating}/5</Text>
              </div>
            </div>
          </Space>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <Space direction="vertical" size={6} style={{ width: '100%' }}>
            <Text style={{ color: publicTheme.subtext, fontSize: 12 }}>
              Supplier: {seller?.name}
            </Text>
            <Space align="end" style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text strong style={{ color: publicTheme.primary, fontSize: 24, lineHeight: 1 }}>
                  {formatCurrency(product.price)}
                </Text>
                {product.originalPrice && product.originalPrice > product.price && (
                  <Text delete style={{ color: publicTheme.subtext, display: 'block', marginTop: 4 }}>
                    {formatCurrency(product.originalPrice)}
                  </Text>
                )}
              </div>
              <Tag
                style={{
                  margin: 0,
                  borderRadius: 999,
                  border: 'none',
                  background: product.inStock ? 'rgba(33,122,89,0.14)' : 'rgba(198,81,75,0.14)',
                  color: product.inStock ? publicTheme.success : publicTheme.danger,
                  fontWeight: 700,
                }}
              >
                {product.inStock ? 'Ready to ship' : 'Need restock'}
              </Tag>
            </Space>
          </Space>
        </div>

        <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
          <Space size={6}>
            <CheckCircleFilled style={{ color: publicTheme.success }} />
            <Text style={{ color: publicTheme.subtext, fontSize: 12 }}>
              Supplier assurance active
            </Text>
          </Space>

          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart?.(product);
            }}
            style={{
              background: publicTheme.ribbon,
              border: 'none',
              borderRadius: 16,
              height: 42,
              fontWeight: 700,
            }}
          >
            Start RFQ
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default ProductCard;
