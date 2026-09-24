import { useEffect, useState } from "react";

export function useTelegram() {
  const [tg, setTg] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [startParam, setStartParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const webapp = (window as any).Telegram?.WebApp;
      if (webapp) {
        webapp.ready();
        webapp.expand();
        setTg(webapp);
        setUser(webapp.initDataUnsafe?.user || null);

        const tgStartParam = webapp.initDataUnsafe?.start_param;
        if (tgStartParam) {
          setStartParam(tgStartParam);
          return;
        }
      }

      // Fallback for browser testing or direct links (?startapp=sbc-store or ?store=aura-bakery)
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get("startapp") || params.get("store") || params.get("store_slug") || params.get("biller_id");
      if (urlParam) {
        setStartParam(urlParam);
      }
    }
  }, []);

  const triggerHaptic = (style: "light" | "medium" | "heavy" = "light") => {
    try {
      tg?.HapticFeedback?.impactOccurred?.(style);
    } catch {
      // Haptics not available outside Telegram mobile client
    }
  };

  return {
    tg,
    user,
    startParam,
    initData: tg?.initData,
    triggerHaptic,
    colorScheme: tg?.colorScheme || "dark",
    themeParams: tg?.themeParams || {},
  };
}
