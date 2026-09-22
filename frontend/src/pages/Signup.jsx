import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password complexity regex: Minimum 8 characters, at least 1 uppercase letter, and 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    // Check if password meets the complex rules
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long, include 1 uppercase letter and 1 number.');
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match! Please check again.');
      return;
    }

    setLoading(true);

    try {
      // Send signup data to the backend
      await api.post('/users/', {
        name: formData.name,
        phone: formData.phone,
        password: formData.password
      });
      
      // Redirect to login page without alert
      navigate('/'); 
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.detail || 'Failed to create account. Phone number might already exist.');
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[380px] bg-gradient-to-b from-[#b895f5] to-[#80a4f9] rounded-[40px] shadow-2xl overflow-hidden p-8 relative flex flex-col justify-center">

        <div className="mt-4 mb-8 text-center">
          <h2 className="text-[28px] font-semibold text-white mb-1 tracking-wide">
            Create Account
          </h2>
          <p className="text-[15px] text-white/90 font-light">
            Join Pharma B2B today!
          </p>
        </div>

        {error && (
          <div className="bg-red-500/90 text-white text-sm p-3 rounded-xl mb-4 text-center shadow-sm break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name / Pharmacy Name"
              className="w-full bg-transparent border border-white/60 rounded-xl px-5 py-3.5 text-white placeholder-white/80 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              type="text"
              name="phone"
              required
              placeholder="Phone Number (e.g. 01712345678)"
              className="w-full bg-transparent border border-white/60 rounded-xl px-5 py-3.5 text-white placeholder-white/80 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                className="w-full bg-transparent border border-white/60 rounded-xl px-5 py-3.5 text-white placeholder-white/80 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Password rule instruction below the box */}
            <p className="text-white/80 text-[11px] mt-1.5 ml-2 font-medium tracking-wide">
              * Min 8 Characters; 1 Uppercase & 1 Number Must
            </p>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              className="w-full bg-transparent border border-white/60 rounded-xl px-5 py-3.5 text-white placeholder-white/80 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-gray-900 font-semibold py-3.5 rounded-xl shadow-lg hover:bg-gray-50 transition-colors mt-4 flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={18} className="animate-spin text-gray-600" /> : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center mb-2">
          <p className="text-white/80 text-[13px]">
            Already have an account?{' '}
            <Link to="/" className="text-white font-bold hover:underline">
              Login Now
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;