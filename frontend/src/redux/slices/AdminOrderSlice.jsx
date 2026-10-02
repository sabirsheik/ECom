import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminError, adminRequest } from "../adminApi";

const withAdminError = (error, rejectWithValue) =>
  rejectWithValue(adminError(error));

export const fetchAdminOrders = createAsyncThunk(
  "adminOrders/fetchAdminOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await adminRequest({ method: "get", url: "/auth/admin/orders" });
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

export const fetchAdminDashboard = createAsyncThunk(
  "adminOrders/fetchAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await adminRequest({ method: "get", url: "/auth/admin/dashboard" });
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await adminRequest({
        method: "put",
        url: `/auth/admin/order-update/${id}`,
        data: { status },
      });
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await adminRequest({ method: "delete", url: `/auth/admin/order-delete/${id}` });
      return id;
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    dashboard: null,
    loading: false,
    dashboardLoading: false,
    error: null,
    updatingId: null,
    deletingId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateOrderStatus.pending, (state, action) => {
        state.updatingId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updatingId = null;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) state.orders[index] = action.payload;
        if (state.dashboard?.recentOrders) {
          const recentIndex = state.dashboard.recentOrders.findIndex(
            (order) => order._id === action.payload._id
          );
          if (recentIndex !== -1) {
            state.dashboard.recentOrders[recentIndex] = action.payload;
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updatingId = null;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(deleteOrder.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.deletingId = null;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default adminOrderSlice.reducer;
