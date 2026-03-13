import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("userToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async Thunk to Fetch by Collection and optional Filters

export const fetchProductsByFilters = createAsyncThunk(
  "product/fetchByFilters",
  async ({
    collection,
    sizes,
    colors,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
    minRating,
    availability,
  }) => {
    const query = new URLSearchParams();
    if (collection) query.append("collection", collection);
    if (sizes) query.append("sizes", sizes);
    if (colors) query.append("colors", colors);
    if (gender) query.append("gender", gender);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (limit) query.append("limit", limit);
    if (minRating) query.append("minRating", minRating);
    if (availability) query.append("availability", availability);

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
    );
    return response.data;
  }
);

// Async thunk to fetch a single product by id

export const fetchProductDetails = createAsyncThunk(
  "Product/fetchProductDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
  }
);

export const trackProductView = createAsyncThunk(
  "product/trackProductView",
  async ({ productId }, { rejectWithValue }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/view`,
        {},
        { headers: getAuthHeaders() }
      );
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to track view" });
    }
  }
);

export const toggleWishlistProduct = createAsyncThunk(
  "product/toggleWishlistProduct",
  async ({ productId, isAuthenticated }, { rejectWithValue }) => {
    try {
      if (isAuthenticated) {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/wishlist-toggle`,
          {},
          { headers: getAuthHeaders() }
        );
        return { productId, wishlist: response.data.wishlist || [] };
      }

      const stored = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
      const exists = stored.includes(productId);
      const next = exists
        ? stored.filter((id) => id !== productId)
        : [...stored, productId];
      localStorage.setItem("guestWishlist", JSON.stringify(next));
      return { productId, guestWishlist: next };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update wishlist" });
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  "product/fetchRecommendations",
  async ({ user, viewedProductIds }, { rejectWithValue }) => {
    try {
      const liked = user?.wishlist?.map((id) => id.toString()) || JSON.parse(localStorage.getItem("guestWishlist") || "[]");
      const viewed = viewedProductIds || JSON.parse(localStorage.getItem("viewedProducts") || "[]");
      const params = new URLSearchParams();
      if (liked.length) params.set("liked", liked.join(","));
      if (viewed.length) params.set("viewed", viewed.join(","));

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/recommendations?${params.toString()}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch recommendations" });
    }
  }
);

export const rateProduct = createAsyncThunk(
  "product/rateProduct",
  async ({ productId, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/rate`,
        { rating },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to submit rating" });
    }
  }
);
// Async thunk to Update product Data

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

// Async thunk to fetch similar products

export const fetchSimilarProducts = createAsyncThunk(
  "product/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
  }
);
const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    recommendations: [],
    guestWishlist: JSON.parse(localStorage.getItem("guestWishlist") || "[]"),
    viewedProductIds: JSON.parse(localStorage.getItem("viewedProducts") || "[]"),
    loading: false,
    error: null,
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // handle Fetching products with filter
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // handle fetching single product
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // handle updated Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updateProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product._id === updateProduct._id
        );
        if (index != 1) {
          state.products[index] = updateProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // handle fetch similar products

      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleWishlistProduct.fulfilled, (state, action) => {
        if (action.payload.guestWishlist) {
          state.guestWishlist = action.payload.guestWishlist;
        }
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(trackProductView.fulfilled, (state, action) => {
        const current = state.viewedProductIds || [];
        const next = [...current.filter((id) => id !== action.payload), action.payload].slice(-30);
        state.viewedProductIds = next;
        localStorage.setItem("viewedProducts", JSON.stringify(next));
      })
      .addCase(rateProduct.fulfilled, (state, action) => {
        const { productId, rating, ratingCount } = action.payload;

        state.products = state.products.map((product) =>
          product._id === productId
            ? { ...product, rating, ratingCount }
            : product
        );

        if (state.selectedProduct?._id === productId) {
          state.selectedProduct = {
            ...state.selectedProduct,
            rating,
            ratingCount,
          };
        }

        state.recommendations = state.recommendations.map((product) =>
          product._id === productId
            ? { ...product, rating, ratingCount }
            : product
        );
      });
  },
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
