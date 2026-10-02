import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { products } from '../data/shopData';
import simpleData from '../../../data/simpleData';

export default function TelegramEntry() {
  const { startParam } = useTelegram();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!startParam) {
      navigate('/shop/sbc-store', { replace: true });
      return;
    }

    // 1. Deep link format: item_<id>
    if (startParam.startsWith('item_')) {
      const productId = startParam.replace('item_', '');
      const simpleProd = (simpleData.products || []).find((p) => String(p.id) === String(productId));
      if (simpleProd) {
        const store = (simpleData.stores || []).find((s) => s.id === simpleProd.biller_id);
        const slug = store ? store.slug : 'sbc-store';
        navigate(`/shop/${slug}?item=${productId}`, { replace: true });
        return;
      }
      navigate(`/shop/sbc-store?item=${productId}`, { replace: true });
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
      const store = (simpleData.stores || []).find((s) => String(s.id) === String(billerId));
      navigate(`/shop/${store?.slug || 'sbc-store'}`, { replace: true });
      return;
    }

    if (startParam.startsWith('store_')) {
      const storeSlug = startParam.replace('store_', '');
      navigate(`/shop/${storeSlug}`, { replace: true });
      return;
    }

    // 5. Direct raw param fallback
    navigate(`/shop/${startParam}`, { replace: true });
  }, [startParam, navigate, location.pathname, location.search]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] flex-1">
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl mb-3 animate-pulse">
        ✈️
      </div>
      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-500 mb-3" />
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Connecting to Telegram Mini App (@aura_emenu_order_bot)...
      </p>
      <p className="text-xs text-slate-400 mt-1">Routing to shop &amp; item catalog</p>
    </div>
  );
}
