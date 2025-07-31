"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Locale, translations } from "@/lib/i18n";

interface LogoutButtonProps {
  locale: Locale;
}

export function LogoutButton({ locale }: LogoutButtonProps) {
  const router = useRouter();
  const t = translations[locale];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleLogout}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span>{locale === "fa" ? "خروج" : "Logout"}</span>
    </Button>
  );
}