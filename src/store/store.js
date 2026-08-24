import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slices/adminAuthSlice";
import bannersReducer from "./slices/bannersSlice";
import categoriesReducer from "./slices/categoriesSlice";
import subCategoriesReducer from "./slices/subCategoriesSlice";
import productsReducer from "./slices/productsSlice";
import symbolsReducer from "./slices/symbolsSlice";

// A new store is created per request so server-rendered pages never share state
// between users. Register slice reducers here as you add them:
export const makeStore = () =>
  configureStore({
    reducer: {
      adminAuth: adminAuthReducer,
      banners: bannersReducer,
      categories: categoriesReducer,
      subCategories: subCategoriesReducer,
      products: productsReducer,
      symbols: symbolsReducer,
    },
  });
