import React from 'react';
import { Outlet } from 'react-router-dom';

export default function EMenuLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      <Outlet />
    </div>
  );
}
