import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axios";

export const fetchTechnicians = createAsyncThunk(
  "users/fetchTechnicians",
  async () => {
    const res = await api.get("/users?role=Technician");
    return res.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    technicians: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTechnicians.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTechnicians.fulfilled, (state, action) => {
        state.loading = false;
        state.technicians = action.payload;
      })
      .addCase(fetchTechnicians.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
