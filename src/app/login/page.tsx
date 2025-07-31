"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Locale, defaultLocale, translations } from "@/lib/i18n";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = translations[locale];
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In a real implementation, this would call your authentication API
      // For now, we'll simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, verify credentials with your backend
      if (username === "admin" && password === "admin") {
        // Store authentication state
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify({ username }));
        router.push("/");
      } else {
        setError("نام کاربری یا رمز عبور اشتباه است");
      }
    } catch (err) {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLocale(locale === "fa" ? "en" : "fa");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="gap-2"
        >
          <span className="text-xs">{locale.toUpperCase()}</span>
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Passage Panel</span>
            </div>
          </div>
          <CardTitle className="text-2xl">
            {locale === "fa" ? "ورود به پنل" : "Login to Panel"}
          </CardTitle>
          <CardDescription>
            {locale === "fa" 
              ? "لطفاً نام کاربری و رمز عبور خود را وارد کنید"
              : "Please enter your username and password"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                {locale === "fa" ? "نام کاربری" : "Username"}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={locale === "fa" ? "نام کاربری را وارد کنید" : "Enter username"}
                required
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                {locale === "fa" ? "رمز عبور" : "Password"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={locale === "fa" ? "رمز عبور را وارد کنید" : "Enter password"}
                  required
                  className="text-right pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {locale === "fa" ? "در حال ورود..." : "Logging in..."}
                </div>
              ) : (
                locale === "fa" ? "ورود" : "Login"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              {locale === "fa" 
                ? "اطلاعات پیش‌فرض: admin / admin"
                : "Default credentials: admin / admin"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}