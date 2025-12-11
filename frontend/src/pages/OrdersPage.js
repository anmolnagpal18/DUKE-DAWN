import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { orderService } from '../services/api';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gold-400 mb-8">My Orders</h1>
          <div className="bg-dark-800 rounded-lg p-8 text-center border border-gold-500">
            <p className="text-gray-400 text-lg mb-6">You haven't placed any orders yet</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gold-500 text-dark-900 px-8 py-3 rounded font-bold hover-gold"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gold-400 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-dark-800 rounded-lg p-6 border border-gold-500"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-dark-700">
                <div>
                  <p className="text-gray-400 text-sm">Order ID</p>
                  <p className="text-white font-bold text-lg font-mono">
                    {order._id}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-gray-400 text-sm">Order Date</p>
                  <p className="text-white font-bold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className={`font-bold capitalize ${
                    order.status === 'delivered'
                      ? 'text-green-400'
                      : order.status === 'shipped'
                      ? 'text-blue-400'
                      : order.status === 'processing'
                      ? 'text-yellow-400'
                      : 'text-gray-400'
                  }`}>
                    {order.status}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-gray-400 text-sm">Payment</p>
                  <p className="text-white font-bold capitalize">
                    {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-gold-400 font-bold text-2xl">
                    ₹{order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <p className="text-gold-400 font-bold mb-3">Items:</p>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-400 text-sm">
                      <span>
                        {item.name || 'Product'} ({item.size || 'N/A'}, {item.color || 'N/A'})
                      </span>
                      <span>
                        x{item.quantity || 0} - ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </span>
                    </div>
                  )) || []}
                </div>
              </div>

              {/* Shipping Info */}
              <div>
                <p className="text-gold-400 font-bold mb-3">Shipping Address:</p>
                <p className="text-gray-400 text-sm">
                  {order.shippingInfo?.name || 'N/A'}
                  <br />
                  {order.shippingInfo?.address || 'N/A'}
                  <br />
                  {order.shippingInfo?.city || 'N/A'}, {order.shippingInfo?.state || 'N/A'} {order.shippingInfo?.zipCode || 'N/A'}
                  <br />
                  {order.shippingInfo?.country || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
