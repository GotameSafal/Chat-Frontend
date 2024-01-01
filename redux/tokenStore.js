import { createSlice } from "@reduxjs/toolkit";
const tokenStore = createSlice({
  name: "tokenStore",
  initialState: {
    token: null,
  },
  reducers: {
    setToken(state, actions) {
      state.token = actions.payload;
    },
    clearToken(state, actions) {
      state.token = null;
    },
  },
});
export default tokenStore.reducer;
export const { setToken, clearToken } = tokenStore.actions;
export const selectToken = (state) => state.tokenStore.token;
