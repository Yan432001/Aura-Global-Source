import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  CopyOutlined,
  ExpandOutlined,
  CompressOutlined,
  CheckOutlined,
  SendOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import simpleData from '../../../../data/simpleData';

export default function EMenuLayout() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('13:12');
  const [forceMobileFullscreen, setForceMobileFullscreen] = useState(false);

  // Extract current store slug from URL
  const currentSlug = useMemo(() => {
    if (params.storeSlug) return params.storeSlug;
    const parts = location.pathname.split('/');
    if (parts[1] === 'shop' && parts[2] && parts[2] !== 'not-found') {
      return parts[2];
    }
    return 'sbc-store';
  }, [params.storeSlug, location.pathname]);

  // Available stores for fast testing
  const storeList = useMemo(() => {
    return (simpleData.stores || []).slice(0, 5);
  }, []);

  // Update clock in real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const telegramLink = `https://t.me/aura_emenu_order_bot/menu?startapp=shop_${currentSlug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(telegramLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitchStore = (slug) => {
    navigate(`/shop/${slug}`);
  };

  const getStoreEmoji = (slug) => {
    if (slug === 'sbc-store') return '☕';
    if (slug === 'aura-bistro') return '🥗';
    if (slug === 'aura-bakery') return '🥐';
    if (slug === 'aura-tech') return '⚡';
    return '🏪';
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans flex flex-col items-center justify-start antialiased selection:bg-blue-600 selection:text-white">
      {/* ======================================================== */}
      {/* TOP DESKTOP DEVICE TOOLBAR (Hidden on mobile < 640px)    */}
      {/* ======================================================== */}
      {!forceMobileFullscreen && (
        <header className="hidden sm:flex w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-6 py-2.5 items-center justify-between z-30 shrink-0 sticky top-0 shadow-lg shadow-black/40">
          {/* Left: Back to Main Web Store & Telegram Deep Link */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700/70 hover:border-blue-500 shadow-sm active:scale-95 group"
            >
              <ArrowLeftOutlined className="text-slate-400 group-hover:text-white transition-colors" style={{ fontSize: 11 }} />
              <span>Back to Web Store</span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pl-2 border-l border-slate-800">
              <span className="text-slate-400 font-medium">Telegram Mini App Link:</span>
              <div
                onClick={handleCopyUrl}
                className="group flex items-center gap-1.5 cursor-pointer bg-slate-950/80 hover:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-sky-500/50 transition-all"
                title="Click to copy link"
              >
                <code className="text-sky-400 font-mono font-semibold text-[11px] truncate max-w-[280px]">
                  {telegramLink}
                </code>
                <CopyOutlined className="text-slate-500 group-hover:text-sky-400 text-xs transition-colors" />
              </div>
            </div>
          </div>

          {/* Center: Quick Store Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[48vw] py-0.5 scrollbar-none">
            <span className="text-[11px] font-extrabold text-slate-400 mr-1 shrink-0 hidden xl:inline uppercase tracking-wider">
              Quick Switch:
            </span>
            {storeList.map((s) => {
              const isActive = s.slug === currentSlug;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSwitchStore(s.slug)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 border flex items-center gap-1.5 active:scale-95 ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 ring-2 ring-blue-500/20'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700/70 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs">{getStoreEmoji(s.slug)}</span>
                  <span>{s.name.replace('Aura ', '').replace(' Systems', '')}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Viewport badge & controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyUrl}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm active:scale-95 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60'
              }`}
              title="Copy Telegram Mini App Link"
            >
              {copied ? (
                <>
                  <CheckOutlined className="text-emerald-400" />
                  <span>Copied Bot Link!</span>
                </>
              ) : (
                <>
                  <CopyOutlined />
                  <span>Copy Bot Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setForceMobileFullscreen(!forceMobileFullscreen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold transition-all border border-slate-700/60 shadow-sm active:scale-95"
              title="Toggle Fullscreen View"
            >
              {forceMobileFullscreen ? (
                <>
                  <CompressOutlined />
                  <span className="hidden xl:inline">Phone Frame</span>
                </>
              ) : (
                <>
                  <ExpandOutlined />
                  <span className="hidden xl:inline">Full Screen</span>
                </>
              )}
            </button>
          </div>
        </header>
      )}

      {/* ======================================================== */}
      {/* MAIN CONTAINER: SMARTPHONE DISPLAY SHELL                 */}
      {/* ======================================================== */}
      <div
        className={`w-full flex-1 flex flex-col items-center justify-center p-0 sm:py-7 sm:px-4 ${
          forceMobileFullscreen ? 'sm:py-0 sm:px-0' : ''
        }`}
      >
        {/* Subtle Ambient Radial Glow behind Phone Chassis on Desktop */}
        {!forceMobileFullscreen && (
          <div className="hidden sm:block absolute w-[520px] h-[780px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/20 to-teal-500/10 rounded-full blur-[100px] pointer-events-none -z-0" />
        )}

        {/* 
          PHONE DISPLAY FRAME (Flagship Titanium Curved Smartphone):
          - Full-screen on real phones / screens < 640px OR if fullscreen toggled.
          - On desktop screens: Renders as modern flagship smartphone (Curved Titanium chassis).
        */}
        <div
          className={`relative z-10 w-full transition-all duration-300 transform-gpu ${
            forceMobileFullscreen
              ? 'max-w-none min-h-screen rounded-none border-0'
              : 'sm:w-[418px] sm:max-w-[418px] sm:h-[874px] sm:max-h-[calc(100vh-74px)] sm:rounded-[50px] sm:border-[11px] sm:border-[#1e2433] sm:shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.08),inset_0_0_12px_rgba(0,0,0,0.9)]'
          } bg-slate-950 flex flex-col overflow-hidden ring-1 ring-white/10`}
        >
          {/* Hardware Buttons on outer sides (Desktop frame only) */}
          {!forceMobileFullscreen && (
            <>
              {/* Action Button & Volume Buttons (Left) */}
              <div className="hidden sm:block absolute -left-[14px] top-[108px] w-[3px] h-[28px] bg-gradient-to-b from-slate-600 to-slate-700 rounded-l-sm" />
              <div className="hidden sm:block absolute -left-[14px] top-[148px] w-[3px] h-[50px] bg-gradient-to-b from-slate-600 to-slate-700 rounded-l-sm" />
              <div className="hidden sm:block absolute -left-[14px] top-[210px] w-[3px] h-[50px] bg-gradient-to-b from-slate-600 to-slate-700 rounded-l-sm" />
              {/* Power Button (Right) */}
              <div className="hidden sm:block absolute -right-[14px] top-[165px] w-[3px] h-[66px] bg-gradient-to-b from-slate-600 to-slate-700 rounded-r-sm" />
            </>
          )}

          {/* ======================================================== */}
          {/* SIMULATED PHONE STATUS BAR (Top Notch & Dynamic Island)  */}
          {/* ======================================================== */}
          <div className="shrink-0 bg-slate-950/95 backdrop-blur-xl px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-300 border-b border-slate-900 select-none z-30">
            {/* Clock */}
            <span className="font-extrabold text-[12px] tracking-tight text-white w-14">
              {currentTime}
            </span>

            {/* Dynamic Island Pill with Telegram Bot Branding */}
            <div className="h-6 px-3.5 rounded-full bg-black border border-slate-800/90 flex items-center justify-center gap-2 shadow-inner shadow-black">
              <span className="w-2 h-2 rounded-full bg-emerald-400 relative flex items-center justify-center">
                <span className="absolute -inset-0.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </span>
              <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                <span>✈️</span>
                <span className="tracking-tight">@aura_emenu_order_bot</span>
              </span>
            </div>

            {/* Status Icons: Signal, 5G, Battery */}
            <div className="flex items-center gap-1.5 w-14 justify-end text-[11px] text-slate-300">
              <span className="text-[10px] font-black text-emerald-400 tracking-wider">5G</span>
              {/* Wi-Fi Icon */}
              <svg
                className="w-3.5 h-3.5 fill-current text-slate-200"
                viewBox="0 0 24 24"
              >
                <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.78 0 7.21 1.48 9.77 3.91L12 18.35 2.23 11.41C4.79 8.98 8.22 7.5 12 7.5z" />
              </svg>
              {/* Battery representation */}
              <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* PHONE SCREEN VIEWPORT (Outlet Content)                   */}
          {/* ======================================================== */}
          <div className="flex-1 overflow-y-auto overscroll-contain bg-slate-950 flex flex-col relative [scrollbar-width:thin] [scrollbar-color:#334155_transparent] transform-gpu">
            <Outlet />
          </div>

          {/* ======================================================== */}
          {/* PHONE BOTTOM HOME INDICATOR                              */}
          {/* ======================================================== */}
          <div className="shrink-0 bg-slate-950/95 backdrop-blur-xl pt-1.5 pb-2.5 flex items-center justify-center select-none pointer-events-none z-30 border-t border-slate-900/60">
            <div className="w-36 h-1 bg-slate-500/40 rounded-full" />
          </div>
        </div>

        {/* Desktop Footnote beneath phone */}
        {!forceMobileFullscreen && (
          <div className="hidden sm:flex flex-col items-center justify-center mt-3 text-center text-xs text-slate-500 max-w-sm">
            <p className="flex items-center gap-1.5 font-semibold text-slate-300">
              <span className="text-sky-400">✈️</span>
              <span>Telegram Mini App Experience</span>
              <span className="text-slate-600">•</span>
              <span className="text-blue-400 font-bold">@aura_emenu_order_bot</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live touch-first food &amp; drinks ordering menu with real-time kitchen Telegram dispatch.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
