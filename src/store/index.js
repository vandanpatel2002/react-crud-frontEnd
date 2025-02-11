import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "./apiSlice"; // Import the API slice

const store = configureStore({
  reducer: {
    apiData: apiReducer,
  },
});

export default store;
