CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE search_products (
  product_id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  attrs_text TEXT,
  tsv tsvector,
  is_active BOOLEAN NOT NULL,
  stock INT NOT NULL
);

CREATE TABLE search_stores (
  store_id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  tsv tsvector,
  is_approved BOOLEAN NOT NULL
);

CREATE INDEX idx_sp_tsv ON search_products USING GIN (tsv);
CREATE INDEX idx_ss_tsv ON search_stores  USING GIN (tsv);

