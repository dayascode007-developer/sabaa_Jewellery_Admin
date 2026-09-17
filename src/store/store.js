import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slices/adminAuthSlice";
import categoriesReducer from "./slices/categoriesSlice";
import subCategoriesReducer from "./slices/subCategoriesSlice";
import productsReducer from "./slices/productsSlice";
import symbolsReducer from "./slices/symbolsSlice";
import bulkProductsReducer from "./slices/bulkProductsSlice";
import customersReducer from "./slices/customersSlice";
import inventoryReducer from "./slices/inventorySlice";
import blogsReducer from "./slices/blogsSlice";
import couponsReducer from "./slices/couponsSlice";
import analyticsReducer from "./slices/analyticsSlice";
import analyticsRealtimeReducer from "./slices/analyticsRealtimeSlice";
import unboxingReducer from "./slices/unboxingSlice";
import adminOrdersReducer from "./slices/adminOrdersSlice";
import adminNotificationsReducer from "./slices/adminNotificationsSlice";
import bulkOrdersReducer from "./slices/bulkOrdersSlice";

// A new store is created per request so server-rendered pages never share state
// between users. Register slice reducers here as you add them:
export const makeStore = () =>
  configureStore({
    reducer: {
      adminAuth: adminAuthReducer,
      categories: categoriesReducer,
      subCategories: subCategoriesReducer,
      products: productsReducer,
      symbols: symbolsReducer,
      bulkProducts: bulkProductsReducer,
      customers: customersReducer,
      inventory: inventoryReducer,
      blogs: blogsReducer,
      coupons: couponsReducer,
      analytics: analyticsReducer,
      analyticsRealtime: analyticsRealtimeReducer,
      unboxing: unboxingReducer,
      adminOrders: adminOrdersReducer,
      adminNotifications: adminNotificationsReducer,
      bulkOrders: bulkOrdersReducer,
    },
  });
