import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ZoomParallaxDemo from '../components/ZoomParallaxDemo';
import CountdownTimer from '../components/CountdownTimer';
import JoinTheClub from '../components/JoinTheClub';
import { productService, cartService, wishlistService } from '../services/api';

const HomePage = ({ onAddToCart, onAddToWishlist }) => {
  const [signatureProducts, setSignatureProducts] = useState([]);
  const [limitedProducts, setLimitedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const sigRes = await productService.getAllProducts({
          category: 'signature',
          limit: 3,
        });
        setSignatureProducts(sigRes.data.products);

        const allRes = await productService.getAllProducts({
          limit: 50,
        });
        const limitedProducts = allRes.data.products.filter(p => p.limitedDrop === true).slice(0, 3);
        setLimitedProducts(limitedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Flowing Golden Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold-500/20 via-transparent via-transparent via-transparent to-gold-400/15"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-600/10 via-transparent to-transparent"></div>
        
        {/* Enhanced Glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gold-500/8 blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">


          {/* Badge */}
          <div className="inline-block mb-8 px-6 py-2 border-t border-b border-gold-500/50">
            <span className="text-gold-400 text-xs tracking-[0.4em] font-light uppercase">Established 2024</span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-gold-400 mb-8 tracking-wide" style={{ textShadow: '0 0 40px rgba(212, 175, 55, 0.3)' }}>
            DUKE & DAWN
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-24 h-px bg-gold-500"></div>
            <div className="w-24 h-px bg-gold-500"></div>
          </div>

          {/* Subtitle */}
          <p className="text-2xl sm:text-3xl text-gray-300 font-light tracking-[0.2em] uppercase mb-4">
            Luxury Redefined
          </p>
          <p className="text-gray-400 text-base max-w-2xl mx-auto mb-12 leading-relaxed">
            Experience timeless elegance with our premium collection of hoodies, crafted for those who demand excellence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link
              to="/shop"
              className="px-12 py-4 bg-gold-500 text-black font-semibold tracking-[0.2em] uppercase text-sm hover:bg-gold-400 transition-all duration-300"
            >
              Discover
            </Link>
            <Link
              to="/signature"
              className="px-12 py-4 border border-gold-500 text-gold-400 font-semibold tracking-[0.2em] uppercase text-sm hover:bg-gold-500/10 transition-all duration-300"
            >
              Collection
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-12 max-w-3xl mx-auto pt-12 border-t border-gold-500/20">
            <div className="space-y-2">
              <div className="text-gold-400 text-sm font-light tracking-widest uppercase">Quality</div>
              <div className="text-white text-xl font-light">Premium</div>
            </div>
            <div className="space-y-2">
              <div className="text-gold-400 text-sm font-light tracking-widest uppercase">Design</div>
              <div className="text-white text-xl font-light">Timeless</div>
            </div>
            <div className="space-y-2">
              <div className="text-gold-400 text-sm font-light tracking-widest uppercase">Service</div>
              <div className="text-white text-xl font-light">24/7</div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Collection Section */}
      <section className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold-400 mb-4">
              Signature Collection
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our most coveted and best-selling hoodies. Premium quality that defines our brand.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {signatureProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  onViewDetails={(id) => (window.location.href = `/product/${id}`)}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/signature"
              className="inline-block bg-gold-500 text-dark-900 px-8 py-3 rounded-lg font-bold hover-gold"
            >
              View All Signature Items
            </Link>
          </div>
        </div>
      </section>

      {/* Zoom Parallax Gallery */}
      <ZoomParallaxDemo />

      {/* Limited Drop Section */}
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold-400 mb-4">
              Limited Drop 🔥
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Exclusive limited edition hoodies. Don't miss out on these special releases.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {limitedProducts.map((product) => (
                <div key={product._id}>
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onAddToWishlist={onAddToWishlist}
                    onViewDetails={(id) => (window.location.href = `/product/${id}`)}
                  />
                  {product.dropEndDate && (
                    <div className="mt-4 p-4 bg-dark-900 rounded-lg">
                      <p className="text-gold-400 font-semibold mb-2">Sale ends in:</p>
                      <CountdownTimer endDate={product.dropEndDate} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/limited"
              className="inline-block bg-gold-500 text-dark-900 px-8 py-3 rounded-lg font-bold hover-gold"
            >
              View All Limited Drops
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gold-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-dark-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Quality</h3>
              <p className="text-gray-400">
                100% authentic materials with exceptional craftsmanship.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-dark-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 3H3z" />
                  <path d="M16 16a2 2 0 11-4 0 2 2 0 014 0zM4 18a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Easy Shopping</h3>
              <p className="text-gray-400">
                Seamless checkout and fast, reliable delivery to your door.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-dark-900" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 9a1 1 0 100-2 1 1 0 000 2zm5-1a1 1 0 11-2 0 1 1 0 012 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                Our dedicated team is always here to help with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <JoinTheClub />
    </div>
  );
};

export default HomePage;
