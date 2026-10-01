import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { exportSingleOrderPdf } from '../../../../utils/orderPdfExporter';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const order = state?.order;
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadPdf = () => {
    if (!order) return;
    exportSingleOrderPdf(order, { storeName: storeSlug });
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
        ✓
      </div>
      <h1 className="text-xl font-extrabold text-slate-100">Order Received!</h1>
      <p className="text-xs text-zinc-400 max-w-xs">
        Your order <strong className="text-sky-400">{order?.referenceNo}</strong> has been transmitted to the store cashier.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleDownloadPdf}
          className="inline-flex items-center gap-2 px-5 min-h-[42px] bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all border border-red-500 shadow-md active:scale-95"
        >
          <span>📄</span>
          <span>{downloaded ? 'Downloaded PDF!' : 'Download PDF Summary'}</span>
        </button>

        <button
          onClick={() => navigate(`/shop/${storeSlug}`)}
          className="px-6 min-h-[42px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 active:scale-95 transition-all"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}