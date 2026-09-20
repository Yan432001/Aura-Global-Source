import React from 'react';
import { Outlet } from 'react-router-dom';

export default function EMenuLayout() {
  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color,#f9fafb)] text-[var(--tg-theme-text-color,#111827)] flex justify-center">
      <main className="w-full max-w-[430px] min-h-screen flex flex-col relative pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-lg">
        <Outlet />
      </main>
    </div>
  );
}