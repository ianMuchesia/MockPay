import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBusinessesQuery } from '../../features/businesses/businessApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import BusinessCard from '../../features/businesses/components/BusinessCard';

const BusinessesPage: React.FC = () => {
  const { data, isLoading, isError } = useGetBusinessesQuery();
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');

  console.log(data);
  
  const handleSubscribeClick = (businessId: string) => {
    navigate(`/dashboard/subscribe/${businessId}`);
  };
  
  // Filter businesses based on search term
  const filteredBusinesses = data && data.filter(business => 
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.address.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Businesses</h1>
          <div className="flex items-center space-x-2">
            <div className="bg-neutral-100 w-32 h-10 rounded-lg animate-pulse"></div>
            <div className="bg-neutral-100 w-36 h-10 rounded-lg animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
              <div className="h-48 bg-neutral-100 mb-4 rounded-lg"></div>
              <div className="h-6 bg-neutral-100 rounded mb-3 w-3/4"></div>
              <div className="h-4 bg-neutral-100 rounded mb-3"></div>
              <div className="h-4 bg-neutral-100 rounded mb-3 w-1/2"></div>
              <div className="h-10 bg-neutral-100 rounded mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-400 text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-700">Failed to load businesses. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Businesses</h1>
          <p className="text-neutral-500">
            {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''} found
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 pr-4 py-2 w-full md:w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <i className="fas fa-search text-neutral-400"></i>
            </div>
          </div>
          
          <div className="flex space-x-2 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-md ${
                view === 'grid' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Grid View"
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-2 rounded-md ${
                view === 'table' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Table View"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Business listing */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <BusinessCard key={business.businessID} business={business} />
          ))}
          {filteredBusinesses.length === 0 && (
            <div className="col-span-3 text-center py-10">
              <div className="text-neutral-400 text-5xl mb-4">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-xl font-medium text-neutral-700">No businesses found</h3>
              <p className="text-neutral-500 mt-2">Try changing your search criteria</p>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr className="bg-neutral-50">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Business
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredBusinesses.map((business) => (
                <tr key={business.businessID} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={business.businessPhotos?.[0]?.photoURL || 'https://via.placeholder.com/100?text=No+Image'}
                          alt=""
                        />
                      </div> */}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-800">{business.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-500">
                      <i className="fas fa-map-marker-alt mr-1 text-primary"></i>
                      {business.address}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-500 line-clamp-2 max-w-xs">
                      {business.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSubscribeClick(business.businessID)}
                      className="btn-primary text-xs py-1 px-3"
                    >
                      <i className="fas fa-handshake mr-1"></i> Subscribe
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBusinesses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <div className="text-neutral-400 text-3xl mb-2">
                      <i className="fas fa-search"></i>
                    </div>
                    <p className="text-neutral-500">No businesses found matching your search criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination (for demonstration) */}
      {filteredBusinesses.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredBusinesses.length}</span> of{" "}
            <span className="font-medium">{filteredBusinesses.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark">
              1
            </button>
            <button className="px-3 py-1 rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none" disabled>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessesPage;