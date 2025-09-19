import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axios";

export const addEquipment = createAsyncThunk(
  "equipments/addEquipment",
  async (equipmentData, { rejectWithValue }) => {
    try {
      const res = await api.post("/equipments", equipmentData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add equipment");
    }
  }
);

export const fetchEquipments = createAsyncThunk(
  "equipments/fetchEquipments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/equipments");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch equipments"
      );
    }
  }
);

export const updateEquipment = createAsyncThunk(
  "equipments/updateEquipment",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/equipments/${id}`, updates);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update equipment"
      );
    }
  }
);

const equipmentSlice = createSlice({
  name: "equipments",
  initialState: {
    list: [],
    loading: false,
    error: null,
    editingEquipment: null,
  },
  reducers: {
    setEditingEquipment: (state, action) => {
      if (
        state.editingEquipment &&
        state.editingEquipment._id === action.payload._id
      ) {
        state.editingEquipment = null;
      } else {
        state.editingEquipment = action.payload;
      }
    },
    clearEditingEquipment: (state) => {
      state.editingEquipment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEquipments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      .addCase(fetchEquipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })

      .addCase(updateEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((eq) =>
          eq._id === action.payload._id ? action.payload : eq
        );
        state.editingEquipment = null;
      });
  },
});

export const { setEditingEquipment, clearEditingEquipment } =
  equipmentSlice.actions;
export default equipmentSlice.reducer;
