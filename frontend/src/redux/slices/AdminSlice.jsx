import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all Users (Admin Only)
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async ({ rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/admin/all-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Add the Create User Action
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/admin/create-user`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Update User Info

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({id, name, email, role}, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/auth/admin/user-update/${id}`,
        {name, email, role},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    };
  }
);

// Delete User

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async ({id}, { rejectWithValue }) => {
    try {
       await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/auth/admin/user-delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    };
  }
);

const adminSlice = createSlice({
    name : "admin",
    initialState : {
        users : [],
        loading : false,
        error : null,
    },
    reducers : {},
    extraReducers : (builder) =>{
        builder 
        // Handle Fetch Users
        .addCase(fetchUsers.pending, (state) =>{
            state.loading = true;
        })
        .addCase(fetchUsers.fulfilled, (state, action) =>{
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) =>{
            state.loading = true;
            state.error = action.error.message;
        })
        // Handle UpdateUser
        .addCase(updateUser.fulfilled, (state, action)=>{
            const updateUser = action.payload;
            const userIndex = state.users.findIndex((user)=>{
                user._id === updateUser._id
            }
        )
        if(userIndex !== -1){
            state.users[userIndex] = updateUser;
        }
        })
          // Handle DeleteUser
        .addCase(deleteUser.fulfilled, (state, action) =>{
            state.users = state.users.filter((user) => user._id !== action.payload);
        })
        .addCase(addUser.pending, (state)=>{
          state.loading = true;
          state.error = null;
        })
        .addCase(addUser.fulfilled, (state, action)=>{
          state.loading = false;
          state.users.push(action.payload.user); // add new user to the state
        })
        .addCase(addUser.rejected, (state, action)=>{
          state.loading = false;
          state.error = action.payload.message;
        })
    }
});

export default adminSlice.reducer;