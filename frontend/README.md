# E-Commerce Frontend (React + Vite + Redux + TailwindCSS)

## Overview
This is the frontend for a full-featured E-Commerce platform built with React, Vite, Redux Toolkit, and TailwindCSS. It provides a modern, responsive UI for users and admins, including product browsing, cart management, checkout, user authentication, and admin dashboards.

## Folder Structure

- `src/`
  - `components/` – Reusable UI components (Admin, Cart, Common, Layout, Products)
  - `Pages/` – Main pages (Home, Login, Register, Profile, Orders, Admin pages)
  - `redux/` – Redux store and slices for state management
  - `data/` – Static data (e.g., product list)
  - `assets/` – Images and static assets
- `public/` – Static files (e.g., favicon, images)
- `index.html` – Main HTML file
- `index.css` – Global styles (TailwindCSS)
- `vite.config.js` – Vite configuration

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
1. Navigate to the `Client` directory:
   ```sh
   cd Client
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Development Server
Start the frontend in development mode:
```sh
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:5173` by default.

### Building for Production
To build the optimized production bundle:
```sh
npm run build
# or
yarn build
```

### Linting
To check for linting errors:
```sh
npm run lint
# or
yarn lint
```

## Features
- Modern UI with TailwindCSS
- Product listing, filtering, and details
- Shopping cart and checkout flow
- User authentication (login/register)
- User profile and order history
- Admin dashboard for managing products, users, and orders
- State management with Redux Toolkit

## Customization
- Update theme and styles in `tailwind.config.js` and `index.css`
- Add or modify components in `src/components/`
- Update product data in `src/data/products.js`

## Contributing
1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

---
