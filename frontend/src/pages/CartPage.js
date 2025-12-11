import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { cartService } from '../services/api';

const CartPage = ({ onCartChange }) => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editSize, setEditSize] = useState('');
  const [editColor, setEditColor] = useState('');

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

  const handleRemoveItem = async (productId, size, color) => {
    try {
      await cartService.removeFromCart({ productId, size, color });
      fetchCart();
      if (onCartChange) onCartChange(); // Update navbar count
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateQuantity = async (productId, size, color, quantity) => {
    if (quantity <= 0) return;
    try {
      await cartService.updateCartItem({
        productId,
        size,
        color,
        quantity,
      });
      fetchCart();
      if (onCartChange) onCartChange(); // Update navbar count
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditSize(item.size);
    setEditColor(item.color);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      // Remove the old item
      await cartService.removeFromCart({
        productId: editingItem.product._id,
        size: editingItem.size,
        color: editingItem.color,
      });
      // Add the new item with updated size/color
      await cartService.addToCart({
        productId: editingItem.product._id,
        size: editSize,
        color: editColor,
        quantity: editingItem.quantity,
        price: editingItem.price,
      });
      fetchCart();
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item details:', error);
      alert('Failed to update item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gold-400 mb-8">Shopping Cart</h1>
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
        <h1 className="text-4xl font-bold text-gold-400 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-dark-800 rounded-lg overflow-hidden border border-gold-500">
              {cart.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-6 flex gap-4 ${
                    idx !== cart.items.length - 1 ? 'border-b border-dark-700' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-dark-900 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {item.product?.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      Size: <span className="text-gold-400">{item.size}</span> |
                      Color: <span className="text-gold-400">{item.color}</span>
                    </p>
                    <p className="text-gold-400 font-bold">
                      ₹{item.price.toFixed(2)} each
                    </p>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-semibold mt-2"
                    >
                      Edit Size/Color
                    </button>
                  </div>

                  {/* Quantity & Price */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="bg-dark-700 text-gold-400 px-2 py-1 rounded hover:bg-gold-500 hover:text-dark-900"
                      >
                        −
                      </button>
                      <span className="w-8 text-white font-semibold text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="bg-dark-700 text-gold-400 px-2 py-1 rounded hover:bg-gold-500 hover:text-dark-900"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-white font-bold mb-3">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() =>
                        handleRemoveItem(
                          item.product._id,
                          item.size,
                          item.color
                        )
                      }
                      className="text-red-400 hover:text-red-300 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-dark-800 rounded-lg p-6 border border-gold-500 h-fit">
            <h2 className="text-2xl font-bold text-gold-400 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 border-b border-dark-700 pb-6">
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

            <div className="flex justify-between text-xl font-bold text-gold-400 mb-6">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gold-500 text-dark-900 py-3 rounded font-bold text-lg hover-gold mb-4"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="w-full border-2 border-gold-400 text-gold-400 py-3 rounded font-bold hover:bg-gold-500 hover:text-dark-900 transition"
            >
              Continue Shopping
            </button>

            <p className="text-gray-400 text-xs text-center mt-4">
              Free shipping on orders over ₹100
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full border border-gold-500">
            <h2 className="text-2xl font-bold text-gold-500 mb-4">Edit {editingItem.product?.name}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gold-500 font-semibold mb-2">Size</label>
                <select
                  value={editSize}
                  onChange={(e) => setEditSize(e.target.value)}
                  className="w-full bg-dark-900 text-white border border-gold-500 rounded px-3 py-2"
                >
                  {editingItem.product?.sizes?.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gold-500 font-semibold mb-2">Color</label>
                <select
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  className="w-full bg-dark-900 text-white border border-gold-500 rounded px-3 py-2"
                >
                  {editingItem.product?.colors?.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gold-500 text-dark-900 py-2 rounded font-semibold hover:bg-gold-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-dark-700 text-white py-2 rounded font-semibold hover:bg-dark-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
