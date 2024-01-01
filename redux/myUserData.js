import { createSlice } from "@reduxjs/toolkit";

const myUserData = createSlice({
  name: "myUserData",
  initialState: {},
  reducers: {
    setUserData(state, action) {
      return { ...action.payload };
    },
    clearUserData(state, action) {
      return {};
    },
  },
});
export default myUserData.reducer;
export const { setUserData, clearUserData } = myUserData.actions;
export const selectMyData = (state) => state.myUserData;
