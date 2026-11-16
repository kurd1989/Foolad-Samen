# راهنمای ساخت فایل APK

## پیش‌نیازها (روی کامپیوتر خودتان)

1. نصب **Node.js** (نسخه ۱۸ یا بالاتر)
2. نصب **Android Studio**
3. نصب JDK 17

---

## مراحل ساخت APK (گام به گام)

### مرحله ۱: باز کردن پوشه پروژه

پوشه `steel-app` را روی کامپیوتر خود کپی کنید و در ترمینال وارد آن شوید:

```bash
cd steel-app
```

### مرحله ۲: نصب وابستگی‌ها

```bash
npm install
```

### مرحله ۳: مقداردهی اولیه Capacitor (فقط بار اول)

```bash
npx cap init "فولاد ثامن پایتخت" "com.samen.rebar" --web-dir .
```

اگر از شما سؤال پرسید، Enter بزنید.

### مرحله ۴: اضافه کردن پلتفرم اندروید

```bash
npx cap add android
```

### مرحله ۵: همگام‌سازی فایل‌ها

```bash
npx cap sync
```

### مرحله ۶: باز کردن پروژه در Android Studio

```bash
npx cap open android
```

### مرحله ۷: ساخت APK در Android Studio

1. از منوی بالا: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. منتظر بمانید تا ساخت تمام شود
3. روی لینک **locate** کلیک کنید
4. فایل `app-debug.apk` آماده است

برای ساخت نسخه نهایی (Release):

1. **Build → Generate Signed Bundle / APK**
2. گزینه APK را انتخاب کنید
3. یک Keystore بسازید یا انتخاب کنید
4. فایل `app-release.apk` ساخته می‌شود

---

## روش جایگزین سریع‌تر (بدون Android Studio)

### استفاده از PWA Builder

1. پروژه را روی یک هاست ساده آپلود کنید (یا از GitHub Pages استفاده کنید)
2. به سایت بروید: https://www.pwabuilder.com
3. آدرس اپلیکیشن را وارد کنید
4. گزینه Android را انتخاب کنید و APK را دانلود کنید

---

## ساختار نهایی پروژه بعد از cap add android

```
steel-app/
├── android/          ← پروژه اندروید (توسط Capacitor ساخته می‌شود)
├── css/
├── js/
├── icons/
├── index.html
├── manifest.json
├── capacitor.config.json
├── package.json
└── ...
```

---

## نکات مهم

- بعد از هر تغییر در فایل‌های HTML/JS/CSS حتماً `npx cap sync` را اجرا کنید
- برای تست روی گوشی واقعی، USB Debugging را فعال کنید
- نام بسته (Package Name): `com.samen.rebar`

---

موفق باشید
فولاد ثامن پایتخت
