import React from 'react';
import { Button, Card, Flex, Space, Tag, Typography } from 'antd';
import {
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  LikeOutlined,
  SendOutlined,
  ShareAltOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { formatCurrency, publicTheme } from '../../../utils/webTheme';

const { Paragraph, Text, Title } = Typography;

const RetailProductCard = ({
  product,
  onPreview,
  onOrder,
  onWishlist,
  isWishlisted = false,
  onLike,
  onShare,
  onOpenTelegram,
}) => (
  <Card
    hoverable
    style={{
      borderRadius: 26,
      border: `1px solid ${publicTheme.border}`,
      background: publicTheme.cardBackground,
      boxShadow: publicTheme.lightShadow,
      height: '100%',
      overflow: 'hidden',
    }}
    styles={{ body: { padding: 16 } }}
    cover={
      <div style={{ padding: 14, paddingBottom: 0 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => onPreview?.(product)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              onPreview?.(product);
            }
          }}
          style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            aspectRatio: '1 / 1',
            background: publicTheme.cardMuted,
            cursor: 'pointer',
          }}
        >
          <img
            data-product-image="true"
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Tag
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              margin: 0,
              borderRadius: 999,
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              color: publicTheme.primary,
              fontWeight: 700,
            }}
          >
            {product.brand}
          </Tag>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              onPreview?.(product);
            }}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              color: publicTheme.text,
            }}
          />
        </div>
      </div>
    }
  >
    <Space direction="vertical" size={10} style={{ width: '100%' }}>
      <div>
        <Text style={{ color: publicTheme.subtext, fontSize: 12 }}>{product.shopName}</Text>
        <Title level={4} style={{ margin: '6px 0', color: publicTheme.text, fontSize: 18, lineHeight: 1.3 }}>
          {product.name}
        </Title>
        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, color: publicTheme.subtext, minHeight: 44 }}>
          {product.description}
        </Paragraph>
      </div>

      <Flex justify="space-between" align="end" gap={12}>
        <div>
          <Text strong style={{ display: 'block', color: publicTheme.primary, fontSize: 24, lineHeight: 1 }}>
            {formatCurrency(product.price)}
          </Text>
          <Text style={{ color: publicTheme.subtext, fontSize: 12 }}>
            In stock: {product.stockCount}
          </Text>
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
          {product.inStock ? 'Stock in' : 'Pre-order'}
        </Tag>
      </Flex>

      <Space wrap size={[8, 8]}>
        <Button
          icon={<ShoppingCartOutlined />}
          type="primary"
          onClick={(event) => onOrder?.(product, event.currentTarget)}
          style={{ borderRadius: 14, background: publicTheme.ribbon, border: 'none', fontWeight: 700 }}
        >
          Order product
        </Button>
        <Button
          icon={<SendOutlined style={{ color: '#2481cc' }} />}
          onClick={(event) => {
            event.stopPropagation();
            onOpenTelegram?.(product);
          }}
          style={{
            borderRadius: 14,
            border: '1px solid rgba(36, 129, 204, 0.3)',
            background: 'rgba(36, 129, 204, 0.08)',
            color: '#2481cc',
            fontWeight: 700,
          }}
        >
          Telegram E-Menu
        </Button>
        <Button
          icon={isWishlisted ? <HeartFilled /> : <HeartOutlined />}
          onClick={() => onWishlist?.(product)}
          style={{ borderRadius: 14, color: isWishlisted ? publicTheme.danger : undefined }}
        >
          Wishlist
        </Button>
        <Button icon={<LikeOutlined />} onClick={() => onLike?.(product)} style={{ borderRadius: 14 }}>
          Like
        </Button>
        <Button icon={<ShareAltOutlined />} onClick={() => onShare?.(product)} style={{ borderRadius: 14 }}>
          Share
        </Button>
      </Space>
    </Space>
  </Card>
);

export default RetailProductCard;
