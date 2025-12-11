import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function AdminUsers() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      alert('User role updated');
      setShowModal(false);
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-20 text-gold-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-black border-b border-gold-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gold-500">Manage Users</h1>
          <p className="text-dark-300">Total Users: {users.length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-dark-900 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none focus:border-gold-600"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500">
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Joined</th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u._id} className="border-b border-dark-700 hover:bg-dark-800 transition">
                  <td className="px-4 py-4 text-white">{u.name}</td>
                  <td className="px-4 py-4 text-dark-300">{u.email}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      u.role === 'admin' 
                        ? 'bg-gold-500 text-dark-900' 
                        : 'bg-dark-700 text-dark-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-dark-300">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-dark-300">
            No users found
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold text-gold-500 mb-4">Edit User</h2>
            <p className="text-white mb-4">Name: {selectedUser.name}</p>
            <p className="text-dark-300 mb-6">Email: {selectedUser.email}</p>
            
            <div className="mb-4">
              <label className="text-gold-500 block mb-2 font-semibold">Change Role</label>
              <select
                defaultValue={selectedUser.role}
                onChange={(e) => handleChangeRole(selectedUser._id, e.target.value)}
                className="w-full px-4 py-2 bg-dark-900 border border-gold-500 text-white rounded-lg focus:outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
