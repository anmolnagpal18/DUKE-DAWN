import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-8 text-center mb-8">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold text-green-400 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-300 text-lg">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-dark-800 rounded-lg p-8 border border-gold-500 mb-8">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-dark-700">
            <div>
              <p className="text-gray-400 text-sm mb-1">Order ID</p>
              <p className="text-white font-bold text-lg font-mono break-all">
                {order._id}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Order Date</p>
              <p className="text-white font-bold">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-yellow-400 font-bold capitalize">
                {order.status}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Payment Method</p>
              <p className="text-white font-bold capitalize">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Amount</p>
              <p className="text-gold-400 font-bold text-xl">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gold-400 mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-dark-900 rounded border border-dark-700"
                >
                  <div className="flex-1">
                    <p className="text-white font-semibold">{item.name || 'Product'}</p>
                    <p className="text-gray-400 text-sm">
                      Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'} | Qty: {item.quantity || 0}
                    </p>
                  </div>
                  <p className="text-gold-400 font-bold">
                    ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </p>
                </div>
              )) || []}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-dark-700 pt-6 space-y-3">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal:</span>
              <span>₹{(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax (10%):</span>
              <span>₹{(order.tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gold-400">
              <span>Total:</span>
              <span>₹{(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-dark-800 rounded-lg p-8 border border-gold-500 mb-8">
          <h3 className="text-xl font-bold text-gold-400 mb-4">Shipping Address</h3>
          <div className="text-gray-400">
            <p className="font-semibold text-white">{order.shippingInfo?.name || 'N/A'}</p>
            <p>{order.shippingInfo?.address || 'N/A'}</p>
            <p>
              {order.shippingInfo?.city || 'N/A'}, {order.shippingInfo?.state || 'N/A'}{' '}
              {order.shippingInfo?.zipCode || 'N/A'}
            </p>
            <p>{order.shippingInfo?.country || 'N/A'}</p>
            <p className="mt-3">Email: {order.shippingInfo?.email || 'N/A'}</p>
            <p>Phone: {order.shippingInfo?.phone || 'N/A'}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-blue-400 mb-3">What's Next?</h3>
          <ul className="text-gray-300 space-y-2 list-disc list-inside">
            <li>
              You will receive a confirmation email shortly with tracking information
            </li>
            <li>Your order will be processed and shipped within 2-3 business days</li>
            <li>You can track your order from the "My Orders" page anytime</li>
            <li>If you have any questions, please contact our support team</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/shop')}
            className="flex-1 bg-gold-500 text-dark-900 py-3 rounded font-bold text-lg hover-gold"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 border-2 border-gold-400 text-gold-400 py-3 rounded font-bold text-lg hover:bg-gold-500 hover:text-dark-900 transition"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
