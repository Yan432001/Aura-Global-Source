import { useEffect, useMemo } from 'react';

export function useTelegram() {
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, [tg]);

  const startParam = useMemo(() => {
    if (tg?.initDataUnsafe?.start_param) {
      return tg.initDataUnsafe.start_param;
    }
    const params = new URLSearchParams(window.location.search);
    return params.get('startapp') || params.get('store') || params.get('biller_id') || null;
  }, [tg]);

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    initData: tg?.initData,
    startParam,
    colorScheme: tg?.colorScheme || 'light',
    themeParams: tg?.themeParams || {},
    MainButton: tg?.MainButton,
    BackButton: tg?.BackButton
  };
}