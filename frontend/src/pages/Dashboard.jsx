import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockCount: 0
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/catalog/products'),
        api.get('/orders/')
      ]);

      const fetchedProducts = productsRes.data || [];
      const fetchedOrders = ordersRes.data || [];

      setProducts(fetchedProducts);
      setOrders(fetchedOrders);

      // মোট রেভিনিউ হিসাব করা
      const revenue = fetchedOrders.reduce((acc, order) => acc + (parseFloat(order.total_amount) || 0), 0);
      
      // লো স্টক প্রোডাক্ট (স্টক ১০ এর কম) কাউন্ট করা
      const lowStock = fetchedProducts.filter(p => (p.stock || 0) < 10).length;

      setStats({
        totalProducts: fetchedProducts.length,
        totalOrders: fetchedOrders.length,
        totalRevenue: revenue,
        lowStockCount: lowStock
      });

    } catch (err) {
      console.error("Dashboard Data Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading dashboard overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans p-2">
      
      {/* Header Greeting */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Pharmacy Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time overview of your inventory and orders</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
          System Online
        </div>
      </div>

      {/* Real Data Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center text-gray-500 text-sm">
            <span>Total Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600 bg-emerald-50 rounded-md p-1" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">৳ {stats.totalRevenue.toFixed(2)}</h2>
          <div className="text-xs text-gray-400">From all completed orders</div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center text-gray-500 text-sm">
            <span>Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-blue-600 bg-blue-50 rounded-md p-1" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{stats.totalOrders}</h2>
          <div className="text-xs text-gray-400">Placed purchase orders</div>
        </div>

        {/* Card 3: Total Products */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center text-gray-500 text-sm">
            <span>Catalog Products</span>
            <Package className="w-5 h-5 text-indigo-600 bg-indigo-50 rounded-md p-1" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{stats.totalProducts}</h2>
          <div className="text-xs text-gray-400">Available in catalog</div>
        </div>

        {/* Card 4: Low Stock */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center text-gray-500 text-sm">
            <span>Low Stock Items</span>
            <AlertTriangle className="w-5 h-5 text-amber-600 bg-amber-50 rounded-md p-1" />
          </div>
          <h2 className="text-3xl font-bold text-amber-600">{stats.lowStockCount}</h2>
          <div className="text-xs text-gray-400">Requires restocking</div>
        </div>

      </div>

      {/* Lower Section: Product Ranking / Inventory Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Product Catalog & Pricing Overview</h3>
        
        {products.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No products found in database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Brand Name</th>
                  <th className="py-3 px-4">Strength</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {products.map((prod, index) => (
                  <tr key={prod.id || index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-blue-600">{prod.brand_name}</td>
                    <td className="py-3 px-4 text-gray-500">{prod.strength || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        (prod.stock || 0) < 10 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {prod.stock || 0} units
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">৳ {prod.price || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;