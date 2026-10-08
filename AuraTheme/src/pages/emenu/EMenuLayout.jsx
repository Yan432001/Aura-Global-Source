import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import OfflineWarningBanner from '../../components/common/OfflineWarningBanner';
import DigitEMenuViewSwitcher from '../../components/emenu/DigitEMenuViewSwitcher';
import { publicTheme } from '../../utils/webTheme';

export default function EMenuLayout() {
  const { storeSlug } = useParams();
  const location = useLocation();

  const [isPhoneFrame, setIsPhoneFrame] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  const resolvedSlug = storeSlug || 'aura-bakery';

  return (
    <div
      style={{
        background: '#0b1120',
        minHeight: '100vh',
      }}
      className="w-full text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white"
    >
      {/* 1. Global View Mode Switcher: App Preview <-> Website View */}
      <DigitEMenuViewSwitcher
        currentMode="app"
        currentSlug={resolvedSlug}
        showStorePicker={true}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame((prev) => !prev)}
      />

      <OfflineWarningBanner />

      {/* 2. Main Body: Either Phone Frame Mockup on Desktop or Clean Mobile Canvas */}
      <main className="w-full flex-1 flex flex-col items-center justify-start py-0 md:py-6 px-0 md:px-4">
        {isPhoneFrame ? (
          <div className="w-full flex flex-col items-center justify-center my-auto">
            {/* Phone Frame Mockup Container */}
            <div
              className="relative w-full max-w-[440px] rounded-none md:rounded-[46px] overflow-hidden bg-white shadow-none md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-0 md:border-[10px] md:border-slate-800 transition-all duration-300 flex flex-col"
              style={{
                minHeight: '100vh',
                maxHeight: '94vh',
              }}
            >
              {/* Phone Speaker Notch / Dynamic Island (visible on desktop) */}
              <div className="hidden md:flex items-center justify-between px-6 pt-3 pb-1 bg-white border-b border-slate-100 z-40 select-none">
                <span className="text-[11px] font-black text-slate-800 font-mono">9:41</span>
                <div className="w-24 h-4.5 bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 mr-3 border border-slate-700/50" />
                  <div className="w-2 h-2 rounded-full bg-blue-500/80" />
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Scrollable Content inside phone frame */}
              <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
                <Outlet />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col items-center justify-start">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}
