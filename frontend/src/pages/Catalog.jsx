import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Package, AlertCircle, Loader2, X, Plus, Minus } from 'lucide-react';
import api from '../api/axiosConfig';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cart States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const response = await api.get('/catalog/products');
      
      // কনসোলে চেক করার জন্য প্রিন্ট করা হলো
      console.log("Catalog API Response:", response.data);
      
      // রেসপন্স অ্যারে হোক বা অবজেক্টের ভেতর আইটেম হোক, সেটি সেভ করার নিরাপদ উপায়:
      const productList = Array.isArray(response.data) 
        ? response.data 
        : response.data.items || response.data.products || [];
        
      setProducts(productList);
      setError('');
    } catch (err) {
      console.error("Catalog Fetch Error:", err);
      setError('Failed to load catalog data. Please make sure the backend is running properly.');
    } finally {
      setLoading(false);
    }
  };

  // Add to Cart Handler
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // আইটেম যোগ করলেই কার্ট ড্রয়ার ওপেন হবে
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (productId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Checkout / Place Order Handler
  const handleCheckout = async () => {
  try {
    // কার্টের আইটেমগুলোকে ব্যাকএন্ডের ফরম্যাটে রূপান্তর করা
    const cartItemsPayload = {
      items: cart.map(item => ({
        product_id: parseInt(item.id || item.product_id),
        quantity: parseInt(item.quantity)
      }))
    };

    // পুরনো '/orders/checkout' এর বদলে সরাসরি ডেটাবেস সমর্থিত '/orders/' রাউটে POST রিকোয়েস্ট পাঠানো
    await api.post('/orders/', cartItemsPayload);

    alert('Order placed successfully and stock updated!');
    setCart([]); // কার্ট ক্লিয়ার করা
    setIsCartOpen(false); // কার্ট ড্রয়ার বন্ধ করা
  } catch (err) {
    console.error("Checkout Error:", err);
    alert(err.response?.data?.detail || 'Failed to checkout. Check stock or try again.');
  }
};

  const filteredProducts = products.filter(product => 
  product?.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
  product?.strength?.toLowerCase().includes(searchTerm.toLowerCase())
);


  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans relative pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Product Catalog</h2>
          <p className="text-sm text-gray-500 mt-1">Browse and order medicines for your pharmacy</p>
        </div>
        
        <div className="flex w-full sm:w-auto space-x-3 items-center">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          {/* Cart Button with Badge */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center px-4 py-2 bg-[#1677ff] text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500">Loading catalog...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
          <h3 className="text-lg font-medium text-red-800 mb-1">Oops! Something went wrong</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={fetchCatalog}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No Products Found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm ? `No results match your search for "${searchTerm}"` : 'Your catalog is currently empty. Add products from the backend.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.id || index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-48 bg-gray-50 flex items-center justify-center border-b border-gray-100 relative">
                <Package className="w-16 h-16 text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                {product.stock > 0 ? (
                  <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">In Stock</span>
                ) : (
                  <span className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">Out of Stock</span>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">
                  {product.category || 'Medicine'}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                   {product.brand_name || 'Unknown Product'}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-1">
                   Strength: {product.strength || 'N/A'} | Form: {product.dosage_form || 'N/A'}
                </p>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ৳ {product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Box of {product.pack_size || '10'}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.stock || product.stock <= 0}
                    className="w-full flex items-center justify-center px-4 py-2.5 bg-[#1677ff] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                Your Cart ({totalCartItems})
              </h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex-1 pr-3">
                      <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500">৳ {item.price} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                <div className="flex justify-between items-center text-base font-bold text-gray-800">
                  <span>Total Amount:</span>
                  <span>৳ {totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={submitting}
                  className="w-full py-3 bg-[#1677ff] text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors disabled:bg-blue-300 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Place Order Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Catalog;