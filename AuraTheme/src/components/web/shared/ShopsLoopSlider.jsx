import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button, Grid, Space, Typography, Tooltip, message } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
  ArrowRightOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RetailShopCard from './RetailShopCard';
import { publicTheme } from '../../../utils/webTheme';

const { useBreakpoint } = Grid;
const { Title, Paragraph, Text } = Typography;

export default function ShopsLoopSlider({
  shops = [],
  retailProducts = [],
  wishlistedShopIds = [],
  toggleShopWishlist,
  handleShareShop,
  handleOpenTelegramModal,
  setPreviewShop,
  intervalMs = 2800,
}) {
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const trackRef = useRef(null);

  // Screen width state with immediate fallback so first paint is accurate
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [containerWidth, setContainerWidth] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const totalShops = shops.length;

  // Tripled array for infinite seamless looping
  const loopItems = useMemo(() => {
    if (totalShops === 0) return [];
    return [...shops, ...shops, ...shops];
  }, [shops, totalShops]);

  // Track position in index units (starts in middle set)
  const currentIndexRef = useRef(totalShops);
  const [currentIndex, setCurrentIndex] = useState(totalShops);
  const isTransitioningRef = useRef(false);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Measure container width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Responsive cards per view (deterministic based on measured width or window width)
  const effectiveWidth = containerWidth > 0 ? containerWidth : (windowWidth > 0 ? windowWidth - 48 : 1200);

  const itemsPerView = useMemo(() => {
    if (effectiveWidth >= 1200) return 4;
    if (effectiveWidth >= 900) return 3;
    if (effectiveWidth >= 600) return 2;
    return 1.15; // Mobile: 1 card + next card peeking 15%
  }, [effectiveWidth]);

  const gap = effectiveWidth < 600 ? 12 : 16;

  // Exact card width in pixels
  const cardWidth = useMemo(() => {
    const available = effectiveWidth - (itemsPerView - 1) * gap;
    return Math.max(available / itemsPerView, 220);
  }, [effectiveWidth, itemsPerView, gap]);

  // Programmatic smooth translation to target index
  const moveToIndex = useCallback(
    (targetIndex, animate = true) => {
      if (!trackRef.current || totalShops <= 1) return;

      if (animate) {
        isTransitioningRef.current = true;
        trackRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      } else {
        trackRef.current.style.transition = 'none';
      }

      const shift = -(targetIndex * (cardWidth + gap));
      trackRef.current.style.transform = `translate3d(${shift}px, 0, 0)`;
      currentIndexRef.current = targetIndex;
      setCurrentIndex(targetIndex);
    },
    [totalShops, cardWidth, gap]
  );

  // Initialize or re-sync position when totalShops or card dimensions change
  useEffect(() => {
    if (totalShops > 0 && trackRef.current) {
      trackRef.current.style.transition = 'none';
      const shift = -(currentIndexRef.current * (cardWidth + gap));
      trackRef.current.style.transform = `translate3d(${shift}px, 0, 0)`;
    }
  }, [totalShops, cardWidth, gap]);

  // Next Slide
  const handleNext = useCallback(() => {
    if (totalShops <= 1) return;
    moveToIndex(currentIndexRef.current + 1, true);
  }, [totalShops, moveToIndex]);

  // Prev Slide
  const handlePrev = useCallback(() => {
    if (totalShops <= 1) return;
    moveToIndex(currentIndexRef.current - 1, true);
  }, [totalShops, moveToIndex]);

  // Seamless infinite loop silent jump
  const handleTransitionEnd = (e) => {
    // Only handle transition of the track itself, ignore bubbling child events
    if (e.target !== trackRef.current) return;
    if (e.propertyName !== 'transform') return;

    isTransitioningRef.current = false;
    if (totalShops <= 1) return;

    const current = currentIndexRef.current;
    if (current >= totalShops * 2) {
      // Reached or passed end of middle set -> jump silently back to middle set
      const resetIndex = current - totalShops;
      trackRef.current.style.transition = 'none';
      const shift = -(resetIndex * (cardWidth + gap));
      trackRef.current.style.transform = `translate3d(${shift}px, 0, 0)`;
      void trackRef.current.offsetHeight; // Force reflow to commit silent position
      currentIndexRef.current = resetIndex;
      setCurrentIndex(resetIndex);
    } else if (current < totalShops) {
      // Jumped before middle set -> jump silently forward to middle set
      const resetIndex = current + totalShops;
      trackRef.current.style.transition = 'none';
      const shift = -(resetIndex * (cardWidth + gap));
      trackRef.current.style.transform = `translate3d(${shift}px, 0, 0)`;
      void trackRef.current.offsetHeight; // Force reflow to commit silent position
      currentIndexRef.current = resetIndex;
      setCurrentIndex(resetIndex);
    }
  };

  // Auto-play interval timer
  useEffect(() => {
    if (isPaused || isHovered || totalShops <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, isHovered, totalShops, intervalMs, handleNext]);

  // Touch and drag support
  const touchStartXRef = useRef(0);
  const touchDeltaXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
      touchDeltaXRef.current = 0;
      isDraggingRef.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || !e.touches || !e.touches[0]) return;
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (touchDeltaXRef.current < -40) {
      handleNext();
    } else if (touchDeltaXRef.current > 40) {
      handlePrev();
    }
    touchStartXRef.current = 0;
    touchDeltaXRef.current = 0;
  };

  // Calculate active shop indicator (0 to totalShops - 1)
  const activeDotIndex = totalShops > 0 ? ((currentIndex % totalShops) + totalShops) % totalShops : 0;

  if (totalShops === 0) return null;

  return (
    <div
      style={{
        width: '100%',
        marginBottom: screens.xs ? 28 : 40,
        position: 'relative',
      }}
    >
      {/* 1. Header with Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: screens.xs ? 'flex-start' : 'flex-end',
          marginBottom: screens.xs ? 12 : 20,
          flexDirection: screens.xs ? 'column' : 'row',
          gap: screens.xs ? 10 : 0,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: publicTheme.primary,
              textTransform: 'uppercase',
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <SyncOutlined spin={!isPaused && !isHovered} style={{ color: publicTheme.primary }} />
            <span>Fulfillment Hubs &amp; Specialty Stores</span>
          </div>
          <Title
            level={screens.xs ? 3 : 2}
            style={{ margin: 0, fontWeight: 800, color: publicTheme.text }}
          >
            Explore Our Shops &amp; Stores
          </Title>
          <Paragraph style={{ color: publicTheme.subtext, fontSize: 13, margin: '4px 0 0' }}>
            Direct supplier shops with instant Telegram Mini App dispatch, local inventory, and fast response times.
          </Paragraph>
        </div>

        {/* Action Controls & Navigation Header Cluster */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            alignSelf: screens.xs ? 'stretch' : 'auto',
            justifyContent: screens.xs ? 'space-between' : 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {/* Loop Running Status Pill & Toggle */}
          <Tooltip title={isPaused ? 'Click to resume auto-slide loop' : 'Click to pause auto-slide'}>
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 12px',
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 700,
                border: `1px solid ${isPaused || isHovered ? '#cbd5e1' : 'rgba(47, 111, 237, 0.25)'}`,
                background: isPaused || isHovered ? '#f8fafc' : 'rgba(47, 111, 237, 0.08)',
                color: isPaused || isHovered ? '#64748b' : publicTheme.primary,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: isPaused || isHovered ? '#94a3b8' : publicTheme.primary,
                  boxShadow: isPaused || isHovered ? 'none' : `0 0 8px ${publicTheme.primary}`,
                }}
              />
              <span>{isPaused ? 'Paused' : isHovered ? 'Hovered' : 'Auto-Looping'}</span>
              {isPaused ? (
                <PlayCircleFilled style={{ fontSize: 13, color: publicTheme.primary }} />
              ) : (
                <PauseCircleFilled style={{ fontSize: 13, color: isHovered ? '#94a3b8' : publicTheme.primary }} />
              )}
            </button>
          </Tooltip>

          {/* Header Prev & Next Arrow Controls */}
          <Space size={6}>
            <Button
              shape="circle"
              size="small"
              icon={<LeftOutlined style={{ fontSize: 12 }} />}
              onClick={handlePrev}
              aria-label="Previous shop"
              style={{
                width: 34,
                height: 34,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: `1px solid ${publicTheme.border}`,
                background: '#ffffff',
                color: publicTheme.text,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              }}
            />
            <Button
              shape="circle"
              size="small"
              icon={<RightOutlined style={{ fontSize: 12 }} />}
              onClick={handleNext}
              aria-label="Next shop"
              style={{
                width: 34,
                height: 34,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: `1px solid ${publicTheme.border}`,
                background: '#ffffff',
                color: publicTheme.text,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              }}
            />
          </Space>

          {/* All Shops Page Link */}
          <Button
            type="link"
            onClick={() => navigate('/shops')}
            style={{ fontWeight: 700, color: publicTheme.primary, padding: '0 4px' }}
          >
            All Shops ({totalShops}) <ArrowRightOutlined />
          </Button>
        </div>
      </div>

      {/* 2. Slider Container with Floating Side Arrows */}
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating Side Left Arrow Button (Desktop / Tablet) */}
        {!screens.xs && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous shop slide"
            style={{
              position: 'absolute',
              left: -16,
              top: '48%',
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#ffffff',
              border: `1px solid ${publicTheme.border}`,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              color: publicTheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(47, 111, 237, 0.25)';
              e.currentTarget.style.borderColor = publicTheme.primary;
              e.currentTarget.style.color = publicTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.borderColor = publicTheme.border;
              e.currentTarget.style.color = publicTheme.text;
            }}
          >
            <LeftOutlined style={{ fontSize: 16 }} />
          </button>
        )}

        {/* Floating Side Right Arrow Button (Desktop / Tablet) */}
        {!screens.xs && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next shop slide"
            style={{
              position: 'absolute',
              right: -16,
              top: '48%',
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#ffffff',
              border: `1px solid ${publicTheme.border}`,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              color: publicTheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(47, 111, 237, 0.25)';
              e.currentTarget.style.borderColor = publicTheme.primary;
              e.currentTarget.style.color = publicTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.borderColor = publicTheme.border;
              e.currentTarget.style.color = publicTheme.text;
            }}
          >
            <RightOutlined style={{ fontSize: 16 }} />
          </button>
        )}

        {/* Single Row Horizontal Overflow Viewport */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            padding: '6px 0 10px',
          }}
        >
          {/* Continuous Sliding Flex Track */}
          <div
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              gap: `${gap}px`,
              width: 'max-content',
              transform: `translate3d(-${currentIndex * (cardWidth + gap)}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            {loopItems.map((shop, idx) => {
              const shopProducts = retailProducts.filter((p) => p.shopId === shop.id);
              const isWishlisted = wishlistedShopIds.includes(shop.id);

              return (
                <div
                  key={`${shop.id}-slide-${idx}`}
                  style={{
                    flex: `0 0 ${cardWidth}px`,
                    width: `${cardWidth}px`,
                    maxWidth: `${cardWidth}px`,
                    boxSizing: 'border-box',
                  }}
                >
                  <RetailShopCard
                    shop={shop}
                    shopProducts={shopProducts}
                    gridMode={screens.xs ? 4 : 6}
                    onPreview={(s) => setPreviewShop?.(s)}
                    onWishlist={toggleShopWishlist}
                    isWishlisted={isWishlisted}
                    onLike={(s) => message.success(`You liked ${s.name}!`)}
                    onShare={handleShareShop}
                    onOpenTelegram={(s) => handleOpenTelegramModal?.(s)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Slider Pagination Indicator Dots */}
      {totalShops > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 7,
            marginTop: 16,
          }}
        >
          {shops.map((shop, idx) => {
            const isActive = activeDotIndex === idx;
            return (
              <button
                key={shop.id || idx}
                type="button"
                onClick={() => {
                  moveToIndex(totalShops + idx, true);
                }}
                aria-label={`Jump to shop ${shop.name || idx + 1}`}
                style={{
                  width: isActive ? 26 : 7,
                  height: 6,
                  borderRadius: 999,
                  background: isActive ? publicTheme.primary : publicTheme.border,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? `0 0 8px rgba(47, 111, 237, 0.4)` : 'none',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
