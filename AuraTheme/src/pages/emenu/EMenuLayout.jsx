import React from 'react';
import { Outlet } from 'react-router-dom';
import OfflineWarningBanner from '../../components/common/OfflineWarningBanner';

export default function EMenuLayout() {
  return (
    <div className="min-h-screen w-full bg-[#070403] text-white font-sans flex flex-col antialiased selection:bg-orange-500 selection:text-white">
      <OfflineWarningBanner />
      <main className="w-full flex-1 flex flex-col items-center">
        <Outlet />
      </main>
    </div>
  );
}
