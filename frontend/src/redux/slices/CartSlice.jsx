import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to load carl from loaclStorage

const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    if (!storedCart) {
      return { products: [], totalPrice: 0 };
    }
    const parsed = JSON.parse(storedCart);
    return {
      products: Array.isArray(parsed?.products) ? parsed.products : [],
      totalPrice: Number(parsed?.totalPrice || 0),
    };
  } catch {
    return { products: [], totalPrice: 0 };
  }
};

// Helper function to save cart in localStorage

const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const buildAuthHeaders = () => {
  const token = localStorage.getItem("userToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const emptyCart = { products: [], totalPrice: 0 };

// Fetch cart for a user or guest

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,

        {
          params: { userId, guestId },
          headers: userId ? buildAuthHeaders() : {},
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return emptyCart;
      }
      return rejectWithValue(error.response.data);
    }
  }
);
// Add an item to the cart for a user or guest

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, size, color, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/create`,
        {
          productId,
          quantity,
          size,
          color,
          guestId,
          userId,
        }
        ,
        {
          headers: userId ? buildAuthHeaders() : {},
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update the quantity of an item in the cart

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { productId, quantity, guestId, userId, size, color },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update`,
        {
          productId,
          quantity,
          size,
          color,
          guestId,
          userId,
        }
        ,
        {
          headers: userId ? buildAuthHeaders() : {},
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Remove an Item from the cart

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/cart/delete`,
        headers: userId ? buildAuthHeaders() : {},
        data: { productId, guestId, userId, size, color },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Merge guest cart into user cart

export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId },
        {
          headers: buildAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    addToCartLoading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = emptyCart;
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      // handle Fetch cart for a user or guest
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to Fetched Cart";
      })
      // handle Add an item to the cart for a user or guest
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.addToCartLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.addToCartLoading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.addToCartLoading = false;
        state.error = action.payload?.message || "Failed to Add Cart";
      })
      // handle Update the quantity of an item in the cart
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to Update Item Quantity";
      })
      // handle Remove an Item from the cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to Remove Item";
      })
    // handle Merge guest cart into user cart
    .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
        localStorage.removeItem("guestId");
        localStorage.setItem("guestId", `guest_${Date.now()}`);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to Merge Cart";
      })
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;