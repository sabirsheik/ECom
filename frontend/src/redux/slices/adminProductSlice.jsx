import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminError, adminRequest } from "../adminApi";

const withAdminError = (error, rejectWithValue) =>
  rejectWithValue(adminError(error));

export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await adminRequest({ method: "get", url: "/auth/admin/products" });
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

export const fetchAdminProduct = createAsyncThunk(
  "adminProducts/fetchAdminProduct",
  async (id, { rejectWithValue }) => {
    try {
      return await adminRequest({ method: "get", url: `/auth/admin/products/${id}` });
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      return await adminRequest({
        method: "post",
        url: "/api/products/create",
        data: productData,
      });
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      return await adminRequest({
        method: "put",
        url: `/api/products/${id}`,
        data: productData,
      });
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await adminRequest({ method: "delete", url: `/api/products/${id}` });
      return id;
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    saving: false,
    deletingId: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.saving = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deletingId = null;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default adminProductSlice.reducer;
