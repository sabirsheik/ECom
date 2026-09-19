# ECom Store

A full-stack clothing e-commerce application with a React storefront, Redux state management, an Express REST API, MongoDB persistence, Cloudinary image uploads, and optional Stripe checkout.

The project contains two independently runnable applications:

- `frontend`: customer storefront and admin dashboard
- `backend`: authentication, catalog, carts, checkout, orders, uploads, subscriptions, and admin APIs

> **Security notice:** Never commit `.env` files or real credentials. The current local environment file contains a live-looking MongoDB connection string. Rotate that database password immediately if it is valid, then replace the value in `backend/.env`.

## Contents

- [Capabilities](#capabilities)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Application Flows](#application-flows)
- [Frontend](#frontend)
- [Backend API](#backend-api)
- [Data Model](#data-model)
- [Seeding Products](#seeding-products)
- [Validation and Testing](#validation-and-testing)
- [Troubleshooting](#troubleshooting)
- [Security and Production Checklist](#security-and-production-checklist)
- [Contributing](#contributing)

## Capabilities

### Customer experience

- Browse published clothing products
- Search, filter, sort, and browse collections
- View product details, images, availability, ratings, similar products, and recommendations
- Add products to a guest cart before signing in
- Merge a guest cart into the account cart after login or registration
- Manage wishlist and product views
- Register, log in, update profile, and delete an account
- Checkout with Cash on Delivery or Stripe
- View order history, order details, payment status, and delivery status
- Subscribe an email address to the store newsletter

### Admin experience

- Protected admin dashboard at `/admin`
- Manage users and roles
- View and manage products
- Create, update, and delete products through protected APIs
- View orders and update order status
- Upload product images through Cloudinary

## Architecture

```text
+-----------------------+          HTTP/JSON          +------------------------+
| React + Vite frontend | --------------------------> | Express REST backend   |
| Redux Toolkit         |                             | JWT middleware         |
| React Router          | <-------------------------- | Mongoose models        |
+-----------------------+                             +-----------+------------+
                                                                    |
                                             +----------------------+----------------------+
                                             |                      |                      |
                                      MongoDB / Atlas          Cloudinary              Stripe
                                      users/products           product images          payments
                                      carts/orders             upload storage          webhooks
```

The frontend reads the backend origin from `VITE_BACKEND_URL`. The backend reads its runtime configuration from `backend/.env` using `dotenv`.

## Technology Stack

### Frontend

- React 19
- Vite 6
- React Router 7
- Redux Toolkit and React Redux
- Axios
- Tailwind CSS
- Framer Motion
- Swiper
- Lucide React, React Icons, Sonner, and React Toastify

### Backend

- Node.js and Express 5
- MongoDB with Mongoose 8
- JWT with `jsonwebtoken`
- Password hashing with `bcryptjs`
- Stripe Checkout and webhook verification
- Cloudinary and Multer for image uploads
- CORS, Morgan, dotenv, and Nodemon

## Repository Structure

```text
ECom/
├── README.md
├── backend/
│   ├── config/                  MongoDB connection configuration
│   ├── controllers/             Request handlers and business logic
│   │   └── Admin/               Admin-specific handlers
│   ├── data/                    Dummy product data
│   ├── Middleware/              JWT authentication and role checks
│   ├── models/                  Mongoose schemas
│   ├── routes/                  Express route modules
│   │   └── Admin/               Admin route modules
│   ├── scripts/                 Seed and maintenance scripts
│   ├── .env                     Local backend configuration, never commit
│   ├── package.json             Backend scripts and dependencies
│   ├── server.js                Express application entry point
│   └── Readme                   Backend-specific notes
└── frontend/
    ├── public/                  Public static assets
    ├── src/
    │   ├── assets/              Imported frontend assets
    │   ├── components/          Reusable UI components
    │   │   ├── Admin/            Admin dashboard components
    │   │   ├── Cart/             Cart UI
    │   │   ├── Common/           Header, navbar, footer, search
    │   │   ├── Layout/           Store and cart layouts
    │   │   └── Products/         Product and checkout UI
    │   ├── data/                 Local frontend data
    │   ├── Pages/                Route-level pages
    │   ├── redux/                Store and Redux slices
    │   ├── App.jsx               Application routes and guards
    │   ├── index.css             Global styles
    │   └── main.jsx              React bootstrap
    ├── package.json              Frontend scripts and dependencies
    ├── tailwind.config.js        Tailwind configuration
    └── vite.config.js            Vite configuration
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- MongoDB local instance or MongoDB Atlas database
- Cloudinary account for image uploads
- Stripe account and test keys for Stripe checkout

Cloudinary and Stripe are optional for basic product browsing and Cash on Delivery. MongoDB and JWT configuration are required for the backend to work correctly.

## Quick Start

### 1. Install dependencies

Open two terminals from the project root:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 2. Configure the backend

Create or update `backend/.env` using the template in the [Environment Variables](#environment-variables) section.

At minimum, configure:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/ecom
JWT_SECRET=replace_with_a_long_random_secret
```

### 3. Configure the frontend

Create `frontend/.env`:

```dotenv
VITE_BACKEND_URL=http://localhost:5100
```

Vite exposes only variables prefixed with `VITE_` to browser code. Do not put MongoDB, JWT, Cloudinary secret, or Stripe secret values in the frontend environment file.

### 4. Start both applications

Backend terminal:

```bash
cd backend
npm start
```

Frontend terminal:

```bash
cd frontend
npm run dev
```

Open:

- Storefront: `http://localhost:5173`
- Backend health check: `http://localhost:5100/`

Expected health response:

```json
{
  "message": "API Run Sucessfully"
}
```

## Environment Variables

### Backend: `backend/.env`

| Variable | Required | Purpose | Example |
|---|---:|---|---|
| `PORT` | No | HTTP port. Defaults to `5100`. | `5100` |
| `HOST` | No | Bind host. Defaults to `localhost`. | `localhost` |
| `MONGODB_URI` | Yes | MongoDB local or Atlas connection string. | `mongodb://127.0.0.1:27017/ecom` |
| `JWT_SECRET` | Yes | Secret used to sign and verify seven-day JWTs. | Long random string |
| `FRONTEND_URL` | No | Stripe success and cancel redirect origin. | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Uploads | Cloudinary cloud name. | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Uploads | Cloudinary API key. | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Uploads | Cloudinary API secret. | `your_api_secret` |
| `STRIPE_SECRET_KEY` | Stripe | Stripe server-side secret key. | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhooks | Stripe endpoint signing secret. | `whsec_...` |

Safe backend template:

```dotenv
PORT=5100
HOST=localhost
MONGODB_URI=mongodb://127.0.0.1:27017/ecom
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=replace_with_cloudinary_cloud_name
CLOUDINARY_API_KEY=replace_with_cloudinary_api_key
CLOUDINARY_API_SECRET=replace_with_cloudinary_api_secret
STRIPE_SECRET_KEY=sk_test_replace_with_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_replace_with_stripe_webhook_secret
```

### Frontend: `frontend/.env`

```dotenv
VITE_BACKEND_URL=http://localhost:5100
```

Restart the Vite server after changing frontend environment variables.

## Application Flows

### Authentication

1. The user registers or logs in through the frontend.
2. The backend validates credentials and returns a JWT.
3. The frontend stores the user summary in `localStorage.userInfo` and the token in `localStorage.userToken`.
4. Protected requests send:

   ```http
   Authorization: Bearer <jwt-token>
   ```

5. The backend loads the current user and attaches it to `req.user`.
6. Admin routes additionally require `req.user.role === "admin"`.

### Guest cart and account cart

- A guest receives a local `guestId` such as `guest_...`.
- Cart endpoints accept either `guestId` or an authenticated `userId`.
- On login or registration, the frontend calls the cart merge endpoint.
- Product, size, color, quantity, and total price are persisted in MongoDB.

### Checkout and payment

1. The authenticated customer posts checkout items and a shipping address.
2. `COD` creates an order immediately with a pending payment status.
3. `STRIPE` creates a pending checkout record.
4. The frontend requests a Stripe Checkout Session and redirects to Stripe.
5. Stripe returns the customer to the frontend with checkout and session identifiers.
6. The frontend verifies the session and the backend finalizes the checkout, creates the order, and clears the user cart.
7. Stripe webhooks provide server-side payment confirmation when configured.

### Product images

Send an image as multipart form data using the field name `image` to `/api/upload`. The backend streams the file to Cloudinary and returns `imageUrl`.

## Frontend

### Customer routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Home page and featured content |
| `/login` | Public | User login |
| `/register` | Public | Account registration |
| `/collections` | Public | Product collection, filters, and sorting |
| `/product/:id` | Public | Product details, rating, wishlist, and cart actions |
| `/profile` | Authenticated | Profile update, logout, and account deletion |
| `/checkout` | Authenticated | Address and payment selection |
| `/order-confirmation` | Authenticated | Latest order confirmation |
| `/my-order` | Authenticated | Order history |
| `/order/:id` | Authenticated | Order details |

### Admin routes

| Route | Access | Purpose |
|---|---|---|
| `/admin` | Admin | Dashboard |
| `/admin/users` | Admin | User management |
| `/admin/products` | Admin | Product management |
| `/admin/products/:id/edit` | Admin | Product editing |
| `/admin/orders` | Admin | Order management |

### Redux state

The store currently contains:

- `auth`: user, token-backed session state, user ID, and guest ID
- `product`: product lists, details, recommendations, wishlist, ratings, and views
- `cart`: guest/account cart contents and totals
- `checkout`: checkout and payment state
- `order`: customer order history and details
- `admin`: admin users
- `adminProduct`: admin product data
- `adminOrder`: admin order data

## Backend API

Base URL: `http://localhost:5100`

Protected endpoints require `Authorization: Bearer <token>`. Admin endpoints require an authenticated admin user.

### System and account

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | API health check |
| POST | `/api/users/register` | Public | Body: `name`, `email`, `password` |
| POST | `/api/users/login` | Public | Body: `email`, `password`; returns JWT |
| GET | `/api/users/profile` | User | Return current profile |
| PUT | `/api/users/profile` | User | Update `name`, `email`, or `password` |
| DELETE | `/api/users/profile` | User | Delete account and related cart/checkout records |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List published products with filters |
| GET | `/api/products/:id` | Public | Get one product |
| GET | `/api/products/product-bestSeller` | Public | Best-selling products |
| GET | `/api/products/product-newArrivals` | Public | New arrivals |
| GET | `/api/products/similar/:id` | Public | Similar products |
| GET | `/api/products/recommendations` | Optional | Personalized or general recommendations |
| POST | `/api/products/:id/view` | Optional | Track a product view |
| POST | `/api/products/:id/wishlist-toggle` | User | Toggle wishlist membership |
| POST | `/api/products/:id/rate` | User | Submit a rating from 1 to 5 |
| POST | `/api/products/create` | Admin | Create a product |
| PUT | `/api/products/:id` | Admin | Update a product |
| DELETE | `/api/products/:id` | Admin | Delete a product |
| GET | `/api/products/all-products` | Admin | List all products, including unpublished products |

Supported product query parameters include `collection`, `category`, `sizes`, `colors`, `gender`, `minPrice`, `maxPrice`, `sortBy`, `search`, `material`, `brand`, `limit`, `minRating`, and `availability`.

Example:

```http
GET /api/products?category=Top%20Wear&colors=Black,White&minPrice=1000&maxPrice=10000&sortBy=priceAsc
```

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/cart` | Optional | Get cart using `userId` or `guestId` query parameter |
| POST | `/api/cart/create` | Optional | Add item using `productId`, `quantity`, `size`, `color`, and identity |
| PUT | `/api/cart/update` | Optional | Update item quantity |
| DELETE | `/api/cart/delete` | Optional | Remove an item |
| POST | `/api/cart/merge` | User | Merge a guest cart after login |

Example add-to-cart body:

```json
{
  "productId": "665f1b2c3d4e5f6789012345",
  "quantity": 1,
  "size": "M",
  "color": "Black",
  "guestId": "guest_1720000000000"
}
```

### Checkout and orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/checkout/create` | User | Create a COD or Stripe checkout |
| POST | `/api/checkout/stripe/session` | User | Create Stripe Checkout Session using `checkoutId` |
| POST | `/api/checkout/stripe/verify-session` | User | Verify `{ checkoutId, sessionId }` |
| GET | `/api/checkout/:id/status` | User | Get checkout status |
| PUT | `/api/checkout/:id/pay` | User | Record payment details |
| POST | `/api/checkout/:id/finalize` | User | Finalize checkout and create order |
| POST | `/api/checkout/webhook` | Stripe | Receive Stripe webhook events; raw request body is required |
| GET | `/api/order/my-orders` | User | List current user's orders |
| GET | `/api/order/:id` | User | Get one order owned by current user |

Example checkout body:

```json
{
  "checkoutItems": [
    {
      "productId": "665f1b2c3d4e5f6789012345",
      "name": "Classic Shirt",
      "image": "https://res.cloudinary.com/example/image/upload/shirt.jpg",
      "price": 4500,
      "size": "M",
      "color": "White",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "address": "12 Main Street",
    "city": "Lahore",
    "postalCode": 54000,
    "country": "Pakistan"
  },
  "paymentMethod": "COD",
  "totalPrice": 4500
}
```

### Uploads and subscriptions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/upload` | Public | Multipart field `image`; uploads to Cloudinary |
| POST | `/api/subscribe` | Public | Body: `{ "email": "customer@example.com" }` |

### Admin API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/auth/admin/all-users` | List all users |
| POST | `/auth/admin/create-user` | Create a user with optional role |
| PUT | `/auth/admin/user-update/:id` | Update user name, email, or role |
| DELETE | `/auth/admin/user-delete/:id` | Delete a user |
| GET | `/auth/admin/products` | List products for admin dashboard |
| GET | `/auth/admin/orders` | List all orders |
| PUT | `/auth/admin/order-update/:id` | Update order status |
| DELETE | `/auth/admin/order-delete/:id` | Delete an order |

Valid order statuses are `Processing`, `Shipped`, `Delivered`, and `Cancelled`.

## Data Model

### User

`name`, `email`, hashed `password`, `role`, `wishlist`, `viewedProducts`, `createdAt`, and `updatedAt`.

Roles are `customer` and `admin`.

### Product

`name`, `description`, `price`, `discountPrice`, `countInPrice` (stock quantity), `sku`, `category`, `brand`, `sizes`, `colors`, `collections`, `material`, `gender`, `images`, feature/publication flags, ratings, tags, owner, and timestamps.

### Cart

Optional `user` or `guestId`, product line items with product/variant information, `totalPrice`, and timestamps. A sparse unique index keeps one cart per user or guest identity.

### Checkout

User, checkout items, shipping address, payment method, total price, payment status/details, paid state, and finalization state.

### Order

User, order items, shipping address, payment method/status, total price, paid state, delivery state, order status, and timestamps.

### Subscriber

Unique normalized email and subscription date.

## Seeding Products

The seed script reads `backend/data/dummy-clothing-products.json`, connects to MongoDB, and upserts products by SKU:

```bash
cd backend
npm run seed:products
```

If an admin user does not exist, the script creates a local seed admin:

```text
Email:    seed-admin@example.com
Password: SeedAdmin123
Role:     admin
```

Change or remove this account before using a shared or production database.

## Validation and Testing

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

- `npm run lint` checks ESLint rules.
- `npm run build` creates the production Vite bundle.
- `npm run dev` starts the development server.
- `npm run preview` serves the production build locally.

### Backend

```bash
cd backend
node --check server.js
node --check config/dbConnect.js
npm test
```

The backend currently has no automated test suite. `npm test` is still the package placeholder and exits with an error until tests are added. For manual verification, start the backend and request:

```bash
curl http://localhost:5100/
```

Use Postman or the frontend to verify authenticated, cart, checkout, upload, and admin flows.

## Troubleshooting

### Backend cannot connect to MongoDB

- Confirm `MONGODB_URI` is present and correctly formatted.
- For Atlas, allow the development IP in Network Access.
- Confirm the database user has access to the selected database.
- Rotate any credential that has been exposed in source control, chat, logs, or screenshots.

### Frontend shows network errors

- Start the backend on the port configured in `VITE_BACKEND_URL`.
- Confirm `frontend/.env` uses the full origin, for example `http://localhost:5100`.
- Restart Vite after changing `.env`.
- Check the browser Network panel for the exact failing endpoint.

### JWT authentication fails

- Use the exact header format `Authorization: Bearer <token>`.
- Confirm `JWT_SECRET` has not changed between token creation and verification.
- Log in again after changing the secret.

### Stripe checkout fails

- Use a Stripe test secret key beginning with `sk_test_` during development.
- Configure `STRIPE_WEBHOOK_SECRET` from the Stripe CLI or Dashboard endpoint.
- Keep `FRONTEND_URL` aligned with the active frontend origin.
- Do not expose Stripe secret values to Vite or browser code.

### Image upload fails

- Confirm all three Cloudinary variables are set.
- Send `multipart/form-data` with the field name `image`.
- Check Cloudinary account limits and the backend error response.

### Port is already in use

Change `PORT` in `backend/.env` and update `VITE_BACKEND_URL` in `frontend/.env` to match.

## Security and Production Checklist

Before deployment:

- Rotate the MongoDB credential currently present in the local environment file.
- Generate a strong random `JWT_SECRET` and store it in a secret manager.
- Add `.env` files to `.gitignore` and verify they are not tracked.
- Use HTTPS for frontend, backend, Stripe redirects, and webhook endpoints.
- Restrict CORS to the deployed frontend origin instead of allowing every origin.
- Use Stripe live keys only in a protected server environment.
- Configure Stripe webhook signature verification and test replay/idempotency behavior.
- Change or remove the seed admin account.
- Add rate limiting, request validation, structured error handling, and automated tests before production traffic.
- Review admin authorization and ensure all admin mutations remain protected by both JWT and role checks.

## Contributing

1. Create a focused branch:

   ```bash
   git checkout -b feature/short-description
   ```

2. Keep changes scoped to the relevant frontend or backend area.
3. Do not commit secrets, generated build output, or local database data.
4. Run frontend lint/build and backend syntax checks before opening a pull request.
5. Describe API contract changes, environment changes, and manual test steps in the pull request.

## License

No license has been defined in the project yet. Add an explicit license before distributing the application publicly.
