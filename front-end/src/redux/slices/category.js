import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  isLoading: false,
  error: null,
  category: null,
  categories: [],
};

const slice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createCategorySuccess(state, action) {
      state.isLoading = false;
      state.categories.push(action.payload);
    },
    getCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.categories = action.payload;
    },
    getCategorySuccess(state, action) {
      state.isLoading = false;
      state.category = action.payload;
    },
  },
});

export default slice.reducer;

export function CreateCategory(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/category`, data);
      console.log(response.data, "createcat");
      dispatch(slice.actions.createCategorySuccess(response.data.category));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      throw error;
    }
  };
}

export function GetAllCategories() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/category`);
      console.log(response.data, "ccc");
      dispatch(slice.actions.getCategoriesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
}
