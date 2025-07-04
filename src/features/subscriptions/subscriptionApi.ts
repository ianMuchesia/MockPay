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
  services: { id: number; name: string; code: string }[];
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
  planName?: string;
  serviceName?: string;
  status: string;
  startDate: string;
  endDate: string;
  renewalMode: string;
  // Add other properties as needed from the actual API response
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
    cancelSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/subscription/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    pauseSubscription: builder.mutation<any, { subscriptionId: string }>({
      query: (body) => ({
        url: '/api/subscription/pause',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    resumeSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/subscription/${id}/resume`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    renewSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/subscription/${id}/renew`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
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
} = subscriptionApi;