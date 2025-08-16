-- Create databases for each service
CREATE DATABASE auth_db;
CREATE DATABASE catalog_db;
CREATE DATABASE seller_db;
CREATE DATABASE review_db;
CREATE DATABASE search_db;
CREATE DATABASE order_payment_db;

-- Grant all privileges to the postgres user
GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE catalog_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE seller_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE review_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE search_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE order_payment_db TO postgres;
