-- Catalog Service Initial Schema (single file)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS catalog;

-- Categories
CREATE TABLE IF NOT EXISTS catalog.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  parent_id UUID NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON catalog.categories(parent_id);

-- Stores
CREATE TABLE IF NOT EXISTS catalog.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  bio TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stores_owner ON catalog.stores(owner_user_id);

-- Products
CREATE TABLE IF NOT EXISTS catalog.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  stock INT NOT NULL,
  category_id UUID NOT NULL,
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  popularity BIGINT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON catalog.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON catalog.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON catalog.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_popularity ON catalog.products(popularity DESC);

-- Product images
CREATE TABLE IF NOT EXISTS catalog.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON catalog.product_images(product_id);

-- Product attributes
CREATE TABLE IF NOT EXISTS catalog.product_attrs (
  product_id UUID NOT NULL,
  key VARCHAR(64) NOT NULL,
  value VARCHAR(128) NOT NULL,
  PRIMARY KEY (product_id, key)
);
CREATE INDEX IF NOT EXISTS idx_product_attrs_product ON catalog.product_attrs(product_id);


