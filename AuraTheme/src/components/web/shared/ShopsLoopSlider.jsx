import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Grid, Space, Typography, Tooltip } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  ArrowRightOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RetailShopCard from './RetailShopCard';
import { publicTheme } from '../../../utils/webTheme';

const { useBreakpoint } = Grid;
const { Title, Paragraph } = Typography;

export default function ShopsLoopSlider({
  shops = [],
  retailProducts = [],
  wishlistedShopIds = [],
  toggleShopWishlist,
  handleShareShop,
  handleOpenTelegramModal,
  setPreviewShop,
  isLoading = false,
}) {
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeDotIndex, setActiveDotIndex] = useState(0);

  // Keep track of scroll position for arrows and indicators
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0 && shops.length > 0) {
      const fraction = scrollLeft / maxScroll;
      const index = Math.min(
        shops.length - 1,
        Math.max(0, Math.round(fraction * (shops.length - 1)))
      );
      setActiveDotIndex(index);
    }
  }, [shops.length]);

  useEffect(() => {
    handleScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // Scroll prev
  const handlePrev = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }, []);

  // Scroll next
  const handleNext = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  // Scroll directly to a specific shop card
  const scrollToShop = useCallback((idx) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const items = container.querySelectorAll('.shop-showcase-item');
    if (items && items[idx]) {
      items[idx].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, []);

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const totalShops = shops.length;

  return (
    <section
      role="region"
      aria-label="Explore Our Shops and Stores"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        width: '100%',
        marginBottom: screens.xs ? 28 : 44,
        position: 'relative',
        outline: 'none',
      }}
    >
      {/* 1. Header with Title, Description, Prev/Next Arrows & All Shops Link */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: screens.xs ? 'flex-start' : 'flex-end',
          marginBottom: screens.xs ? 14 : 20,
          flexDirection: screens.xs ? 'column' : 'row',
          gap: screens.xs ? 12 : 0,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: publicTheme.primary,
              textTransform: 'uppercase',
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ShopOutlined style={{ color: publicTheme.primary, fontSize: 13 }} />
            <span>Fulfillment Hubs &amp; Specialty Stores</span>
          </div>
          <Title
            level={screens.xs ? 3 : 2}
            style={{ margin: 0, fontWeight: 800, color: publicTheme.text }}
          >
            Explore Our Shops &amp; Stores
          </Title>
          <Paragraph style={{ color: publicTheme.subtext, fontSize: 13, margin: '4px 0 0' }}>
            Direct supplier shops with instant Telegram Mini App dispatch, local inventory, and fast
            turnaround.
          </Paragraph>
        </div>

        {/* Action Controls & Navigation Header Cluster */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            alignSelf: screens.xs ? 'stretch' : 'auto',
            justifyContent: screens.xs ? 'space-between' : 'flex-end',
          }}
        >
          {/* Header Prev & Next Arrow Controls */}
          <Space size={6}>
            <Tooltip title="Scroll previous">
              <Button
                shape="circle"
                size="small"
                icon={<LeftOutlined style={{ fontSize: 12 }} />}
                onClick={handlePrev}
                disabled={!canScrollLeft}
                aria-label="Previous shop"
                style={{
                  width: 36,
                  height: 36,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: `1px solid ${publicTheme.border}`,
                  background: '#ffffff',
                  color: canScrollLeft ? publicTheme.text : '#cbd5e1',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  cursor: canScrollLeft ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                }}
              />
            </Tooltip>
            <Tooltip title="Scroll next">
              <Button
                shape="circle"
                size="small"
                icon={<RightOutlined style={{ fontSize: 12 }} />}
                onClick={handleNext}
                disabled={!canScrollRight}
                aria-label="Next shop"
                style={{
                  width: 36,
                  height: 36,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: `1px solid ${publicTheme.border}`,
                  background: '#ffffff',
                  color: canScrollRight ? publicTheme.text : '#cbd5e1',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  cursor: canScrollRight ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                }}
              />
            </Tooltip>
          </Space>

          {/* All Shops Page Link */}
          <Button
            type="link"
            onClick={() => navigate('/shops')}
            style={{ fontWeight: 700, color: publicTheme.primary, padding: '0 6px' }}
          >
            All Shops ({totalShops}) <ArrowRightOutlined />
          </Button>
        </div>
      </div>

      {/* 2. Slider Container with Floating Side Arrows & Side Edge Gradient Blending */}
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        {/* Floating Side Left Arrow Button (Desktop / Tablet) */}
        {!screens.xs && canScrollLeft && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous shop slide"
            style={{
              position: 'absolute',
              left: -16,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: '#ffffff',
              border: `1px solid ${publicTheme.border}`,
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
              color: publicTheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 25,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(47, 111, 237, 0.22)';
              e.currentTarget.style.borderColor = publicTheme.primary;
              e.currentTarget.style.color = publicTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.borderColor = publicTheme.border;
              e.currentTarget.style.color = publicTheme.text;
            }}
          >
            <LeftOutlined style={{ fontSize: 15 }} />
          </button>
        )}

        {/* Floating Side Right Arrow Button (Desktop / Tablet) */}
        {!screens.xs && canScrollRight && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next shop slide"
            style={{
              position: 'absolute',
              right: -16,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: '#ffffff',
              border: `1px solid ${publicTheme.border}`,
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
              color: publicTheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 25,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(47, 111, 237, 0.22)';
              e.currentTarget.style.borderColor = publicTheme.primary;
              e.currentTarget.style.color = publicTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.borderColor = publicTheme.border;
              e.currentTarget.style.color = publicTheme.text;
            }}
          >
            <RightOutlined style={{ fontSize: 15 }} />
          </button>
        )}

        {/* Left Edge Fade */}
        {canScrollLeft && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: screens.xs ? 20 : 36,
              background: 'linear-gradient(90deg, #f4f7f4 0%, rgba(244, 247, 244, 0) 100%)',
              pointerEvents: 'none',
              zIndex: 15,
              transition: 'opacity 0.25s ease',
            }}
          />
        )}

        {/* Right Edge Fade */}
        {canScrollRight && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: screens.xs ? 20 : 36,
              background: 'linear-gradient(270deg, #f4f7f4 0%, rgba(244, 247, 244, 0) 100%)',
              pointerEvents: 'none',
              zIndex: 15,
              transition: 'opacity 0.25s ease',
            }}
          />
        )}

        {/* Smooth Horizontal Track with Native Momentum and Scroll-Snap */}
        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            gap: screens.xs ? 12 : 16,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            padding: '8px 4px 16px',
            scrollBehavior: 'smooth',
          }}
          className="hide-scrollbar"
        >
          {/* SKELETON LOADING STATE */}
          {isLoading || totalShops === 0 ? (
            [1, 2, 3, 4].map((n) => (
              <div
                key={`skeleton-card-${n}`}
                style={{
                  flex: screens.xs
                    ? '0 0 calc(85% - 6px)'
                    : screens.sm && !screens.lg
                    ? '0 0 calc(48% - 8px)'
                    : '0 0 calc(25% - 12px)',
                  minWidth: screens.xs ? 270 : 280,
                  height: 380,
                  borderRadius: 20,
                  background: '#ffffff',
                  padding: 14,
                  boxShadow: publicTheme.lightShadow,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  boxSizing: 'border-box',
                }}
              >
                <div
                  className="shimmer-placeholder"
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 11',
                    borderRadius: 16,
                  }}
                />
                <div
                  className="shimmer-placeholder"
                  style={{ width: '40%', height: 12, borderRadius: 6 }}
                />
                <div
                  className="shimmer-placeholder"
                  style={{ width: '80%', height: 18, borderRadius: 6 }}
                />
                <div
                  className="shimmer-placeholder"
                  style={{ width: '100%', height: 32, borderRadius: 6 }}
                />
                <div
                  className="shimmer-placeholder"
                  style={{ width: '50%', height: 14, borderRadius: 6, marginTop: 'auto' }}
                />
                <div
                  className="shimmer-placeholder"
                  style={{ width: '100%', height: 36, borderRadius: 10 }}
                />
              </div>
            ))
          ) : (
            shops.map((shop, idx) => {
              const shopProducts = (retailProducts || []).filter((p) => p.shopId === shop.id);
              const isWishlisted = wishlistedShopIds.includes(shop.id);

              return (
                <div
                  key={shop.id || idx}
                  className="shop-showcase-item"
                  style={{
                    flex: screens.xs
                      ? '0 0 calc(84% - 6px)'
                      : screens.sm && !screens.lg
                      ? '0 0 calc(48% - 8px)'
                      : '0 0 calc(25% - 12px)',
                    minWidth: screens.xs ? 270 : 280,
                    maxWidth: screens.xs ? 340 : 'none',
                    scrollSnapAlign: 'start',
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
                    onLike={(s) => {}}
                    onShare={handleShareShop}
                    onOpenTelegram={(s) => handleOpenTelegramModal?.(s)}
                  />
                </div>
              );
            })
          )}
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
            marginTop: 14,
          }}
        >
          {shops.map((shop, idx) => {
            const isActive = activeDotIndex === idx;
            return (
              <button
                key={shop.id || idx}
                type="button"
                onClick={() => scrollToShop(idx)}
                aria-label={`Jump to shop ${idx + 1}: ${shop.name}`}
                style={{
                  width: isActive ? 24 : 7,
                  height: 6,
                  borderRadius: 999,
                  background: isActive ? publicTheme.primary : publicTheme.border,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 0 10px rgba(47, 111, 237, 0.45)' : 'none',
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
