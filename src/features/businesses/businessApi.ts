import { api } from '../api/apiSlice';


export interface BusinessPhoto {
  photoURL: string;
  photoSection: string;
}

interface ReviewsData {
  rating: number;
  count: number;
  comment: string;
}

interface OpenCloseHours {
  openingHours: string | null;
  message: string;
  extMessage: string | null;
  isOpen: boolean;
}

interface BusinessSubCategory {
  id: number;
  businessID: string;
  subCategoryID: number;
  subCategoryName: string;
}

interface BusinessAttribute {
  attributeName: string;
  attributeValue: string | null;
  attributeIcon: string;
}

interface BusinessTag {
  tagName: string;
  tagIcon: string;
}

interface BusinessHour {
  id: number;
  businessID: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

interface BusinessProduct {
  id: number;
  businessID: string;
  name: string;
  description: string;
  price: number;
  productType: string;
  categoryID: number;
  subCategoryID: number;
  createdDate: string;
  updatedDate: string;
  productPhotos: Array<{
    id: number;
    businessProductID: number;
    businessID: string;
    photoURL: string;
    uploadDate: string;
    softDeleted: boolean;
  }>;
}

interface BusinessBrand {
  businessID: string;
  brandID: string;
  name: string;
  description: string;
  brandPhotos: Array<{
    id: number;
    brandID: string;
    photoUrl: string;
  }>;
}

interface Review {
  reviewID: number;
  userID: number;
  userName: string;
  businessID: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  notHelpfulCount: number;
  reviewDate: string;
  status: number;
  reviewResponses: any[];
}

export interface Business {
  isSponsored: boolean;
  businessID: string;
  categoryID: number;
  subCategoryID: number | null;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  email: string;
  videoURL: string;
  adressDetails: string;
  website: string | null;
  latitude: number;
  longitude: number;
  createdDate: string;
  isVerified: boolean;
  reviewsData: ReviewsData;
  openCloseHours: OpenCloseHours;
  businessSubCategories: BusinessSubCategory[];
  businessHours: any[];
  businessAttributes: BusinessAttribute[];
  businessTags: BusinessTag[];
  businessPhotos: BusinessPhoto[];
  reviews: any[];
  businessProducts: any[];
  businessContacts: any[];
  businessPromotion: any;
}

export interface SingleBusiness {
  businessID: string;
  categoryID: number;
  name: string;
  address: string;
  description: string;
  city: string;
  country: string;
  phoneNumber: string;
  email: string;
  videoURL: string | null;
  addressDetails: string;
  website: string | null;
  latitude: number;
  longitude: number;
  rating: number;
  isVerified: boolean;
  openCloseHours: OpenCloseHours;
  businessAssociation: {
    addedToMall: boolean;
    addedToPetrolStation: boolean;
    hasBrands: boolean;
  };
  businessSubCategories: BusinessSubCategory[];
  businessHours: BusinessHour[];
  businessAttributes: BusinessAttribute[];
  businessTags: BusinessTag[];
  businessPhotos: BusinessPhoto[];
  reviews: Review[];
  businessProducts: BusinessProduct[];
  businessContacts: any[];
  businessPromotion: any;
  childBusinesses: any[];
  businessBrands: BusinessBrand[];
  businessNotices: any[];
}
interface BusinessListingResponse {
  success: boolean;
  data: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    items: Business[];
  };
}

export const businessApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomeBusinesses: builder.mutation<BusinessListingResponse, { pageNumber: number; pageSize: number; sortBy: string }>({
      query: (body) => ({
        url: '/api/Business/home-listing',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Business'],
    }),
    getBusinesses: builder.query<Business[], void>({
      query: () => ({
        url: '/api/Business/user',
        method: 'GET',
      }),
      providesTags: ['Business'],
    }),
      getSingleBusiness: builder.query<SingleBusiness, string>({
      query: (businessId) => ({
        url: `/api/Business/${businessId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Business', id }],
    }),
  }),
});

export const { useGetHomeBusinessesMutation, useGetBusinessesQuery ,useGetSingleBusinessQuery} = businessApi;