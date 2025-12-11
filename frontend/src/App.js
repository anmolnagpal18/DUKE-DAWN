import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { cartService, wishlistService } from './services/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import SignatureCollectionPage from './pages/SignatureCollectionPage';
import LimitedDropPage from './pages/LimitedDropPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminContacts from './pages/AdminContacts';
import AdminReviews from './pages/AdminReviews';
import AdminCarousel from './pages/AdminCarousel';
import AdminNewsletter from './pages/AdminNewsletter';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import './index.css';

function AppContent() {
  const { token, user } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (token && user) {
      fetchCart();
      fetchWishlist();
    } else {
      setCartCount(0);
      setWishlistCount(0);
    }
  }, [token, user]);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartCount(0);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await wishlistService.getWishlist();
      console.log('Wishlist response:', response.data); // Debug log
      const count = response.data?.products?.length || 0;
      console.log('Wishlist count:', count); // Debug log
      setWishlistCount(count);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistCount(0);
    }
  };

  const handleAddToCart = async (cartItem) => {
    if (!token || !user) {
      alert('Please sign in to add items to cart');
      window.location.href = '/login';
      return;
    }

    try {
      await cartService.addToCart(cartItem);
      fetchCart();
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!token || !user) {
      alert('Please sign in to add items to wishlist');
      window.location.href = '/login';
      return;
    }

    try {
      await wishlistService.addToWishlist(productId);
      fetchWishlist();
      alert('Item added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add item to wishlist');
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark-900">
        <Navbar cartCount={cartCount} wishlistCount={wishlistCount} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />} />
            <Route path="/shop" element={<ShopPage onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />} />
            <Route path="/signature" element={<SignatureCollectionPage onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />} />
            <Route path="/limited" element={<LimitedDropPage onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />} />
            <Route path="/product/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cart" element={<CartPage onCartChange={fetchCart} />} />
            <Route path="/wishlist" element={<WishlistPage onAddToCart={handleAddToCart} onWishlistChange={fetchWishlist} />} />
            <Route path="/checkout" element={token ? <CheckoutPage onOrderComplete={fetchCart} /> : <Navigate to="/login" />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={token ? <OrdersPage /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/contacts" element={<AdminContacts />} />
              <Route path="/admin/carousel" element={<AdminCarousel />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/newsletter" element={<AdminNewsletter />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
