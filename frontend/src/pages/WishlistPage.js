import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { wishlistService } from '../services/api';

const WishlistPage = ({ onAddToCart, onWishlistChange }) => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [token, navigate]);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistService.getWishlist();
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      fetchWishlist();
      if (onWishlistChange) onWishlistChange(); // Update navbar count
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading wishlist...</p>
      </div>
    );
  }

  const validProducts = (wishlist?.products || []).filter(
    (item) => item && item.product && item.product._id && item.product.name
  );

  if (!wishlist || validProducts.length === 0) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gold-400 mb-8">My Wishlist</h1>
          <div className="bg-dark-800 rounded-lg p-8 text-center border border-gold-500">
            <p className="text-gray-400 text-lg mb-6">Your wishlist is empty</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gold-500 text-dark-900 px-8 py-3 rounded font-bold hover-gold"
            >
              Explore Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gold-400 mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {validProducts.map((item) => (
            <div
              key={item._id}
              className="group relative bg-black border border-gold-500/20 rounded-lg overflow-hidden hover:border-gold-500 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-80 bg-dark-900 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${item.product._id}`)}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                {/* Remove Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.product._id); }}
                  className="absolute top-4 right-4 w-10 h-10 bg-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="cursor-pointer" onClick={() => navigate(`/product/${item.product._id}`)}>
                  {/* Category */}
                  <div className="text-gold-500 text-xs tracking-widest uppercase mb-2 font-light">
                    {item.product.category}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-1 group-hover:text-gold-400 transition-colors">
                    {item.product.name}
                  </h3>

                  {/* Price */}
                  {typeof item.product.price === 'number' && (
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-gold-400">${item.product.price.toFixed(2)}</span>
                      {item.product.mrp && item.product.mrp > item.product.price && (
                        <span className="text-gray-500 text-sm line-through">${item.product.mrp.toFixed(2)}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() =>
                    onAddToCart({
                      productId: item.product._id,
                      size: item.product.sizes?.[0] || 'M',
                      color: item.product.colors?.[0] || 'Black',
                      quantity: 1,
                      price: item.product.price,
                    })
                  }
                  className="w-full bg-gold-500 text-black py-3 font-semibold tracking-wider uppercase text-sm hover:bg-gold-400 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  <span>Add to Cart</span>
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
