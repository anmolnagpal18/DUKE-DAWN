import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function AdminProducts() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    image: '',
    images: ['', '', '', ''],
    category: 'regular',
    sizes: 'XS,S,M,L,XL,XXL',
    colors: 'Black,White,Navy',
    stock: '',
    limitedDrop: false,
    dropEndDate: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (!showModal) return undefined;

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
  }, [showModal]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        mrp: formData.mrp ? parseFloat(formData.mrp) : parseFloat(formData.price) * 1.2,
        image: formData.image,
        images: formData.images.filter(img => img.trim()),
        category: formData.category,
        sizes: formData.sizes.split(',').map(s => s.trim()),
        colors: formData.colors.split(',').map(c => c.trim()),
        stock: parseInt(formData.stock),
        limitedDrop: formData.limitedDrop,
        dropEndDate: formData.dropEndDate ? new Date(formData.dropEndDate).toISOString() : null
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, payload);
        alert('Product updated successfully');
      } else {
        await api.post('/admin/products', payload);
        alert('Product created successfully');
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        mrp: '',
        image: '',
        images: ['', '', '', ''],
        category: 'regular',
        sizes: 'XS,S,M,L,XL,XXL',
        colors: 'Black,White,Navy',
        stock: '',
        limitedDrop: false,
        dropEndDate: ''
      });
      fetchProducts();
    } catch (error) {
      alert('Error saving product: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp || product.price * 1.2,
      image: product.image,
      images: product.images && product.images.length ? product.images : ['', '', '', ''],
      category: product.category,
      sizes: product.sizes.join(','),
      colors: product.colors.join(','),
      stock: product.stock,
      limitedDrop: product.limitedDrop || false,
      dropEndDate: product.dropEndDate ? product.dropEndDate.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${productId}`);
        setProducts(products.filter(p => p._id !== productId));
        alert('Product deleted successfully');
      } catch (error) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      mrp: '',
      image: '',
      category: 'regular',
      sizes: 'XS,S,M,L,XL,XXL',
      colors: 'Black,White,Navy',
      stock: ''
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center py-20 text-gold-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-black border-b border-gold-500 flex justify-between items-center">
        <div className="max-w-7xl mx-auto px-4 py-6 w-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gold-500">Manage Products</h1>
            <p className="text-dark-300">Total Products: {products.length}</p>
          </div>
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-600 transition"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="group bg-black border border-gold-500/20 rounded-lg overflow-hidden hover:border-gold-500 transition-all duration-500">
              <div className="relative h-64 bg-dark-900 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {product.limitedDrop && (
                    <div className="bg-gold-500 text-black px-2 py-1 text-xs font-bold uppercase">Limited</div>
                  )}
                  {product.stock < 10 && (
                    <div className="bg-red-600 text-white px-2 py-1 text-xs font-semibold">{product.stock} Left</div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="text-gold-500 text-xs tracking-widest uppercase mb-2 font-light">{product.category}</div>
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl font-bold text-gold-400">${product.price}</span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-gray-500 text-sm line-through">${product.mrp}</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4">Stock: {product.stock}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-dark-300">
            No products found
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div ref={modalRef} className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp scroll-smooth" style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
            <div className="sticky top-0 bg-dark-800 border-b border-gold-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gold-500">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-dark-300 hover:text-white text-2xl"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-6">

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gold-500 block mb-2 font-semibold">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gold-500 block mb-2 font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gold-500 block mb-2 font-semibold">Selling Price (SP)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                    className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gold-500 block mb-2 font-semibold">MRP</label>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="Auto: SP × 1.2"
                    className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gold-500 block mb-2 font-semibold">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gold-500 block mb-2 font-semibold">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gold-500 block mb-2 font-semibold">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                >
                  <option value="regular">Regular</option>
                  <option value="signature">Signature</option>
                  <option value="limited">Limited Drop</option>
                </select>
              </div>

              <div>
                <label className="text-gold-500 block mb-2 font-semibold">Sizes (comma-separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gold-500 block mb-2 font-semibold">Colors (comma-separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gold-500 block mb-2 font-semibold">Additional Images (4 slots)</label>
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Image URL ${idx + 1} (optional)`}
                    value={formData.images[idx] || ''}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[idx] = e.target.value;
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="w-full px-4 py-2 mb-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gold-500 block mb-2 font-semibold">Limited Drop?</label>
                  <input
                    type="checkbox"
                    name="limitedDrop"
                    checked={formData.limitedDrop}
                    onChange={(e) => setFormData({ ...formData, limitedDrop: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>
                {formData.limitedDrop && (
                  <div>
                    <label className="text-gold-500 block mb-2 font-semibold">Drop End Date</label>
                    <input
                      type="date"
                      name="dropEndDate"
                      value={formData.dropEndDate}
                      onChange={(e) => setFormData({ ...formData, dropEndDate: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-600 transition"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
