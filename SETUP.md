# Passage Panel - Complete Setup Guide

## 📋 سیستم مورد نیاز

- حساب Cloudflare با دسترسی به Workers
- Node.js 18+ (برای توسعه محلی)
- Wrangler CLI (برای مستقرسازی Worker)
- حساب GitHub (برای مستقرسازی Frontend)

## 🚀 مراحل راه‌اندازی

### مرحله 1: نصب و پیکربندی Cloudflare Workers

#### 1.1 نصب Wrangler CLI
```bash
npm install -g wrangler
```

#### 1.2 ورود به حساب Cloudflare
```bash
wrangler login
```

#### 1.3 ایجاد پروژه Worker
```bash
wrangler init passage-worker
cd passage-worker
```

#### 1.4 کپی فایل‌های Worker
فایل‌های زیر را به پروژه خود کپی کنید:
- `worker-complete.js` → `worker.js`
- `wrangler.toml`

#### 1.5 ایجاد KV Namespaces
```bash
# ایجاد namespace برای کاربران
wrangler kv:namespace create "PASSAGE_USERS"
wrangler kv:namespace create "PASSAGE_USERS" --preview

# ایجاد namespace برای احراز هویت
wrangler kv:namespace create "PASSAGE_AUTH"
wrangler kv:namespace create "PASSAGE_AUTH" --preview

# ایجاد namespace برای اینباند‌ها
wrangler kv:namespace create "PASSAGE_INBOUNDS"
wrangler kv:namespace create "PASSAGE_INBOUNDS" --preview

# ایجاد namespace برای آمار
wrangler kv:namespace create "PASSAGE_STATS"
wrangler kv:namespace create "PASSAGE_STATS" --preview

# ایجاد namespace برای لاگ‌ها
wrangler kv:namespace create "PASSAGE_LOGS"
wrangler kv:namespace create "PASSAGE_LOGS" --preview

# ایجاد namespace برای بکاپ‌ها
wrangler kv:namespace create "PASSAGE_BACKUPS"
wrangler kv:namespace create "PASSAGE_BACKUPS" --preview
```

#### 1.6 به‌روزرسانی wrangler.toml
بعد از ایجاد KV namespaces، شناسه‌ها را در فایل `wrangler.toml` جایگزین کنید:

```toml
[[kv_namespaces]]
binding = "PASSAGE_USERS"
id = "YOUR_ACTUAL_USERS_NAMESPACE_ID"

[[kv_namespaces]]
binding = "PASSAGE_AUTH"
id = "YOUR_ACTUAL_AUTH_NAMESPACE_ID"

# و به همین ترتیب برای بقیه namespaceها...
```

#### 1.7 مستقرسازی Worker
```bash
wrangler deploy
```

پس از مستقرسازی، URL Worker خود را یادداشت کنید (مثلاً: `https://passage-worker.your-subdomain.workers.dev`)

### مرحله 2: پیکربندی Frontend

#### 2.1 کلون کردن ریپازیتوری
```bash
git clone https://github.com/your-username/passage-frontend.git
cd passage-frontend
```

#### 2.2 نصب وابستگی‌ها
```bash
npm install
```

#### 2.3 تنظیم متغیرهای محیطی
فایل `.env.local` را ایجاد کنید:

```env
NEXT_PUBLIC_API_URL=https://your-worker.your-subdomain.workers.dev
NEXT_PUBLIC_APP_NAME=Passage
NEXT_PUBLIC_VERSION=1.0.0
```

#### 2.4 ساخت پروژه
```bash
npm run build
npm run export
```

### مرحله 3: مستقرسازی Frontend

#### گزینه 1: GitHub Pages
```bash
# نصب gh-pages
npm install -g gh-pages

# مستقرسازی روی GitHub Pages
gh-pages -d out
```

#### گزینه 2: Vercel
```bash
# نصب Vercel CLI
npm i -g vercel

# مستقرسازی
vercel
```

#### گزینه 3: Netlify
1. ریپازیتوری را به Netlify متصل کنید
2. دایرکتوری `out` را به عنوان پوشه publish تنظیم کنید

### مرحله 4: راه‌اندازی اولیه

#### 4.1 دسترسی به پنل
به آدرس frontend خود بروید (مثلاً: `https://your-username.github.io/passage-frontend`)

#### 4.2 ورود اولیه
1. **API URL**: آدرس Worker خود را وارد کنید
2. **Username**: نام کاربری دلخواه (مثلاً: `admin`)
3. **Password**: رمز عبور دلخواه

#### 4.3 اولین کاربر
سیستم به طور خودکار اولین کاربر را به عنوان ادمین ایجاد می‌کند.

## 🔧 پیکربندی پیشرفته

### تنظیم دامنه سفارشی

#### 1. Cloudflare Worker
```bash
# افزودن دامنه سفارشی به Worker
wrangler domains add your-domain.com
```

#### 2. Frontend
در تنظیمات هاستینگ خود، دامنه سفارشی را پیکربندی کنید.

### تنظیمات امنیتی

#### 1. محدود کردن دسترسی با IP
در فایل `worker.js` می‌توانید لیست IPهای مجاز را اضافه کنید:

```javascript
const ALLOWED_IPS = ['your_ip', 'trusted_ip'];

async function checkIP(request) {
  const ip = request.headers.get('CF-Connecting-IP');
  return ALLOWED_IPS.includes(ip);
}
```

#### 2. تنظیم rate limiting
```javascript
const RATE_LIMIT = {
  requests: 100,
  window: 60000 // 1 minute
};
```

### بکاپ و بازیابی

#### ایجاد بکاپ
```bash
# از طریق API
curl -X POST https://your-worker.workers.dev/api/system/backup \
  -H "Authorization: Bearer your_token"
```

#### بازیابی بکاپ
```bash
# از طریق Wrangler CLI
wrangler kv:get --namespace-id your-backups-namespace-id backup_timestamp
```

## 🚨 عیب‌یابی

### خطاهای رایج

#### 1. خطای CORS
**مشکل**: Frontend نمی‌تواند به API متصل شود
**حل**: مطمئن شوید که headers CORS در Worker به درستی تنظیم شده‌اند

#### 2. خطای احراز هویت
**مشکل**: توکن منقضی شده یا نامعتبر است
**حل**: مجدداً وارد سیستم شوید

#### 3. خطای KV Namespace
**مشکل**: شناسه KV namespace اشتباه است
**حل**: شناسه‌های صحیح را در `wrangler.toml` وارد کنید

#### 4. خطای مستقرسازی
**مشکل**: Worker مستقر نمی‌شود
**حل**: 
```bash
wrangler whoami
wrangler deploy --env production
```

### لاگ‌ها و دیباگ

#### فعال‌سازی لاگ‌ها
```javascript
// در worker.js
console.log('[DEBUG] Request received:', request.url);
```

#### مشاهده لاگ‌ها
```bash
wrangler tail
```

## 📊 مانیتورینگ

### آمار استفاده
```bash
wrangler deployments list
wrangler kv:namespace list
```

### تست سلامت
```bash
curl https://your-worker.workers.dev/api/health
```

## 🔄 به‌روزرسانی

### به‌روزرسانی Worker
```bash
wrangler deploy
```

### به‌روزرسانی Frontend
```bash
npm run build
npm run export
# سپس فایل‌های خروجی را در هاستینگ خود آپلود کنید
```

## 🛡️ بهترین شیوه‌ها

### امنیت
1. از توکن‌های قوی استفاده کنید
2. به‌طور منظم KV namespaces را پاک کنید
3. از HTTPS استفاده کنید
4. دسترسی‌ها را محدود کنید

### عملکرد
1. از کش کردن داده‌ها استفاده کنید
2. درخواست‌ها را بهینه کنید
3. از کوئری‌های کارآمد استفاده کنید

### پشتیبانی
1. مستندات را به‌روز نگه دارید
2. بکاپ‌های منظم ایجاد کنید
3. سیستم را مانیتور کنید

## 📞 پشتیبانی

اگر به کمک نیاز دارید:
1. **GitHub Issues**: گزارش باگ‌ها و درخواست ویژگی‌ها
2. **Documentation**: مطالعه مستندات و راهنماها
3. **Community**: عضویت در بحث‌ها و انجمن‌ها

---

**موفق باشید! Passage Panel اکنون آماده استفاده است.** 🎉
