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
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Download,
  Calendar,
  Zap,
  Users
} from "lucide-react";
import { Locale, defaultLocale, translations } from "@/lib/i18n";
import { AuthGuard } from "@/components/auth-guard";

interface User {
  id: string;
  username: string;
  email: string;
  protocol: "vless" | "vmess" | "trojan" | "shadowsocks";
  trafficLimit: number; // in GB
  trafficUsed: number; // in GB
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = translations[locale];
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    protocol: "vless" as User["protocol"],
    trafficLimit: 10,
    expiryDate: "",
    isActive: true
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockUsers: User[] = [
      {
        id: "1",
        username: "user1",
        email: "user1@example.com",
        protocol: "vless",
        trafficLimit: 100,
        trafficUsed: 25.5,
        expiryDate: "2024-12-31",
        isActive: true,
        createdAt: "2024-01-01"
      },
      {
        id: "2",
        username: "user2",
        email: "user2@example.com",
        protocol: "vmess",
        trafficLimit: 50,
        trafficUsed: 30.2,
        expiryDate: "2024-06-30",
        isActive: true,
        createdAt: "2024-01-15"
      }
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        trafficUsed: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      protocol: "vless",
      trafficLimit: 10,
      expiryDate: "",
      isActive: true
    });
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      protocol: user.protocol,
      trafficLimit: user.trafficLimit,
      expiryDate: user.expiryDate,
      isActive: user.isActive
    });
    setDialogOpen(true);
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
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

  const getTrafficPercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <AuthGuard>
      <DashboardLayout locale={locale} onLocaleChange={setLocale}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {locale === "fa" ? "مدیریت کاربران" : "User Management"}
              </h1>
              <p className="text-muted-foreground">
                {locale === "fa" 
                  ? "مدیریت کاربران و تنظیمات دسترسی آن‌ها"
                  : "Manage users and their access settings"
                }
              </p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  {locale === "fa" ? "افزودن کاربر" : "Add User"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser 
                      ? (locale === "fa" ? "ویرایش کاربر" : "Edit User")
                      : (locale === "fa" ? "افزودن کاربر جدید" : "Add New User")
                    }
                  </DialogTitle>
                  <DialogDescription>
                    {locale === "fa" 
                      ? "اطلاعات کاربر را وارد کنید"
                      : "Enter the user information"
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">
                        {locale === "fa" ? "نام کاربری" : "Username"}
                      </Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {locale === "fa" ? "ایمیل" : "Email"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="protocol">
                        {locale === "fa" ? "پروتکل" : "Protocol"}
                      </Label>
                      <Select 
                        value={formData.protocol} 
                        onValueChange={(value) => setFormData({...formData, protocol: value as User["protocol"]})}
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="trafficLimit">
                        {locale === "fa" ? "محدودیت ترافیک (GB)" : "Traffic Limit (GB)"}
                      </Label>
                      <Input
                        id="trafficLimit"
                        type="number"
                        value={formData.trafficLimit}
                        onChange={(e) => setFormData({...formData, trafficLimit: Number(e.target.value)})}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">
                      {locale === "fa" ? "تاریخ انقضا" : "Expiry Date"}
                    </Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    />
                    <Label htmlFor="isActive">
                      {locale === "fa" ? "فعال" : "Active"}
                    </Label>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">
                      {editingUser 
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "تعداد کاربران" : "Total Users"}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "کاربران ثبت شده" : "Registered users"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "کاربران فعال" : "Active Users"}
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "کاربران فعال" : "Currently active"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "ترافیک کل" : "Total Traffic"}
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.reduce((sum, user) => sum + user.trafficUsed, 0).toFixed(1)} GB
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "مصرف شده" : "Used traffic"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "fa" ? "لیست کاربران" : "Users List"}
              </CardTitle>
              <CardDescription>
                {locale === "fa" 
                  ? "نمایش تمام کاربران ثبت شده در سیستم"
                  : "Showing all registered users in the system"
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
                        {locale === "fa" ? "نام کاربری" : "Username"}
                      </TableHead>
                      <TableHead>
                        {locale === "fa" ? "پروتکل" : "Protocol"}
                      </TableHead>
                      <TableHead>
                        {locale === "fa" ? "ترافیک" : "Traffic"}
                      </TableHead>
                      <TableHead>
                        {locale === "fa" ? "انقضا" : "Expiry"}
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
                    {users.map((user) => (
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
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{user.trafficUsed.toFixed(1)} GB</span>
                              <span>{user.trafficLimit} GB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ 
                                  width: `${getTrafficPercentage(user.trafficUsed, user.trafficLimit)}%` 
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.expiryDate).toLocaleDateString(
                            locale === "fa" ? "fa-IR" : "en-US"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive 
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
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
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