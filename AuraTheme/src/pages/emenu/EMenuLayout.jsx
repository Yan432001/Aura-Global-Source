import React from 'react';
import { Outlet } from 'react-router-dom';
import OfflineWarningBanner from '../../components/common/OfflineWarningBanner';
import { publicTheme } from '../../utils/webTheme';

export default function EMenuLayout() {
  return (
    <div
      style={{
        background: publicTheme.pageBackground,
        minHeight: '100vh',
      }}
      className="w-full text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white"
    >
      <OfflineWarningBanner />
      <main className="w-full flex-1 flex flex-col items-center justify-start">
        <Outlet />
      </main>
    </div>
  );
}
