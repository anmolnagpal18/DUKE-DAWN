import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { newsletterService } from '../services/api';

export default function AdminNewsletter() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSendForm, setShowSendForm] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchSubscriptions();
  }, [user, navigate]);

  const fetchSubscriptions = async () => {
    try {
      const response = await newsletterService.getSubscriptions();
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      await newsletterService.deleteSubscription(id);
      setSubscriptions(subscriptions.filter(sub => sub._id !== id));
      alert('Subscription deleted successfully');
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('Failed to delete subscription');
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (!emailData.subject || !emailData.message) {
      alert('Please fill in both subject and message');
      return;
    }

    setSending(true);
    try {
      await newsletterService.sendNewsletter(emailData);
      alert(`Newsletter sent successfully to ${subscriptions.length} subscribers!`);
      setEmailData({ subject: '', message: '' });
      setShowSendForm(false);
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert(`Failed to send newsletter: ${error.response?.data?.message || error.message}`);
    } finally {
      setSending(false);
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
      <div className="bg-black border-b border-gold-500">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gold-500">
              Newsletter Subscriptions
            </h1>
            <p className="text-dark-300">
              Total Subscribers: {subscriptions.length}
            </p>
          </div>
          <button
            onClick={() => setShowSendForm(!showSendForm)}
            className="bg-gold-500 text-dark-900 px-6 py-2 rounded font-bold hover:bg-gold-400 transition"
          >
            Send Newsletter
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showSendForm && (
          <div className="bg-dark-800 rounded-lg p-6 border border-gold-500 mb-8">
            <h2 className="text-2xl font-bold text-gold-500 mb-4">Send Newsletter</h2>
            <form onSubmit={handleSendNewsletter} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
                  placeholder="Enter email subject"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Message</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                  rows={6}
                  className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
                  placeholder="Enter your newsletter message"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-gold-500 text-dark-900 px-6 py-2 rounded font-bold hover:bg-gold-400 transition disabled:opacity-50"
                >
                  {sending ? 'Sending...' : `Send to ${subscriptions.length} Subscribers`}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSendForm(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded font-bold hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500">
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">
                  Subscribed Date
                </th>
                <th className="px-4 py-3 text-left text-gold-500 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr
                  key={subscription._id}
                  className="border-b border-dark-700 hover:bg-dark-800 transition"
                >
                  <td className="px-4 py-4 text-white">
                    {subscription.email}
                  </td>
                  <td className="px-4 py-4 text-dark-300">
                    {new Date(subscription.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleDelete(subscription._id)}
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

        {subscriptions.length === 0 && (
          <div className="text-center py-12 text-dark-300">
            No newsletter subscriptions found
          </div>
        )}
      </div>
    </div>
  );
}