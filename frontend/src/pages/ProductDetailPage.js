import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';

const ProductDetailPage = ({ onAddToCart, onAddToWishlist }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data);
        setSelectedSize(response.data.sizes?.[0] || 'M');
        setSelectedColor(response.data.colors?.[0] || 'Black');

        const relatedRes = await productService.getRelatedProducts(id);
        setRelatedProducts(relatedRes.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    onAddToCart({
      productId: product._id,
      size: selectedSize,
      color: selectedColor,
      quantity: parseInt(quantity),
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Product not found</p>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-dark-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-dark-800 rounded-lg overflow-hidden mb-4 h-96">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded border-2 overflow-hidden ${
                      activeImage === idx ? 'border-gold-400' : 'border-gray-600'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.limitedDrop && (
              <div className="mb-4">
                <div className="inline-block bg-gold-500 text-dark-900 px-4 py-2 rounded-full font-bold mb-2">Limited Edition</div>
                {product.dropEndDate && (
                  <div className="mt-2">
                    <CountdownTimer endDate={product.dropEndDate} />
                  </div>
                )}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {product.name}
            </h1>

            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex text-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      {i < Math.floor(product.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 ml-2">
                  ({product.numReviews || (product.reviews && product.reviews.length) || 0} reviews)
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <p className="text-3xl font-bold text-gold-400">
                ₹{product.price.toFixed(2)}
              </p>
              {product.mrp && product.mrp > product.price && (
                <p className="text-xl text-gray-500 line-through">
                  ₹{product.mrp.toFixed(2)}
                </p>
              )}
            </div>

            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-6">
              <p className={`font-semibold ${
                product.stock > 10
                  ? 'text-green-400'
                  : product.stock > 0
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : 'Out of stock'}
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-3">Size:</label>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded font-semibold transition ${
                      selectedSize === size
                        ? 'bg-gold-500 text-dark-900'
                        : 'bg-dark-800 text-white border border-gold-500 hover:border-gold-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-white font-bold mb-3">Color:</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-dark-800 text-white border border-gold-500 rounded px-4 py-2 focus:outline-none focus:border-gold-300"
                >
                  {product.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-3">Quantity:</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-dark-800 text-gold-400 px-4 py-2 rounded border border-gold-500 hover:bg-gold-500 hover:text-dark-900"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-16 bg-dark-800 text-white border border-gold-500 rounded px-2 py-2 text-center"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-dark-800 text-gold-400 px-4 py-2 rounded border border-gold-500 hover:bg-gold-500 hover:text-dark-900"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 rounded font-bold text-lg transition ${
                  product.stock > 0
                    ? 'bg-gold-500 text-dark-900 hover-gold'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={() => onAddToWishlist(product._id)}
                className="px-6 py-3 rounded font-bold border-2 border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-dark-900 transition"
              >
                ♥ Wishlist
              </button>
            </div>

            {/* Product Info */}
            <div className="border-t border-gold-500 pt-6 mt-6">
              <div className="space-y-3 text-gray-400 text-sm">
                <p><span className="text-gold-400 font-semibold">Shipping:</span> Free on orders over ₹100</p>
                <p><span className="text-gold-400 font-semibold">Returns:</span> 30-day return policy</p>
                <p><span className="text-gold-400 font-semibold">Material:</span> Premium cotton blend</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gold-400 mb-4">Customer Reviews</h2>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4 mb-6">
              {product.reviews.map((r) => (
                <div key={r._id || r.createdAt} className="bg-dark-800 p-4 rounded border border-dark-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-white">{r.name}</div>
                    <div className="text-gold-400">{[...Array(5)].map((_, i) => <span key={i}>{i < r.rating ? '★' : '☆'}</span>)}</div>
                  </div>
                  <div className="text-gray-300 text-sm">{r.comment}</div>
                  <div className="text-gray-500 text-xs mt-2">{new Date(r.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 mb-6">Be the first to review this product.</div>
          )}

          {user ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmittingReview(true);
                try {
                  const response = await productService.postReview(id, { rating, comment });
                  console.log('Review submitted successfully:', response);
                  // refresh product to show new review
                  const res = await productService.getProductById(id);
                  setProduct(res.data);
                  setRating(5);
                  setComment('');
                  alert('Review submitted successfully!');
                } catch (err) {
                  console.error('Error submitting review:', err);
                  alert(err.response?.data?.message || 'Error submitting review');
                } finally {
                  setSubmittingReview(false);
                }
              }}
              className="bg-dark-800 p-4 rounded border border-dark-700"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Write a review</h3>
              
              <div className="mb-3">
                <label className="block text-sm text-gray-400 mb-1">Rating *</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))} 
                  className="w-full mb-3 bg-dark-900 border border-dark-700 text-white px-3 py-2 rounded focus:outline-none focus:border-gold-400"
                >
                  <option value="">Select a rating...</option>
                  {[5,4,3,2,1].map((r) => (
                    <option key={r} value={r}>{r} star{r>1?'s':''}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm text-gray-400 mb-1">Comment</label>
                <textarea 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  rows={4} 
                  placeholder="Share your thoughts about this product..." 
                  className="w-full mb-3 bg-dark-900 border border-dark-700 text-white px-3 py-2 rounded focus:outline-none focus:border-gold-400" 
                />
              </div>

              <button 
                type="submit" 
                disabled={submittingReview || !rating} 
                className={`${submittingReview || !rating ? 'bg-gray-600 cursor-not-allowed' : 'bg-gold-500 hover:bg-gold-600'} text-dark-900 px-4 py-2 rounded font-semibold transition`}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="text-gray-400">Please <a href="/login" className="text-gold-400">login</a> to write a review.</div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gold-400 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct._id}
                  onClick={() => navigate(`/product/${relProduct._id}`)}
                  className="cursor-pointer bg-dark-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105"
                >
                  <div className="bg-dark-900 h-48 overflow-hidden">
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-2 line-clamp-2">
                      {relProduct.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <p className="text-gold-400 font-bold text-lg">
                        ₹{relProduct.price.toFixed(2)}
                      </p>
                      {relProduct.mrp && relProduct.mrp > relProduct.price && (
                        <p className="text-gray-500 text-sm line-through">
                          ₹{relProduct.mrp.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
