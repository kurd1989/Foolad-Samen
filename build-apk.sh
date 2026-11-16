#!/bin/bash
# اسکریپت آماده‌سازی برای ساخت APK
# فولاد ثامن پایتخت - خط تولید میلگرد

set -e

echo "=========================================="
echo "  آماده‌سازی پروژه برای ساخت APK"
echo "  فولاد ثامن پایتخت"
echo "=========================================="
echo ""

# بررسی Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js نصب نیست. لطفاً ابتدا Node.js را نصب کنید."
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo ""

echo "📦 در حال نصب وابستگی‌ها..."
npm install --legacy-peer-deps

echo ""
echo "⚙️  مقداردهی Capacitor..."
if [ ! -d "android" ]; then
    npx cap add android
else
    echo "پلتفرم اندروید از قبل وجود دارد."
fi

echo ""
echo "🔄 همگام‌سازی فایل‌ها..."
npx cap sync

echo ""
echo "=========================================="
echo "✅ پروژه آماده است!"
echo ""
echo "حالا یکی از این کارها را انجام دهید:"
echo ""
echo "  1. باز کردن در Android Studio:"
echo "     npx cap open android"
echo ""
echo "  2. یا مستقیم Build کنید از داخل Android Studio"
echo "     Build → Build APK(s)"
echo "=========================================="
