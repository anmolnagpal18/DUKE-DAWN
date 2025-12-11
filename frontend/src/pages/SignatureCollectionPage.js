import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';

const SignatureCollectionPage = ({ onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts({
          category: 'signature',
          limit: 50,
        });
        setProducts(response.data.products);
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
          <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-4">
            Signature Collection
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our most coveted and best-selling hoodies. Each piece represents our commitment to premium quality, comfort, and style. The Signature Collection is where tradition meets innovation.
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
            <p className="text-gray-400 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onViewDetails={(id) => navigate(`/product/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureCollectionPage;
