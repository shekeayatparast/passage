"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRCodeComponent } from "@/components/qr-code";
import { 
  Copy, 
  Download, 
  QrCode, 
  Link, 
  Smartphone,
  Monitor,
  Globe
} from "lucide-react";
import { Locale, translations } from "@/lib/i18n";

interface Config {
  id: string;
  type: "vless" | "vmess" | "trojan" | "shadowsocks";
  remark: string;
  server: string;
  port: number;
  uuid: string;
  config: string;
  subscriptionUrl?: string;
}

interface ConfigDisplayProps {
  configs: Config[];
  locale: Locale;
}

export function ConfigDisplay({ configs, locale }: ConfigDisplayProps) {
  const [selectedConfig, setSelectedConfig] = useState<Config | null>(
    configs.length > 0 ? configs[0] : null
  );
  const t = translations[locale];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const downloadConfig = (config: Config) => {
    const blob = new Blob([config.config], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${config.remark.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getProtocolColor = (type: string) => {
    switch (type) {
      case "vless": return "bg-blue-100 text-blue-800";
      case "vmess": return "bg-green-100 text-green-800";
      case "trojan": return "bg-purple-100 text-purple-800";
      case "shadowsocks": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (configs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Globe className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {locale === "fa" ? "هیچ کانفیگی موجود نیست" : "No configurations available"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            {locale === "fa" ? "کانفیگ‌های موجود" : "Available Configurations"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configs.map((config) => (
              <Card 
                key={config.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedConfig?.id === config.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedConfig(config)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{config.remark}</h3>
                      <Badge className={getProtocolColor(config.type)}>
                        {config.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Monitor className="h-3 w-3" />
                        <span>{config.server}:{config.port}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        <span className="truncate">{config.uuid.substring(0, 8)}...</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(config.config);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadConfig(config);
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Config Details */}
      {selectedConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              {selectedConfig.remark}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="qr" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="qr" className="gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="config" className="gap-2">
                  <Link className="h-4 w-4" />
                  Config
                </TabsTrigger>
                <TabsTrigger value="subscription" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Subscription
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="qr" className="mt-6">
                <div className="flex justify-center">
                  <QRCodeComponent
                    value={selectedConfig.config}
                    size={256}
                    title={selectedConfig.remark}
                    onCopy={() => copyToClipboard(selectedConfig.config)}
                    onDownload={() => downloadConfig(selectedConfig)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="config" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getProtocolColor(selectedConfig.type)}>
                        {selectedConfig.type.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedConfig.server}:{selectedConfig.port}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedConfig.config)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {locale === "fa" ? "کپی" : "Copy"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadConfig(selectedConfig)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {locale === "fa" ? "دانلود" : "Download"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <code className="text-sm break-all whitespace-pre-wrap">
                      {selectedConfig.config}
                    </code>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="subscription" className="mt-6">
                <div className="space-y-4">
                  {selectedConfig.subscriptionUrl ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            {locale === "fa" ? "لینک سابسکریپشن" : "Subscription Link"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {locale === "fa" 
                              ? "این لینک را در کلاینت VPN خود وارد کنید"
                              : "Enter this link in your VPN client"
                            }
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(selectedConfig.subscriptionUrl!)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {locale === "fa" ? "کپی لینک" : "Copy Link"}
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-muted rounded-lg">
                        <code className="text-sm break-all">
                          {selectedConfig.subscriptionUrl}
                        </code>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">
                              {locale === "fa" ? "کلاینت‌های پشتیبانی شده" : "Supported Clients"}
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• v2rayN</li>
                              <li>• v2rayNG</li>
                              <li>• Clash</li>
                              <li>• Shadowrocket</li>
                              <li>• Quantumult X</li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">
                              {locale === "fa" ? "مزایای سابسکریپشن" : "Subscription Benefits"}
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• {locale === "fa" ? "به‌روزرسانی خودکار کانفیگ‌ها" : "Auto-update configs"}</li>
                              <li>• {locale === "fa" ? "مدیریت متمرکز سرورها" : "Centralized server management"}</li>
                              <li>• {locale === "fa" ? "تعویض خودکار سرور" : "Automatic server switching"}</li>
                              <li>• {locale === "fa" ? "بارگذاری تعادل" : "Load balancing"}</li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {locale === "fa" 
                          ? "سابسکریپشن برای این کانفیگ موجود نیست"
                          : "Subscription not available for this config"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}