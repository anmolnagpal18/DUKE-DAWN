# Hoodie Store Backend

Node.js + Express backend API for the premium hoodie store.

## Installation

```bash
npm install
```

## Setup

1. Create a `.env` file based on `.env.example`
2. Update the MongoDB URI and JWT secret
3. Install MongoDB locally or use MongoDB Atlas

## Development

```bash
npm run dev
```

The API will run on http://localhost:5000

## Production

```bash
npm start
```

## Database Seeding

To populate the database with sample products:

```bash
node seed.js
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create product (admin)

### Cart
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart/add` - Add item to cart (requires auth)
- `POST /api/cart/update` - Update cart item (requires auth)
- `POST /api/cart/remove` - Remove item from cart (requires auth)
- `POST /api/cart/clear` - Clear cart (requires auth)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist (requires auth)
- `POST /api/wishlist/add` - Add to wishlist (requires auth)
- `POST /api/wishlist/remove` - Remove from wishlist (requires auth)

### Orders
- `POST /api/orders/create` - Create order (requires auth)
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order details (requires auth)

## Technology Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled
