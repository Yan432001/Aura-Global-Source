import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Modal,
  Button,
  Space,
  Tag,
  Typography,
  Tooltip,
  Input,
  Dropdown,
  Segmented,
  Badge,
  Spin,
  message,
} from 'antd';
import {
  GlobalOutlined,
  DesktopOutlined,
  TabletOutlined,
  MobileOutlined,
  ExportOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HomeOutlined,
  CopyOutlined,
  CheckOutlined,
  SendOutlined,
  RotateRightOutlined,
  FullscreenOutlined,
  CloseOutlined,
  LockOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  FireOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';

const { Text } = Typography;

export default function AdminStorefrontPreviewModal({
  open,
  onClose,
  initialUrl = '/',
  initialDevice = 'desktop',
  stores = [],
}) {
  const [device, setDevice] = useState(initialDevice); // 'desktop', 'tablet', 'mobile', 'telegram'
  const [orientation, setOrientation] = useState('portrait'); // 'portrait', 'landscape'
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [history, setHistory] = useState([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copied, setCopied] = useState(false);
  const [studioTheme, setStudioTheme] = useState('dark'); // 'dark', 'light'

  // Sync initial URL when modal opens
  useEffect(() => {
    if (open) {
      const target = initialUrl || '/';
      setUrl(target);
      setInputUrl(target);
      setHistory([target]);
      setHistoryIndex(0);
      setIframeKey((k) => k + 1);
    }
  }, [open, initialUrl]);

  // Navigate to path
  const navigateTo = (newPath) => {
    if (!newPath) return;
    const cleanPath = newPath.startsWith('/') ? newPath : `/${newPath}`;
    setUrl(cleanPath);
    setInputUrl(cleanPath);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), cleanPath]);
    setHistoryIndex((prev) => prev + 1);
    setIframeKey((k) => k + 1);
  };

  // Back in history
  const handleBack = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      const target = history[nextIdx];
      setUrl(target);
      setInputUrl(target);
      setIframeKey((k) => k + 1);
    }
  };

  // Forward in history
  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const target = history[nextIdx];
      setUrl(target);
      setInputUrl(target);
      setIframeKey((k) => k + 1);
    }
  };

  // Reload iframe
  const handleReload = () => {
    setIsRefreshing(true);
    setIframeKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Copy full preview link
  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    message.success('URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick route options
  const defaultRoutes = useMemo(() => [
    { label: 'Homepage', icon: <HomeOutlined />, path: '/' },
    { label: 'All Stores', icon: <ShopOutlined />, path: '/shops' },
    { label: 'Artisan Bakery', icon: '🥐', path: '/shops/aura-bakery' },
    { label: 'Specialty Coffee', icon: '☕', path: '/shops/sbc-store' },
    { label: 'French Bistro', icon: '🍽️', path: '/shops/aura-bistro' },
    { label: 'Nexus Mobile', icon: '📱', path: '/shops/nexus-mobile' },
    { label: 'Apex PC Hub', icon: '💻', path: '/shops/apex-pc' },
    { label: 'Digital E-Menu', icon: <AppstoreOutlined />, path: '/shop/sbc-store' },
    { label: 'Telegram Mini App', icon: <SendOutlined />, path: '/tg' },
    { label: 'Cart & Checkout', icon: <ShoppingCartOutlined />, path: '/cart' },
    { label: 'Deals & Products', icon: <FireOutlined />, path: '/products' },
  ], []);

  // Compute device frame viewport dimensions
  const getDeviceDimensions = () => {
    const isLandscape = orientation === 'landscape';

    switch (device) {
      case 'mobile':
        return {
          width: isLandscape ? 844 : 390,
          height: isLandscape ? 390 : 780,
          label: isLandscape ? '844 × 390 (Mobile Landscape)' : '390 × 844 (iPhone 15 Pro)',
        };
      case 'tablet':
        return {
          width: isLandscape ? 1024 : 768,
          height: isLandscape ? 768 : 880,
          label: isLandscape ? '1024 × 768 (iPad Landscape)' : '768 × 1024 (iPad Portrait)',
        };
      case 'telegram':
        return {
          width: 390,
          height: 740,
          label: '390 × 740 (Telegram Mini App View)',
        };
      case 'desktop':
      default:
        return {
          width: '100%',
          height: 740,
          label: '100% Full Desktop View',
        };
    }
  };

  const dimensions = getDeviceDimensions();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="95vw"
      style={{ top: 16, maxWidth: 1400, padding: 0 }}
      styles={{
        content: {
          padding: 0,
          borderRadius: 20,
          overflow: 'hidden',
          background: studioTheme === 'dark' ? '#0f172a' : '#f8fafc',
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        body: {
          padding: 0,
        },
      }}
      closeIcon={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', minHeight: 650 }}>
        {/* ========================================================= */}
        {/* TOP BAR: STUDIO CHROME & CONTROLS */}
        {/* ========================================================= */}
        <div
          style={{
            background: studioTheme === 'dark' ? '#0f172a' : '#ffffff',
            borderBottom: `1px solid ${studioTheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {/* Left: Window Controls & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260 }}>
            {/* Traffic Light Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                onClick={onClose}
                role="button"
                tabIndex={0}
                title="Close Preview"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#ef4444',
                  cursor: 'pointer',
                  boxShadow: '0 0 6px rgba(239, 68, 68, 0.5)',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#f59e0b',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#10b981',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GlobalOutlined style={{ color: '#38bdf8', fontSize: 17 }} />
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 14.5,
                  color: studioTheme === 'dark' ? '#f8fafc' : '#0f172a',
                  letterSpacing: '-0.01em',
                }}
              >
                Storefront Simulator
              </span>
              <Tag
                color="success"
                style={{
                  margin: 0,
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 10.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '1px 8px',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                  }}
                />
                Live Sync
              </Tag>
            </div>
          </div>

          {/* Center: Device Segmented Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Segmented
              value={device}
              onChange={(val) => setDevice(val)}
              options={[
                {
                  label: (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <DesktopOutlined /> Desktop
                    </span>
                  ),
                  value: 'desktop',
                },
                {
                  label: (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <TabletOutlined /> Tablet
                    </span>
                  ),
                  value: 'tablet',
                },
                {
                  label: (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <MobileOutlined /> Mobile
                    </span>
                  ),
                  value: 'mobile',
                },
                {
                  label: (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <SendOutlined /> Telegram TMA
                    </span>
                  ),
                  value: 'telegram',
                },
              ]}
              style={{
                background: studioTheme === 'dark' ? '#1e293b' : '#f1f5f9',
                padding: 3,
                borderRadius: 12,
              }}
            />

            {/* Orientation Rotate (for mobile & tablet) */}
            {(device === 'mobile' || device === 'tablet') && (
              <Tooltip title={`Rotate to ${orientation === 'portrait' ? 'Landscape' : 'Portrait'}`}>
                <Button
                  shape="circle"
                  size="small"
                  icon={<RotateRightOutlined />}
                  onClick={() =>
                    setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
                  }
                  style={{
                    background: studioTheme === 'dark' ? '#1e293b' : '#ffffff',
                    borderColor: studioTheme === 'dark' ? '#334155' : '#cbd5e1',
                    color: studioTheme === 'dark' ? '#f8fafc' : '#0f172a',
                  }}
                />
              </Tooltip>
            )}
          </div>

          {/* Right: Studio Actions & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tooltip title="Toggle Studio Background Theme">
              <Button
                size="small"
                onClick={() => setStudioTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                style={{
                  background: studioTheme === 'dark' ? '#1e293b' : '#ffffff',
                  borderColor: studioTheme === 'dark' ? '#334155' : '#cbd5e1',
                  color: studioTheme === 'dark' ? '#f8fafc' : '#0f172a',
                  fontWeight: 600,
                  fontSize: 11,
                  borderRadius: 8,
                }}
              >
                {studioTheme === 'dark' ? '☀️ Light Stage' : '🌙 Dark Stage'}
              </Button>
            </Tooltip>

            <Button
              type="primary"
              size="small"
              icon={<ExportOutlined />}
              onClick={() => window.open(url, '_blank')}
              style={{
                background: '#2563eb',
                borderColor: '#2563eb',
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 8,
                padding: '0 12px',
                height: 28,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              }}
            >
              Open in New Tab
            </Button>

            <Button
              shape="circle"
              size="small"
              icon={<CloseOutlined style={{ fontSize: 12 }} />}
              onClick={onClose}
              style={{
                background: studioTheme === 'dark' ? '#1e293b' : '#f1f5f9',
                borderColor: studioTheme === 'dark' ? '#334155' : '#cbd5e1',
                color: studioTheme === 'dark' ? '#94a3b8' : '#64748b',
              }}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECONDARY BAR: SIMULATED BROWSER ADDRESS BAR */}
        {/* ========================================================= */}
        <div
          style={{
            background: studioTheme === 'dark' ? '#141e33' : '#f8fafc',
            borderBottom: `1px solid ${studioTheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Navigation Controls */}
          <Space size={4}>
            <Button
              shape="circle"
              size="small"
              disabled={historyIndex <= 0}
              icon={<ArrowLeftOutlined style={{ fontSize: 11 }} />}
              onClick={handleBack}
              style={{
                background: studioTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: studioTheme === 'dark' ? '#334155' : '#cbd5e1',
                color: studioTheme === 'dark' ? '#f8fafc' : '#0f172a',
              }}
            />
            <Button
              shape="circle"
              size="small"
              disabled={historyIndex >= history.length - 1}
              icon={<ArrowRightOutlined style={{ fontSize: 11 }} />}
              onClick={handleForward}
              style={{
                background: studioTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: studioTheme === 'dark' ? '#334155' : '#cbd5e1',
                color: studioTheme === 'dark' ? '#f8fafc' : '#0f172a',
              }}
            />
            <Button
              shape="circle"
              size="small"
              icon={<ReloadOutlined spin={isRefreshing} style={{ fontSize: 11 }} />}
              onClick={handleReload}
              style={{
                background: studioTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: studioTheme === 'dark' ? '#334155' : '#cbd5e1',
                color: studioTheme === 'dark' ? '#f8fafc' : '#0f172a',
              }}
            />
          </Space>

          {/* Browser Omnibar / URL Input */}
          <div
            style={{
              flex: 1,
              maxWidth: 720,
              display: 'flex',
              alignItems: 'center',
              background: studioTheme === 'dark' ? '#0f172a' : '#ffffff',
              border: `1px solid ${studioTheme === 'dark' ? '#334155' : '#cbd5e1'}`,
              borderRadius: 10,
              padding: '2px 10px',
              gap: 8,
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <LockOutlined style={{ color: '#10b981', fontSize: 12 }} />
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: studioTheme === 'dark' ? '#94a3b8' : '#64748b',
                userSelect: 'none',
              }}
            >
              aura-supply.store
            </span>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigateTo(inputUrl);
              }}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: studioTheme === 'dark' ? '#38bdf8' : '#0284c7',
                fontSize: 12.5,
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
              placeholder="e.g. /shops/sbc-store"
            />
            <Tooltip title={copied ? 'Copied!' : 'Copy Preview Link'}>
              <Button
                type="text"
                size="small"
                icon={copied ? <CheckOutlined style={{ color: '#10b981' }} /> : <CopyOutlined />}
                onClick={handleCopyLink}
                style={{
                  color: studioTheme === 'dark' ? '#94a3b8' : '#64748b',
                  padding: 0,
                  width: 24,
                  height: 24,
                }}
              />
            </Tooltip>
          </div>

          {/* Resolution Badge */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: studioTheme === 'dark' ? '#94a3b8' : '#64748b',
                background: studioTheme === 'dark' ? '#1e293b' : '#e2e8f0',
                padding: '3px 8px',
                borderRadius: 6,
              }}
            >
              {dimensions.label}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* QUICK ROUTE PILLS BAR (FIXES PREVIOUS HORIZONTAL SQUISHING) */}
        {/* ========================================================= */}
        <div
          style={{
            background: studioTheme === 'dark' ? '#0f172a' : '#f1f5f9',
            borderBottom: `1px solid ${studioTheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: studioTheme === 'dark' ? '#64748b' : '#94a3b8',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span>⚡</span>
            <span>Quick Routes:</span>
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {defaultRoutes.map((rt) => {
              const isActive = url === rt.path;
              return (
                <button
                  key={rt.path}
                  type="button"
                  onClick={() => navigateTo(rt.path)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 11px',
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    border: isActive
                      ? '1px solid #3b82f6'
                      : `1px solid ${studioTheme === 'dark' ? '#334155' : '#cbd5e1'}`,
                    background: isActive
                      ? '#2563eb'
                      : studioTheme === 'dark'
                      ? '#1e293b'
                      : '#ffffff',
                    color: isActive
                      ? '#ffffff'
                      : studioTheme === 'dark'
                      ? '#cbd5e1'
                      : '#334155',
                    boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
                  }}
                >
                  <span>{rt.icon}</span>
                  <span>{rt.label}</span>
                  <span
                    style={{
                      opacity: isActive ? 0.9 : 0.6,
                      fontSize: 10,
                      fontFamily: 'monospace',
                    }}
                  >
                    ({rt.path})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN STAGE CANVAS: REALISTIC HARDWARE DEVICE FRAMES */}
        {/* ========================================================= */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            background:
              studioTheme === 'dark'
                ? 'radial-gradient(#1e293b 1px, transparent 1px) 0 0 / 20px 20px, #0b1120'
                : 'radial-gradient(#cbd5e1 1px, transparent 1px) 0 0 / 20px 20px, #e2e8f0',
            padding: device === 'desktop' ? '16px' : '28px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {/* ===================================================== */}
          {/* 1. DESKTOP SIMULATOR FRAME */}
          {/* ===================================================== */}
          {device === 'desktop' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                minHeight: 580,
                borderRadius: 14,
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.35)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Desktop Window Title Bar */}
              <div
                style={{
                  background: '#f1f5f9',
                  borderBottom: '1px solid #e2e8f0',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                </div>
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 6,
                    padding: '2px 14px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    maxWidth: 320,
                  }}
                >
                  <LockOutlined style={{ color: '#10b981', fontSize: 10 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    https://aura-supply.store{url}
                  </span>
                </div>
              </div>

              {/* Desktop Iframe */}
              <iframe
                key={`desktop-${iframeKey}`}
                src={url}
                title="Desktop Storefront Live Preview"
                style={{
                  width: '100%',
                  flex: 1,
                  border: 'none',
                  background: '#ffffff',
                }}
              />
            </div>
          )}

          {/* ===================================================== */}
          {/* 2. MOBILE SIMULATOR FRAME (IPHONE 15 PRO CHASSIS) */}
          {/* ===================================================== */}
          {device === 'mobile' && (
            <div
              style={{
                width: dimensions.width,
                height: dimensions.height,
                borderRadius: orientation === 'portrait' ? 48 : 36,
                border: '11px solid #1e293b',
                background: '#000000',
                boxShadow:
                  '0 25px 65px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {/* Dynamic Island Pill (Portrait Only) */}
              {orientation === 'portrait' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 104,
                    height: 26,
                    borderRadius: 20,
                    background: '#000000',
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  }}
                >
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#0f172a' }} />
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#0284c7' }} />
                </div>
              )}

              {/* Simulated iOS Status Bar */}
              {orientation === 'portrait' && (
                <div
                  style={{
                    height: 38,
                    background: '#ffffff',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#0f172a',
                    borderBottom: '1px solid #f1f5f9',
                    zIndex: 10,
                  }}
                >
                  <span>9:41</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                    <span>5G</span>
                    <span>100% 🔋</span>
                  </div>
                </div>
              )}

              {/* Mobile Iframe */}
              <iframe
                key={`mobile-${iframeKey}`}
                src={url}
                title="Mobile Storefront Live Preview"
                style={{
                  width: '100%',
                  flex: 1,
                  border: 'none',
                  background: '#ffffff',
                }}
              />

              {/* Simulated Home Indicator Bar */}
              <div
                style={{
                  height: 18,
                  background: '#ffffff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 4,
                    borderRadius: 999,
                    background: '#94a3b8',
                  }}
                />
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* 3. TABLET SIMULATOR FRAME (IPAD PRO CHASSIS) */}
          {/* ===================================================== */}
          {device === 'tablet' && (
            <div
              style={{
                width: dimensions.width,
                height: dimensions.height,
                borderRadius: 36,
                border: '14px solid #1e293b',
                background: '#ffffff',
                boxShadow:
                  '0 30px 75px -15px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {/* FaceTime Camera Dot */}
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#334155',
                  zIndex: 20,
                }}
              />

              {/* Tablet Iframe */}
              <iframe
                key={`tablet-${iframeKey}`}
                src={url}
                title="Tablet Storefront Live Preview"
                style={{
                  width: '100%',
                  flex: 1,
                  border: 'none',
                  background: '#ffffff',
                }}
              />
            </div>
          )}

          {/* ===================================================== */}
          {/* 4. TELEGRAM TMA SIMULATOR FRAME */}
          {/* ===================================================== */}
          {device === 'telegram' && (
            <div
              style={{
                width: dimensions.width,
                height: dimensions.height,
                borderRadius: 44,
                border: '11px solid #1e293b',
                background: '#ffffff',
                boxShadow:
                  '0 25px 65px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {/* Telegram App Header Bar */}
              <div
                style={{
                  background: '#2481cc',
                  color: '#ffffff',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Close</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>Aura Supply Bot</div>
                  <div style={{ fontSize: 10, opacity: 0.85 }}>bot • live test environment</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 2 }}>
                  •••
                </div>
              </div>

              {/* Telegram Iframe Viewport */}
              <iframe
                key={`telegram-${iframeKey}`}
                src={url.startsWith('/tg') ? url : `/tg${url}`}
                title="Telegram Mini App Live Preview"
                style={{
                  width: '100%',
                  flex: 1,
                  border: 'none',
                  background: '#ffffff',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
