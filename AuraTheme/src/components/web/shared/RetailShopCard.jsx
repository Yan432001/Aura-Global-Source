import React from 'react';
import { Avatar, Button, Card, Flex, Grid, Space, Tag, Typography } from 'antd';
import {
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  LikeOutlined,
  SendOutlined,
  ShareAltOutlined,
  ShopOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatCompact, publicTheme } from '../../../utils/webTheme';

const { useBreakpoint } = Grid;
const { Paragraph, Text, Title } = Typography;

const RetailShopCard = ({
  shop,
  shopProducts = [],
  onPreview,
  onWishlist,
  isWishlisted = false,
  onLike,
  onShare,
  onOpenTelegram,
  gridMode = 6,
}) => {
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const isPhone = !screens.sm;
  const isTablet = screens.sm && !screens.lg;
  const isCompact = !screens.lg;

  const handleVisit = () => {
    navigate(`/shops/${shop.id}`);
  };

  return (
    <Card
      hoverable
      className="app-shop-card retail-shop-card-wrapper"
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
          padding: isPhone ? 10 : isTablet ? 12 : 14,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
      cover={
        <div
          style={{
            paddingTop: isPhone ? 8 : isTablet ? 10 : 12,
            paddingLeft: isPhone ? 8 : isTablet ? 10 : 12,
            paddingRight: isPhone ? 8 : isTablet ? 10 : 12,
            paddingBottom: 0,
          }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={() => onPreview?.(shop)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onPreview?.(shop);
            }}
            style={{
              position: 'relative',
              borderRadius: isPhone ? 14 : isTablet ? 16 : 20,
              overflow: 'hidden',
              aspectRatio: '16 / 11',
              background: publicTheme.cardMuted,
              cursor: 'pointer',
            }}
          >
            <img
              src={shop.heroImage}
              alt={shop.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Subtle Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.45) 100%)',
              }}
            />

            {/* Shop Badge (Top Left - matches image.png pills like 'Apex Pro', 'MoveTech') */}
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
                fontWeight: 800,
                fontSize: isPhone ? 10 : 11,
                padding: isPhone ? '1px 7px' : '2px 9px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(4px)',
                letterSpacing: '-0.01em',
              }}
            >
              {shop.logoText || 'STORE'}
            </Tag>

            {/* Wishlist / Favorite Heart Button (Top Right) */}
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
              onClick={(e) => {
                e.stopPropagation();
                onWishlist?.(shop);
              }}
              style={{
                position: 'absolute',
                top: isPhone ? 6 : 8,
                right: isPhone ? 6 : 8,
                width: isPhone ? 28 : 32,
                height: isPhone ? 28 : 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
              }}
              title={isWishlisted ? 'Remove favorite' : 'Add to favorites'}
            />

            {/* Quick Preview Eye Button (Bottom Right) */}
            <Button
              type="text"
              shape="circle"
              icon={<EyeOutlined style={{ fontSize: isPhone ? 12 : 14, color: publicTheme.text }} />}
              onClick={(e) => {
                e.stopPropagation();
                onPreview?.(shop);
              }}
              style={{
                position: 'absolute',
                right: isPhone ? 6 : 8,
                bottom: isPhone ? 6 : 8,
                width: isPhone ? 28 : 32,
                height: isPhone ? 28 : 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
              }}
              title="Quick preview shop"
            />
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Subtitle & Title */}
        <div style={{ marginBottom: isPhone ? 6 : 8 }}>
          <Text
            style={{
              color: publicTheme.subtext,
              fontSize: isPhone ? 10 : 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {shop.branch ? shop.branch.replace('-', ' ') : 'STORE DIRECTORY'}
          </Text>

          <Title
            level={4}
            style={{
              margin: isPhone ? '2px 0 3px' : '3px 0 4px',
              color: publicTheme.text,
              fontSize: isPhone ? 13 : isTablet ? 14 : gridMode === 6 ? 14 : 16,
              fontWeight: 800,
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {shop.name}
          </Title>

          <Paragraph
            style={{
              margin: 0,
              color: publicTheme.subtext,
              fontSize: isPhone ? 11 : 12,
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: isPhone ? 28 : 32,
            }}
          >
            {shop.summary}
          </Paragraph>
        </div>

        {/* Rating, Products count & In-stock/Verified pill */}
        <Flex
          justify="space-between"
          align="center"
          gap={6}
          style={{ marginBottom: isPhone ? 8 : 10, marginTop: 'auto' }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <Text
              strong
              style={{
                color: publicTheme.primary,
                fontSize: isPhone ? 14 : isTablet ? 16 : 18,
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              ★ {shop.rating}
            </Text>
            <Text style={{ color: publicTheme.subtext, fontSize: 10.5 }}>
              ({formatCompact(shopProducts.length)} items)
            </Text>
          </div>

          <Tag
            style={{
              margin: 0,
              borderRadius: 999,
              border: 'none',
              background: 'rgba(33,122,89,0.12)',
              color: publicTheme.success,
              fontWeight: 700,
              fontSize: isPhone ? 10 : 11,
              padding: isPhone ? '1px 6px' : '2px 8px',
            }}
          >
            In stock
          </Tag>
        </Flex>

        {/* Action Buttons: Exact 2-row layout matching image.png */}
        {isCompact ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
            <Button
              icon={<ShopOutlined style={{ fontSize: 13 }} />}
              type="primary"
              onClick={handleVisit}
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
              Visit shop
            </Button>

            <Button
              icon={<SendOutlined style={{ color: '#2481cc', fontSize: 12 }} />}
              onClick={(e) => {
                e.stopPropagation();
                onOpenTelegram?.(shop);
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
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(shop);
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
              title="Share shop"
            />
          </div>
        ) : (
          /* Desktop Action Rows matching image.png */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            {/* Top button row: Visit shop + Telegram E-Menu */}
            <div style={{ display: 'flex', gap: 6, width: '100%' }}>
              <Button
                icon={<ShopOutlined style={{ fontSize: 13 }} />}
                type="primary"
                onClick={handleVisit}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  background: publicTheme.ribbon,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 12,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '0 8px',
                  whiteSpace: 'nowrap',
                }}
              >
                Visit shop
              </Button>
              <Button
                icon={<SendOutlined style={{ color: '#2481cc', fontSize: 12 }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTelegram?.(shop);
                }}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  border: '1px solid rgba(36, 129, 204, 0.3)',
                  background: 'rgba(36, 129, 204, 0.08)',
                  color: '#2481cc',
                  fontWeight: 700,
                  fontSize: 11.5,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '0 6px',
                  whiteSpace: 'nowrap',
                }}
              >
                Telegram E-Menu
              </Button>
            </div>

            {/* Bottom button row: Wishlist, Like, Share */}
            <div style={{ display: 'flex', gap: 4, width: '100%' }}>
              <Button
                icon={isWishlisted ? <HeartFilled style={{ color: publicTheme.danger, fontSize: 11 }} /> : <HeartOutlined style={{ fontSize: 11 }} />}
                onClick={() => onWishlist?.(shop)}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  fontSize: 11,
                  height: 28,
                  padding: '0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                Wishlist
              </Button>
              <Button
                icon={<LikeOutlined style={{ fontSize: 11 }} />}
                onClick={() => onLike?.(shop)}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  fontSize: 11,
                  height: 28,
                  padding: '0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                Like
              </Button>
              <Button
                icon={<ShareAltOutlined style={{ fontSize: 11 }} />}
                onClick={() => onShare?.(shop)}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  fontSize: 11,
                  height: 28,
                  padding: '0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RetailShopCard;
