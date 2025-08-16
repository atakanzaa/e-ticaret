# API Endpoints Map

## Authentication Service (/api/auth)
**Public:**
- `POST /register` - User registration
- `POST /login` - User login
- `GET /oauth2/callback/google` - OAuth2 callback

**Authenticated:**
- `GET /me` - Current user info

**Admin Only:**
- `GET /users` - List users with filtering
- `DELETE /users/{id}` - Soft delete user
- `PATCH /users/{id}/roles` - Update user roles

## Catalog Service (/api/catalog)
**Public:**
- `GET /home` - Homepage products (cached 60s)
- `GET /products` - Product listing with filters
- `GET /products/{slug}` - Product detail
- `GET /stores/{slug}` - Store detail

**Seller Only:**
- `GET /my/store` - My store info
- `POST /products` - Create product
- `POST /products/{id}/images/presign` - Get presigned URLs

**Admin Only:**
- `PATCH /stores/{id}/approve` - Approve/reject store
- `PATCH /products/{id}/active` - Enable/disable product

## Seller Service (/api/seller)
**User:**
- `POST /apply` - Apply to become seller

**Seller:**
- `GET /me/store` - My store details
- `PUT /me/store/profile` - Update store profile

**Admin:**
- `GET /applications` - List seller applications
- `PATCH /applications/{id}` - Approve/reject application

## Review Service (/api/review)
**User:**
- `POST /` - Add product review

**Public:**
- `GET /product/{productId}` - Get approved reviews

**Admin:**
- `PATCH /{id}/approve` - Approve/reject review

## Search Service (/api/search)
**Public:**
- `GET /?q=&type=product|store&page=` - Full-text search

## Order & Payment Service (/api/order, /api/payment)
**Public:**
- `POST /order/cart/items` - Add to cart (guest/user)
- `POST /order/checkout` - Checkout with idempotency
- `GET /order/{id}` - Order details

**Payment:**
- `POST /payment/{orderId}/init` - Initialize payment
- `POST /payment/iyzico/webhook` - Payment webhook

## Notification Service (/api/notify)
**Internal:**
- Health check endpoint only
- AMQP consumer for email queue

## Roles and Permissions

### USER (Default)
- Browse products and stores
- Add reviews
- Place orders (guest or authenticated)

### SELLER
- All USER permissions
- Manage own store
- Create and manage products
- Upload product images

### ADMIN
- All permissions
- User management
- Store approval
- Review moderation
- Seller application management
