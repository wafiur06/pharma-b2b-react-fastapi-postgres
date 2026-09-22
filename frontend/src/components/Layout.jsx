import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  LogOut, 
  HeartPulse,
  Bell,
  User,
  Search,
  Settings,
  X,
  ShieldCheck,
  Phone,
  FileText,
  RotateCcw,
  Tags,
  Truck,
  Headset
} from 'lucide-react';
import api from '../api/axiosConfig';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [userData, setUserData] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // প্রফেশনাল মোডাল স্টেট
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/auth/me'); 
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchUserProfile();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Ekhane sob gulo notun service add kora hoyeche ebong Inventory ke My Stock kora hoyeche
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Catalog', icon: Package, path: '/catalog' },
    { name: 'My Stock', icon: ClipboardList, path: '/inventory' },
    { name: 'Orders', icon: ShoppingCart, path: '/orders' },
    { name: 'Invoices & Billing', icon: FileText, path: '/invoices' },
    { name: 'Returns & Expiry', icon: RotateCcw, path: '/returns' },
    { name: 'Deals & Offers', icon: Tags, path: '/offers' },
    { name: 'Track Shipments', icon: Truck, path: '/tracking' },
    { name: 'Support', icon: Headset, path: '/support' },
  ];

  const displayName = userData?.name || userData?.username || userData?.phone || '01712345678';
  const role = userData?.role || 'Administrator';

  return (
    <div className="flex h-screen bg-[#f0f2f5] font-sans relative">
      
      {/* Sidebar - Dark Theme */}
      <div className="w-[256px] bg-[#001529] flex flex-col shadow-xl z-20 transition-all duration-300">
        <div className="h-16 flex items-center px-6 bg-[#002140]">
          <HeartPulse className="w-8 h-8 text-white mr-3" />
          <span className="text-xl font-bold text-white tracking-wide">Pharma B2B</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-md transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-[#1677ff] text-white font-medium shadow-md' 
                      : 'text-white/65 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-white/65'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 bg-[#001529]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-md transition-colors font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center text-lg font-semibold text-gray-800">
            {menuItems.find(item => item.path === location.pathname)?.name || 'Panel'}
          </div>
          
          <div className="flex items-center space-x-5 text-gray-500">
            <button className="hover:text-blue-600 transition-colors cursor-pointer">
              <Search className="w-5 h-5" />
            </button>
            <button className="hover:text-blue-600 transition-colors cursor-pointer">
              <Settings className="w-5 h-5" />
            </button>
            <button className="relative hover:text-blue-600 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Dynamic User Profile Area with Clickable Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center pl-4 border-l border-gray-200 ml-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors select-none"
              >
                <div className="hidden md:block text-right mr-3">
                  <div className="text-sm font-semibold text-gray-800">{displayName}</div>
                  <div className="text-xs text-gray-500">{role}</div>
                </div>
                <div className="h-10 w-10 bg-[#e6f4ff] rounded-full flex items-center justify-center border border-[#91caff] shadow-sm text-[#1677ff]">
                  <User className="w-5 h-5" />
                </div>
              </div>

              {/* Professional Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-gray-800 truncate mt-0.5">{displayName}</p>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">{role}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-3 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span>My Profile Details</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors cursor-pointer font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Logout System</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* End of User Profile Area */}

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f0f2f5] p-6">
          {children}
        </main>
      </div>

      {/* Professional Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-lg font-bold text-2xl">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{displayName}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {role}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Account Phone</p>
                  <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Access Role</p>
                  <p className="text-sm font-semibold text-gray-800">{role} Access</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Layout;