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

            {/* Brand / Category Pill */}
            {product.brand && (
              <Tag
                style={{
                  position: 'absolute',
                  top: isPhone ? 6 : 8,
                  left: isPhone ? 6 : 8,
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
              <Text
                delete
                style={{
                  color: publicTheme.subtext,
                  fontSize: isPhone ? 10 : 11,
                  display: 'block',
                }}
              >
                {formatCurrency(product.originalPrice)}
              </Text>
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

        {/* Compact App-Style Action Bar on Phone & Tablet */}
        {isCompact ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
            <Button
              icon={<ShoppingCartOutlined style={{ fontSize: 13 }} />}
              type="primary"
              onClick={(event) => handleAdd?.(product, event.currentTarget)}
              style={{
                flex: 1,
                height: isPhone ? 32 : 34,
                borderRadius: 10,
                background: publicTheme.ribbon,
                border: 'none',
                fontWeight: 700,
                fontSize: isPhone ? 11 : 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '0 8px',
              }}
            >
              + Order
            </Button>

            <Button
              icon={<SendOutlined style={{ color: '#2481cc', fontSize: 12 }} />}
              onClick={(event) => {
                event.stopPropagation();
                onOpenTelegram?.(product);
              }}
              style={{
                width: isPhone ? 32 : 34,
                height: isPhone ? 32 : 34,
                minWidth: isPhone ? 32 : 34,
                borderRadius: 10,
                padding: 0,
                background: 'rgba(36, 129, 204, 0.08)',
                border: '1px solid rgba(36, 129, 204, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Telegram E-Menu"
            />

            <Button
              icon={<ShareAltOutlined style={{ fontSize: 12, color: publicTheme.subtext }} />}
              onClick={(event) => {
                event.stopPropagation();
                onShare?.(product);
              }}
              style={{
                width: isPhone ? 30 : 34,
                height: isPhone ? 32 : 34,
                minWidth: isPhone ? 30 : 34,
                borderRadius: 10,
                padding: 0,
                border: `1px solid ${publicTheme.softBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Share product"
            />
          </div>
        ) : (
          /* Desktop Action Row */
          <Space wrap size={[6, 6]} style={{ width: '100%' }}>
            <Button
              icon={<ShoppingCartOutlined />}
              type="primary"
              onClick={(event) => handleAdd?.(product, event.currentTarget)}
              style={{
                borderRadius: 12,
                background: publicTheme.ribbon,
                border: 'none',
                fontWeight: 700,
                fontSize: 13,
                height: 36,
              }}
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
                borderRadius: 12,
                border: '1px solid rgba(36, 129, 204, 0.3)',
                background: 'rgba(36, 129, 204, 0.08)',
                color: '#2481cc',
                fontWeight: 700,
                fontSize: 13,
                height: 36,
              }}
            >
              Telegram E-Menu
            </Button>
            <Button
              icon={isWishlisted ? <HeartFilled /> : <HeartOutlined />}
              onClick={() => handleWish?.(product)}
              style={{
                borderRadius: 12,
                color: isWishlisted ? publicTheme.danger : undefined,
                height: 36,
              }}
            >
              Wishlist
            </Button>
            <Button
              icon={<LikeOutlined />}
              onClick={() => onLike?.(product)}
              style={{ borderRadius: 12, height: 36 }}
            >
              Like
            </Button>
            <Button
              icon={<ShareAltOutlined />}
              onClick={() => onShare?.(product)}
              style={{ borderRadius: 12, height: 36 }}
            >
              Share
            </Button>
          </Space>
        )}
      </div>
    </Card>
  );
};

export default RetailProductCard;
