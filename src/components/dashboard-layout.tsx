"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Users, 
  Settings, 
  BarChart3, 
  Globe, 
  Shield,
  Info,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { LogoutButton } from "@/components/logout-button";
import { Locale, defaultLocale, translations, type TranslationKey } from "@/lib/i18n";

const sidebarNavItems = [
  {
    titleKey: "dashboard" as TranslationKey,
    href: "/",
    icon: Home,
  },
  {
    titleKey: "users" as TranslationKey,
    href: "/users",
    icon: Users,
  },
  {
    titleKey: "inbounds" as TranslationKey,
    href: "/inbounds",
    icon: Globe,
  },
  {
    titleKey: "statistics" as TranslationKey,
    href: "/statistics",
    icon: BarChart3,
  },
  {
    titleKey: "settings" as TranslationKey,
    href: "/settings",
    icon: Settings,
  },
  {
    titleKey: "about" as TranslationKey,
    href: "/about",
    icon: Info,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  locale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
}

export function DashboardLayout({ children, locale = defaultLocale, onLocaleChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const t = translations[locale];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-sidebar-foreground">{t.xuiPanel}</span>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="grid gap-2">
              {sidebarNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {t[item.titleKey]}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="text-xs text-sidebar-foreground/60">
              {t.poweredBy}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {onLocaleChange && (
              <LanguageToggle currentLocale={locale} onLocaleChange={onLocaleChange} />
            )}
            <ThemeToggle />
            <LogoutButton locale={locale} />
          </div>
        </div>

        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}