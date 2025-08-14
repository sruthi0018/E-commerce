import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  error: null,
  stats: {
    totalProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    ordersLastWeek: [],
    products: [],
  },
};

const slice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getDashboardSuccess(state, action) {
      state.isLoading = false;
      state.stats = action.payload;
    },
    // Optional: update stats in real-time via Socket.IO
    updateStock(state, action) {
      const { productId, stock } = action.payload;
      state.stats.products = state.stats.products.map(p =>
        p._id === productId ? { ...p, stock } : p
      );
    },
    addNewOrder(state, action) {
      state.stats.totalOrders += 1;
      state.stats.ordersLastWeek.push(action.payload);
    },
  },
});

export default slice.reducer;
export const { updateStock, addNewOrder } = slice.actions;


export const getDashboardStats = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/admin`);
    console.log(res.data,"chhh")
    dispatch(slice.actions.getDashboardSuccess(res.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};
