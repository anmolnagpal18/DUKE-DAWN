import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';

const ShopPage = ({ onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: 12,
      };
      const response = await productService.getAllProducts(params);
      setProducts(response.data.products);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.pages,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPagination({ ...pagination, currentPage: 1 });
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gold-400 mb-4">Shop All Hoodies</h1>
          <p className="text-gray-400 text-lg mx-auto max-w-2xl">
            Browse our complete collection of premium hoodies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="bg-dark-800 rounded-lg p-6 border border-gold-500 h-fit">
            <h3 className="text-xl font-bold text-gold-400 mb-6">Filters</h3>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full bg-dark-900 border border-gold-400 text-white px-3 py-2 rounded"
              >
                <option value="">All Categories</option>
                <option value="signature">Signature</option>
                <option value="limited">Limited</option>
                <option value="regular">Regular</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Price Range</label>
              <input
                type="number"
                placeholder="Min price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full bg-dark-900 border border-gold-400 text-white px-3 py-2 rounded mb-2"
              />
              <input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full bg-dark-900 border border-gold-400 text-white px-3 py-2 rounded"
              />
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full bg-dark-900 border border-gold-400 text-white px-3 py-2 rounded"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setFilters({
                  category: '',
                  minPrice: '',
                  maxPrice: '',
                  sortBy: 'newest',
                });
                setPagination({ ...pagination, currentPage: 1 });
              }}
              className="w-full bg-gold-500 text-dark-900 py-2 rounded font-semibold hover-gold"
            >
              Reset Filters
            </button>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-400 text-lg">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-400 text-lg">No products found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        currentPage: Math.max(1, pagination.currentPage - 1),
                      })
                    }
                    disabled={pagination.currentPage === 1}
                    className="bg-gold-500 text-dark-900 px-4 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover-gold"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          currentPage: i + 1,
                        })
                      }
                      className={`px-4 py-2 rounded font-semibold transition ${
                        pagination.currentPage === i + 1
                          ? 'bg-gold-500 text-dark-900'
                          : 'bg-dark-800 text-gold-400 border border-gold-500 hover:bg-gold-500 hover:text-dark-900'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        currentPage: Math.min(
                          pagination.totalPages,
                          pagination.currentPage + 1
                        ),
                      })
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="bg-gold-500 text-dark-900 px-4 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover-gold"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
