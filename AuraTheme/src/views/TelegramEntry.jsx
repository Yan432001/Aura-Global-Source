import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

export default function TelegramEntry() {
  const { startParam } = useTelegram();
  const navigate = useNavigate();

  useEffect(() => {
    if (!startParam) {
      navigate('/shop/unknown', { replace: true });
      return;
    }

    if (startParam.startsWith('biller_')) {
      const billerId = startParam.replace('biller_', '');
      navigate(`/shop/by-biller/${billerId}`, { replace: true });
    } else if (startParam.startsWith('store_')) {
      const storeSlug = startParam.replace('store_', '');
      navigate(`/shop/${storeSlug}`, { replace: true });
    } else {
      // Direct raw param fallback
      navigate(`/shop/${startParam}`, { replace: true });
    }
  }, [startParam, navigate]);

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3" />
      <p className="text-sm opacity-70">Loading store...</p>
    </div>
  );
}