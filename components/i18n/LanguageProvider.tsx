"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LANGUAGE_COOKIE, type Locale } from "@/lib/i18n/types";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (english: string, spanish: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, updateLocale] = useState(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    updateLocale(next);
    // This preference is separate from the demo's patient data repository.
    document.cookie = `${LANGUAGE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    document.documentElement.lang = next;
  }, []);

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t: (english: string, spanish: string) => locale === "es" ? spanish : english }), [locale, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage requires LanguageProvider");
  return context;
}
