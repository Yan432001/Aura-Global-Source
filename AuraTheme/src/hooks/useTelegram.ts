"use client";

import { useEffect, useState } from "react";

export function useTelegram() {
  const [tg, setTg] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [startParam, setStartParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const webapp = (window as any).Telegram.WebApp;
      webapp.ready();
      webapp.expand();
      setTg(webapp);
      setUser(webapp.initDataUnsafe?.user || null);
      setStartParam(webapp.initDataUnsafe?.start_param || null);
    }
  }, []);

  const triggerHaptic = (style: "light" | "medium" | "heavy" = "light") => {
    tg?.HapticFeedback?.impactOccurred(style);
  };

  return { tg, user, startParam, triggerHaptic };
}