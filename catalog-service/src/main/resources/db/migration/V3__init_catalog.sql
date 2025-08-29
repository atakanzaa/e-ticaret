CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  parent_id UUID NULL
);

CREATE TABLE stores (
  id UUID PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  bio TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  stock INT NOT NULL,
  category_id UUID NOT NULL,
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL
);

CREATE TABLE product_attrs (
  product_id UUID NOT NULL,
  key VARCHAR(64) NOT NULL,
  value VARCHAR(128) NOT NULL
);

