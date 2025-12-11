import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import { productService } from '../services/api';

const LimitedDropPage = ({ onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts({
          limit: 50,
        });
        const limitedProducts = response.data.products.filter(p => p.limitedDrop === true);
        setProducts(limitedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-black border-b border-gold-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-4 flex items-center justify-center gap-3">
            Limited Drop 🔥
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Exclusive limited edition hoodies. These special releases are produced in small quantities. Once they're gone, they're gone forever. Don't miss out!
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-900/30 border-b border-red-500/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-300 font-semibold">
            ⚡ Limited quantities available. Stock is running out fast!
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400 text-lg">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400 text-lg">No limited drop products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product._id}>
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  onViewDetails={(id) => navigate(`/product/${id}`)}
                />
                {product.dropEndDate && (
                  <div className="mt-4 p-4 bg-dark-800 rounded-lg border border-gold-500">
                    <p className="text-gold-400 font-semibold mb-2">Sale ends in:</p>
                    <CountdownTimer endDate={product.dropEndDate} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LimitedDropPage;
