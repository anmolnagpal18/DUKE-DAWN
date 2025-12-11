import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await adminService.getContacts();
      setContacts(res.data);
    } catch (err) {
      console.error('Error fetching contacts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact submission?')) return;
    try {
      await adminService.deleteContact(id);
      setContacts(contacts.filter(c => c._id !== id));
    } catch (err) {
      console.error('Error deleting contact', err);
      alert('Failed to delete contact');
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="bg-black border-b border-gold-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-gold-400">Contact Submissions</h2>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-400">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c._id} className="bg-dark-800 p-4 rounded border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-white font-bold">{c.name} <span className="text-gray-400 text-sm">— {c.email}</span></div>
                  {c.subject && <div className="text-gold-400 text-sm">{c.subject}</div>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleString()}</div>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-gray-300 whitespace-pre-wrap">{c.message}</div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminContacts;
