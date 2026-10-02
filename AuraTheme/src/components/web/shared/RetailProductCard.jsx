import React from 'react';
import { Button, Card, Flex, Grid, Space, Tag, Typography } from 'antd';
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

const { useBreakpoint } = Grid;
const { Paragraph, Text, Title } = Typography;

const RetailProductCard = ({
  product,
  onPreview,
  onQuickView,
  onOrder,
  onAddToCart,
  onWishlist,
  onToggleWishlist,
  isWishlisted = false,
  onLike,
  onShare,
  onOpenTelegram,
}) => {
  const screens = useBreakpoint();
  const isPhone = !screens.sm;
  const isTablet = screens.sm && !screens.lg;
  const isCompact = !screens.lg; // phone or tablet

  const handleView = onPreview || onQuickView;
  const handleAdd = onOrder || onAddToCart;
  const handleWish = onWishlist || onToggleWishlist;

  return (
    <Card
      hoverable
      className="app-product-card retail-product-card-wrapper"
      style={{
        borderRadius: isPhone ? 18 : isTablet ? 22 : 26,
        border: `1px solid ${publicTheme.border}`,
        background: publicTheme.cardBackground,
        boxShadow: publicTheme.lightShadow,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        body: {
          padding: isPhone ? 10 : isTablet ? 12 : 16,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
      cover={
        <div
          style={{
            paddingTop: isPhone ? 8 : isTablet ? 10 : 14,
            paddingLeft: isPhone ? 8 : isTablet ? 10 : 14,
            paddingRight: isPhone ? 8 : isTablet ? 10 : 14,
            paddingBottom: 0,
          }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleView?.(product)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                handleView?.(product);
              }
            }}
            style={{
              position: 'relative',
              borderRadius: isPhone ? 14 : isTablet ? 16 : 20,
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

            {/* Brand / Category Pill and Promo Badge */}
            <div
              style={{
                position: 'absolute',
                top: isPhone ? 6 : 8,
                left: isPhone ? 6 : 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                zIndex: 2,
                alignItems: 'flex-start',
              }}
            >
              {product.badge && (
                <span
                  style={{
                    borderRadius: 999,
                    background: product.badge.includes('🔥')
                      ? '#ef4444'
                      : product.badge.includes('⚡')
                      ? '#f59e0b'
                      : product.badge.includes('Price')
                      ? '#10b981'
                      : '#2F6FED',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: isPhone ? 9.5 : 10.5,
                    padding: '2px 8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    display: 'inline-block',
                    width: 'fit-content',
                    lineHeight: 1.3,
                  }}
                >
                  {product.badge}
                </span>
              )}

              {product.brand && (
                <Tag
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    border: 'none',
                    background: 'rgba(255,255,255,0.92)',
                    color: publicTheme.primary,
                    fontWeight: 700,
                    fontSize: isPhone ? 10 : 11,
                    padding: isPhone ? '1px 6px' : '2px 8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {product.brand}
                </Tag>
              )}
            </div>

            {/* Quick Favorite / Wishlist Heart Button */}
            <Button
              type="text"
              shape="circle"
              icon={
                isWishlisted ? (
                  <HeartFilled style={{ color: publicTheme.danger, fontSize: isPhone ? 13 : 15 }} />
                ) : (
                  <HeartOutlined style={{ color: publicTheme.subtext, fontSize: isPhone ? 13 : 15 }} />
                )
              }
              onClick={(event) => {
                event.stopPropagation();
                handleWish?.(product);
              }}
              style={{
                position: 'absolute',
                top: isPhone ? 6 : 8,
                right: isPhone ? 6 : 8,
                width: isPhone ? 30 : 34,
                height: isPhone ? 30 : 34,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
              }}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            />

            {/* Quick View Button */}
            <Button
              type="text"
              shape="circle"
              icon={<EyeOutlined style={{ fontSize: isPhone ? 12 : 14, color: publicTheme.text }} />}
              onClick={(event) => {
                event.stopPropagation();
                handleView?.(product);
              }}
              style={{
                position: 'absolute',
                right: isPhone ? 6 : 8,
                bottom: isPhone ? 6 : 8,
                width: isPhone ? 30 : 34,
                height: isPhone ? 30 : 34,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
              }}
              title="Quick preview"
            />
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Title & Info */}
        <div style={{ marginBottom: isPhone ? 6 : 8 }}>
          <Text
            style={{
              color: publicTheme.subtext,
              fontSize: isPhone ? 10 : 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.shopName || product.brand}
          </Text>

          <Title
            level={4}
            style={{
              margin: isPhone ? '2px 0 4px' : '4px 0 6px',
              color: publicTheme.text,
              fontSize: isPhone ? 13 : isTablet ? 14 : 16,
              lineHeight: 1.28,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: isPhone ? 34 : isTablet ? 36 : 40,
            }}
          >
            {product.name}
          </Title>

          {!isPhone && (
            <Paragraph
              ellipsis={{ rows: isTablet ? 1 : 2 }}
              style={{
                margin: 0,
                color: publicTheme.subtext,
                fontSize: 12,
                minHeight: isTablet ? 20 : 38,
                lineHeight: 1.4,
              }}
            >
              {product.description}
            </Paragraph>
          )}
        </div>

        {/* Price & Stock */}
        <Flex
          justify="space-between"
          align="center"
          gap={6}
          style={{ marginBottom: isPhone ? 8 : 10, marginTop: 'auto' }}
        >
          <div>
            <Text
              strong
              style={{
                display: 'block',
                color: publicTheme.primary,
                fontSize: isPhone ? 16 : isTablet ? 18 : 22,
                lineHeight: 1.1,
              }}
            >
              {formatCurrency(product.price)}
            </Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Text
                  delete
                  style={{
                    color: publicTheme.subtext,
                    fontSize: isPhone ? 10 : 11,
                  }}
                >
                  {formatCurrency(product.originalPrice)}
                </Text>
                <span
                  style={{
                    color: '#ef4444',
                    fontWeight: 800,
                    fontSize: isPhone ? 9.5 : 10.5,
                  }}
                >
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              </div>
            )}
          </div>

          <Tag
            style={{
              margin: 0,
              borderRadius: 999,
              border: 'none',
              background: product.inStock ? 'rgba(33,122,89,0.12)' : 'rgba(198,81,75,0.12)',
              color: product.inStock ? publicTheme.success : publicTheme.danger,
              fontWeight: 700,
              fontSize: isPhone ? 10 : 11,
              padding: isPhone ? '1px 6px' : '2px 8px',
            }}
          >
            {product.inStock ? 'In stock' : 'Pre-order'}
          </Tag>
        </Flex>

        {/* Action Button Section matching image: Row 1 Order product, Row 2 Telegram & Wishlist, Row 3 Like & Share */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isPhone ? 6 : 8, width: '100%', marginTop: 'auto', paddingTop: 6 }}>
          {/* Row 1: Order Product Full Width */}
          <Button
            type="primary"
            block
            icon={<ShoppingCartOutlined style={{ fontSize: isPhone ? 13 : 14 }} />}
            onClick={(event) => handleAdd?.(product, event.currentTarget)}
            style={{
              borderRadius: 10,
              background: '#2F6FED',
              borderColor: '#2F6FED',
              fontWeight: 700,
              fontSize: isPhone ? 12 : 13,
              height: isPhone ? 34 : 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(47, 111, 237, 0.2)',
            }}
          >
            Order product
          </Button>

          {/* Row 2: Telegram E-Menu & Wishlist */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isPhone ? 6 : 8 }}>
            <Button
              icon={<SendOutlined style={{ color: '#2481cc', fontSize: isPhone ? 11 : 12 }} />}
              onClick={(event) => {
                event.stopPropagation();
                onOpenTelegram?.(product);
              }}
              style={{
                borderRadius: 10,
                border: '1px solid rgba(36, 129, 204, 0.35)',
                background: 'rgba(36, 129, 204, 0.06)',
                color: '#2481cc',
                fontWeight: 700,
                fontSize: isPhone ? 11 : 12,
                height: isPhone ? 32 : 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '0 4px',
              }}
            >
              Telegram E-Menu
            </Button>
            <Button
              icon={
                isWishlisted ? (
                  <HeartFilled style={{ color: publicTheme.danger, fontSize: isPhone ? 11 : 12 }} />
                ) : (
                  <HeartOutlined style={{ color: publicTheme.text, fontSize: isPhone ? 11 : 12 }} />
                )
              }
              onClick={(event) => {
                event.stopPropagation();
                handleWish?.(product);
              }}
              style={{
                borderRadius: 10,
                borderColor: publicTheme.softBorder,
                color: isWishlisted ? publicTheme.danger : publicTheme.text,
                fontWeight: 600,
                fontSize: isPhone ? 11 : 12,
                height: isPhone ? 32 : 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '0 4px',
              }}
            >
              Wishlist
            </Button>
          </div>

          {/* Row 3: Like & Share */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isPhone ? 6 : 8 }}>
            <Button
              icon={<LikeOutlined style={{ fontSize: isPhone ? 11 : 12 }} />}
              onClick={(event) => {
                event.stopPropagation();
                onLike?.(product);
              }}
              style={{
                borderRadius: 10,
                borderColor: publicTheme.softBorder,
                color: publicTheme.text,
                fontWeight: 600,
                fontSize: isPhone ? 11 : 12,
                height: isPhone ? 32 : 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '0 4px',
              }}
            >
              Like
            </Button>
            <Button
              icon={<ShareAltOutlined style={{ fontSize: isPhone ? 11 : 12 }} />}
              onClick={(event) => {
                event.stopPropagation();
                onShare?.(product);
              }}
              style={{
                borderRadius: 10,
                borderColor: publicTheme.softBorder,
                color: publicTheme.text,
                fontWeight: 600,
                fontSize: isPhone ? 11 : 12,
                height: isPhone ? 32 : 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '0 4px',
              }}
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RetailProductCard;
