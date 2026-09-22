import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // Adjust the endpoint path if your backend uses a different route for inventory
      const response = await api.get('/inventory/');
      setInventory(response.data || []);
      setError('');
    } catch (err) {
      console.error("Inventory Fetch Error:", err);
      // Fallback message if endpoint doesn't exist yet
      setError(err.response?.data?.detail || 'Failed to load inventory data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item?.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.depot_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Inventory Management</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor real-time stock levels and warehouse distribution</p>
        </div>
        
        <div className="flex w-full sm:w-auto space-x-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500">Loading inventory data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mb-3" />
          <h3 className="text-lg font-medium text-red-800 mb-1">Could not fetch inventory</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchInventory}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      ) : filteredInventory.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No Inventory Records Found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm ? `No results match "${searchTerm}"` : 'Your inventory list is currently empty.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Product Name</th>
                <th className="py-3.5 px-6">Depot / Warehouse</th>
                <th className="py-3.5 px-6">Quantity in Stock</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {filteredInventory.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{item.product_name || 'N/A'}</td>
                  <td className="py-4 px-6 text-gray-500">{item.depot_name || 'Main Warehouse'}</td>
                  <td className="py-4 px-6 font-semibold">{item.quantity ?? 0} units</td>
                  <td className="py-4 px-6">
                    {(item.quantity ?? 0) > 10 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" /> In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;