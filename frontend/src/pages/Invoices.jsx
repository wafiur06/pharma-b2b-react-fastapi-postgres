import React, { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/invoices/').then(res => {
      setInvoices(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800">Invoices & Billing</h2>
      </div>
      
      {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10" /> : invoices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center text-center">
          <FileText className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">No Invoices Yet</h3>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-4">
          {invoices.map(inv => <div key={inv.id} className="p-3 border-b">Invoice #{inv.invoice_number} - ৳{inv.total_amount} ({inv.status})</div>)}
        </div>
      )}
    </div>
  );
};
export default Invoices;