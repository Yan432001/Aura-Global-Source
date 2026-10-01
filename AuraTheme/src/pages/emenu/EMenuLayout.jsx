import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  CopyOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import simpleData from '../../../../data/simpleData';
import OfflineWarningBanner from '../../components/common/OfflineWarningBanner';

export default function EMenuLayout() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Extract current store slug from URL
  const currentSlug = useMemo(() => {
    if (params.storeSlug) return params.storeSlug;
    const parts = location.pathname.split('/');
    if (parts[1] === 'shop' && parts[2] && parts[2] !== 'not-found') {
      return parts[2];
    }
    return 'sbc-store';
  }, [params.storeSlug, location.pathname]);

  // Available stores for branch switching
  const storeList = useMemo(() => {
    return (simpleData.stores || []).slice(0, 5);
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
    <div className="min-h-screen bg-[#FAF7F2] text-slate-800 font-sans flex flex-col antialiased selection:bg-orange-500 selection:text-white">
      <OfflineWarningBanner />

      {/* ======================================================== */}
      {/* TOP DESKTOP DEVICE TOOLBAR                               */}
      {/* ======================================================== */}
      <header className="w-full bg-white/95 backdrop-blur-xl border-b border-orange-100/90 px-4 lg:px-6 py-2.5 flex items-center justify-between z-30 shrink-0 sticky top-0 shadow-2xs">
        {/* Left: Back to Main Web Store & Telegram Deep Link */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-[#FF5722] text-slate-700 hover:text-white text-xs font-bold transition-all border border-orange-200/70 hover:border-[#FF5722] shadow-xs active:scale-95 group"
          >
            <ArrowLeftOutlined className="text-orange-500 group-hover:text-white transition-colors" style={{ fontSize: 11 }} />
            <span>Back to Web Store</span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 pl-2 border-l border-orange-200/60">
            <span className="font-semibold text-slate-600">Telegram Bot Link:</span>
            <div
              onClick={handleCopyUrl}
              className="group flex items-center gap-1.5 cursor-pointer bg-orange-50/60 hover:bg-orange-100/70 px-2.5 py-1 rounded-lg border border-orange-200/60 hover:border-orange-300 transition-all"
              title="Click to copy link"
            >
              <code className="text-[#F25C19] font-mono font-bold text-[11px] truncate max-w-[280px]">
                {telegramLink}
              </code>
              <CopyOutlined className="text-slate-400 group-hover:text-[#F25C19] text-xs transition-colors" />
            </div>
          </div>
        </div>

        {/* Center: Quick Store Branch Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[48vw] py-0.5 scrollbar-none">
          <span className="text-[11px] font-black text-slate-400 mr-1 shrink-0 hidden xl:inline uppercase tracking-wider">
            Shops / Branch:
          </span>
          {storeList.map((s) => {
            const isActive = s.slug === currentSlug;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSwitchStore(s.slug)}
                className={`text-xs px-3 py-1.5 rounded-xl font-extrabold transition-all shrink-0 border flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-md shadow-orange-500/25 ring-2 ring-orange-400/20'
                    : 'bg-white text-slate-700 border-orange-100 hover:bg-orange-50 hover:text-slate-900'
                }`}
              >
                <span className="text-xs">{getStoreEmoji(s.slug)}</span>
                <span>{s.name.replace('Aura ', '').replace(' Systems', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Copy Bot Link */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyUrl}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs active:scale-95 cursor-pointer ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white hover:bg-orange-50 text-slate-700 border-orange-200/80'
            }`}
            title="Copy Telegram Mini App Link"
          >
            {copied ? (
              <>
                <CheckOutlined className="text-emerald-600" />
                <span className="font-bold text-emerald-700">Copied Link!</span>
              </>
            ) : (
              <>
                <CopyOutlined className="text-orange-500" />
                <span>Copy Bot Link</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN CONTAINER: FULL PORTAL VIEW                         */}
      {/* ======================================================== */}
      <main className="w-full flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
