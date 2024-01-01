import { createSlice } from "@reduxjs/toolkit";
const messageData = createSlice({
  name: "messageData",
  initialState: {
    message: "",
    chatId: "",
    selectedUserInfo: "",
  },
  reducers: {
    setMessageData(state, action) {
      return {
        ...state,
        message: action.payload,
      };
    },
    setChatId(state, action) {
      return {
        ...state,
        chatId: action.payload,
      };
    },
    setSelectedUserInfo(state, action) {
      return { ...state, selectedUserInfo: action.payload };
    },

    clearMessageData(state, action) {
      return {
        message: "",
        chatId: "",
      };
    },
  },
});

export default messageData.reducer;
export const {
  setMessageData,
  clearMessageData,
  setSelectedUserInfo,
  setChatId,
} = messageData.actions;

export const selectMessage = (state)=>state.messageState