import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminError, adminRequest } from "../adminApi";

const withAdminError = (error, rejectWithValue) =>
  rejectWithValue(adminError(error));

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await adminRequest({ method: "get", url: "/auth/admin/all-users" });
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      return await adminRequest({
        method: "post",
        url: "/auth/admin/create-user",
        data: userData,
      });
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, ...userData }, { rejectWithValue }) => {
    try {
      return await adminRequest({
        method: "put",
        url: `/auth/admin/user-update/${id}`,
        data: userData,
      });
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await adminRequest({ method: "delete", url: `/auth/admin/user-delete/${id}` });
      return id;
    } catch (error) {
      return withAdminError(error, rejectWithValue);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  saving: false,
  deletingId: null,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(addUser.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.saving = false;
        state.users.unshift(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.users.findIndex(
          (user) => user._id === action.payload.user._id
        );
        if (index !== -1) state.users[index] = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deletingId = null;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
