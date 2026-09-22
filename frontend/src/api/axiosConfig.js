import axios from 'axios';

// একটি কাস্টম axios ইন্সট্যান্স তৈরি করা হলো
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // আপনার ব্যাকএন্ডের মূল URL
});

// রিকোয়েস্ট ইন্টারসেপ্টর: প্রতিটি রিকোয়েস্ট ব্যাকএন্ডে যাওয়ার আগে এই কোডটি রান করবে
api.interceptors.request.use(
  (config) => {
    // লোকাল স্টোরেজ থেকে টোকেনটি নেওয়া হচ্ছে
    const token = localStorage.getItem('access_token');
    
    // টোকেন থাকলে সেটি হেডারে যুক্ত করে দেওয়া হচ্ছে
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;