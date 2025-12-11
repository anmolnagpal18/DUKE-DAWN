import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart({
      productId: product._id,
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Black',
      quantity: 1,
      price: product.price,
    });
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="group relative bg-black border border-gold-500/20 rounded-lg overflow-hidden hover:border-gold-500 transition-all duration-500 cursor-pointer">
      {/* Product Image */}
      <div onClick={handleCardClick} className="relative overflow-hidden h-80 bg-dark-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {product.limitedDrop && (
            <div className="bg-gold-500 text-black px-3 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
              Limited
            </div>
          )}
          {product.stock < 10 && (
            <div className="bg-red-600 text-white px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              {product.stock} Left
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onAddToWishlist(product._id); }}
          className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm border border-gold-500/30 rounded-full flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-black transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div onClick={handleCardClick}>
          {/* Category Badge */}
          <div className="text-gold-500 text-xs tracking-widest uppercase mb-2 font-light">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-gold-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-gold-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-gray-500 text-xs">({product.numReviews || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-gold-400">₹{product.price.toFixed(2)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-gray-500 text-sm line-through">₹{product.mrp.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gold-500 text-black py-3 font-semibold tracking-wider uppercase text-sm hover:bg-gold-400 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <span>Add to Cart</span>
          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
