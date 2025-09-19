import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";
import ReportsPage from "./pages/Report";

import SupervisorDashboard from "./components/dashboard/SupervisorDashboard";
import ManagerDashboard from "./components/dashboard/ManagerDashboard";
import TechnicianDashboard from "./components/dashboard/TechnicianDashboard";

import AddEquipment from "./components/equipment/AddEquipment";
import EquipmentList from "./components/equipment/EquipmentList";

import WorkOrderList from "./components/workOrder/WorkOrderList";
import AddWorkOrder from "./components/workOrder/AddWorkOrder";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />

      {/* Common Protected route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute role="Manager">
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Supervisor Route */}
      <Route
        path="/supervisor"
        element={
          <ProtectedRoute role="Supervisor">
            <SupervisorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Manager Route */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute role="Manager">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Technician Route */}
      <Route
        path="/technician"
        element={
          <ProtectedRoute role="Technician">
            <TechnicianDashboard />
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/equipment/add"
        element={
          <ProtectedRoute role={["Manager", "Supervisor"]}>
            <AddEquipment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/equipment/list"
        element={
          <ProtectedRoute role={["Manager", "Supervisor"]}>
            <EquipmentList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workorders/add"
        element={
          <ProtectedRoute role={["Manager", "Supervisor"]}>
            <AddWorkOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workorders/list"
        element={
          <ProtectedRoute role={["Manager", "Supervisor", "Technician"]}>
            <WorkOrderList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
