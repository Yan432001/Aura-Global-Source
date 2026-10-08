import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  MobileOutlined,
  GlobalOutlined,
  ArrowLeftOutlined,
  ShopOutlined,
  DownOutlined,
  QrcodeOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Space, Tag, Tooltip } from 'antd';
import AuraLogo from '../common/AuraLogo';

export const STORE_PREVIEWS = [
  { slug: 'aura-bakery', name: 'Aura Artisan Bakery', shortName: 'Bakery', emoji: '🥐' },
  { slug: 'sbc-store', name: 'Aura Specialty Coffee', shortName: 'Coffee', emoji: '☕' },
  { slug: 'aura-bistro', name: 'Aura French Bistro', shortName: 'Bistro', emoji: '🍽️' },
  { slug: 'aura-lounge', name: 'Aura Botanical Lounge', shortName: 'Matcha', emoji: '🍵' },
  { slug: 'nexus-mobile', name: 'Nexus Mobile & Gadgets', shortName: 'Phones', emoji: '📱' },
  { slug: 'apex-pc', name: 'Apex PC & Workstations', shortName: 'Computers', emoji: '💻' },
];

export default function DigitEMenuViewSwitcher({
  currentMode = 'app', // 'app' | 'website'
  currentSlug = 'aura-bakery',
  showStorePicker = true,
  isPhoneFrame = false,
  onTogglePhoneFrame,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const activeStore =
    STORE_PREVIEWS.find((s) => s.slug === currentSlug) || STORE_PREVIEWS[0];

  const handleSelectStore = (newSlug) => {
    if (currentMode === 'website') {
      navigate(`/shop/menu/${newSlug}`);
    } else {
      navigate(`/shop/${newSlug}`);
    }
  };

  const handleSwitchToWebsiteView = () => {
    navigate(`/shop/menu/${currentSlug}`);
  };

  const handleSwitchToAppPreview = () => {
    navigate(`/shop/${currentSlug}`);
  };

  const storeMenuItems = {
    items: STORE_PREVIEWS.map((st) => ({
      key: st.slug,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
          <span style={{ fontSize: 16 }}>{st.emoji}</span>
          <span style={{ fontWeight: st.slug === currentSlug ? 800 : 500 }}>
            {st.name}
          </span>
          {st.slug === currentSlug && (
            <Tag color="blue" style={{ marginLeft: 'auto', borderRadius: 999, fontSize: 10 }}>
              Active
            </Tag>
          )}
        </div>
      ),
      onClick: () => handleSelectStore(st.slug),
    })),
  };

  return (
    <nav
      aria-label="Digit E-Menu View Mode Navigation"
      style={{
        width: '100%',
        background: '#0f172a',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        zIndex: 50,
        position: 'sticky',
        top: 0,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Left: Branding & Back to Main Store */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'rgba(255, 255, 255, 0.75)',
            textDecoration: 'none',
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.08)',
            transition: 'all 0.2s',
          }}
          title="Return to Aura Marketplace Home"
        >
          <ArrowLeftOutlined style={{ fontSize: 11 }} />
          <span>Website Home</span>
        </Link>

        <div style={{ width: 1, height: 18, background: 'rgba(255, 255, 255, 0.2)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <QrcodeOutlined style={{ color: '#38bdf8', fontSize: 16 }} />
          <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: '-0.01em', color: '#ffffff' }}>
            Digit E-Menu
          </span>
          <Tag
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              margin: 0,
              padding: '0 6px',
            }}
          >
            Live Preview
          </Tag>
        </div>
      </div>

      {/* Middle & Right: View Switcher (App Preview <-> Website View) & Store Picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Store Picker Dropdown */}
        {showStorePicker && (
          <Dropdown menu={storeMenuItems} trigger={['click']} placement="bottomRight">
            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span>{activeStore.emoji}</span>
              <span>{activeStore.name}</span>
              <DownOutlined style={{ fontSize: 9, opacity: 0.7 }} />
            </button>
          </Dropdown>
        )}

        {/* PRIMARY TOGGLE: App Preview <-> Website View */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.45)',
            padding: 3,
            borderRadius: 999,
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* App Preview Option */}
          <button
            type="button"
            onClick={currentMode === 'app' ? undefined : handleSwitchToAppPreview}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 14px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              cursor: currentMode === 'app' ? 'default' : 'pointer',
              border: 'none',
              background: currentMode === 'app' ? '#2563eb' : 'transparent',
              color: currentMode === 'app' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              boxShadow: currentMode === 'app' ? '0 2px 8px rgba(37, 99, 235, 0.5)' : 'none',
              transition: 'all 0.2s ease',
            }}
            title="Switch to Mobile App Preview (Telegram Mini App view)"
          >
            <MobileOutlined style={{ fontSize: 13 }} />
            <span>App Preview</span>
          </button>

          {/* Website View Option */}
          <button
            type="button"
            onClick={currentMode === 'website' ? undefined : handleSwitchToWebsiteView}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 14px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              cursor: currentMode === 'website' ? 'default' : 'pointer',
              border: 'none',
              background: currentMode === 'website' ? '#dc2626' : 'transparent',
              color: currentMode === 'website' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              boxShadow: currentMode === 'website' ? '0 2px 8px rgba(220, 38, 38, 0.5)' : 'none',
              transition: 'all 0.2s ease',
            }}
            title="Switch to Website View (Full responsive website e-menu layout)"
          >
            <GlobalOutlined style={{ fontSize: 13 }} />
            <span>Website View</span>
          </button>
        </div>

        {/* Optional Phone Mockup Bezel Toggle (only in App Preview on desktop) */}
        {currentMode === 'app' && onTogglePhoneFrame && (
          <Tooltip title={isPhoneFrame ? 'Toggle standard view' : 'Toggle phone device mockup frame'}>
            <button
              type="button"
              onClick={onTogglePhoneFrame}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 8,
                background: isPhoneFrame ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${isPhoneFrame ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)'}`,
                color: isPhoneFrame ? '#38bdf8' : 'rgba(255, 255, 255, 0.8)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <MobileOutlined />
              <span>{isPhoneFrame ? 'Frame: ON' : 'Phone Frame'}</span>
            </button>
          </Tooltip>
        )}
      </div>
    </nav>
  );
}
