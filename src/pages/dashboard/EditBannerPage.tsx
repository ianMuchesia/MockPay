import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetUserBannersMutation,
  useUpdateBannerMutation 
} from '../../features/banners/bannerApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

interface Banner {
  id: number;
  title: string;
  description: string;
  webImageUrl: string;
  link: string;
  mobileImageUrl: string;
  status: string;
  linkedSubscriptionId: number | null;
}

const EditBannerPage: React.FC = () => {
  const { bannerId } = useParams<{ bannerId: string }>();
  const navigate = useNavigate();
  
  // API hooks
  const [getUserBanners, { data: bannersData, isLoading: loadingBanners }] = useGetUserBannersMutation();
  const [updateBanner, { isLoading: updatingBanner }] = useUpdateBannerMutation();

  // State management
  const [banner, setBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
  });
  const [webImage, setWebImage] = useState<File | null>(null);
  const [mobileImage, setMobileImage] = useState<File | null>(null);
  const [webImagePreview, setWebImagePreview] = useState<string>('');
  const [mobileImagePreview, setMobileImagePreview] = useState<string>('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Fetch banner data on component mount
  useEffect(() => {
    if (bannerId) {
      fetchBannerData();
    }
  }, [bannerId]);

  // Fetch specific banner data
  const fetchBannerData = async () => {
    try {
      const response = await getUserBanners({
        searchTerm: '',
        pageNumber: 1,
        pageSize: 100, // Get all to find our banner
      }).unwrap();

      const foundBanner = response.data.items.find(b => b.id === parseInt(bannerId!));
      
      if (foundBanner) {
        setBanner(foundBanner);
        setFormData({
          title: foundBanner.title,
          description: foundBanner.description,
          link: foundBanner.link,
        });
        setWebImagePreview(foundBanner.webImageUrl);
        setMobileImagePreview(foundBanner.mobileImageUrl);
      } else {
        setModalMessage('Banner not found.');
        setModalType('error');
        setShowModal(true);
        setTimeout(() => navigate('/dashboard/banners'), 2000);
      }
    } catch (error) {
      setModalMessage('Failed to load banner data.');
      setModalType('error');
      setShowModal(true);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'web' | 'mobile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, [`${type}Image`]: 'Please select a valid image file.' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [`${type}Image`]: 'Image size must be less than 5MB.' }));
      return;
    }

    if (type === 'web') {
      setWebImage(file);
      setWebImagePreview(URL.createObjectURL(file));
    } else {
      setMobileImage(file);
      setMobileImagePreview(URL.createObjectURL(file));
    }

    // Clear error
    setErrors(prev => ({ ...prev, [`${type}Image`]: '' }));
  };

  // Remove image
  const removeImage = (type: 'web' | 'mobile') => {
    if (type === 'web') {
      setWebImage(null);
      setWebImagePreview(banner?.webImageUrl || '');
    } else {
      setMobileImage(null);
      setMobileImagePreview(banner?.mobileImageUrl || '');
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Link is required';
    } else {
      try {
        new URL(formData.link);
      } catch {
        newErrors.link = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !banner) {
      return;
    }

    try {
      const updateData: any = {
        id: banner.id,
        title: formData.title,
        description: formData.description,
        link: formData.link,
      };

      // Only include images if they were changed
      if (webImage) {
        updateData.webImage = webImage;
      }
      if (mobileImage) {
        updateData.mobileImage = mobileImage;
      }

      await updateBanner(updateData).unwrap();

      setModalMessage('Banner updated successfully!');
      setModalType('success');
      setShowModal(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/dashboard/banners');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update banner. Please try again.';
      setModalMessage(errorMessage);
      setModalType('error');
      setShowModal(true);
    }
  };

  // Loading state
  if (loadingBanners || !banner) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-grow">
            <div className="h-8 bg-neutral-100 w-48 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-neutral-100 w-64 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-neutral-800">Edit Banner</h1>
          <p className="text-neutral-500">
            Update your banner details and images
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<i className="fas fa-arrow-left"></i>}
          onClick={() => navigate('/dashboard/banners')}
        >
          Back to Banners
        </Button>
      </div>

      {/* Banner Status Info */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              banner.status === 'ACTIVE' ? 'bg-green-100' : 
              banner.status === 'PENDING' ? 'bg-yellow-100' : 'bg-gray-100'
            }`}>
              <i className={`fas ${
                banner.status === 'ACTIVE' ? 'fa-check-circle text-green-600' : 
                banner.status === 'PENDING' ? 'fa-clock text-yellow-600' : 'fa-pause-circle text-gray-600'
              }`}></i>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">Banner #{banner.id}</h3>
              <p className="text-sm text-neutral-600">
                Status: <span className={`font-medium ${
                  banner.status === 'ACTIVE' ? 'text-green-600' : 
                  banner.status === 'PENDING' ? 'text-yellow-600' : 'text-gray-600'
                }`}>{banner.status}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <div>
              <span>Subscription:</span>
              <span className="ml-1 font-medium">
                {banner.linkedSubscriptionId ? `#${banner.linkedSubscriptionId}` : 'Unlinked'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Banner Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="form-label">
                  Banner Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input ${errors.title ? 'border-red-300' : ''}`}
                  placeholder="Enter banner title"
                />
                {errors.title && <p className="form-error">{errors.title}</p>}
              </div>

              {/* Link */}
              <div>
                <label className="form-label">
                  Target Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className={`form-input ${errors.link ? 'border-red-300' : ''}`}
                  placeholder="https://example.com"
                />
                {errors.link && <p className="form-error">{errors.link}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="form-label">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`form-input ${errors.description ? 'border-red-300' : ''}`}
                placeholder="Enter banner description"
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>
          </div>

          {/* Current Images */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Banner Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Web Image */}
              <div>
                <label className="form-label">Web Banner Image</label>
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="text-sm text-neutral-600">Current Image:</div>
                    {webImagePreview && (
                      <img
                        src={webImagePreview}
                        alt="Web banner"
                        className="w-full h-32 object-cover rounded border"
                      />
                    )}
                    
                    <div className="flex gap-2">
                      <label className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          leftIcon={<i className="fas fa-upload"></i>}
                        >
                          Change Image
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'web')}
                          className="hidden"
                        />
                      </label>
                      
                      {webImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImage('web')}
                          leftIcon={<i className="fas fa-undo"></i>}
                        >
                          Revert
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-xs text-neutral-500">
                      Recommended: 1200x400px, Max 5MB
                    </p>
                  </div>
                </div>
                {errors.webImage && <p className="form-error">{errors.webImage}</p>}
              </div>

              {/* Mobile Image */}
              <div>
                <label className="form-label">Mobile Banner Image</label>
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="text-sm text-neutral-600">Current Image:</div>
                    {mobileImagePreview && (
                      <img
                        src={mobileImagePreview}
                        alt="Mobile banner"
                        className="w-full h-32 object-cover rounded border"
                      />
                    )}
                    
                    <div className="flex gap-2">
                      <label className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          leftIcon={<i className="fas fa-upload"></i>}
                        >
                          Change Image
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'mobile')}
                          className="hidden"
                        />
                      </label>
                      
                      {mobileImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImage('mobile')}
                          leftIcon={<i className="fas fa-undo"></i>}
                        >
                          Revert
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-xs text-neutral-500">
                      Recommended: 400x300px, Max 5MB
                    </p>
                  </div>
                </div>
                {errors.mobileImage && <p className="form-error">{errors.mobileImage}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="text"
              onClick={() => navigate('/dashboard/banners')}
            >
              Cancel
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={fetchBannerData}
                leftIcon={<i className="fas fa-refresh"></i>}
              >
                Reset Changes
              </Button>
              
              <Button
                type="submit"
                isLoading={updatingBanner}
                disabled={!formData.title || !formData.description || !formData.link}
                rightIcon={<i className="fas fa-save"></i>}
              >
                Update Banner
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'success' ? 'Success!' : 'Error'}
        type={modalType}
      >
        <p>{modalMessage}</p>
        {modalType === 'success' && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => navigate('/dashboard/banners')}
              size="sm"
            >
              View Banners
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default EditBannerPage;