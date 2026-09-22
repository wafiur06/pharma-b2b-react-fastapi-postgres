import React, { useState } from 'react';
import { Truck, Search } from 'lucide-react';
import api from '../api/axiosConfig';

const Tracking = () => {
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if(!orderId) return;
    try {
      setError('');
      const res = await api.get(`/services/tracking/${orderId}`);
      setResult(res.data);
    } catch (err) {
      setResult(null);
      setError('Order not found or invalid ID.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Track Shipments</h2>
        <div className="relative flex space-x-2">
          <input type="number" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID..." className="pl-4 pr-4 py-2 border rounded-lg" />
          <button onClick={handleTrack} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Track</button>
        </div>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {result ? (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
          <h3 className="text-xl font-bold text-green-700">Order #{result.order_id}</h3>
          <p className="text-gray-700 mt-2">Status: <span className="font-bold uppercase">{result.status}</span></p>
          <p className="text-gray-600">Total: ৳{result.amount}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center text-center">
          <Truck className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">Enter Order ID to Track</h3>
        </div>
      )}
    </div>
  );
};
export default Tracking;