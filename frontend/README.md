# Complete E-commerce Setup Guide

This guide will help you set up the complete e-commerce platform from scratch.

## Prerequisites

Before starting, make sure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## Step 1: Create Project Directory

```bash
mkdir ecommerce-project
cd ecommerce-project
```

## Step 2: Backend Setup

### 2.1 Create Backend Folder Structure

```bash
mkdir backend
cd backend
mkdir config middleware models routes uploads
```

### 2.2 Create Files

Create the following files in their respective folders:

```
backend/
├── config/
│   └── database.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   └── orders.js
├── uploads/               (empty folder for images)
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

### 2.3 Initialize Backend

```bash
npm init -y
```

### 2.4 Install Backend Dependencies

```bash
npm install express mongoose cors bcryptjs jsonwebtoken multer dotenv
npm install --save-dev nodemon
```

### 2.5 Configure MongoDB

**Option A: Local MongoDB**
1. Install MongoDB Community Server
2. Start MongoDB service:
   - Windows: MongoDB starts automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongodb`

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env` with connection string

### 2.6 Create .env File

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
NODE_ENV=development
```

### 2.7 Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

## Step 3: Frontend Setup

Open a new terminal window:

### 3.1 Create Frontend Folder Structure

```bash
cd ..  # Go back to ecommerce-project
mkdir frontend
cd frontend
```

### 3.2 Initialize Next.js Project

```bash
npx create-next-app@latest . --app --tailwind --no-src-dir
```

When prompted:
- ✔ Would you like to use TypeScript? › **No**
- ✔ Would you like to use ESLint? › **Yes**
- ✔ Would you like to use Tailwind CSS? › **Yes**
- ✔ Would you like to use `src/` directory? › **Yes**
- ✔ Would you like to use App Router? › **Yes**
- ✔ Would you like to customize the default import alias? › **No**

### 3.3 Install Frontend Dependencies

```bash
npm install axios lucide-react
```

### 3.4 Create Folder Structure

```bash
cd src
mkdir components context utils
```

Final structure:
```
frontend/src/
├── app/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── Navbar.js
│   ├── AuthPage.js
│   ├── HomePage.js
│   ├── ProductCard.js
│   ├── SellerDashboard.js
│   ├── ProductForm.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   └── Footer.js
├── context/
│   ├── AuthContext.js
│   └── CartContext.js
└── utils/
    ├── api.js
    └── constants.js
```

### 3.5 Create .env.local File

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3.6 Copy All Component Files

Copy the code from all the artifacts above into their respective files.

### 3.7 Start Frontend Server

```bash
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000
```

## Step 4: Test the Application

### 4.1 Open Browser

Navigate to: `http://localhost:3000`

### 4.2 Test User Registration

1. Click "Login / Sign Up"
2. Click "Sign Up"
3. Fill in details:
   - Name: Test User
   - Email: user@test.com
   - Password: test123
   - Role: Customer
4. Click "Sign Up"

### 4.3 Test Seller Registration

1. Logout
2. Register again as Seller:
   - Name: Test Seller
   - Email: seller@test.com
   - Password: test123
   - Role: Seller
3. Click "Sign Up"

### 4.4 Test Seller Features

1. Login as Seller
2. Click "My Products"
3. Add a product:
   - Name: Test Product
   - Description: This is a test product
   - Price: 999
   - Category: Electronics
   - Stock: 10
   - Image: Upload any image
4. Click "Add Product"

### 4.5 Test Customer Features

1. Logout
2. Login as Customer (user@test.com)
3. Browse products on home page
4. Click "Add to Cart"
5. Click cart icon
6. Update quantities
7. Click "Proceed to Checkout"
8. Fill shipping address
9. Click "Place Order"

## Step 5: Verify Database

### 5.1 Check MongoDB

Open MongoDB Compass or use Mongo Shell:

```bash
mongo
use ecommerce
show collections
db.users.find()
db.products.find()
db.orders.find()
```

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error
**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
1. Check if MongoDB is running
2. Verify MONGODB_URI in .env
3. For Atlas, check IP whitelist

### Issue 2: Port Already in Use
**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change port in .env
```

### Issue 3: CORS Error
**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
- Ensure backend has `cors` installed
- Check if backend is running on port 5000

### Issue 4: Images Not Loading
**Solution**:
1. Check if `uploads` folder exists in backend
2. Verify image path in database
3. Check file permissions

### Issue 5: Cannot Find Module
**Error**: `Cannot find module '@/context/AuthContext'`

**Solution**:
```bash
# Check if file exists
# Restart Next.js dev server
npm run dev
```

## Project Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Production Deployment

### Backend Deployment (Heroku Example)

```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Frontend Deployment (Vercel)

```bash
cd frontend
npm install -g vercel
vercel
```

Update `.env.local` with production API URL:
```env
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com/api
```

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Default Test Accounts

After setup, create these test accounts:

**Customer Account:**
- Email: customer@test.com
- Password: test123
- Role: Customer

**Seller Account:**
- Email: seller@test.com
- Password: test123
- Role: Seller

## Next Steps

1. ✅ Setup completed
2. 📝 Add more products
3. 🎨 Customize design
4. 🔒 Add payment gateway
5. 📧 Add email notifications
6. 📊 Add analytics
7. 🚀 Deploy to production

## Support

If you encounter any issues:
1. Check console logs
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check environment variables
5. Review this guide

## Useful Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB version
mongod --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

Happy Coding! 🚀