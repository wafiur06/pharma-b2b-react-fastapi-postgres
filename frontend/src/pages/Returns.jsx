import React, { useState, useEffect } from 'react';
import { RotateCcw, Plus, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = () => {
    api.get('/services/returns').then(res => {
      setReturns(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleCreate = async () => {
    const reason = prompt("Enter return reason:");
    if (reason) {
      await api.post('/services/returns', { reason, product_name: "Requested Item" });
      fetchReturns();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Returns & Expiry</h2>
        <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4 mr-1.5" /> Request Return</button>
      </div>
      {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10" /> : returns.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center text-center">
          <RotateCcw className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">No Return Requests</h3>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-4">
          {returns.map(r => <div key={r.id} className="p-3 border-b">{r.product_name} - {r.reason} ({r.status})</div>)}
        </div>
      )}
    </div>
  );
};
export default Returns;