# Passage Panel for Cloudflare Workers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=flat&logo=Cloudflare&logoColor=white)](https://workers.cloudflare.com/)

یک پنل مدیریت Passage مدرن و قدرتمند برای Cloudflare Workers با پشتیبانی از پروتکل‌های مختلف VPN/Proxy.

## ✨ ویژگی‌ها

### 🎨 رابط کاربری
- طراحی مدرن شبیه به Passage با رنگ #C7A46C
- پشتیبانی کامل از زبان فارسی و انگلیسی
- حالت روشن و تاریک با قابلیت تغییر خودکار
- ریسپانسیو و سازگار با موبایل

### 🔐 امنیت و احراز هویت
- سیستم ورود امن با جلسات محافظت شده
- قابلیت خروج از سیستم
- محافظت از مسیرهای API
- مدیریت دسترسی کاربران

### 👥 مدیریت کاربران
- ایجاد، ویرایش و حذف کاربران
- تنظیم محدودیت حجم ترافیک برای هر کاربر
- تنظیم تاریخ انقضا برای کاربران
- فعال/غیرفعال کردن کاربران
- نمایش آمار مصرف ترافیک

### 🌐 پشتیبانی از پروتکل‌ها
- **VLESS** با انتقال TCP, WebSocket, gRPC
- **VMESS** با انتقال TCP, WebSocket
- **Trojan** با انتقال TCP, WebSocket
- **Shadowsocks** با انتقال TCP
- پشتیبانی از TLS و SSL

### 📊 مانیتورینگ و آمار
- نمایش ترافیک مصرفی هر کاربر
- نمایش تعداد اتصالات فعال
- لاگ‌های اتصالات و خطاها
- نمودارهای مصرفی در بازه‌های زمانی مختلف
- آمار کلی سیستم

### 🔗 قابلیت‌های کاربردی
- تولید لینک سابسکریپشن برای کلاینت‌ها
- تولید کد QR برای کانفیگ‌ها
- کپی کردن کانفیگ‌ها با یک کلیک
- تست اتصال کانفیگ‌ها
- پشتیبان‌گیری از تنظیمات

### 🌍 اطلاعات کاربر
- نمایش آی‌پی کاربر با کشورش
- نمایش پرچم کشور به صورت خودکار
- نمایش ISP مراجعه کننده
- تشخیص موقعیت جغرافیایی

## 🚀 شروع سریع

### پیش‌نیازها
- Node.js 18 یا بالاتر
- حساب Cloudflare با دامنه فعال
- دانش پایه از VPN و پروتکل‌ها

### نصب و راه‌اندازی

1. **کلون کردن ریپازیتوری**
   ```bash
   git clone https://github.com/your-username/passage-panel.git
   cd passage-panel
   ```

2. **نصب وابستگی‌ها**
   ```bash
   npm install
   ```

3. **تنظیمات متغیرهای محیطی**
   ```bash
   cp .env.example .env.local
   ```
   فایل `.env.local` را ویرایش کرده و مقادیر زیر را تنظیم کنید:
   ```env
   NEXT_PUBLIC_API_URL=https://your-worker-domain.workers.dev
   ```

4. **اجرای پروژه در حالت توسعه**
   ```bash
   npm run dev
   ```

5. **بیلد برای تولید**
   ```bash
   npm run build
   npm start
   ```

### راه‌اندازی Cloudflare Worker

1. **ایجاد Worker در Cloudflare**
   - وارد حساب Cloudflare خود شوید
   - به بخش Workers & Pages بروید
   - Create Worker را انتخاب کنید
   - کد `worker.js` را کپی کنید

2. **دیپلوی Worker**
   ```bash
   npm install -g wrangler
   wrangler deploy
   ```

3. **تنظیم دامنه**
   - در تب Triggers، Custom Domain را اضافه کنید
   - یا از روت استفاده کنید: `yourdomain.com/api/*`

## 📱 استفاده از پنل

### ورود به سیستم
- آدرس پنل: `https://your-domain.com`
- نام کاربری پیش‌فرض: `admin`
- رمز عبور پیش‌فرض: `admin`

### ایجاد کاربر جدید
1. به بخش **مدیریت کاربران** بروید
2. روی **افزودن کاربر** کلیک کنید
3. اطلاعات کاربر را وارد کنید:
   - نام کاربری و ایمیل
   - پروتکل مورد نظر
   - محدودیت ترافیک (GB)
   - تاریخ انقضا
4. کاربر را ایجاد کنید

### ایجاد اینباند جدید
1. به بخش **اینباندها** بروید
2. روی **ایجاد اینباند** کلیک کنید
3. تنظیمات را پیکربندی کنید:
   - نام و پروتکل
   - پورت و نوع انتقال
   - تنظیمات TLS
4. اینباند را ذخیره کنید

### تولید کانفیگ
- برای هر کاربر به صورت خودکار کانفیگ تولید می‌شود
- از QR Code برای اسکن در کلاینت موبایل استفاده کنید
- یا کانفیگ را به صورت متنی کپی کنید

### سابسکریپشن
- هر کاربر یک لینک سابسکریپشن منحصر به فرد دارد
- این لینک را در کلاینت‌های زیر وارد کنید:
  - v2rayN, v2rayNG
  - Clash, ClashX
  - Shadowrocket
  - Quantumult X

## 🔧 تنظیمات پیشرفته

### تغییر اعتبارنامه‌ها
در فایل `worker.js`:
```javascript
this.settings = {
  adminUsername: "your_username",
  adminPassword: "your_password",
  // ...
};
```

### محدودیت‌های سیستم
```javascript
this.settings = {
  maxUsers: 100,
  maxInbounds: 50,
  sessionTimeout: 3600000,
  // ...
};
```

### پیکربندی پروتکل‌ها
هر پروتکل تنظیمات مخصوص به خود را دارد:
- **VLESS**: UUID، آدرس سرور، پورت، مسیر WebSocket
- **VMESS**: UUID، آدرس سرور، پورت، تنظیمات امنیتی
- **Trojan**: رمز عبور، آدرس سرور، پورت
- **Shadowsocks**: رمز عبور، روش رمزنگاری

## 🛡️ امنیت

### بهترین practices
1. رمز عبور پیش‌فرض را تغییر دهید
2. همیشه از HTTPS استفاده کنید
3. دسترسی به پنل را با IP محدود کنید
4. به‌روزرسانی‌های منظم انجام دهید
5. از Cloudflare WAF برای محافظت استفاده کنید

### فایروال Cloudflare
```javascript
// مثال قوانین WAF
(http.request.uri contains "/api" and ip.src in $bad_ips)
```

## 📊 مانیتورینگ

### آمار زنده
- ترافیک آپلود/دانلود
- تعداد اتصالات فعال
- وضعیت کاربران و اینباندها
- خطاها و هشدارها

### لاگ‌ها
- لاگ‌های دسترسی به پنل
- لاگ‌های اتصالات VPN
- لاگ‌های خطا و سیستم
- لاگ‌های ترافیک

## 🤝 مشارکت

ما از هرگونه مشارکت استقبال می‌کنیم! لطفاً برای مشارکت:

1. ریپازیتوری را فورک کنید
2. یک شاخه برای ویژگی خود ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات خود را کامیت کنید (`git commit -m 'Add amazing feature'`)
4. شاخه را پوش کنید (`git push origin feature/amazing-feature`)
5. یک Pull Request ایجاد کنید

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است. برای اطلاعات بیشتر به فایل [LICENSE](LICENSE) مراجعه کنید.

## 🙏 تشکر

- تیم [Passage](https://github.com/vaxilu/x-ui) برای الهام بخشی
- [Cloudflare](https://cloudflare.com) برای پلتفرم عالی Workers
- تیم [Next.js](https://nextjs.org) برای فریمورک فوق‌العاده
- جامعه متن‌بخ برای کامپوننت‌های استفاده شده

## 📞 پشتیبانی

- **سوالات**: برای پرسش و پاسخ به Discussions استفاده کنید
- **باگ‌ها**: باگ‌ها را در Issues گزارش دهید
- **ویژگی‌ها**: درخواست‌های ویژگی جدید را در Issues ایجاد کنید
- **مستندات**: برای راهنمای کامل به [SETUP.md](SETUP.md) مراجعه کنید

---

⭐ اگر این پروژه برای شما مفید بود، به آن ستاره دهید!