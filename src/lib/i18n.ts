export type Locale = "fa" | "en";
export type TranslationKey = keyof typeof translations.fa;

export const defaultLocale: Locale = "fa";

export const translations = {
  fa: {
    xuiPanel: "Passage پنل",
    dashboard: "داشبورد",
    users: "مدیریت کاربران",
    inbounds: "اینباندها",
    statistics: "آمار و گزارشات",
    settings: "تنظیمات",
    about: "درباره ما",
    poweredBy: "قدرت گرفته از Cloudflare Workers",
    online: "آنلاین",
    
    // Dashboard
    dashboardTitle: "داشبورد",
    dashboardSubtitle: "مدیریت پنل Passage شما بر روی Cloudflare Workers",
    
    // User Info
    yourConnectionInfo: "اطلاعات اتصال شما",
    connectionDescription: "اطلاعات مربوط به اتصال فعلی شما به اینترنت",
    yourIP: "آی‌پی شما",
    country: "کشور",
    provider: "سرویس دهنده",
    location: "موقعیت",
    unknown: "نامشخص",
    
    // Stats
    activeUsers: "کاربران فعال",
    totalUsers: "مجموع کاربران",
    inboundsCount: "اینباندها",
    activeProtocols: "پروتکل‌های فعال",
    totalTraffic: "ترافیک کل",
    consumed: "مصرف شده",
    serverStatus: "وضعیت سرور",
    excellent: "عالی",
    cloudflareWorkers: "Cloudflare Workers",
    
    // Quick Actions
    quickActions: "اقدامات سریع",
    quickActionsDescription: "دسترسی سریع به امکانات پرکاربرد",
    addNewUser: "افزودن کاربر جدید",
    createNewInbound: "ایجاد اینباند جدید",
    viewStats: "مشاهده آمار",
    
    // Common
    copy: "کپی",
    language: "زبان",
    theme: "تم"
  },
  en: {
    xuiPanel: "Passage Panel",
    dashboard: "Dashboard",
    users: "User Management",
    inbounds: "Inbounds",
    statistics: "Statistics",
    settings: "Settings",
    about: "About Us",
    poweredBy: "Powered by Cloudflare Workers",
    online: "Online",
    
    // Dashboard
    dashboardTitle: "Dashboard",
    dashboardSubtitle: "Manage your Passage panel on Cloudflare Workers",
    
    // User Info
    yourConnectionInfo: "Your Connection Info",
    connectionDescription: "Information about your current internet connection",
    yourIP: "Your IP",
    country: "Country",
    provider: "ISP",
    location: "Location",
    unknown: "Unknown",
    
    // Stats
    activeUsers: "Active Users",
    totalUsers: "Total Users",
    inboundsCount: "Inbounds",
    activeProtocols: "Active Protocols",
    totalTraffic: "Total Traffic",
    consumed: "Used",
    serverStatus: "Server Status",
    excellent: "Excellent",
    cloudflareWorkers: "Cloudflare Workers",
    
    // Quick Actions
    quickActions: "Quick Actions",
    quickActionsDescription: "Quick access to frequently used features",
    addNewUser: "Add New User",
    createNewInbound: "Create New Inbound",
    viewStats: "View Statistics",
    
    // Common
    copy: "Copy",
    language: "Language",
    theme: "Theme"
  }
} as const;