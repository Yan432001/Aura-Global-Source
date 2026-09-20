import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const order = state?.order;

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
        ✓
      </div>
      <h1 className="text-xl font-extrabold">Order Received!</h1>
      <p className="text-xs text-zinc-500 max-w-xs">
        Your order <strong>{order?.referenceNo}</strong> has been transmitted to the store cashier.
      </p>
      <button
        onClick={() => navigate(`/shop/${storeSlug}`)}
        className="px-6 min-h-[44px] bg-[var(--theme-accent)] text-white rounded-xl text-xs font-semibold"
      >
        Back to Menu
      </button>
    </div>
  );
}