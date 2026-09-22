import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; // Link এখানেই ইম্পোর্ট করা হলো
import api from '../api/axiosConfig';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        phone: phone, 
        password: password
      };

      const response = await api.post('/auth/login', payload);

      const token = response.data.access_token || response.data.token;
      if (token) {
        localStorage.setItem('access_token', token);
        setSuccessMsg('Login Successful! Token saved.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setSuccessMsg('Login Successful! (Pero token pawa jayni)');
      }
      
    } catch (err) {
      console.error("Full Login Error:", err);
      
      let errorMessage = 'Connection Failed! Please check your credentials.';
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = `Validation Error: ${detail[0].loc[detail[0].loc.length - 1]} - ${detail[0].msg}`;
        } else {
          errorMessage = JSON.stringify(detail);
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[380px] bg-gradient-to-b from-[#b895f5] to-[#80a4f9] rounded-[40px] shadow-2xl overflow-hidden p-8 relative flex flex-col justify-center">

        <div className="mt-8 mb-10 text-center">
          <h2 className="text-[28px] font-semibold text-white mb-1 tracking-wide">
            Welcome,
          </h2>
          <p className="text-xl text-white/90 font-light">
            Glad to see you!
          </p>
        </div>

        {error && (
          <div className="bg-red-500/90 text-white text-sm p-3 rounded-xl mb-4 text-center shadow-sm break-words">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/90 text-white text-sm p-3 rounded-xl mb-4 text-center shadow-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              required
              placeholder="Phone Number / Username"
              className="w-full bg-transparent border border-white/60 rounded-xl px-5 py-3.5 text-white placeholder-white/80 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="w-full bg-transparent border border-white/60 rounded-xl px-5 py-3.5 text-white placeholder-white/80 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="text-right mt-2">
              <a href="#" className="text-[13px] text-white/90 hover:text-white font-medium">
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-gray-900 font-semibold py-3.5 rounded-xl shadow-lg hover:bg-gray-50 transition-colors mt-2 flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={18} className="animate-spin text-gray-600" /> : 'Login'}
          </button>
        </form>

        {/* এই অংশটুকু ঠিক করে দেওয়া হয়েছে */}
        <div className="mt-12 text-center mb-4">
          <p className="text-white/80 text-[13px]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white font-bold hover:underline">
              Sign Up Now
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;