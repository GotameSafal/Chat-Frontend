import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    // credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const tokenState = getState().tokenStore;
      if (tokenState) headers.set("authorization", tokenState.token);
      return headers;
    },
  }),
  tagTypes: ["Friends", "User"],
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: () => "/api/getFriends",
      providesTags: ["User"],
    }),
    getNewFriends: builder.query({
      query: () => "/api/getNewFriends",
      providesTags: ["Friends"],
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/api/login", method: "POST", body }),
    }),
    signup: builder.mutation({
      query: (body) => ({ url: "/api/signup", method: "POST", body }),
    }),
    fetchMyData: builder.query({
      query: () => "/api/me",
    }),
    confirmRequest: builder.mutation({
      query: (body) => ({ url: "/api/confirmFriend", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    deleteRequest: builder.mutation({
      query: (body) => ({
        url: "/api/deleteFriend",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    addFriend: builder.mutation({
      query: (body) => ({ url: "/api/addfriend", method: "POST", body }),
      invalidatesTags: ["Friends"],
    }),
    logout: builder.query({
      query: () => "/api/logout",
    }),
    search: builder.query({
      query: (keyword) => `/api/search?keyword=${keyword}`,
    }),
    friendRequest: builder.query({
      query: () => "/api/requests",
      providesTags: ["User"],
    }),
    startConvo: builder.mutation({
      query: (body) => ({ url: "/api/chat", method: "POST", body }),
    }),

    fetchMessage: builder.query({
      query: (chatId) => `/api/message/${chatId}`,
    }),
    fetchAllChat: builder.query({
      query: () => "/api/chat/",
    }),
    sendMessage: builder.mutation({
      query: (body) => ({ url: "/api/message/", method: "POST", body }),
    }),
  }),
});
export const {
  useLoginMutation,
  useSignupMutation,
  useGetNewFriendsQuery,
  useGetFriendsQuery,
  useLazyGetFriendsQuery,
  useFetchAllChatQuery,
  useConfirmRequestMutation,
  useAddFriendMutation,
  useDeleteRequestMutation,
  useLazyLogoutQuery,
  useLazySearchQuery,
  useFriendRequestQuery,
  useFetchMyDataQuery,
  useLazyFetchMyDataQuery,
  useStartConvoMutation,
  useLazyFetchMessageQuery,
  useLazyFetchAllChatQuery,
  useSendMessageMutation,
  useLazyGetNewFriendsQuery,
  useLazyFriendRequestQuery
} = api;
