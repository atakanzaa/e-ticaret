CREATE TABLE carts (
  cart_id UUID PRIMARY KEY,
  user_id UUID NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
  cart_id UUID NOT NULL,
  product_id UUID NOT NULL,
  qty INT NOT NULL CHECK (qty > 0),
  PRIMARY KEY (cart_id, product_id)
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID NULL,
  email VARCHAR(255) NOT NULL,
  address_json JSONB NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  status VARCHAR(12) NOT NULL CHECK (status IN ('NEW','PAID','CANCELLED')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  qty INT NOT NULL CHECK (qty > 0),
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE idempotency_keys (
  key VARCHAR(64) PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

