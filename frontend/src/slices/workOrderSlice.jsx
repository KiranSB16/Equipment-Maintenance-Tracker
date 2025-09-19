import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axios";

export const fetchWorkOrders = createAsyncThunk(
  "workOrders/fetchWorkOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/workOrders");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createWorkOrder = createAsyncThunk(
  "workOrders/createWorkOrder",
  async (workOrderData, { rejectWithValue }) => {
    try {
      const res = await api.post("/workOrders", workOrderData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateWorkOrder = createAsyncThunk(
  "workOrders/updateWorkOrder",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/workOrders/${id}`, updates);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const assignWorkOrder = createAsyncThunk(
  "workOrders/assignTechnician",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/workOrders/${id}/assign`, updates);
      return res.data.workOrder;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const completeWorkOrder = createAsyncThunk(
  "workOrders/completeWorkOrder",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/workOrders/${id}/complete`);
      return res.data.workOrder;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const closeWorkOrder = createAsyncThunk(
  "workOrders/closeWorkOrder",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/workOrders/${id}/close`);
      return res.data.workOrder;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const workOrderSlice = createSlice({
  name: "workOrders",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchWorkOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createWorkOrder.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(updateWorkOrder.fulfilled, (state, action) => {
        const index = state.list.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      .addCase(assignWorkOrder.fulfilled, (state, action) => {
        const index = state.list.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      .addCase(completeWorkOrder.fulfilled, (state, action) => {
        const index = state.list.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      .addCase(closeWorkOrder.fulfilled, (state, action) => {
        const index = state.list.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default workOrderSlice.reducer;
