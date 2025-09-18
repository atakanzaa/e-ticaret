CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS search;

-- Search product documents
CREATE TABLE IF NOT EXISTS search.search_products (
  product_id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  attrs_text TEXT,
  tsv tsvector,
  is_active BOOLEAN NOT NULL,
  stock INT NOT NULL,
  popularity BIGINT NOT NULL DEFAULT 0
);

-- Search store documents
CREATE TABLE IF NOT EXISTS search.search_stores (
  store_id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  tsv tsvector,
  is_approved BOOLEAN NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sp_tsv ON search.search_products USING GIN (tsv);
CREATE INDEX IF NOT EXISTS idx_ss_tsv ON search.search_stores  USING GIN (tsv);

-- Triggers to keep tsv in sync
CREATE OR REPLACE FUNCTION search.update_sp_tsv() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector('simple', unaccent(coalesce(NEW.name,'') || ' ' || coalesce(NEW.attrs_text,'')));
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sp_tsv ON search.search_products;
CREATE TRIGGER trg_sp_tsv BEFORE INSERT OR UPDATE ON search.search_products
FOR EACH ROW EXECUTE FUNCTION search.update_sp_tsv();

CREATE OR REPLACE FUNCTION search.update_ss_tsv() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector('simple', unaccent(coalesce(NEW.name,'') || ' ' || coalesce(NEW.bio,'')));
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ss_tsv ON search.search_stores;
CREATE TRIGGER trg_ss_tsv BEFORE INSERT OR UPDATE ON search.search_stores
FOR EACH ROW EXECUTE FUNCTION search.update_ss_tsv();

-- Popular products (precomputed list for homepage)
CREATE TABLE IF NOT EXISTS search.popular_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  rank_position INT NOT NULL,
  score NUMERIC(8,4) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(rank_position)
);
CREATE INDEX IF NOT EXISTS idx_popular_products_product ON search.popular_products(product_id);

