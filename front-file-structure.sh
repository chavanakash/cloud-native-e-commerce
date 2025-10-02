#!/bin/bash

echo "🚀 Creating Frontend Project Structure..."

# Create main frontend directory
mkdir -p frontend
cd frontend

# ==================== PUBLIC FOLDER ====================
echo "📁 Creating public folder..."
mkdir -p public
touch public/favicon.ico

# ==================== SRC STRUCTURE ====================
echo "📦 Creating src structure..."

# App folder
mkdir -p src/app
touch src/app/layout.js
touch src/app/page.js
touch src/app/globals.css

# Components folder
mkdir -p src/components
touch src/components/Navbar.js
touch src/components/AuthPage.js
touch src/components/HomePage.js
touch src/components/ProductCard.js
touch src/components/SellerDashboard.js
touch src/components/ProductForm.js
touch src/components/CartPage.js
touch src/components/CheckoutPage.js
touch src/components/Footer.js

# Context folder
mkdir -p src/context
touch src/context/AuthContext.js
touch src/context/CartContext.js

# Utils folder
mkdir -p src/utils
touch src/utils/api.js
touch src/utils/constants.js

# Styles folder
mkdir -p src/styles
touch src/styles/components.css

# ==================== ROOT CONFIG FILES ====================
echo "⚙️  Creating config files..."

touch .env.local
touch .gitignore
touch next.config.js
touch package.json
touch postcss.config.js
touch tailwind.config.js
touch README.md

# ==================== COMPLETION ====================
echo ""
echo "✅ Frontend structure created successfully!"
echo ""
echo "📁 Structure:"
echo "frontend/"
echo "├── public/"
echo "│   └── favicon.ico"
echo "├── src/"
echo "│   ├── app/"
echo "│   │   ├── layout.js"
echo "│   │   ├── page.js"
echo "│   │   └── globals.css"
echo "│   ├── components/"
echo "│   │   ├── Navbar.js"
echo "│   │   ├── AuthPage.js"
echo "│   │   ├── HomePage.js"
echo "│   │   ├── ProductCard.js"
echo "│   │   ├── SellerDashboard.js"
echo "│   │   ├── ProductForm.js"
echo "│   │   ├── CartPage.js"
echo "│   │   ├── CheckoutPage.js"
echo "│   │   └── Footer.js"
echo "│   ├── context/"
echo "│   │   ├── AuthContext.js"
echo "│   │   └── CartContext.js"
echo "│   ├── utils/"
echo "│   │   ├── api.js"
echo "│   │   └── constants.js"
echo "│   └── styles/"
echo "│       └── components.css"
echo "├── .env.local"
echo "├── .gitignore"
echo "├── next.config.js"
echo "├── package.json"
echo "├── postcss.config.js"
echo "├── tailwind.config.js"
echo "└── README.md"
echo ""
echo "🎉 Done! You can now start adding your code to the files."