import React from 'react';
import { Outlet } from 'react-router-dom';

export default function EMenuLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-900 text-slate-100 antialiased selection:bg-amber-500 selection:text-white">
      <main className="w-full flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
