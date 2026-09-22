import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders'; 
import Layout from './components/Layout';
import Signup from './pages/Signup';

// Notun add kora page gulor import
import Invoices from './pages/Invoices';
import Returns from './pages/Returns';
import Offers from './pages/Offers';
import Tracking from './pages/Tracking';
import Support from './pages/Support';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route (Without Layout) */}
        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* Authenticated Routes (With Layout/Sidebar) */}
        <Route 
          path="/dashboard" 
          element={<Layout><Dashboard /></Layout>} 
        />
        <Route 
          path="/catalog" 
          element={<Layout><Catalog /></Layout>} 
        />
        <Route 
          path="/inventory" 
          element={<Layout><Inventory /></Layout>} 
        />
        <Route 
          path="/orders" 
          element={<Layout><Orders /></Layout>} 
        />
        
        {/* Notun Service Route gulo */}
        <Route 
          path="/invoices" 
          element={<Layout><Invoices /></Layout>} 
        />
        <Route 
          path="/returns" 
          element={<Layout><Returns /></Layout>} 
        />
        <Route 
          path="/offers" 
          element={<Layout><Offers /></Layout>} 
        />
        <Route 
          path="/tracking" 
          element={<Layout><Tracking /></Layout>} 
        />
        <Route 
          path="/support" 
          element={<Layout><Support /></Layout>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;