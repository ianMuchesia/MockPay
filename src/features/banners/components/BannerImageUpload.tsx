import React, { useState, useRef } from 'react';
import Button from '../../../components/common/Button';


interface BannerImageUploadProps {
  label: string;
  type: 'web' | 'mobile';
  currentImage?: string;
  onImageChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  recommendedSize?: string;
}

const BannerImageUpload: React.FC<BannerImageUploadProps> = ({
  label,
  type,
  currentImage,
  onImageChange,
  error,
  required = false,
  disabled = false,
  recommendedSize,
}) => {
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(currentImage || '');
      onImageChange(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onImageChange(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setPreview(currentImage || '');
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!disabled ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          /* Image Preview */
          <div className="relative group">
            <img
              src={preview}
              alt={`${type} banner preview`}
              className="w-full h-48 object-cover rounded-lg"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                  className="bg-white text-gray-800 hover:bg-gray-100"
                  leftIcon={<i className="fas fa-edit"></i>}
                >
                  Change
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="bg-white text-gray-800 hover:bg-gray-100"
                  leftIcon={<i className="fas fa-trash"></i>}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Upload Placeholder */
          <div className="p-8 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${
              type === 'mobile' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <i className={`fas ${
                type === 'mobile' ? 'fa-mobile-alt text-blue-600' : 'fa-desktop text-green-600'
              } text-2xl`}></i>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">
                Upload {type} banner image
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to select
              </p>
              {recommendedSize && (
                <p className="text-xs text-gray-400">
                  Recommended: {recommendedSize}
                </p>
              )}
              <p className="text-xs text-gray-400">
                Max file size: 5MB • Formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        )}

        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary bg-opacity-10 border-2 border-primary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-cloud-upload-alt text-primary text-3xl mb-2"></i>
              <p className="text-primary font-medium">Drop image here</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* File Info */}
      {preview && !currentImage?.includes(preview) && (
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <i className="fas fa-info-circle"></i>
          <span>New image selected - click "Update Banner" to save changes</span>
        </div>
      )}
    </div>
  );
};

export default BannerImageUpload;