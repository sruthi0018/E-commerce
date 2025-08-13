// cartSlice.js or orderSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  error: null,
  order: null,
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
      state.order = action.payload;
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
