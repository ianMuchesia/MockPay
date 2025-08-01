import type { ApiResponse } from "../../types/main";
import { api } from "../api/apiSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      ApiResponse<{ api: { token: string; refreshToken: string } }>,
      { phone: string; password: string }
    >({
      query: (credentials) => ({
        url: "/api/auth/login/by-phone",
        method: "POST",
        body: credentials,
      }),
    }),
    getUser: builder.query<any, void>({
      // Adjust 'any' to actual User type later
      query: () => "/api/auth/user",
    }),
  }),
});

export const { useLoginMutation, useGetUserQuery } = authApi;
