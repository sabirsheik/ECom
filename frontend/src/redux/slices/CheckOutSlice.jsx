import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const buildHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/create`,
        checkoutData,
        { headers: buildHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Checkout creation failed" });
    }
  }
);

export const createStripeSession = createAsyncThunk(
  "checkout/createStripeSession",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/stripe/session`,
        { checkoutId },
        { headers: buildHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to create Stripe session" });
    }
  }
);

export const verifyStripeSession = createAsyncThunk(
  "checkout/verifyStripeSession",
  async ({ checkoutId, sessionId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/stripe/verify-session`,
        { checkoutId, sessionId },
        { headers: buildHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Stripe verification failed" });
    }
  }
);

export const fetchCheckoutStatus = createAsyncThunk(
  "checkout/fetchCheckoutStatus",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/status`,
        { headers: buildHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch checkout status" });
    }
  }
);

export const payCheckout = createAsyncThunk(
  "checkout/payCheckout",
  async ({ checkoutId, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails,
        },
        { headers: buildHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Checkout payment failed" });
    }
  }
);

export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        { headers: buildHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Checkout finalize failed" });
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    finalizedOrder: null,
    stripeSession: null,
    checkoutStatus: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCheckoutState: (state) => {
      state.checkout = null;
      state.finalizedOrder = null;
      state.stripeSession = null;
      state.checkoutStatus = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload?.checkout || null;
        state.finalizedOrder = action.payload?.order || null;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(payCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(payCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(finalizeCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.finalizedOrder = action.payload;
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(createStripeSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStripeSession.fulfilled, (state, action) => {
        state.loading = false;
        state.stripeSession = action.payload;
      })
      .addCase(createStripeSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(verifyStripeSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyStripeSession.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutStatus = action.payload;
      })
      .addCase(verifyStripeSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchCheckoutStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckoutStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutStatus = action.payload;
      })
      .addCase(fetchCheckoutStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;