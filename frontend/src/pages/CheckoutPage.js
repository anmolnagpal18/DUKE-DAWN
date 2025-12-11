import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { cartService, orderService } from '../services/api';

const CheckoutPage = ({ onOrderComplete }) => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'online',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [token, navigate]);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.paymentMethod === 'online') {
        await handleOnlinePayment();
      } else {
        await handleCODOrder();
      }
    } catch (error) {
      console.error('Error processing order:', error);
      if (error.response?.data?.message === 'Razorpay not configured') {
        alert('Online payment is currently unavailable. Please use Cash on Delivery.');
      } else {
        alert(`Failed to process order: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCODOrder = async () => {
    const response = await orderService.createOrder({
      shippingInfo: formData,
      paymentMethod: 'cod',
    });

    if (onOrderComplete) {
      onOrderComplete();
    }

    navigate(`/order-confirmation/${response.data.orderId}`);
  };

  const handleOnlinePayment = async () => {
    try {
      console.log('Creating Razorpay order...');
      const response = await orderService.createRazorpayOrder({ shippingInfo: formData });
      console.log('Razorpay order response:', response.data);
      
      // Check if this is a demo order (Razorpay not configured)
      if (response.data.isDemoOrder) {
        alert('Demo Mode: Order created successfully! (Razorpay not configured)');
        
        if (onOrderComplete) {
          onOrderComplete();
        }
        
        navigate(`/order-confirmation/${response.data.orderId}`);
        return;
      }
      
      const options = {
        key: response.data.key,
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'DUKE & DAWN Store',
        description: 'Order Payment',
        order_id: response.data.orderId,
        handler: async (paymentResponse) => {
          try {
            console.log('Payment successful, verifying...', paymentResponse);
            const verifyResponse = await orderService.verifyPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              shippingInfo: formData,
            });

            if (onOrderComplete) {
              onOrderComplete();
            }

            navigate(`/order-confirmation/${verifyResponse.data.orderId}`);
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#D4AF37',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gold-400 mb-8">Checkout</h1>
          <div className="bg-dark-800 rounded-lg p-8 text-center border border-gold-500">
            <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gold-500 text-dark-900 px-8 py-3 rounded font-bold hover-gold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gold-400 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-dark-800 rounded-lg p-8 border border-gold-500">
              <h2 className="text-2xl font-bold text-gold-400 mb-6">Shipping Information</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-6 pt-6 border-t border-gold-500/30">
                  <h3 className="text-xl font-bold text-gold-400 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                      formData.paymentMethod === 'online' 
                        ? 'border-gold-500 bg-gold-500/10' 
                        : 'border-gold-500/30 hover:border-gold-500'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-gold-500 bg-dark-900 border-gold-400 focus:ring-gold-500"
                      />
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <div>
                          <div className="text-white font-semibold">Online Payment</div>
                          <div className="text-gray-400 text-sm">Pay securely with card or UPI</div>
                        </div>
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                      formData.paymentMethod === 'cod' 
                        ? 'border-gold-500 bg-gold-500/10' 
                        : 'border-gold-500/30 hover:border-gold-500'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-gold-500 bg-dark-900 border-gold-400 focus:ring-gold-500"
                      />
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        <div>
                          <div className="text-white font-semibold">Cash on Delivery</div>
                          <div className="text-gray-400 text-sm">Pay when you receive your order</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold-500 text-dark-900 py-3 rounded font-bold text-lg hover-gold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isSubmitting ? 'Processing...' : `Place Order - ${formData.paymentMethod === 'cod' ? 'COD' : 'Pay Online'}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-dark-800 rounded-lg p-6 border border-gold-500 h-fit">
            <h2 className="text-2xl font-bold text-gold-400 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {cart.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-400 border-b border-dark-700 pb-2">
                  <div className="flex-1">
                    <p className="text-white font-semibold line-clamp-1">
                      {item.product?.name}
                    </p>
                    <p className="text-xs">
                      {item.size} | {item.color} x{item.quantity}
                    </p>
                  </div>
                  <p className="text-white font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-b border-dark-700 pb-6 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax (10%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-gold-400">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <p className="text-gray-400 text-xs mt-4 text-center">
              This is a demo. No real payment processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
