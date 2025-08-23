import type { ApiResponse } from "../../types/main";
import { api } from "../api/apiSlice";



interface LoginRequest {
  phone: string;
  password: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  userType: 'INDIVIDUAL' | 'COMPANY';
  alertChannel: 'EMAIL' | 'PHONE';
  name:string;
}

interface AuthResponse {
  success: boolean;
  data: {
    api: {
      token: string;
      refreshToken: string;
    };
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      userType: string;
      isVerified: boolean;
      name:string;
    };
  };
  message: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login/by-phone',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/api/auth/register/buyer',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
   
    
    getUser: builder.query<any, void>({
      // Adjust 'any' to actual User type later
      query: () => "/api/auth/user",
    }),
  }),
});

export const { useLoginMutation, useGetUserQuery ,useRegisterMutation} = authApi;
