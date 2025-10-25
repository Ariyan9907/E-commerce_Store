# E-commerce Store

A simple e-commerce store built with HTML, CSS, JavaScript, Node.js, Express, and MySQL.

## Features

- Product listings
- Product details page
- Shopping cart
- User registration/login
- Order processing
- REST API backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Create a MySQL database
   - Run the SQL schema from `database/schema.sql`
   - Optionally run `database/seed.sql` for sample data

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update database credentials and JWT secret

4. **Run the Application**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `/public` - Frontend files (HTML, CSS, JS)
- `/database` - SQL schema and seed files
- `/routes` - Express API routes
- `/middleware` - Custom middleware (auth, etc.)
- `/config` - Configuration files
- `server.js` - Main server file

## API Endpoints

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID

### Users
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - Login user

### Cart
- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:id` - Update cart item
- DELETE `/api/cart/:id` - Remove item from cart

### Orders
- GET `/api/orders` - Get user's orders
- POST `/api/orders` - Create new order

### Project Structure
 ```bash
ecommerce/
├── config/
│   └── database.js           # MySQL database connection
│
├── database/
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Sample product data
│
├── middleware/
│   └── auth.js               # JWT authentication middleware
│
├── routes/
│   ├── products.js           # Product API routes
│   ├── users.js              # User registration/login
│   ├── cart.js               # Shopping cart routes
│   └── orders.js             # Order management
│
├── public/
│   ├── css/
│   │   └── style.css         # Responsive CSS styles
│   │
│   ├── js/
│   │   ├── auth.js           # Authentication utilities
│   │   ├── app.js            # Product listing page
│   │   ├── product-details.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── login.js
│   │   ├── register.js
│   │   └── orders.js
│   │
│   ├── index.html            # Home / Products page
│   ├── product-details.html
│   ├── cart.html
│   ├── checkout.html
│   ├── login.html
│   ├── register.html
│   └── orders.html
│
├── server.js                 # Express server
├── package.json
├── .env.example              # Example environment configuration
└── README.md
   ```

