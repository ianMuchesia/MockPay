import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import BusinessesPage from "../pages/dashboard/BusinessesPage";
import SubscribePage from "../pages/dashboard/SubscribePage";
import SubscriptionsPage from "../pages/dashboard/SubscriptionsPage";
import ProtectedRoute from "./ProtectedRoute";
import PaymentDetailsPage from "../pages/dashboard/PaymentDetailsPage";
import PaymentStatusPage from "../pages/dashboard/PaymentStatusPage";
import PaymentHistoryPage from "../pages/dashboard/PaymentHistoryPage";
import BannerManagementPage from "../pages/dashboard/BannerManagementPage";
import CreateBannerPage from "../pages/dashboard/CreateBannerPage";
import EditBannerPage from "../pages/dashboard/EditBannerPage";
import BannerServicePurchasePage from "../pages/dashboard/BannerServicePurchasePage";
import BannerPaymentDetailsPage from "../pages/dashboard/BannerPaymentDetailsPage";
import SubscriptionPaymentDetailsPage from "../pages/dashboard/SubscriptionPaymentDetailsPage";
import SingleBusinessPage from "../pages/SingleBusinessPage";
import SignupPage from "../pages/SignupPage";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/businesses/:businessId" element ={<SingleBusinessPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<BusinessesPage />} />{" "}
            {/* Default dashboard route */}
            <Route path="businesses" element={<BusinessesPage />} />
            <Route path="subscribe/:businessId" element={<SubscribePage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="payment-details" element={<PaymentDetailsPage />} />
            <Route path="payment-status" element={<PaymentStatusPage />} />
            <Route path="payment-history" element={<PaymentHistoryPage />} />
            <Route path="banners" element={<BannerManagementPage />} />
            <Route path="banners/create" element={<CreateBannerPage />} />
            <Route path="banners/edit/:bannerId" element={<EditBannerPage />} />
            <Route path="subscription-payment-details/:subscriptionId/:action" element={<SubscriptionPaymentDetailsPage />} />
            <Route
              path="banners/purchase"
              element={<BannerServicePurchasePage />}
            />

            <Route path="banners/payment-details" element={<BannerPaymentDetailsPage />} />
          </Route>

        </Route>

        {/* Catch-all for 404 - optional */}
        <Route
          path="*"
          element={
            <h1 className="text-center text-3xl mt-20">404 - Page Not Found</h1>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
