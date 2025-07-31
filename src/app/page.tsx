"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Wifi, Server, Users, Activity, Copy } from "lucide-react";
import { Locale, defaultLocale, translations } from "@/lib/i18n";
import { AuthGuard } from "@/components/auth-guard";

interface UserInfo {
  ip: string;
  country: string;
  countryCode: string;
  isp: string;
  city?: string;
  region?: string;
}

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = translations[locale];

  useEffect(() => {
    // Get user info
    const getUserInfo = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserInfo({
          ip: data.ip,
          country: data.country_name,
          countryCode: data.country,
          isp: data.org,
          city: data.city,
          region: data.region
        });
      } catch (error) {
        // Fallback with mock data
        setUserInfo({
          ip: "192.168.1.1",
          country: "Unknown",
          countryCode: "UN",
          isp: "Unknown ISP"
        });
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AuthGuard>
      <DashboardLayout locale={locale} onLocaleChange={setLocale}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.dashboardTitle}</h1>
            <p className="text-muted-foreground">
              {t.dashboardSubtitle}
            </p>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Activity className="w-3 h-3 mr-1" />
            {t.online}
          </Badge>
        </div>

        {/* User Info Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t.yourConnectionInfo}
            </CardTitle>
            <CardDescription>
              {t.connectionDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
              </div>
            ) : userInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t.yourIP}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono">{userInfo.ip}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(userInfo.ip)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t.country}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getFlagEmoji(userInfo.countryCode)}</span>
                    <span className="text-lg">{userInfo.country}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t.provider}</label>
                  <span className="text-lg">{userInfo.isp}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t.location}</label>
                  <span className="text-lg">
                    {userInfo.city && userInfo.region 
                      ? `${userInfo.city}, ${userInfo.region}`
                      : t.unknown
                    }
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.activeUsers}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                {t.totalUsers}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.inboundsCount}</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                {t.activeProtocols}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.totalTraffic}</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 GB</div>
              <p className="text-xs text-muted-foreground">
                {t.consumed}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.serverStatus}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t.excellent}</div>
              <p className="text-xs text-muted-foreground">
                {t.cloudflareWorkers}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t.quickActions}</CardTitle>
            <CardDescription>
              {t.quickActionsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Users className="h-6 w-6" />
                <span>{t.addNewUser}</span>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Wifi className="h-6 w-6" />
                <span>{t.createNewInbound}</span>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Activity className="h-6 w-6" />
                <span>{t.viewStats}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    </AuthGuard>
  );
}