import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../slices/authSlice"
import equipmentReducer from "../slices/equipmentSlice"
import workOrderReducer from "../slices/workOrderSlice"
import userReducer from "../slices/userSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    equipments: equipmentReducer,
    workOrders: workOrderReducer,
    users: userReducer,
  },
});

export default store
