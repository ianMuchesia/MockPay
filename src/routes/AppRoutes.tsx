import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import BusinessesPage from '../pages/dashboard/BusinessesPage';
import SubscribePage from '../pages/dashboard/SubscribePage';
import SubscriptionsPage from '../pages/dashboard/SubscriptionsPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<BusinessesPage />} /> {/* Default dashboard route */}
            <Route path="businesses" element={<BusinessesPage />} />
            <Route path="subscribe/:businessId" element={<SubscribePage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
          </Route>
        </Route>

        {/* Catch-all for 404 - optional */}
        <Route path="*" element={<h1 className="text-center text-3xl mt-20">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;