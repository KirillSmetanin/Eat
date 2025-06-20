import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../src/components/Layout';
import RegistrationPage from '../src/components/RegistrationPage';
import LoginPage from '../src/components/LoginPage';
import OrdersPage from '../src/components/OrdersPage';
import NewOrderPage from '../src/components/NewOrderPage';
import AdminPanelPage from '../src/components/AdminPanelPage';

function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    if (location.pathname !== path) navigate(path);
  };

  const handleLogout = () => setUser(null);

  return (
    <Layout user={user} onLogout={handleLogout} onNavigate={handleNavigate}>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/orders" element={<OrdersPage user={user} />} />
        <Route path="/new-order" element={<NewOrderPage user={user} />} />
        <Route path="/admin" element={<AdminPanelPage user={user} />} />
        <Route path="*" element={<div>Добро пожаловать в Я буду кушац!</div>} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <AppRoutes user={user} setUser={setUser} />
    </BrowserRouter>
  );
}