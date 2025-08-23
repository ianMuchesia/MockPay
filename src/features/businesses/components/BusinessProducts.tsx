import React, { useState } from 'react';
import type { SingleBusiness } from '../businessApi';


interface BusinessProductsProps {
  business: SingleBusiness;
}

const BusinessProducts: React.FC<BusinessProductsProps> = ({ business }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  if (business.businessProducts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <i className="fas fa-box-open text-6xl text-neutral-300 mb-4"></i>
        <h3 className="text-xl font-semibold text-neutral-600 mb-2">No Products Available</h3>
        <p className="text-neutral-500">This business hasn't added any products yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Products & Services</h2>
          <span className="text-primary font-medium">
            {business.businessProducts.length} {business.businessProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {business.businessProducts.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="group bg-neutral-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedProduct(product);
                setIsModalOpen(true);
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.productPhotos[0]?.photoURL || '/api/placeholder/300/200'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/300/200';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-neutral-800 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                  {product.description}
                </p>
                {product.price > 0 && (
                  <p className="text-primary font-bold text-lg">
                    ${product.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {business.businessProducts.length > 6 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              View All {business.businessProducts.length} Products
            </button>
          </div>
        )}
      </div>

      {/* Products Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-800">
                {selectedProduct ? selectedProduct.name : 'All Products & Services'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="w-10 h-10 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times text-neutral-600"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {selectedProduct ? (
                /* Single Product View */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                      <img
                        src={selectedProduct.productPhotos[0]?.photoURL || '/api/placeholder/400/300'}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/400/300';
                        }}
                      />
                    </div>
                    
                    {selectedProduct.productPhotos.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.productPhotos.slice(1, 5).map((photo: { photoURL: string }, index: number) => (
                          <img
                            key={index}
                            src={photo.photoURL}
                            alt={`${selectedProduct.name} ${index + 2}`}
                            className="w-full h-20 object-cover rounded-lg"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              e.currentTarget.src = '/api/placeholder/100/80';
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-bold text-neutral-800 mb-4">{selectedProduct.name}</h3>
                    <p className="text-neutral-700 leading-relaxed mb-6">{selectedProduct.description}</p>
                    
                    {selectedProduct.price > 0 && (
                      <div className="bg-primary/10 rounded-2xl p-6 mb-6">
                        <p className="text-primary text-3xl font-bold">${selectedProduct.price.toFixed(2)}</p>
                        <p className="text-neutral-600">Starting price</p>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all">
                        Contact for This Service
                      </button>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="w-full bg-white border-2 border-neutral-200 text-neutral-700 py-3 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
                      >
                        View All Products
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* All Products Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {business.businessProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-neutral-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.productPhotos[0]?.photoURL || '/api/placeholder/300/200'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/300/200';
                          }}
                        />
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-neutral-800 mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        {product.price > 0 && (
                          <p className="text-primary font-bold text-lg">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessProducts;