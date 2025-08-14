import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  error: null,
  items: [],
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getCartSuccess(state, action) {
      state.isLoading = false;
      state.items = action.payload.items || [];
    },
    updateCartSuccess(state, action) {
      state.isLoading = false;
      state.items = action.payload.items || [];
    },
    removeFromCartSuccess(state, action) {
      state.isLoading = false;
      state.items = action.payload.items || [];
    },
    updateCartQtySuccess(state, action) {
      state.isLoading = false;
      state.items = action.payload.items || [];
    },
   removeFromCartSuccess: (state, action) => {
  state.isLoading = false;
  const removedId = action.payload; 
  state.items = state.items.filter(i => i.productId !== removedId);
},

    clearCart(state) {
      state.items = [];
    },
  },
});

export default slice.reducer;
export const { clearCart } = slice.actions;


export const getCart = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/cart`, {

    });
    console.log(res.data)
    dispatch(slice.actions.getCartSuccess(res.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};

export const addToCart = (productId, quantity) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/v1/cart/add`,
       productId, quantity ,
    );
    console.log(res,'ddd')
    dispatch(slice.actions.updateCartSuccess(res.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};

export const removeFromCart = (productId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/api/v1/cart/remove/${productId}`,
    );
    dispatch(slice.actions.removeFromCartSuccess(productId));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};

export const updateCartQty = (productId, quantity) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/v1/cart/update`,
      {productId, quantity },
      // { withCredentials: true }
    );
    dispatch(slice.actions.updateCartSuccess(res.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};

export const ClearCart = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/cart/clear`);
    dispatch(slice.actions.clearCart()); 
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};
