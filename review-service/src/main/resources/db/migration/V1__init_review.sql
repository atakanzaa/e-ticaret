-- Review Service Initial Schema (single file)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS review;

-- Product reviews
CREATE TABLE IF NOT EXISTS review.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON review.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON review.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON review.reviews(is_approved);

-- Seller reviews
CREATE TABLE IF NOT EXISTS review.seller_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_seller_review ON review.seller_reviews(seller_id, user_id);
CREATE INDEX IF NOT EXISTS idx_seller_reviews_is_approved ON review.seller_reviews(is_approved);

