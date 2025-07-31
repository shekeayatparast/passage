"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Locale, type TranslationKey } from "@/lib/i18n";

interface LanguageToggleProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function LanguageToggle({ currentLocale, onLocaleChange }: LanguageToggleProps) {
  const toggleLanguage = () => {
    onLocaleChange(currentLocale === "fa" ? "en" : "fa");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage}>
      <Globe className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle Language</span>
      <span className="absolute -bottom-1 -right-1 text-xs font-bold">
        {currentLocale.toUpperCase()}
      </span>
    </Button>
  );
}