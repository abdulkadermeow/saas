#!/bin/sh
set -e

cd /var/www/html

# توليد مفتاح التطبيق إذا لم يكن موجوداً
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# تشغيل الـ migrations تلقائياً (عطّله بـ RUN_MIGRATIONS=false)
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo ">> Running migrations..."
    php artisan migrate --force
fi

# كاش الإعدادات للأداء في الإنتاج
if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache
    php artisan route:cache
fi

exec "$@"
