import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slices/adminAuthSlice";
import bannersReducer from "./slices/bannersSlice";

// A new store is created per request so server-rendered pages never share state
// between users. Register slice reducers here as you add them:
export const makeStore = () =>
  configureStore({
    reducer: {
      adminAuth: adminAuthReducer,
      banners: bannersReducer,
    },
  });
