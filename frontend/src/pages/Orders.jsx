import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, CheckCircle2, XCircle, Loader2, X, Package, Building2, Trash2, PlusCircle } from 'lucide-react';
import api from '../api/axiosConfig';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Order Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  
  // Custom items list for the order
  const [orderItems, setOrderItems] = useState([{ product_id: '', quantity: 1 }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/');
      setOrders(response.data || []);
      setError('');
    } catch (err) {
      console.error("Orders Fetch Error:", err);
      setError(err.response?.data?.detail || 'Failed to load orders data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/catalog/products');
      setProducts(response.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleOpenCreateModal = () => {
    setOrderItems([{ product_id: '', quantity: 1 }]);
    setIsModalOpen(true);
  };

  const handleAddItemRow = () => {
    setOrderItems([...orderItems, { product_id: '', quantity: 1 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (orderItems.length === 1) return;
    const updated = orderItems.filter((_, i) => i !== index);
    setOrderItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    setOrderItems(updated);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete Order #${orderId}?`)) return;
    try {
      await api.delete(`/orders/${orderId}`);
      fetchOrders();
    } catch (err) {
      console.error("Delete Order Error:", err);
      alert(err.response?.data?.detail || 'Failed to delete order.');
    }
  };

  const handleSaveCustomOrder = async (e) => {
    e.preventDefault();
    for (let item of orderItems) {
      if (!item.product_id) {
        alert('Please select a product for all rows.');
        return;
      }
    }

    try {
      setSubmitting(true);
      const orderPayload = {
        items: orderItems.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity || 1)
        }))
      };

      await api.post('/orders/', orderPayload);

      setIsModalOpen(false);
      setOrderItems([{ product_id: '', quantity: 1 }]);
      fetchOrders();
      alert('Custom order placed successfully and inventory stock updated!');
    } catch (err) {
      console.error("Save Order Error:", err);
      alert(err.response?.data?.detail || 'Failed to place order. Check stock availability.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order?.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    order?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order?.items?.some(item => 
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans relative">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Orders Management</h2>
          <p className="text-sm text-gray-500 mt-1">Track purchase orders and transaction history</p>
        </div>
        
        <div className="flex w-full sm:w-auto space-x-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search orders, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center px-4 py-2 bg-[#1677ff] text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Custom Order
          </button>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg flex flex-col items-center justify-center text-center">
          <XCircle className="w-12 h-12 text-red-400 mb-3" />
          <h3 className="text-lg font-medium text-red-800 mb-1">Could not fetch orders</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button onClick={fetchOrders} className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium">
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">No Orders Found</h3>
          <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Ordered Product & Company</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Total Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {filteredOrders.map((order, index) => (
                <tr key={order.id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">#{order.id || index + 1}</td>
                  
                  <td className="py-4 px-6">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="space-y-1 mb-2 last:mb-0">
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="font-semibold text-gray-900">{item.product_name}</span>
                            <span className="text-xs text-gray-500">({item.strength})</span>
                            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-xs text-gray-500 pl-6">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            <span>Company: <strong className="text-gray-700">{item.company_name || 'N/A'}</strong></span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">No items details</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-gray-500">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800">
                    ৳ {order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {order.status || 'Completed'}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Create Custom Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomOrder} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Select Products & Quantities</label>
                
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <select
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      >
                        <option value="">-- Choose Product --</option>
                        {products.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.brand_name || 'Unknown'} {prod.strength ? `(${prod.strength})` : ''} - ৳ {prod.price || 0} (Stock: {prod.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-28">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      />
                    </div>

                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 pt-1 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Add Another Product
                </button>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#1677ff] text-white rounded-lg hover:bg-blue-600 text-sm font-medium flex items-center disabled:bg-blue-300 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Place Custom Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;