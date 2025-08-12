import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/product";
import categoryReducer from './slices/category'

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
  },
});
