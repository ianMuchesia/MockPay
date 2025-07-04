import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Extract current page name from path for breadcrumbs
  const getPageName = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length === 1) return 'Dashboard';
    return path[path.length - 1].charAt(0).toUpperCase() + path[path.length - 1].slice(1);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 bg-neutral-800 bg-opacity-50 z-20 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      <Navbar />
      
      <div className="flex flex-1">
        {/* Mobile sidebar */}
        <div className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out md:block z-30`}>
          <Sidebar />
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm">
              <button 
                className="md:hidden p-2 mr-2 rounded-md hover:bg-neutral-200"
                onClick={() => setSidebarOpen(true)}
              >
                <i className="fas fa-bars"></i>
              </button>
              <a href="/dashboard" className="text-neutral-500 hover:text-primary">Dashboard</a>
              {location.pathname !== '/dashboard' && (
                <>
                  <i className="fas fa-chevron-right text-neutral-400 text-xs"></i>
                  <span className="text-neutral-800 font-medium">{getPageName()}</span>
                </>
              )}
            </div>
          </div>
          
          {/* Page content */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <Outlet /> {/* Renders the sub-route component */}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 p-4 text-center text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} MockPay. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardLayout;