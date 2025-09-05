# Chamilo 1.11.x PHP 7.4 bilan yaxshi ishlaydi
FROM php:7.4-apache

# Apache mod_rewrite
RUN a2enmod rewrite

# PHP kengaytmalari
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev libxml2-dev libzip-dev \
    libicu-dev unzip curl git pkg-config libonig-dev zlib1g-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd intl mbstring zip mysqli pdo pdo_mysql xml \
    && rm -rf /var/lib/apt/lists/*

# Chamilo versiyasini o'zgartirmoqchi bo'lsangiz shu yerda yangilang
ARG CHAMILO_VERSION=1.11.28
WORKDIR /var/www/html

# Chamilo tar.gz ni yuklab ochish
RUN curl -fSL "https://github.com/chamilo/chamilo-lms/releases/download/v${CHAMILO_VERSION}/chamilo-${CHAMILO_VERSION}.zip" -o /tmp/chamilo.zip \
    || curl -fSL "https://github.com/chamilo/chamilo-lms/archive/refs/heads/1.11.x.zip" -o /tmp/chamilo.zip \
    && rm -rf /var/www/html/* \
    && unzip /tmp/chamilo.zip -d /tmp \
    && sh -c 'shopt -s dotglob || true; src=$(echo /tmp/chamilo* | awk "{print \$1}"); mv "$src"/* /var/www/html/' \
    && rm -rf /tmp/chamilo* \
    && chown -R www-data:www-data /var/www/html

# Apache docroot-ni to'g'ri yo'naltirish
ENV APACHE_DOCUMENT_ROOT /var/www/html
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
