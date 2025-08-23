import { api } from "../api/apiSlice";

// export const bannerApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     getBanners: builder.query<{ message: string; data: Banner[] }, void>({
//       query: () => '/api/Banners',
//       providesTags: ['Banner'],
//     }),
//   }),
// });

// export const { useGetBannersQuery } = bannerApi;

// Type definitions
interface BannerEntitlement {
  canCreateBanner: boolean;
  availableSlots: number;
  existingBanners: ExistingBanner[];
  availableSubscriptionIdsForNewBanner: number[];
  message: string;
}

interface ExistingBanner {
  bannerId: number;
  title: string;
  link: string;
  webImageUrl: string;
  mobileImageUrl: string | null;
  linkedSubscriptionId: number;
  linkedSubscriptionStatus: string;
  subscriptionEndDate: string;
}

interface Banner {
  id: number;
  title: string;
  description: string;
  webImageUrl: string;
  duration: number;
  remainingDuration: number | null;
  sellerId: number;
  link: string;
  mobileImageUrl: string;
  status: string;
  pausedAt: string | null;
  createdAt: string;
  startDate: string | null;
  linkedSubscriptionId: number | null;
  linkedSubscription: any;
  bannersTariffs: any;
}

interface BannersResponse {
  message: string;
  data: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    items: Banner[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface BannerEntitlementResponse {
  message: string;
  data: BannerEntitlement;
}

interface GetBannersRequest {
  searchTerm?: string;
  userId?: number;
  pageNumber?: number;
  pageSize?: number;
}

interface CreateBannerRequest {
  title: string;
  description: string;
  link: string;
  selectedSubscriptionId: number;
  tariffs?: string[];
  webImage: File;
  mobileImage: File;
}

interface UpdateBannerRequest {
  id: number;
  title: string;
  description: string;
  link: string;
  selectedSubscriptionId?: number;
  tariffs?: string[];
  webImage?: File;
  mobileImage?: File;
}

interface BannerService {
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

interface BannerServiceResponse {
  message: string;
  data: BannerService;
}

export interface ScheduledBanner {
  bannerId: number;
  title: string;
  link: string;
  webImageUrl: string;
  mobileImageUrl: string;
  linkedSubscriptionId: number;
  linkedSubscriptionStatus: string;
  subscriptionEndDate: string;
}

interface ScheduledBannerResponse {
  message: string;
  data: ScheduledBanner[];
}

export const bannerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get banner entitlements
    getBannerEntitlements: builder.query<BannerEntitlementResponse, void>({
      query: () => "/api/v2/banners/entitlements",
      providesTags: ["Banner"],
    }),

    // Get user banners with pagination
    getUserBanners: builder.mutation<BannersResponse, GetBannersRequest>({
      query: (params) => ({
        url: "/api/v2/banners/sellers",
        method: "POST",
        body: {
          searchTerm: params.searchTerm || "",
          userId: params.userId || 0,
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
        },
      }),
      invalidatesTags: ["Banner"],
    }),
    getScheduledBanners: builder.query<ScheduledBannerResponse, void>({
      query: () => ({
        url: "/api/v2/banners/scheduled",
        method: "GET",
      }),
      providesTags: ["Banner"],
    }),

    // Create new banner
    createBanner: builder.mutation<
      { message: string; data: Banner },
      CreateBannerRequest
    >({
      query: (bannerData) => {
        const formData = new FormData();
        formData.append("Title", bannerData.title);
        formData.append("Description", bannerData.description);
        formData.append("Link", bannerData.link);
        //formData.append('SelectedSubscriptionId', bannerData.selectedSubscriptionId.toString());

        if (bannerData.tariffs) {
          bannerData.tariffs.forEach((tariff) => {
            formData.append("Tariffs", tariff);
          });
        }

        formData.append("WebImage", bannerData.webImage);
        formData.append("MobileImage", bannerData.mobileImage);

        return {
          url: "/api/v2/banners/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Banner"],
    }),

    //create premium banner
    createPremiumBanner: builder.mutation<
      { message: string; data: Banner },
      CreateBannerRequest
    >({
      query: (bannerData) => {
        const formData = new FormData();
        formData.append("Title", bannerData.title);
        formData.append("Description", bannerData.description);
        formData.append("Link", bannerData.link);
        formData.append(
          "SelectedSubscriptionId",
          bannerData.selectedSubscriptionId.toString()
        );

        if (bannerData.tariffs) {
          bannerData.tariffs.forEach((tariff) => {
            formData.append("Tariffs", tariff);
          });
        }

        formData.append("WebImage", bannerData.webImage);
        formData.append("MobileImage", bannerData.mobileImage);

        return {
          url: "/api/v2/banners/create/premium",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Banner"],
    }),

    // Update banner
    updateBanner: builder.mutation<
      { message: string; data: Banner },
      UpdateBannerRequest
    >({
      query: (bannerData) => {
        const formData = new FormData();
        formData.append("Title", bannerData.title);
        formData.append("Description", bannerData.description);
        formData.append("Link", bannerData.link);

        if (bannerData.selectedSubscriptionId) {
          formData.append(
            "SelectedSubscriptionId",
            bannerData.selectedSubscriptionId.toString()
          );
        }

        if (bannerData.tariffs) {
          bannerData.tariffs.forEach((tariff) => {
            formData.append("Tariffs", tariff);
          });
        }

        if (bannerData.webImage) {
          formData.append("WebImage", bannerData.webImage);
        }

        if (bannerData.mobileImage) {
          formData.append("MobileImage", bannerData.mobileImage);
        }

        return {
          url: `/api/v2/banners/${bannerData.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Banner"],
    }),

    // Delete banner
    deleteBanner: builder.mutation<{ message: string }, number>({
      query: (bannerId) => ({
        url: `/api/v2/banners/${bannerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),
    getBannerService: builder.query<BannerServiceResponse, void>({
      query: () => "/api/v2/banners/service",
      providesTags: ["Banner"],
    }),

    getBanners: builder.query<{ message: string; data: Banner[] }, void>({
      query: () => "/api/Banners",
      providesTags: ["Banner"],
    }),

    // Link banner to subscription (assuming this endpoint exists)
    linkBannerToSubscription: builder.mutation<
      { message: string },
      { bannerId: number; subscriptionId: number }
    >({
      query: ({ bannerId, subscriptionId }) => ({
        url: `/api/v2/banners/${bannerId}/link`,
        method: "POST",
        body: { subscriptionId },
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useGetBannerEntitlementsQuery,
  useGetUserBannersMutation,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useLinkBannerToSubscriptionMutation,
  useGetBannersQuery,
  useGetBannerServiceQuery,
  useCreatePremiumBannerMutation,
  useGetScheduledBannersQuery,
} = bannerApi;
