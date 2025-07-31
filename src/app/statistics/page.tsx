"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Globe,
  Zap,
  Calendar,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";
import { Locale, defaultLocale, translations } from "@/lib/i18n";
import { AuthGuard } from "@/components/auth-guard";

interface Stats {
  totalUp: number;
  totalDown: number;
  totalConnections: number;
  usersCount: number;
  inboundsCount: number;
  activeUsers: number;
  activeInbounds: number;
}

interface UserStats {
  id: string;
  username: string;
  protocol: string;
  up: number;
  down: number;
  connections: number;
  lastSeen: string;
}

interface InboundStats {
  id: string;
  remark: string;
  protocol: string;
  port: number;
  up: number;
  down: number;
  connections: number;
  status: string;
}

interface TrafficData {
  timestamp: string;
  upload: number;
  download: number;
  connections: number;
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [inboundStats, setInboundStats] = useState<InboundStats[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("24h");
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = translations[locale];

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockStats: Stats = {
        totalUp: 1024 * 1024 * 1024 * 50, // 50 GB
        totalDown: 1024 * 1024 * 1024 * 150, // 150 GB
        totalConnections: 1250,
        usersCount: 25,
        inboundsCount: 8,
        activeUsers: 20,
        activeInbounds: 6
      };

      const mockUserStats: UserStats[] = [
        {
          id: "1",
          username: "user1",
          protocol: "vless",
          up: 1024 * 1024 * 1024 * 5,
          down: 1024 * 1024 * 1024 * 15,
          connections: 45,
          lastSeen: "2024-01-15T10:30:00Z"
        },
        {
          id: "2",
          username: "user2",
          protocol: "vmess",
          up: 1024 * 1024 * 1024 * 3,
          down: 1024 * 1024 * 1024 * 8,
          connections: 32,
          lastSeen: "2024-01-15T09:45:00Z"
        },
        {
          id: "3",
          username: "user3",
          protocol: "trojan",
          up: 1024 * 1024 * 1024 * 8,
          down: 1024 * 1024 * 1024 * 25,
          connections: 67,
          lastSeen: "2024-01-15T11:15:00Z"
        }
      ];

      const mockInboundStats: InboundStats[] = [
        {
          id: "1",
          remark: "VLESS WebSocket",
          protocol: "vless",
          port: 443,
          up: 1024 * 1024 * 1024 * 20,
          down: 1024 * 1024 * 1024 * 60,
          connections: 450,
          status: "active"
        },
        {
          id: "2",
          remark: "VMESS TCP",
          protocol: "vmess",
          port: 8080,
          up: 1024 * 1024 * 1024 * 15,
          down: 1024 * 1024 * 1024 * 40,
          connections: 320,
          status: "active"
        },
        {
          id: "3",
          remark: "Trojan gRPC",
          protocol: "trojan",
          port: 443,
          up: 1024 * 1024 * 1024 * 10,
          down: 1024 * 1024 * 1024 * 35,
          connections: 280,
          status: "active"
        }
      ];

      // Generate traffic data based on time range
      const mockTrafficData: TrafficData[] = [];
      const now = new Date();
      const intervals = timeRange === "24h" ? 24 : timeRange === "7d" ? 7 : 30;
      const intervalMs = timeRange === "24h" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

      for (let i = intervals - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * intervalMs);
        mockTrafficData.push({
          timestamp: timestamp.toISOString(),
          upload: Math.floor(Math.random() * 1024 * 1024 * 100),
          download: Math.floor(Math.random() * 1024 * 1024 * 300),
          connections: Math.floor(Math.random() * 100)
        });
      }

      setStats(mockStats);
      setUserStats(mockUserStats);
      setInboundStats(mockInboundStats);
      setTrafficData(mockTrafficData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(num);
  };

  const getProtocolBadgeColor = (protocol: string) => {
    switch (protocol) {
      case "vless": return "bg-blue-100 text-blue-800";
      case "vmess": return "bg-green-100 text-green-800";
      case "trojan": return "bg-purple-100 text-purple-800";
      case "shadowsocks": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "error": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout locale={locale} onLocaleChange={setLocale}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {locale === "fa" ? "آمار و گزارشات" : "Statistics & Reports"}
              </h1>
              <p className="text-muted-foreground">
                {locale === "fa" 
                  ? "نمایش آمار دقیق از عملکرد سیستم و ترافیک"
                  : "Detailed system performance and traffic statistics"
                }
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">
                    {locale === "fa" ? "۲۴ ساعت" : "24 Hours"}
                  </SelectItem>
                  <SelectItem value="7d">
                    {locale === "fa" ? "۷ روز" : "7 Days"}
                  </SelectItem>
                  <SelectItem value="30d">
                    {locale === "fa" ? "۳۰ روز" : "30 Days"}
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={loadStats} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {locale === "fa" ? "به‌روزرسانی" : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {locale === "fa" ? "ترافیک کل" : "Total Traffic"}
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatBytes(stats.totalUp + stats.totalDown)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ↑ {formatBytes(stats.totalUp)} / ↓ {formatBytes(stats.totalDown)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {locale === "fa" ? "اتصالات فعال" : "Active Connections"}
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(stats.totalConnections)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {locale === "fa" ? "همزمان" : "Concurrent"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {locale === "fa" ? "کاربران فعال" : "Active Users"}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(stats.activeUsers)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {locale === "fa" ? "از مجموع" : "of"} {formatNumber(stats.usersCount)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {locale === "fa" ? "اینباندهای فعال" : "Active Inbounds"}
                  </CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(stats.activeInbounds)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {locale === "fa" ? "از مجموع" : "of"} {formatNumber(stats.inboundsCount)}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Detailed Statistics */}
          <Tabs defaultValue="traffic" className="space-y-4">
            <TabsList>
              <TabsTrigger value="traffic" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                {locale === "fa" ? "ترافیک" : "Traffic"}
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                {locale === "fa" ? "کاربران" : "Users"}
              </TabsTrigger>
              <TabsTrigger value="inbounds" className="gap-2">
                <Globe className="h-4 w-4" />
                {locale === "fa" ? "اینباندها" : "Inbounds"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="traffic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === "fa" ? "نمودار ترافیک" : "Traffic Chart"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "fa" 
                      ? "نمایش ترافیک در بازه زمانی انتخاب شده"
                      : "Traffic visualization for selected time range"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Simple traffic chart visualization */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Upload className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium">
                                {locale === "fa" ? "آپلود" : "Upload"}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {stats ? formatBytes(stats.totalUp) : '0'}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Download className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">
                                {locale === "fa" ? "دانلود" : "Download"}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              {stats ? formatBytes(stats.totalDown) : '0'}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart3 className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium">
                                {locale === "fa" ? "مجموع" : "Total"}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                              {stats ? formatBytes(stats.totalUp + stats.totalDown) : '0'}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Traffic timeline */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          {locale === "fa" ? "آمار زمانی" : "Timeline"}
                        </h3>
                        <div className="space-y-1">
                          {trafficData.slice(-5).map((data, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>
                                {new Date(data.timestamp).toLocaleString(
                                  locale === "fa" ? "fa-IR" : "en-US"
                                )}
                              </span>
                              <div className="flex items-center gap-4">
                                <span className="text-blue-600">
                                  ↑ {formatBytes(data.upload)}
                                </span>
                                <span className="text-green-600">
                                  ↓ {formatBytes(data.download)}
                                </span>
                                <span className="text-purple-600">
                                  {data.connections} {locale === "fa" ? "اتصال" : "conns"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === "fa" ? "آمار کاربران" : "User Statistics"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "fa" 
                      ? "آمار مصرف ترافیک و اتصالات کاربران"
                      : "User traffic and connection statistics"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {locale === "fa" ? "کاربر" : "User"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "پروتکل" : "Protocol"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "آپلود" : "Upload"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "دانلود" : "Download"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "اتصالات" : "Connections"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "آخرین فعالیت" : "Last Seen"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userStats.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.username}
                            </TableCell>
                            <TableCell>
                              <Badge className={getProtocolBadgeColor(user.protocol)}>
                                {user.protocol.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-blue-600">
                                {formatBytes(user.up)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-green-600">
                                {formatBytes(user.down)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {formatNumber(user.connections)}
                            </TableCell>
                            <TableCell>
                              {new Date(user.lastSeen).toLocaleString(
                                locale === "fa" ? "fa-IR" : "en-US"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inbounds" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === "fa" ? "آمار اینباندها" : "Inbound Statistics"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "fa" 
                      ? "آمار ترافیک و عملکرد اینباندها"
                      : "Inbound traffic and performance statistics"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {locale === "fa" ? "نام" : "Remark"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "پروتکل" : "Protocol"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "پورت" : "Port"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "آپلود" : "Upload"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "دانلود" : "Download"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "اتصالات" : "Connections"}
                          </TableHead>
                          <TableHead>
                            {locale === "fa" ? "وضعیت" : "Status"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inboundStats.map((inbound) => (
                          <TableRow key={inbound.id}>
                            <TableCell className="font-medium">
                              {inbound.remark}
                            </TableCell>
                            <TableCell>
                              <Badge className={getProtocolBadgeColor(inbound.protocol)}>
                                {inbound.protocol.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {inbound.port}
                            </TableCell>
                            <TableCell>
                              <span className="text-blue-600">
                                {formatBytes(inbound.up)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-green-600">
                                {formatBytes(inbound.down)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {formatNumber(inbound.connections)}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(inbound.status)}>
                                {inbound.status === "active" 
                                  ? (locale === "fa" ? "فعال" : "Active")
                                  : (locale === "fa" ? "غیرفعال" : "Inactive")
                                }
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}