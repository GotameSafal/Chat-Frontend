import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import messages from "./message.js";
import myUserData from "./myUserData.js";
import tokenStore from "./tokenStore.js";
export const store = configureStore({
  reducer: {
    messageState: messages,
    tokenStore,
    myUserData,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
