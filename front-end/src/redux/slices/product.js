import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  isLoading: false,
  error: null,
     total: 0,
  product: null,
  products: [],
};

const slice = createSlice({
  name: "products",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createProductSuccess(state, action) {
      state.isLoading = false;
      state.products.push(action.payload);
    },
 getProductsSuccess(state, action) {
  state.isLoading = false;
  state.products = action.payload.products; 
  state.total = action.payload.total;
},

    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },
    searchProductSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },
    updateProductSuccess(state, action) {
      state.isLoading = false;
      const updated = action.payload;
      const index = state.products.findIndex((p) => p._id === updated._id);
      if (index !== -1) {
        state.products[index] = updated;
      }
    },
        deleteProductSuccess(state, action) {
      state.isLoading = false;
      state.products = state.products.filter((c) => c._id !== action.payload);
    },
    clearSingleProduct(state) {
  state.product = null;
}

  },
});


export default slice.reducer;
export const { clearSingleProduct } = slice.actions;

export function CreateProduct(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/product`, data
        , { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("crpro",response.data)
      dispatch(slice.actions.createProductSuccess(response.data.product));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      throw error;
    }
  };
}

export const GetAllProducts = (params) => async (dispatch) => {
 dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/product`, { params });
    console.log("gtp",response)
 dispatch(slice.actions.getProductsSuccess(response.data));
  } catch (error) {
   dispatch(slice.actions.hasError(error.message));
  }
};


export function GetProductById(id) {
  console.log("iddd",id)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/product/${id}`);
      console.log("getprod",response)
      dispatch(slice.actions.getProductSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
}

export function DeleteProduct(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/product/${id}`);
      dispatch(slice.actions.deleteProductSuccess(id));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      throw error;
    }
  };
}

export function UpdateProduct(id, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/product/${id}`, data,
         { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response.data,"up")
      dispatch(slice.actions.updateProductSuccess(response.data.product));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      throw error;
    }
  };
}

