'use client';

import { ShoppingCart, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/utils/constants';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    addToCart(product);
    // Show toast notification
    alert('Product added to cart!');
  };

  const imageUrl = product.image
    ? `http://localhost:5000${product.image}`
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition duration-300 animate-fade-in">
      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package size={64} className="text-purple-400" />
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
          {product.description}
        </p>

        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-purple-600">
            ₹{product.price.toFixed(2)}
          </span>
          <span
            className={`text-sm px-2 py-1 rounded ${
              product.stock > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        {user && user.role !== 'seller' && (
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            <ShoppingCart size={18} />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        )}

        {!user && (
          <div className="text-center text-sm text-gray-500">
            Login to purchase
          </div>
        )}
      </div>
    </div>
  );
}