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
     updateCategorySuccess(state, action) {
      state.isLoading = false;
      const updated = action.payload;
      const index = state.categories.findIndex((p) => p._id === updated._id);
      if (index !== -1) {
        state.categories[index] = updated;
      }
    },
    getCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.categories = action.payload;
    },
    getCategorySuccess(state, action) {
      state.isLoading = false;
      state.category = action.payload;
    },
     deleteCategorySuccess(state, action) {
      state.isLoading = false;
      state.categories = state.categories.filter((c) => c._id !== action.payload);
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
      dispatch(slice.actions.createCategorySuccess(response.data));
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

export function UpdateCategory(id, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/category/${id}`, data);
      dispatch(slice.actions.updateCategorySuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      throw error;
    }
  };
}

export function DeleteCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/category/${id}`);
      dispatch(slice.actions.deleteCategorySuccess(id));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      throw error;
    }
  };
}