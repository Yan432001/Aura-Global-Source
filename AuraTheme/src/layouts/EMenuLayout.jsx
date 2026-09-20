import React from 'react';
import { Outlet } from 'react-router-dom';

export default function EMenuLayout({ themeColor = '#2481cc' }) {
  return (
    <div
      style={{
        '--theme-accent': themeColor,
        minHeight: '100vh',
        backgroundColor: 'var(--tg-theme-bg-color, #f4f4f5)',
        color: 'var(--tg-theme-text-color, #18181b)'
      }}
      className="flex justify-center w-full"
    >
      <main
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
        className="w-full max-w-[480px] min-h-screen bg-white dark:bg-zinc-900 shadow-md flex flex-col relative"
      >
        <Outlet />
      </main>
    </div>
  );
}