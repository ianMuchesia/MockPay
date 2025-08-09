import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Navigation items with icons
  // Update your navigationItems array in Sidebar.tsx
  const navigationItems = [
    {
      name: "Dashboard",
      icon: "fa-chart-line",
      path: "/dashboard",
      exact: true,
    },
    {
      name: "Businesses",
      icon: "fa-building",
      path: "/dashboard/businesses",
    },
    {
      name: "Subscriptions",
      icon: "fa-receipt",
      path: "/dashboard/subscriptions",
    },

    {
      name: "Banners",
      icon: "fa-bullhorn",
      path: "/dashboard/banners",
    },

    {
      name: "Payment History",
      icon: "fa-credit-card",
      path: "/dashboard/payment-history",
    },
    {
      name: "Profile",
      icon: "fa-user",
      path: "/dashboard/profile",
    },
    {
      name: "Settings",
      icon: "fa-cog",
      path: "/dashboard/settings",
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white shadow-lg transition-all duration-300 ease-in-out fixed h-screen z-30 md:relative`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-4 border-b border-neutral-100">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="font-bold text-lg">MockPay</span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        className="absolute -right-3 top-20 bg-white w-6 h-6 rounded-full shadow-md flex items-center justify-center text-xs border border-neutral-100"
        onClick={() => setCollapsed(!collapsed)}
      >
        <i className={`fas fa-chevron-${collapsed ? "right" : "left"}`}></i>
      </button>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.path
              : pathname.startsWith(item.path);

            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={`flex items-center py-3 px-4 rounded-lg transition duration-200 ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <i
                    className={`fas ${item.icon} ${collapsed ? "" : "mr-3"} ${
                      isActive ? "" : "text-neutral-500"
                    }`}
                  ></i>
                  {!collapsed && <span>{item.name}</span>}
                  {!collapsed && isActive && (
                    <span className="ml-auto">
                      <i className="fas fa-circle text-xs"></i>
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* User Section */}
        {isAuthenticated && !collapsed && (
          <div className="mt-auto pt-6 border-t border-neutral-100">
            <div className="flex items-center p-4 hover:bg-neutral-100 rounded-lg cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                <i className="fas fa-user text-neutral-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-800">
                  User Name
                </p>
                <p className="text-xs text-neutral-500">user@example.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Help & Support */}
        <div className={`mt-8 ${collapsed ? "text-center" : ""}`}>
          {!collapsed && (
            <p className="text-xs text-neutral-500 mb-2">Need help?</p>
          )}
          <button
            className={`${
              collapsed
                ? "w-10 h-10 rounded-full"
                : "w-full py-2 px-4 rounded-lg"
            } flex items-center justify-center bg-neutral-100 text-neutral-700 hover:bg-neutral-200`}
          >
            <i className="fas fa-question-circle"></i>
            {!collapsed && <span className="ml-2">Support</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
