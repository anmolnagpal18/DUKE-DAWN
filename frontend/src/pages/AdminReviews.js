import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function AdminReviews() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchReviews();
  }, [user, navigate]);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/admin/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/admin/reviews/${reviewId}`);
      setReviews((prev) => prev.filter(r => r._id !== reviewId));
    } catch (err) {
      console.error('Failed to delete review', err);
      alert('Failed to delete review');
    }
  };

  if (loading) return <div className="text-center py-20 text-gold-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="bg-black border-b border-gold-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gold-500">Manage Reviews</h1>
          <p className="text-dark-300">Total Reviews: {reviews.length}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500">
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Product</th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Reviewer</th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Rating</th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Comment</th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r._id} className="border-b border-dark-700 hover:bg-dark-800 transition">
                  <td className="px-4 py-4 text-white">{r.product?.name || 'N/A'}</td>
                  <td className="px-4 py-4 text-white">{r.name}</td>
                  <td className="px-4 py-4 text-gold-500">{r.rating}</td>
                  <td className="px-4 py-4 text-dark-300">{r.comment}</td>
                  <td className="px-4 py-4 text-dark-300">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => handleDelete(r._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12 text-dark-300">No reviews found</div>
        )}
      </div>
    </div>
  );
}
