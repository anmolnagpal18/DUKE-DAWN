import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gold-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-black border-b border-gold-500 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gold-400 mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Welcome back, <span className="text-gold-400 font-semibold">{user?.name}</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Overview Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Users" 
              value={stats?.totalUsers} 
              color="from-blue-500 to-blue-600"
              icon="👥"
            />
            <StatCard 
              title="Admin Users" 
              value={stats?.adminUsers} 
              color="from-gold-500 to-gold-600"
              icon="👑"
            />
            <StatCard 
              title="Regular Users" 
              value={stats?.regularUsers} 
              color="from-green-500 to-green-600"
              icon="👤"
            />
            <StatCard 
              title="Total Products" 
              value={stats?.totalProducts} 
              color="from-purple-500 to-purple-600"
              icon="📦"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard 
            title="Manage Users" 
            description="View and edit user details"
            link="/admin/users"
            icon="👥"
            color="from-blue-500 to-blue-600"
          />
          <ActionCard 
            title="Manage Products" 
            description="Add, edit or delete products"
            link="/admin/products"
            icon="📦"
            color="from-gold-500 to-gold-600"
          />
          <ActionCard 
            title="View Orders" 
            description="Monitor all customer orders"
            link="/admin/orders"
            icon="🛒"
            color="from-green-500 to-green-600"
          />
          <ActionCard 
            title="Manage Reviews" 
            description="View and delete product reviews"
            link="/admin/reviews"
            icon="📝"
            color="from-pink-500 to-pink-600"
          />
          <ActionCard 
            title="Manage Zoom Parallax"
            description="Add or remove images used in Zoom Parallax section"
            link="/admin/carousel"
            icon="🖼️"
            color="from-yellow-500 to-yellow-600"
          />
          <ActionCard 
            title="Contact Submissions" 
            description="View messages from customers"
            link="/admin/contacts"
            icon="✉️"
            color="from-indigo-500 to-indigo-600"
          />
          <ActionCard 
            title="Newsletter Subscribers" 
            description="Manage email subscriptions"
            link="/admin/newsletter"
            icon="📧"
            color="from-teal-500 to-teal-600"
          />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-4xl font-bold">{value || 0}</p>
    </div>
  );
}

function ActionCard({ title, description, link, icon, color }) {
  return (
    <Link to={link}>
      <div className={`bg-gradient-to-br ${color} rounded-lg p-6 text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105 hover:-translate-y-1 border border-transparent hover:border-white/20`}>
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-90 leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center text-sm font-semibold">
          <span>Manage</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
