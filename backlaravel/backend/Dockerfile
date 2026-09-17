FROM php:8.3-fpm-alpine

# إضافات PHP المطلوبة للارافيل + MySQL
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && apk add --no-cache icu-dev oniguruma-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring intl zip opcache bcmath \
    && apk del .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# طبقة التبعيات أولاً لاستغلال كاش دوكر
COPY composer.json ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-audit

COPY . .

RUN composer dump-autoload --optimize --no-dev \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

COPY docker/php.ini /usr/local/etc/php/conf.d/99-app.ini
COPY docker/entrypoint.sh /usr/local/bin/app-entrypoint
RUN chmod +x /usr/local/bin/app-entrypoint

EXPOSE 9000
ENTRYPOINT ["app-entrypoint"]
CMD ["php-fpm"]
