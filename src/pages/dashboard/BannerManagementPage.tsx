import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetBannerEntitlementsQuery, 
  useGetUserBannersMutation,
  useDeleteBannerMutation 
} from '../../features/banners/bannerApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const BannerManagementPage: React.FC = () => {
  const navigate = useNavigate();
  
  // API hooks
  const { data: entitlementsData, isLoading: loadingEntitlements, refetch: refetchEntitlements } = useGetBannerEntitlementsQuery();
  const [getUserBanners, { data: bannersData, isLoading: loadingBanners }] = useGetUserBannersMutation();
  const [deleteBanner, { isLoading: deletingBanner }] = useDeleteBannerMutation();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'PAUSED' | 'EXPIRED'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'confirm'>('success');
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);

  // Fetch banners on component mount and when dependencies change
  useEffect(() => {
    fetchBanners();
  }, [currentPage, searchTerm]);

  const fetchBanners = () => {
    getUserBanners({
      searchTerm,
      pageNumber: currentPage,
      pageSize,
    });
  };

  // Handle banner deletion
  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;

    try {
      await deleteBanner(bannerToDelete).unwrap();
      setModalMessage('Banner deleted successfully!');
      setModalType('success');
      setShowModal(true);
      setBannerToDelete(null);
      fetchBanners();
      refetchEntitlements();
    } catch (error: any) {
      setModalMessage('Failed to delete banner. Please try again.');
      setModalType('error');
      setShowModal(true);
      setBannerToDelete(null);
    }
  };

  const confirmDeleteBanner = (bannerId: number) => {
    setBannerToDelete(bannerId);
    setModalMessage('Are you sure you want to delete this banner? This action cannot be undone.');
    setModalType('confirm');
    setShowModal(true);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBanners();
  };

  // Handle create banner
  const handleCreateBanner = () => {
    if (entitlementsData?.data?.canCreateBanner) {
      navigate('/dashboard/banners/create');
    } else {
      navigate('/dashboard/banners/create?requiresService=true');
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'ACTIVE':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'PAUSED':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'EXPIRED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Filter banners by status
  const filteredBanners = bannersData?.data.items.filter(banner => 
    statusFilter === 'ALL' || banner.status === statusFilter
  ) || [];

  // Loading state
  if (loadingEntitlements) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-grow">
            <div className="h-8 bg-neutral-100 w-48 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-neutral-100 w-64 rounded animate-pulse"></div>
          </div>
          <div className="bg-neutral-100 h-10 w-40 rounded animate-pulse"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="h-64 bg-neutral-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const entitlements = entitlementsData?.data;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-neutral-800">Banner Management</h1>
          <p className="text-neutral-500">
            Create and manage your advertising banners
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-neutral-400"></i>
            </div>
            <input
              type="text"
              className="form-input pl-10 w-full md:w-80"
              placeholder="Search banners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </form>
      </div>

      {/* Enhanced Entitlement Status Card */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Information */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                entitlements?.canCreateBanner ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                <i className={`fas ${
                  entitlements?.canCreateBanner ? 'fa-check-circle text-green-600' : 'fa-exclamation-triangle text-orange-600'
                } text-2xl`}></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-800">
                  {entitlements?.canCreateBanner ? 'Ready to Create Banners!' : 'Banner Service Required'}
                </h3>
                <p className="text-neutral-600">{entitlements?.message}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{entitlements?.availableSlots || 0}</p>
                <p className="text-sm text-neutral-500">Available Slots</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <p className="text-2xl font-bold text-neutral-800">{entitlements?.existingBanners.length || 0}</p>
                <p className="text-sm text-neutral-500">Created Banners</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {entitlements?.availableSubscriptionIdsForNewBanner.length || 0}
                </p>
                <p className="text-sm text-neutral-500">Active Services</p>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="flex flex-col justify-center space-y-4">
            <Button
              onClick={handleCreateBanner}
              size="lg"
              leftIcon={<i className="fas fa-plus"></i>}
              className="w-full"
            >
              {entitlements?.canCreateBanner ? 'Create New Banner' : 'Create Banner'}
            </Button>
            
            {entitlements?.canCreateBanner && (
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/banners/purchase')}
                size="sm"
                leftIcon={<i className="fas fa-shopping-cart"></i>}
                className="w-full"
              >
                Buy More Slots
              </Button>
            )}
            
            {!entitlements?.canCreateBanner && (
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/banners/purchase')}
                size="sm"
                leftIcon={<i className="fas fa-shopping-cart"></i>}
                className="w-full"
              >
                Get Banner Service
              </Button>
            )}
            
            <Button
              variant="text"
              onClick={() => {
                refetchEntitlements();
                fetchBanners();
              }}
              size="sm"
              leftIcon={<i className="fas fa-refresh"></i>}
              className="w-full"
            >
              Refresh Status
            </Button>
          </div>
        </div>
      </Card>

      {/* Only show banners section if user has created banners */}
      {entitlements?.existingBanners && entitlements.existingBanners.length > 0 && (
        <>
          {/* Status Filter Tabs */}
          <div className="mb-6 border-b border-neutral-200">
            <nav className="flex space-x-8">
              {['ALL', 'ACTIVE', 'PENDING', 'PAUSED', 'EXPIRED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    statusFilter === status
                      ? 'border-primary text-primary'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {status}
                  {status === 'ALL' && bannersData?.data.totalCount && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-neutral-100 text-neutral-600">
                      {bannersData.data.totalCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Banners Grid */}
          <Card>
            {loadingBanners ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-neutral-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredBanners.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bullhorn text-2xl text-neutral-400"></i>
                </div>
                <h3 className="text-lg font-medium text-neutral-700">
                  {searchTerm ? 'No banners found' : 'No banners in this category'}
                </h3>
                <p className="text-neutral-500 mt-2">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Try changing the status filter'
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {filteredBanners.map((banner) => (
                    <div key={banner.id} className="border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {/* Banner Image */}
                      <div className="relative h-40 bg-neutral-100">
                        {banner.webImageUrl ? (
                          <img
                            src={banner.webImageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDIwIDYgMTYuMjEgNiAxNEE2IDYgMCAwIDEgMTggMTRDMTggMTYuMjEgMTQuMjEgMjAgMTIgMTZaIiBmaWxsPSIjOUM5Qzk0Ii8+Cjwvc3ZnPgo=';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <i className="fas fa-image text-2xl text-neutral-400"></i>
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={getStatusBadge(banner.status)}>
                            {banner.status}
                          </span>
                        </div>

                        {/* Linked Status */}
                        {banner.linkedSubscriptionId === null && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Unlinked
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Banner Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-neutral-800 mb-1">{banner.title}</h3>
                        <p className="text-sm text-neutral-600 mb-2 line-clamp-2">{banner.description}</p>
                        <p className="text-xs text-neutral-500 mb-3">
                          Created: {new Date(banner.createdAt).toLocaleDateString()}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/dashboard/banners/edit/${banner.id}`)}
                            leftIcon={<i className="fas fa-edit"></i>}
                          >
                            Edit
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => confirmDeleteBanner(banner.id)}
                            leftIcon={<i className="fas fa-trash"></i>}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {bannersData?.data && bannersData.data.totalCount > pageSize && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200">
                    <div className="text-sm text-neutral-500">
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, bannersData.data.totalCount)} of {bannersData.data.totalCount} banners
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={!bannersData.data.hasPreviousPage}
                        leftIcon={<i className="fas fa-chevron-left"></i>}
                      >
                        Previous
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={!bannersData.data.hasNextPage}
                        rightIcon={<i className="fas fa-chevron-right"></i>}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'success' ? 'Success!' : modalType === 'error' ? 'Error' : 'Confirm Action'}
        type={modalType}
      >
        <p>{modalMessage}</p>
        {modalType === 'confirm' && (
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => setShowModal(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteBanner}
              isLoading={deletingBanner}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Banner
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BannerManagementPage;