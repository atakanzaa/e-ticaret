-- Create order_payment schema
CREATE SCHEMA IF NOT EXISTS order_payment;

-- Payments table
CREATE TABLE IF NOT EXISTS order_payment.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING_3DS', 'AUTHORIZED', 'SUCCEEDED', 'FAILED', 'CANCELLED')),
    price NUMERIC(12,2) NOT NULL,
    paid_price NUMERIC(12,2),
    currency VARCHAR(3) NOT NULL,
    installment INTEGER NOT NULL,
    conversation_id VARCHAR(255),
    iyz_payment_id VARCHAR(255),
    iyz_auth_code VARCHAR(255),
    iyz_fraud_status VARCHAR(50),
    iyz_error_code VARCHAR(10),
    iyz_error_message TEXT,
    card_family VARCHAR(50),
    card_association VARCHAR(50),
    card_type VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Payment items table
CREATE TABLE IF NOT EXISTS order_payment.payment_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES order_payment.payments(id) ON DELETE CASCADE,
    item_id VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    paid_price NUMERIC(10,2),
    iyz_item_tx_id VARCHAR(255),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'SUCCEEDED', 'FAILED')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Webhook events table
CREATE TABLE IF NOT EXISTS order_payment.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    payload JSONB,
    signature VARCHAR(500) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    conversation_id VARCHAR(255),
    payment_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMP,
    retry_count INTEGER NOT NULL DEFAULT 0
);

-- Idempotency keys table
CREATE TABLE IF NOT EXISTS order_payment.idempotency_keys (
    key VARCHAR(255) PRIMARY KEY,
    request_hash VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS order_payment.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'TRY',
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    shipping_address TEXT,
    billing_address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_payment.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES order_payment.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Carts table
CREATE TABLE IF NOT EXISTS order_payment.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'TRY',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS order_payment.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES order_payment.carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_carts_user_id ON order_payment.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON order_payment.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON order_payment.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_payment.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON order_payment.cart_items(cart_id);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON order_payment.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_conversation_id ON order_payment.payments(conversation_id);
CREATE INDEX IF NOT EXISTS idx_payments_iyz_payment_id ON order_payment.payments(iyz_payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_items_payment_id ON order_payment.payment_items(payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_payment_id ON order_payment.webhook_events(payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_conversation_id ON order_payment.webhook_events(conversation_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON order_payment.webhook_events(processed_at) WHERE processed_at IS NULL;
