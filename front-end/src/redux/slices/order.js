// cartSlice.js or orderSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  error: null,
  order: null,
  orders:[]
};

const slice = createSlice({
  name: "order",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createOrderSuccess(state, action) {
      state.isLoading = false;
           state.orders.push(action.payload);

    },
     getOrdersSuccess(state, action) {
      state.isLoading = false;
      state.orders = action.payload;
    },
     updateOrderSuccess(state, action) {
      state.isLoading = false;
      const updated = action.payload;
      const index = state.orders.findIndex((p) => p._id === updated._id);
      if (index !== -1) {
        state.orders[index] = updated;
      }
    },
  },
});

export default slice.reducer;

export const { startLoading, hasError, createOrderSuccess } = slice.actions;


export const createOrder = (orderData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/v1/order`,
      orderData,

    );
    dispatch(createOrderSuccess(res.data));
  } catch (error) {
    dispatch(hasError(error.response?.data?.message || error.message));
  }
};

export const GetMyOrders = (params) => async (dispatch) => {
 dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/order/my`, { params });
    console.log("gtp",response)
 dispatch(slice.actions.getOrdersSuccess(response.data));
  } catch (error) {
   dispatch(slice.actions.hasError(error.message));
  }
};

export const GetOrders = (params) => async (dispatch) => {
 dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/order`, { params });
    console.log("gtp",response)
 dispatch(slice.actions.getOrdersSuccess(response.data));
  } catch (error) {
   dispatch(slice.actions.hasError(error.message));
  }
};

export function UpdateOrder(id, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/order/${id}/status`, data,
       
      );
      console.log(response.data,"up")
      dispatch(slice.actions.updateOrderSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      throw error;
    }
  };
}