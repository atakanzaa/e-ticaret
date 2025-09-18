-- Seller Service Initial Schema (single file)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS seller;

-- Helper function to update updated_at columns
CREATE OR REPLACE FUNCTION seller.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Seller applications
CREATE TABLE IF NOT EXISTS seller.seller_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  status VARCHAR(16) NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seller_applications_user_id ON seller.seller_applications(user_id);

-- Seller-side product management (separate from catalog schema)
CREATE TABLE IF NOT EXISTS seller.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    image_url VARCHAR(500),
    seller_id UUID NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seller_products_seller_id ON seller.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_products_category ON seller.products(category);
CREATE INDEX IF NOT EXISTS idx_seller_products_is_active ON seller.products(is_active);
CREATE INDEX IF NOT EXISTS idx_seller_products_created_at ON seller.products(created_at DESC);

DROP TRIGGER IF EXISTS update_products_updated_at ON seller.products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON seller.products 
    FOR EACH ROW 
    EXECUTE FUNCTION seller.update_updated_at_column();

