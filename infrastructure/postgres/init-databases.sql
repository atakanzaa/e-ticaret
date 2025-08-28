-- E-Ticaret Marketplace Database Initialization
-- Bu script tüm mikroservisler için veritabanlarını oluşturur

-- Auth Service Database
CREATE DATABASE auth_db;
CREATE USER auth_user WITH ENCRYPTED PASSWORD 'auth_password';
GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;

-- Catalog Service Database  
CREATE DATABASE catalog_db;
CREATE USER catalog_user WITH ENCRYPTED PASSWORD 'catalog_password';
GRANT ALL PRIVILEGES ON DATABASE catalog_db TO catalog_user;

-- Seller Service Database
CREATE DATABASE seller_db;
CREATE USER seller_user WITH ENCRYPTED PASSWORD 'seller_password';
GRANT ALL PRIVILEGES ON DATABASE seller_db TO seller_user;

-- Review Service Database
CREATE DATABASE review_db;
CREATE USER review_user WITH ENCRYPTED PASSWORD 'review_password';
GRANT ALL PRIVILEGES ON DATABASE review_db TO review_user;

-- Search Service Database
CREATE DATABASE search_db;
CREATE USER search_user WITH ENCRYPTED PASSWORD 'search_password';
GRANT ALL PRIVILEGES ON DATABASE search_db TO search_user;

-- Order Payment Service Database
CREATE DATABASE order_payment_db;
CREATE USER order_payment_user WITH ENCRYPTED PASSWORD 'order_payment_password';
GRANT ALL PRIVILEGES ON DATABASE order_payment_db TO order_payment_user;

-- Notification Service Database
CREATE DATABASE notification_db;
CREATE USER notification_user WITH ENCRYPTED PASSWORD 'notification_password';
GRANT ALL PRIVILEGES ON DATABASE notification_db TO notification_user;

-- Log creation
\echo 'E-Ticaret veritabanları başarıyla oluşturuldu!';
