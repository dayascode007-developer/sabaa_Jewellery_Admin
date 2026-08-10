import { configureStore } from "@reduxjs/toolkit";

// A new store is created per request so server-rendered pages never share state
// between users. Register slice reducers here as you add them:
//   import authReducer from "./slices/authSlice";
//   reducer: { auth: authReducer }
export const makeStore = () =>
  configureStore({
    reducer: {},
  });
