import React, { useState, useMemo } from 'react';
import { Button, Card, Flex, Grid, Space, Tag, Typography, Tooltip, message } from 'antd';
import {
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  LikeOutlined,
  SendOutlined,
  ShareAltOutlined,
  ShopOutlined,
  StarFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatCompact, publicTheme } from '../../../utils/webTheme';

const { useBreakpoint } = Grid;
const { Paragraph, Text, Title } = Typography;

// Helper to calculate shop hours & live Open / Closed status
export const getShopSchedule = (shop) => {
  const name = (shop?.name || '').toLowerCase();
  const summary = (shop?.summary || '').toLowerCase();
  const category = (shop?.category || '').toLowerCase();

  let openHour = 8;
  let closeHour = 20;
  let scheduleText = '08:00 AM – 08:00 PM';

  if (name.includes('bakery') || name.includes('coffee') || category.includes('food')) {
    openHour = 6.5; // 06:30 AM
    closeHour = 22; // 10:00 PM
    scheduleText = '06:30 AM – 10:00 PM';
  } else if (name.includes('bistro') || name.includes('dining')) {
    openHour = 10;
    closeHour = 23;
    scheduleText = '10:00 AM – 11:00 PM';
  } else if (name.includes('warehouse') || name.includes('packaging') || name.includes('safety')) {
    openHour = 7.5;
    closeHour = 18;
    scheduleText = '07:30 AM – 06:00 PM';
  } else if (name.includes('mobile') || name.includes('pc') || name.includes('apparel')) {
    openHour = 9;
    closeHour = 21;
    scheduleText = '09:00 AM – 09:00 PM';
  }

  // Calculate live status from current time
  const now = new Date();
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
  const isOpen = currentHourDecimal >= openHour && currentHourDecimal < closeHour;

  return {
    isOpen,
    statusText: isOpen ? 'Open now' : 'Closed',
    scheduleText,
  };
};

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

  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const isPhone = !screens.sm;
  const isTablet = screens.sm && !screens.lg;
  const isCompact = !screens.lg;

  const schedule = useMemo(() => getShopSchedule(shop), [shop]);

  const handleVisit = () => {
    navigate(`/shops/${shop.id || shop.slug || 1}`);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 460);
    onWishlist?.(shop);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setHasLiked(true);
    onLike?.(shop);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    onShare?.(shop);
  };

  // Format clean location label (e.g. BKK1, BANGKOK HUB)
  const locationLabel = useMemo(() => {
    if (!shop.branch) return 'CENTRAL HUB';
    return shop.branch.replace(/-/g, ' ').toUpperCase();
  }, [shop.branch]);

  return (
    <Card
      hoverable={false}
      className="retail-shop-creative-card group"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      style={{
        borderRadius: isPhone ? 18 : isTablet ? 22 : 24,
        border: isCardHovered
          ? '1px solid rgba(47, 111, 237, 0.45)'
          : `1px solid ${publicTheme.border}`,
        background: publicTheme.cardBackground,
        boxShadow: isCardHovered
          ? '0 20px 34px -10px rgba(15, 23, 42, 0.16), 0 0 1px 1px rgba(47, 111, 237, 0.2)'
          : publicTheme.lightShadow,
        transform: isCardHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition:
          'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.3s ease',
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
          {/* Card Media Wrapper */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onPreview?.(shop)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onPreview?.(shop);
            }}
            aria-label={`Preview ${shop.name}`}
            style={{
              position: 'relative',
              borderRadius: isPhone ? 14 : isTablet ? 16 : 18,
              overflow: 'hidden',
              aspectRatio: '16 / 11',
              background: publicTheme.cardMuted,
              cursor: 'pointer',
            }}
          >
            {/* Lazy Loaded Hero Image with Smooth Zoom */}
            <img
              src={
                shop.heroImage ||
                shop.banner ||
                shop.image ||
                'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&fit=crop'
              }
              alt={shop.name}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&fit=crop';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isCardHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {/* Soft Gradient Overlay at the bottom */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(15,23,42,0) 35%, rgba(15,23,42,0.4) 65%, rgba(15,23,42,0.85) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* TOP-LEFT: Store Brand Pill + Open/Closed Live Status Badge */}
            <div
              style={{
                position: 'absolute',
                top: isPhone ? 6 : 8,
                left: isPhone ? 6 : 8,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                zIndex: 2,
              }}
            >
              {/* Store Code Tag */}
              <span
                style={{
                  borderRadius: 999,
                  background: 'rgba(255, 255, 255, 0.92)',
                  color: publicTheme.primary,
                  fontWeight: 800,
                  fontSize: isPhone ? 9.5 : 10.5,
                  padding: isPhone ? '1.5px 7px' : '2px 8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  letterSpacing: '-0.01em',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {shop.logoText || 'STORE'}
              </span>

              {/* Open now / Closed status badge */}
              <Tooltip title={schedule.scheduleText}>
                <span
                  style={{
                    borderRadius: 999,
                    background: schedule.isOpen
                      ? 'rgba(255, 255, 255, 0.92)'
                      : 'rgba(15, 23, 42, 0.85)',
                    color: schedule.isOpen ? '#15803d' : '#f59e0b',
                    fontWeight: 700,
                    fontSize: isPhone ? 9 : 10,
                    padding: isPhone ? '1.5px 7px' : '2px 8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: schedule.isOpen ? '#22c55e' : '#f59e0b',
                      boxShadow: schedule.isOpen
                        ? '0 0 6px rgba(34, 197, 94, 0.6)'
                        : 'none',
                    }}
                  />
                  <span>{schedule.statusText}</span>
                </span>
              </Tooltip>
            </div>

            {/* TOP-RIGHT: Quick View Eye Icon Button */}
            <Tooltip title="Quick View Store & Products">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview?.(shop);
                }}
                aria-label={`Quick view ${shop.name}`}
                style={{
                  position: 'absolute',
                  top: isPhone ? 6 : 8,
                  right: isPhone ? 6 : 8,
                  width: isPhone ? 28 : 32,
                  height: isPhone ? 28 : 32,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.92)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  color: publicTheme.text,
                  transition: 'all 0.2s ease',
                  zIndex: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.color = publicTheme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = publicTheme.text;
                }}
              >
                <EyeOutlined style={{ fontSize: isPhone ? 12 : 13.5 }} />
              </button>
            </Tooltip>

            {/* BOTTOM-LEFT: Location Tag (BKK1, BANGKOK HUB...) Frosted-Glass Badge */}
            <div
              style={{
                position: 'absolute',
                left: isPhone ? 6 : 8,
                bottom: isPhone ? 6 : 8,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: isPhone ? '2px 8px' : '3px 9px',
                  borderRadius: 999,
                  background: 'rgba(15, 23, 42, 0.68)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  color: '#ffffff',
                  fontSize: isPhone ? 9.5 : 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                }}
              >
                <EnvironmentOutlined style={{ fontSize: 10, color: '#60a5fa' }} />
                <span>{locationLabel}</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      {/* CARD BODY CONTENT */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Subtitle & Title */}
        <div style={{ marginBottom: isPhone ? 6 : 8 }}>
          <Text
            style={{
              color: publicTheme.primary,
              fontSize: isPhone ? 10 : 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {shop.established ? `EST. ${shop.established}` : 'DIRECT SUPPLIER'}
          </Text>

          <Title
            level={4}
            style={{
              margin: isPhone ? '2px 0 3px' : '3px 0 4px',
              color: publicTheme.text,
              fontSize: isPhone ? 13 : isTablet ? 14 : gridMode === 6 ? 14 : 15.5,
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

        {/* METRICS ROW: Rating & Items in One Clean Line + In-Stock with Live Pulse Dot */}
        <Flex
          justify="space-between"
          align="center"
          gap={6}
          style={{ marginBottom: isPhone ? 10 : 12, marginTop: 'auto' }}
        >
          {/* Rating & items count in ONE CLEAN LINE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
            <StarFilled style={{ color: '#f59e0b', fontSize: isPhone ? 12 : 13 }} />
            <span
              style={{
                fontWeight: 800,
                color: publicTheme.text,
                fontSize: isPhone ? 12.5 : 13.5,
                lineHeight: 1,
              }}
            >
              {shop.rating || 4.9}
            </span>
            <span
              style={{
                color: publicTheme.subtext,
                fontSize: isPhone ? 11 : 12,
                fontWeight: 500,
              }}
            >
              • {formatCompact(shopProducts.length)} items
            </span>
          </div>

          {/* In Stock with Animated "Live" Pulse Dot */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: isPhone ? '2px 7px' : '2.5px 8px',
              borderRadius: 999,
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.22)',
            }}
          >
            <span
              style={{
                position: 'relative',
                display: 'inline-flex',
                width: 7,
                height: 7,
              }}
            >
              <span
                className="animate-live-ping"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                }}
              />
              <span
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  borderRadius: '50%',
                  width: 7,
                  height: 7,
                  backgroundColor: '#16a34a',
                }}
              />
            </span>
            <span
              style={{
                fontSize: isPhone ? 10 : 11,
                fontWeight: 700,
                color: '#15803d',
                lineHeight: 1,
              }}
            >
              In stock
            </span>
          </div>
        </Flex>

        {/* ACTION BUTTONS & TOOLTIP CLUSTER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          {/* Primary & Secondary Action Row */}
          <div style={{ display: 'flex', gap: 6, width: '100%' }}>
            {/* 1. "Visit shop" Primary Gradient Button */}
            <button
              type="button"
              onClick={handleVisit}
              style={{
                flex: 1.3,
                height: isPhone ? 33 : 35,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2F6FED 0%, #1e40af 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: isPhone ? 11 : 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '0 8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(47, 111, 237, 0.28)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(47, 111, 237, 0.38)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(47, 111, 237, 0.28)';
              }}
            >
              <ShopOutlined style={{ fontSize: 13 }} />
              <span>Visit shop</span>
            </button>

            {/* 2. "Telegram" Secondary Button with Telegram Blue Icon */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTelegram?.(shop);
              }}
              aria-label={`Open Telegram E-Menu for ${shop.name}`}
              style={{
                flex: 1,
                height: isPhone ? 33 : 35,
                borderRadius: 10,
                background: 'rgba(36, 129, 204, 0.08)',
                border: '1px solid rgba(36, 129, 204, 0.35)',
                color: '#2481cc',
                fontWeight: 700,
                fontSize: isPhone ? 11 : 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '0 6px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(36, 129, 204, 0.16)';
                e.currentTarget.style.borderColor = '#2481cc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(36, 129, 204, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(36, 129, 204, 0.35)';
              }}
            >
              <SendOutlined style={{ color: '#2481cc', fontSize: 12.5 }} />
              <span>Telegram</span>
            </button>
          </div>

          {/* 3. Merged Wishlist / Like / Share Row with Tooltips to save space */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 5,
              width: '100%',
              paddingTop: 1,
            }}
          >
            {/* Wishlist Button with Heart Bounce Animation */}
            <Tooltip title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}>
              <button
                type="button"
                onClick={handleHeartClick}
                aria-label="Wishlist"
                className={isPopping ? 'animate-pop-heart' : ''}
                style={{
                  flex: 1,
                  height: 28,
                  borderRadius: 8,
                  border: isWishlisted
                    ? '1px solid rgba(239, 68, 68, 0.35)'
                    : `1px solid ${publicTheme.softBorder}`,
                  background: isWishlisted ? 'rgba(239, 68, 68, 0.08)' : '#f8fafc',
                  color: isWishlisted ? '#ef4444' : publicTheme.subtext,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                {isWishlisted ? (
                  <HeartFilled style={{ color: '#ef4444', fontSize: 12 }} />
                ) : (
                  <HeartOutlined style={{ fontSize: 12 }} />
                )}
                <span>Wishlist</span>
              </button>
            </Tooltip>

            {/* Like Button */}
            <Tooltip title={hasLiked ? 'You liked this shop' : 'Like shop'}>
              <button
                type="button"
                onClick={handleLikeClick}
                aria-label="Like shop"
                style={{
                  flex: 1,
                  height: 28,
                  borderRadius: 8,
                  border: hasLiked
                    ? '1px solid rgba(47, 111, 237, 0.35)'
                    : `1px solid ${publicTheme.softBorder}`,
                  background: hasLiked ? 'rgba(47, 111, 237, 0.08)' : '#f8fafc',
                  color: hasLiked ? publicTheme.primary : publicTheme.subtext,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                <LikeOutlined style={{ fontSize: 12 }} />
                <span>Like</span>
              </button>
            </Tooltip>

            {/* Share Button */}
            <Tooltip title="Share shop">
              <button
                type="button"
                onClick={handleShareClick}
                aria-label="Share shop"
                style={{
                  flex: 1,
                  height: 28,
                  borderRadius: 8,
                  border: `1px solid ${publicTheme.softBorder}`,
                  background: '#f8fafc',
                  color: publicTheme.subtext,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                <ShareAltOutlined style={{ fontSize: 12 }} />
                <span>Share</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RetailShopCard;
