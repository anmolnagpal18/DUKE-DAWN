import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function AdminOrders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (!selectedOrder) return undefined;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const modalEl = modalRef.current;
    const handleWheel = (e) => {
      if (modalEl && modalEl.contains(e.target)) {
        e.stopPropagation();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [selectedOrder]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(
        `/admin/orders/${orderId}/status`,
        { status: newStatus }
      );
      const updatedOrder = response.data.order;
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.delete(`/admin/orders/${orderId}`);
      setOrders(orders.filter(o => o._id !== orderId));
      alert('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gold-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-black border-b border-gold-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gold-500">
            Manage Orders
          </h1>
          <p className="text-dark-300">
            Total Orders: {orders.length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500">
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-dark-700 hover:bg-dark-800 transition"
                >
                  <td className="px-4 py-4 text-white font-mono cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    {order._id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-4 text-white cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    {order.shippingInfo?.name}
                  </td>
                  <td className="px-4 py-4 text-dark-300 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-gold-500 font-semibold cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    ${order.total?.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-white cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="bg-dark-800 text-white border border-dark-700 rounded px-3 py-1"
                    >
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="canceled">canceled</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12 text-dark-300">
            No orders found
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn"
          style={{ overscrollBehavior: 'contain' }}
        >
          <div
            ref={modalRef}
            className="bg-dark-800 border border-gold-500 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp scroll-smooth"
            style={{ overscrollBehavior: 'contain', touchAction: 'pan-y', WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-dark-800 border-b border-gold-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gold-500">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-dark-300 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {/* Order Header Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-dark-300 text-sm">Order ID</p>
                  <p className="text-white font-mono">
                    {selectedOrder._id}
                  </p>
                </div>
                <div>
                  <p className="text-dark-300 text-sm">Order Date</p>
                  <p className="text-white">
                    {new Date(
                      selectedOrder.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-dark-300 text-sm">Status</p>
                  <p className="text-gold-500 font-semibold capitalize">
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <p className="text-dark-300 text-sm">Payment Method</p>
                  <p className="text-white capitalize">
                    {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                </div>
                <div>
                  <p className="text-dark-300 text-sm">Customer</p>
                  <p className="text-white">
                    {selectedOrder.shippingInfo?.name}
                  </p>
                </div>
              </div>

              {/* Items Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gold-500 mb-4">
                  Items Ordered
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items &&
                  selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-dark-900 p-4 rounded border border-dark-700"
                      >
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <p className="text-dark-300 text-sm">
                              Product Name
                            </p>
                            <p className="text-white font-semibold">
                              {item.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-dark-300 text-sm">
                              Price (SP)
                            </p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-gold-500 font-semibold">
                                ${item.price?.toFixed(2)}
                              </p>
                              {item.mrp && item.mrp > item.price && (
                                <p className="text-gray-500 text-xs line-through">
                                  ${item.mrp?.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-dark-300 text-sm">
                              Quantity
                            </p>
                            <p className="text-white font-semibold">
                              {item.quantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-dark-300 text-sm">
                              Size
                            </p>
                            <p className="text-white font-semibold capitalize">
                              {item.size || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-dark-300 text-sm">
                              Color
                            </p>
                            <p className="text-white font-semibold capitalize">
                              {item.color || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-dark-700">
                          <p className="text-dark-300 text-sm">
                            Item Subtotal
                          </p>
                          <p className="text-gold-500 font-semibold">
                            $
                            {(
                              item.price * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-dark-300">
                      No items in this order
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-dark-900 p-4 rounded border border-dark-700 mb-6">
                <h3 className="text-lg font-bold text-gold-500 mb-4">
                  Pricing Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-dark-300">Subtotal:</span>
                    <span className="text-white">
                      ${selectedOrder.subtotal?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-300">Tax:</span>
                    <span className="text-white">
                      ${selectedOrder.tax?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-dark-700 pt-2 mt-2">
                    <span className="text-gold-500 font-semibold">
                      Total:
                    </span>
                    <span className="text-gold-500 font-bold text-lg">
                      ${selectedOrder.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-dark-900 p-4 rounded border border-dark-700">
                <h3 className="text-lg font-bold text-gold-500 mb-4">
                  Shipping Address
                </h3>
                <div className="grid grid-cols-2 gap-4 text-dark-300 text-sm">
                  <div>
                    <p>
                      Name:{' '}
                      <span className="text-white">
                        {selectedOrder.shippingInfo?.name}
                      </span>
                    </p>
                    <p>
                      Email:{' '}
                      <span className="text-white">
                        {selectedOrder.shippingInfo?.email}
                      </span>
                    </p>
                    <p>
                      Phone:{' '}
                      <span className="text-white">
                        {selectedOrder.shippingInfo?.phone}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Address:{' '}
                      <span className="text-white">
                        {selectedOrder.shippingInfo?.address}
                      </span>
                    </p>
                    <p>
                      City:{' '}
                      <span className="text-white">
                        {selectedOrder.shippingInfo?.city}
                      </span>
                    </p>
                    <p>
                      State:{' '}
                      <span className="text-white">
                        {selectedOrder.shippingInfo?.state}
                      </span>
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p>
                      ZIP Code:{' '}
                      <span className="text-white">
                        {selectedOrder.shippingInfo?.zipCode}
                      </span>
                    </p>
                    <p>
                      Country:{' '}
                      <span className="text-white">
                        {selectedOrder.shippingInfo?.country}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
