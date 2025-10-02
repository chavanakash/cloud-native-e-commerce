# E-commerce Backend API

A RESTful API for an e-commerce platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 User authentication (JWT)
- 👥 User and Seller roles
- 📦 Product management (CRUD)
- 🛒 Order management
- 🖼️ Image upload for products
- 🔍 Product search and filtering

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup MongoDB**

Local MongoDB:
```bash
# Install MongoDB and start service
mongod
```

Or use MongoDB Atlas (Cloud):
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string

4. **Configure environment variables**

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

5. **Create uploads directory**
```bash
mkdir uploads
```

6. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Yes (Seller) |
| PUT | `/api/products/:id` | Update product | Yes (Seller) |
| DELETE | `/api/products/:id` | Delete product | Yes (Seller) |
| GET | `/api/products/seller/my-products` | Get seller's products | Yes (Seller) |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create order | Yes |
| GET | `/api/orders` | Get user's orders | Yes |
| GET | `/api/orders/:id` | Get single order | Yes |
| PATCH | `/api/orders/:id/status` | Update order status | Yes |
| PATCH | `/api/orders/:id/cancel` | Cancel order | Yes |

## Request Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Product (Seller)
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: "Product Name"
description: "Product Description"
price: 99.99
category: "Electronics"
stock: 50
image: <file>
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "quantity": 2
    }
  ],
  "totalAmount": 199.98,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── upload.js            # File upload middleware
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   └── Order.js             # Order model
├── routes/
│   ├── auth.js              # Auth routes
│   ├── products.js          # Product routes
│   └── orders.js            # Order routes
├── uploads/                 # Uploaded images
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # Documentation
```

## Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes with middleware
- File upload validation
- Input validation

## License

ISC