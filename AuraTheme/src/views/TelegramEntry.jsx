import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { products } from '../data/shopData';
import simpleData from '../../../data/simpleData';

export default function TelegramEntry() {
  const { startParam } = useTelegram();
  const navigate = useNavigate();

  useEffect(() => {
    if (!startParam) {
      navigate('/shop/seller-1', { replace: true });
      return;
    }

    // 1. Deep link format: item_<id>
    if (startParam.startsWith('item_')) {
      const productId = startParam.replace('item_', '');
      // Find shop from shopData or simpleData
      const foundProduct = (products || []).find((p) => String(p.id) === String(productId));
      if (foundProduct && foundProduct.shopId) {
        navigate(`/shop/${foundProduct.shopId}?item=${productId}`, { replace: true });
        return;
      }
      const simpleProd = (simpleData.products || []).find((p) => String(p.id) === String(productId));
      if (simpleProd && simpleProd.biller_id) {
        navigate(`/shop/by-biller/${simpleProd.biller_id}?item=${productId}`, { replace: true });
        return;
      }
      navigate(`/shop/seller-1?item=${productId}`, { replace: true });
      return;
    }

    // 2. Deep link format: shop_<shopId>_item_<productId>
    if (startParam.startsWith('shop_') && startParam.includes('_item_')) {
      const withoutPrefix = startParam.replace('shop_', '');
      const [shopSlug, productId] = withoutPrefix.split('_item_');
      navigate(`/shop/${shopSlug}?item=${productId}`, { replace: true });
      return;
    }

    // 3. Deep link format: shop_<shopId>
    if (startParam.startsWith('shop_')) {
      const shopSlug = startParam.replace('shop_', '');
      navigate(`/shop/${shopSlug}`, { replace: true });
      return;
    }

    // 4. Biller & Store legacy deep links
    if (startParam.startsWith('biller_')) {
      const billerId = startParam.replace('biller_', '');
      navigate(`/shop/by-biller/${billerId}`, { replace: true });
      return;
    }

    if (startParam.startsWith('store_')) {
      const storeSlug = startParam.replace('store_', '');
      navigate(`/shop/${storeSlug}`, { replace: true });
      return;
    }

    // 5. Direct raw param fallback
    navigate(`/shop/${startParam}`, { replace: true });
  }, [startParam, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] flex-1">
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl mb-3 animate-pulse">
        ✈️
      </div>
      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-500 mb-3" />
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Connecting to Telegram Mini App via @BotFather...
      </p>
      <p className="text-xs text-slate-400 mt-1">Routing to shop &amp; item catalog</p>
    </div>
  );
}
