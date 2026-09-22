import React, { useState, useEffect } from 'react';
import { Headset, Plus, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    api.get('/services/support/tickets').then(res => {
      setTickets(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleCreate = async () => {
    const subject = prompt("Ticket Subject:");
    const message = prompt("Describe your issue:");
    if (subject && message) {
      await api.post('/services/support/tickets', { subject, message });
      fetchTickets();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Help & Support</h2>
        <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4 inline mr-1" /> New Ticket</button>
      </div>
      {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10" /> : tickets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center text-center">
          <Headset className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">How can we help?</h3>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-4">
          {tickets.map(t => <div key={t.id} className="p-3 border-b"><strong>{t.subject}</strong>: {t.message} <span className="float-right text-sm bg-gray-100 px-2 py-1 rounded">{t.status}</span></div>)}
        </div>
      )}
    </div>
  );
};
export default Support;