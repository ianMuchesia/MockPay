// In src/features/payments/paymentApi.ts
import { api } from '../api/apiSlice';

// Payment status response type
interface PaymentStatusResponse {
  id: number;
  invoiceId: number;
  invoice: any; // Can be null or an object
  paymentAppPaymentId: string;
  gatewayTransactionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethodType: string;
  gatewayName: string;
  transactionDate: string;
  failureReason: string | null;
  metadata: string;
  createdAt: string;
  updatedAt: string;
}




export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentStatus: builder.query<PaymentStatusResponse, string>({
      query: (transactionId) => `/api/payment/status/${transactionId}`,
    }),
  }),
});

export const { useGetPaymentStatusQuery } = paymentApi;

