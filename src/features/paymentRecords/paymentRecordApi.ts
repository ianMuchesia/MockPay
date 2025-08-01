import { api } from '../api/apiSlice';

// Type definitions
interface Invoice {
  id: number;
  subscriptionId: number;
  businessId: string | null;
  userId: string;
  invoiceNumber: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  dueDate: string;
  paidDate: string | null;
  status: string;
  invoiceType: string;
  proratedCreditAmount: number | null;
  proratedChargeAmount: number | null;
  originalInvoiceId: number | null;
  periodStartDate: string;
  periodEndDate: string;
  createdAt: string;
  updatedAt: string;
  pdfUrl: string | null;
  subscription: any;
  originalInvoice: any;
  refundInvoices: any;
}

interface PaymentRecord {
  id: number;
  invoiceId: number;
  invoice: Invoice;
  paymentAppPaymentId: string;
  gatewayTransactionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethodType: string | null;
  gatewayName: string | null;
  transactionDate: string;
  failureReason: string | null;
  metadata: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentRecordsResponse {
  message: string;
  data: PaymentRecord[];
}

interface GeneratePdfResponse {
  message: string;
  data: string; // PDF URL
}

export const paymentRecordApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserPaymentRecords: builder.query<PaymentRecordsResponse, void>({
      query: () => '/api/PaymentRecord/user',
      providesTags: ['PaymentRecord'],
    }),
    generateInvoicePdf: builder.mutation<GeneratePdfResponse, { paymentId: number; invoiceId: number }>({
      query: ({ paymentId, invoiceId }) => ({
        url: `/api/PaymentRecord/${paymentId}/invoice/${invoiceId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetUserPaymentRecordsQuery,
  useGenerateInvoicePdfMutation,
} = paymentRecordApi;