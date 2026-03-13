import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `$Bearer ${localStorage.getItem("userToken")}`;

// async thunk to fetch all orders (Admin Only)

export const fetchAdminOrders = createAsyncThunk(
  "adminOrders/fetchAdminOrders",
  async (_DO_NOT_USE__ACTIONTYPE, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/auth/admin/orders`, {
        headers: {
          Authorization: `${USER_TOKEN}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// async function to update order status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/auth/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `${USER_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Async thunk to delete a Order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/auth/admin/orders/${id}`, {
        headers: {
          Authorization: `${USER_TOKEN}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle Fetch Admin Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        //   Calculate the Total Sales
        const totalSales = action.payload.reduce((acc, order) => {
          return acc + order.totalSales;
        }, 0);
        state.totalSales = totalSales;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // handle Update Orders
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updateaOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (orderIndex !== 1) {
          state.orders[orderIndex] = updateaOrder;
        }
      })
      // Handle Delete Products
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = action.orders.filter(
          (order) => order._id !== action.payload
        );
      });
  },
});
export default adminOrderSlice.reducer;
