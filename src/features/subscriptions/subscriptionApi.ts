import type { ApiResponse } from '../../types/main';
import { api } from '../api/apiSlice';

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  durationInDays: number;
  status: string;
  isRenewable: boolean;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;
  code: string;
  description: string;
  type: string;
  standalonePrice: number;
  standaloneBillingCycle: string;
  standaloneDurationInDays: number;
  status: string;
}

export interface Subscription {
  subscriptionID: string;
  subscriptionPlanName?: string;
  serviceName?: string;
  status: string;
  startDate: string;
  endDate: string;
  renewalMode: string;
  id:number;
  
}


interface PaymentInitiateResponse {
  paymentId: string;
  status: string;
  redirectUrl: string;
}

interface CreatedSubscriptionDto {
  createdSubscription: any;
  paymentResponse?: PaymentInitiateResponse;
}

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<{ message: string; data: SubscriptionPlan[] }, void>({
      query: () => '/api/subscriptionplan',
      providesTags: ['SubscriptionPlan'],
    }),
    getServices: builder.query<{ message: string; data: Service[] }, void>({
      query: () => '/api/service',
      providesTags: ['Service'],
    }),
    createSubscription: builder.mutation<
      any, // Adjust return type if there's a specific success response
      {
        subscriberType: 'BUSINESS';
        subscriberId: string;
        subscriptionType: 'PACKAGE' | 'STANDALONE_SERVICE';
        subscriptionPlanId?: number | null;
        serviceId?: number | null;
        renewalMode: 'AUTO' | 'MANUAL';
      }
    >({
      query: (body) => ({
        url: '/api/subscription',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'], // Invalidate subscriptions list after creation
    }),
    getSubscriptionsBySubscriber: builder.query<
      { message: string; data: Subscription[] }, // Adjust data structure
      { subscriberType: string; subscriberId: string }
    >({
      query: ({ subscriberType, subscriberId }) =>
        `/api/subscription/subscriber/${subscriberType}/${subscriberId}`,
      providesTags: ['Subscription'],
    }),
     getUserSubscriptions: builder.query<
      { message: string; data: Subscription[] }, // Adjust data structure
      void
    >({
      query: () =>
        `/api/subscription/user`,
      providesTags: ['Subscription'],
    }),
    cancelSubscription: builder.mutation<any, string|number>({
      query: (id) => ({
        url: `/api/subscription/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    pauseSubscription: builder.mutation<any, { subscriptionId: string|number,pauseEndDate:string }>({
      query: (body) => ({
        url: '/api/subscription/pause',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    resumeSubscription: builder.mutation<any, string|number>({
      query: (id) => ({
        url: `/api/subscription/${id}/resume`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    renewSubscription: builder.mutation<any, string|number>({
      query: (id) => ({
        url: `/api/subscription/${id}/renew`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    retrySubscription: builder.mutation<any, string|number>({
      query: (id) => ({
        url: `/api/subscription/${id}/retry-payment`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
       createSubscriptionWithPayment: builder.mutation<
      ApiResponse<CreatedSubscriptionDto>,
      {
        subscriberType: string;
        subscriberId: string;
        subscriptionType: string;
        subscriptionPlanId: number;
        serviceId: number;
        renewalMode: string;
        payerInfo: {
          email: string;
          phoneNumber: string;
          firstName: string;
          lastName: string;
          countryCode: string;
        };
        currency: string;
        gatewayName: string;
        returnUrl: string;
      }
    >({
      query: (data) => ({
        url: '/api/subscription/with-payment',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useGetServicesQuery,
  useCreateSubscriptionMutation,
  useGetSubscriptionsBySubscriberQuery,
  useCancelSubscriptionMutation,
  usePauseSubscriptionMutation,
  useResumeSubscriptionMutation,
  useRenewSubscriptionMutation,
  useGetUserSubscriptionsQuery,
  useRetrySubscriptionMutation,
  useCreateSubscriptionWithPaymentMutation
} = subscriptionApi;