import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminCarousel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return navigate('/');
    fetchItems();
  }, [user, navigate]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCarousel();
      setItems(res.data.items || []);
    } catch (err) {
      console.error('Error fetching carousel items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    if (items.length >= 6) {
      alert('Maximum 6 images allowed');
      return;
    }
    try {
      await adminService.createCarouselItem({ image: imageUrl, alt: '', order: items.length, active: true, isCenter: false });
      setImageUrl('');
      fetchItems();
    } catch (err) {
      console.error('Add error', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await adminService.deleteCarouselItem(id);
      fetchItems();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  if (loading) return <div className="text-center py-20 text-gold-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="bg-black border-b border-gold-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gold-400">Manage Zoom Parallax Images</h1>
          <p className="text-gray-400 mt-2">Add or remove images for the homepage gallery</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Image Form */}
        <form onSubmit={handleAdd} className="bg-dark-800 rounded-lg p-6 mb-8 border border-gold-500">
          <div className="flex gap-4">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg focus:outline-none focus:border-gold-500"
              required
              disabled={items.length >= 6}
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={items.length >= 6}
            >
              Add Image
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-2">{items.length}/6 images added</p>
        </form>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="group relative bg-black border border-gold-500/20 rounded-lg overflow-hidden hover:border-gold-500 transition-all duration-500">
              <div className="relative h-80 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.alt || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300?text=Image+Error'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No images added yet. Add your first image above.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCarousel;
