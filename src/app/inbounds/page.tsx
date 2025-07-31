"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Settings,
  Wifi,
  Globe,
  Shield,
  Activity
} from "lucide-react";
import { Locale, defaultLocale, translations } from "@/lib/i18n";
import { AuthGuard } from "@/components/auth-guard";

interface Inbound {
  id: string;
  remark: string;
  protocol: "vless" | "vmess" | "trojan" | "shadowsocks";
  port: number;
  transport: "tcp" | "ws" | "grpc" | "kcp";
  tls: boolean;
  enable: boolean;
  settings: {
    clients: any[];
    fallbacks?: any[];
  };
  streamSettings: {
    network: string;
    security: string;
    tlsSettings?: any;
    tcpSettings?: any;
    wsSettings?: any;
    grpcSettings?: any;
  };
  createdAt: string;
  up: number; // upload traffic in bytes
  down: number; // download traffic in bytes
}

export default function InboundsPage() {
  const [inbounds, setInbounds] = useState<Inbound[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInbound, setEditingInbound] = useState<Inbound | null>(null);
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = translations[locale];
  
  const [formData, setFormData] = useState({
    remark: "",
    protocol: "vless" as Inbound["protocol"],
    port: 443,
    transport: "ws" as Inbound["transport"],
    tls: true,
    enable: true
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockInbounds: Inbound[] = [
      {
        id: "1",
        remark: "VLESS WebSocket",
        protocol: "vless",
        port: 443,
        transport: "ws",
        tls: true,
        enable: true,
        settings: {
          clients: [
            { id: "uuid1", email: "user1@example.com" }
          ]
        },
        streamSettings: {
          network: "ws",
          security: "tls",
          wsSettings: {
            path: "/vless"
          }
        },
        createdAt: "2024-01-01",
        up: 1024 * 1024 * 100, // 100 MB
        down: 1024 * 1024 * 200 // 200 MB
      },
      {
        id: "2",
        remark: "VMESS TCP",
        protocol: "vmess",
        port: 8080,
        transport: "tcp",
        tls: false,
        enable: true,
        settings: {
          clients: [
            { id: "uuid2", email: "user2@example.com" }
          ]
        },
        streamSettings: {
          network: "tcp",
          security: "none"
        },
        createdAt: "2024-01-15",
        up: 1024 * 1024 * 50, // 50 MB
        down: 1024 * 1024 * 150 // 150 MB
      }
    ];
    
    setInbounds(mockInbounds);
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInbound) {
      // Update inbound
      setInbounds(inbounds.map(inbound => 
        inbound.id === editingInbound.id 
          ? { ...inbound, ...formData }
          : inbound
      ));
    } else {
      // Add new inbound
      const newInbound: Inbound = {
        id: Date.now().toString(),
        ...formData,
        settings: {
          clients: []
        },
        streamSettings: {
          network: formData.transport,
          security: formData.tls ? "tls" : "none"
        },
        createdAt: new Date().toISOString().split('T')[0],
        up: 0,
        down: 0
      };
      setInbounds([...inbounds, newInbound]);
    }
    
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      remark: "",
      protocol: "vless",
      port: 443,
      transport: "ws",
      tls: true,
      enable: true
    });
    setEditingInbound(null);
  };

  const handleEdit = (inbound: Inbound) => {
    setEditingInbound(inbound);
    setFormData({
      remark: inbound.remark,
      protocol: inbound.protocol,
      port: inbound.port,
      transport: inbound.transport,
      tls: inbound.tls,
      enable: inbound.enable
    });
    setDialogOpen(true);
  };

  const handleDelete = (inboundId: string) => {
    setInbounds(inbounds.filter(inbound => inbound.id !== inboundId));
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

  const getTransportBadgeColor = (transport: string) => {
    switch (transport) {
      case "tcp": return "bg-red-100 text-red-800";
      case "ws": return "bg-yellow-100 text-yellow-800";
      case "grpc": return "bg-indigo-100 text-indigo-800";
      case "kcp": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AuthGuard>
      <DashboardLayout locale={locale} onLocaleChange={setLocale}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {locale === "fa" ? "مدیریت اینباندها" : "Inbound Management"}
              </h1>
              <p className="text-muted-foreground">
                {locale === "fa" 
                  ? "مدیریت اینباندها و تنظیمات پروتکل‌ها"
                  : "Manage inbounds and protocol settings"
                }
              </p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  {locale === "fa" ? "ایجاد اینباند" : "Create Inbound"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingInbound 
                      ? (locale === "fa" ? "ویرایش اینباند" : "Edit Inbound")
                      : (locale === "fa" ? "ایجاد اینباند جدید" : "Create New Inbound")
                    }
                  </DialogTitle>
                  <DialogDescription>
                    {locale === "fa" 
                      ? "تنظیمات اینباند را پیکربندی کنید"
                      : "Configure the inbound settings"
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="remark">
                        {locale === "fa" ? "نام (Remark)" : "Remark"}
                      </Label>
                      <Input
                        id="remark"
                        value={formData.remark}
                        onChange={(e) => setFormData({...formData, remark: e.target.value})}
                        placeholder={locale === "fa" ? "نام اینباند" : "Inbound name"}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="protocol">
                        {locale === "fa" ? "پروتکل" : "Protocol"}
                      </Label>
                      <Select 
                        value={formData.protocol} 
                        onValueChange={(value) => setFormData({...formData, protocol: value as Inbound["protocol"]})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vless">VLESS</SelectItem>
                          <SelectItem value="vmess">VMESS</SelectItem>
                          <SelectItem value="trojan">Trojan</SelectItem>
                          <SelectItem value="shadowsocks">Shadowsocks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="port">
                        {locale === "fa" ? "پورت" : "Port"}
                      </Label>
                      <Input
                        id="port"
                        type="number"
                        value={formData.port}
                        onChange={(e) => setFormData({...formData, port: Number(e.target.value)})}
                        min="1"
                        max="65535"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="transport">
                        {locale === "fa" ? "انتقال (Transport)" : "Transport"}
                      </Label>
                      <Select 
                        value={formData.transport} 
                        onValueChange={(value) => setFormData({...formData, transport: value as Inbound["transport"]})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tcp">TCP</SelectItem>
                          <SelectItem value="ws">WebSocket</SelectItem>
                          <SelectItem value="grpc">gRPC</SelectItem>
                          <SelectItem value="kcp">mKCP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="tls"
                        checked={formData.tls}
                        onCheckedChange={(checked) => setFormData({...formData, tls: checked})}
                      />
                      <Label htmlFor="tls">
                        {locale === "fa" ? "TLS" : "TLS"}
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enable"
                        checked={formData.enable}
                        onCheckedChange={(checked) => setFormData({...formData, enable: checked})}
                      />
                      <Label htmlFor="enable">
                        {locale === "fa" ? "فعال" : "Enable"}
                      </Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">
                      {editingInbound 
                        ? (locale === "fa" ? "به‌روزرسانی" : "Update")
                        : (locale === "fa" ? "ایجاد" : "Create")
                      }
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "تعداد اینباندها" : "Total Inbounds"}
                </CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inbounds.length}</div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "اینباندهای تنظیم شده" : "Configured inbounds"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "اینباندهای فعال" : "Active Inbounds"}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {inbounds.filter(i => i.enable).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "در حال اجرا" : "Currently running"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "آپلود کل" : "Total Upload"}
                </CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBytes(inbounds.reduce((sum, inbound) => sum + inbound.up, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "ترافیک ارسال شده" : "Upload traffic"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "دانلود کل" : "Total Download"}
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBytes(inbounds.reduce((sum, inbound) => sum + inbound.down, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "ترافیک دریافت شده" : "Download traffic"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Inbounds Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "fa" ? "لیست اینباندها" : "Inbounds List"}
              </CardTitle>
              <CardDescription>
                {locale === "fa" 
                  ? "نمایش تمام اینباندهای تنظیم شده"
                  : "Showing all configured inbounds"
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
                        {locale === "fa" ? "انتقال" : "Transport"}
                      </TableHead>
                      <TableHead>
                        {locale === "fa" ? "ترافیک" : "Traffic"}
                      </TableHead>
                      <TableHead>
                        {locale === "fa" ? "وضعیت" : "Status"}
                      </TableHead>
                      <TableHead className="text-left">
                        {locale === "fa" ? "عملیات" : "Actions"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inbounds.map((inbound) => (
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
                          <Badge className={getTransportBadgeColor(inbound.transport)}>
                            {inbound.transport.toUpperCase()}
                          </Badge>
                          {inbound.tls && (
                            <Badge className="ml-1 bg-green-100 text-green-800">
                              TLS
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span>↑ {formatBytes(inbound.up)}</span>
                              <span>↓ {formatBytes(inbound.down)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={inbound.enable ? "default" : "secondary"}>
                            {inbound.enable 
                              ? (locale === "fa" ? "فعال" : "Active")
                              : (locale === "fa" ? "غیرفعال" : "Inactive")
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(inbound)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(inbound.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}