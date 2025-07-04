import { api } from '../api/apiSlice';

interface Banner {
  id: number;
  title: string;
  description: string;
  webImageUrl: string;
  mobileImageUrl: string;
  link: string;
}

export const bannerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<{ message: string; data: Banner[] }, void>({
      query: () => '/api/Banners',
      providesTags: ['Banner'],
    }),
  }),
});

export const { useGetBannersQuery } = bannerApi;