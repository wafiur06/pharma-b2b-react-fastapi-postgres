import React, { useState, useEffect } from 'react';
import { Tags, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services/offers').then(res => {
      setOffers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800">Deals & Offers</h2>
      </div>
      {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10" /> : offers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center text-center">
          <Tags className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">No Active Offers</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.map(offer => (
            <div key={offer.id} className="bg-white p-5 rounded-xl shadow-sm border border-blue-100">
              <h3 className="font-bold text-blue-700">{offer.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{offer.description}</p>
              <div className="mt-4 font-bold text-lg text-emerald-600">{offer.discount_percentage}% OFF</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Offers;