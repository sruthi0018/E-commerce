import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/product";
import categoryReducer from './slices/category';
import cartReducer from './slices/cart.js';
import orderReducer from './slices/order.js'
import dashboardReducer from './slices/dashboard.js'

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    order: orderReducer,
    dashboard:dashboardReducer

  },
});
