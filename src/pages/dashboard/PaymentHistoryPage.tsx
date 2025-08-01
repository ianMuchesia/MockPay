import React, { useState } from 'react';

import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useGenerateInvoicePdfMutation, useGetUserPaymentRecordsQuery } from '../../features/paymentRecords/paymentRecordApi';

const PaymentHistoryPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetUserPaymentRecordsQuery();
  const [generatePdf, { isLoading: generatingPdf }] = useGenerateInvoicePdfMutation();

  // State management
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'failed' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);

  // Filter payment records based on active tab and search
  const filteredRecords = data?.data?.filter((record) => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'paid' && record.status === 'Succeeded') ||
      (activeTab === 'failed' && record.status === 'Failed') ||
      (activeTab === 'pending' && record.status === 'Pending');
    
    const matchesSearch = 
      record.invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.gatewayTransactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.paymentAppPaymentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  }) || [];

  // Calculate status counts
  const getStatusCounts = () => {
    const counts = { all: 0, paid: 0, failed: 0, pending: 0 };
    
    data?.data?.forEach((record) => {
      counts.all++;
      if (record.status === 'Succeeded') counts.paid++;
      else if (record.status === 'Failed') counts.failed++;
      else counts.pending++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Handle PDF download/generation
  const handleDownloadInvoice = async (record: any) => {
    try {
      if (record.invoice.pdfUrl) {
        window.open(record.invoice.pdfUrl, '_blank');
      } else {
        const response = await generatePdf({
          paymentId: record.id,
          invoiceId: record.invoiceId
        }).unwrap();
        
        if (response.data) {
          window.open(response.data, '_blank');
          setModalMessage('Invoice downloaded successfully!');
          setModalType('success');
          setShowModal(true);
        }
      }
    } catch (error: any) {
      setModalMessage('Failed to download invoice. Please try again.');
      setModalType('error');
      setShowModal(true);
    }
  };

  // Toggle record expansion
  const toggleRecordExpansion = (recordId: number) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  // Loading state
  if (isLoading) {
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-100 rounded-xl"></div>
            ))}
          </div>
          
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-400 text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-700">
              Failed to load payment history. Please try refreshing the page.
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Retry
            </Button>
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
          <h1 className="text-2xl font-bold text-neutral-800">Payment History</h1>
          <p className="text-neutral-500">
            Track all your payment transactions and download invoices
          </p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-neutral-400"></i>
          </div>
          <input
            type="text"
            className="form-input pl-10 w-full md:w-80"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="mb-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pb-6 border-b border-neutral-100">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-receipt text-blue-600"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{statusCounts.all}</p>
                <p className="text-sm text-neutral-500">Total Payments</p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{statusCounts.paid}</p>
                <p className="text-sm text-neutral-500">Successful</p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-times-circle text-red-600"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{statusCounts.failed}</p>
                <p className="text-sm text-neutral-500">Failed</p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-yellow-600"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                <p className="text-sm text-neutral-500">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'all', label: 'All Payments', count: statusCounts.all },
              { id: 'paid', label: 'Successful', count: statusCounts.paid },
              { id: 'failed', label: 'Failed', count: statusCounts.failed },
              { id: 'pending', label: 'Pending', count: statusCounts.pending },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Payment Records */}
        <div className={activeTab === 'all' ? 'block' : 'hidden'}>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-receipt text-2xl text-neutral-400"></i>
              </div>
              <h3 className="text-lg font-medium text-neutral-700">No payment records found</h3>
              <p className="text-neutral-500 mt-2">
                {searchTerm ? 'Try adjusting your search terms' : "You don't have any payment history yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                  {/* Main Row */}
                  <div 
                    className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => toggleRecordExpansion(record.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Status Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          record.status === 'Succeeded' 
                            ? 'bg-green-100 text-green-600' 
                            : record.status === 'Failed' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          <i className={`fas ${
                            record.status === 'Succeeded' 
                              ? 'fa-check' 
                              : record.status === 'Failed' 
                              ? 'fa-times' 
                              : 'fa-clock'
                          }`}></i>
                        </div>

                        {/* Payment Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-neutral-900">
                              {record.invoice.invoiceNumber}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === 'Succeeded' 
                                ? 'bg-green-100 text-green-800' 
                                : record.status === 'Failed' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-500 mt-1">
                            {new Date(record.transactionDate).toLocaleDateString()} • 
                            {record.gatewayTransactionId}
                          </p>
                          {record.failureReason && (
                            <p className="text-sm text-red-500 mt-1">
                              {record.failureReason.length > 50 
                                ? `${record.failureReason.substring(0, 50)}...` 
                                : record.failureReason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Amount */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-neutral-900">
                            {record.amount} {record.currency}
                          </p>
                          <p className="text-sm text-neutral-500">
                            Due: {record.invoice.amountDue} {record.currency}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {record.status === 'Succeeded' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadInvoice(record);
                              }}
                              isLoading={generatingPdf}
                              leftIcon={<i className="fas fa-download"></i>}
                            >
                              Invoice
                            </Button>
                          )}
                          
                          <Button
                            variant="text"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRecordExpansion(record.id);
                            }}
                          >
                            <i className={`fas ${expandedRecord === record.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedRecord === record.id && (
                    <div className="px-4 pb-4 bg-neutral-50 border-t border-neutral-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        {/* Payment Details */}
                        <div>
                          <h4 className="font-semibold text-neutral-800 mb-3">Payment Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Payment ID:</span>
                              <span className="font-mono text-xs break-all">
                                {record.paymentAppPaymentId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Gateway:</span>
                              <span>{record.gatewayName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Method:</span>
                              <span>{record.paymentMethodType || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Invoice Details */}
                        <div>
                          <h4 className="font-semibold text-neutral-800 mb-3">Invoice Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Type:</span>
                              <span>{record.invoice.invoiceType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Due Date:</span>
                              <span>{new Date(record.invoice.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Paid Date:</span>
                              <span>
                                {record.invoice.paidDate 
                                  ? new Date(record.invoice.paidDate).toLocaleDateString()
                                  : 'Not paid'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Billing Period */}
                        <div>
                          <h4 className="font-semibold text-neutral-800 mb-3">Billing Period</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Start:</span>
                              <span>{new Date(record.invoice.periodStartDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">End:</span>
                              <span>{new Date(record.invoice.periodEndDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Subscription:</span>
                              <span>#{record.invoice.subscriptionId}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other tab contents */}
        {['paid', 'failed', 'pending'].map((tabId) => (
          <div key={tabId} className={activeTab === tabId ? 'block' : 'hidden'}>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-receipt text-2xl text-neutral-400"></i>
                </div>
                <h3 className="text-lg font-medium text-neutral-700">
                  No {tabId} payments found
                </h3>
                <p className="text-neutral-500 mt-2">
                  {searchTerm ? 'Try adjusting your search terms' : `You don't have any ${tabId} payments yet`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          record.status === 'Succeeded' 
                            ? 'bg-green-100 text-green-600' 
                            : record.status === 'Failed' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          <i className={`fas ${
                            record.status === 'Succeeded' 
                              ? 'fa-check' 
                              : record.status === 'Failed' 
                              ? 'fa-times' 
                              : 'fa-clock'
                          }`}></i>
                        </div>
                        <div>
                          <h3 className="font-semibold">{record.invoice.invoiceNumber}</h3>
                          <p className="text-sm text-neutral-500">
                            {new Date(record.transactionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{record.amount} {record.currency}</p>
                        {record.status === 'Succeeded' && (
                          <Button
                            variant="text"
                            size="sm"
                            onClick={() => handleDownloadInvoice(record)}
                            isLoading={generatingPdf}
                          >
                            <i className="fas fa-download mr-1"></i>
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </Card>

      {/* Modal */}
          {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'success' ? 'Success!' : 'Error'}
        type={modalType}
      >
        <p>{modalMessage}</p>
      </Modal>
    </>
  );
};

export default PaymentHistoryPage;