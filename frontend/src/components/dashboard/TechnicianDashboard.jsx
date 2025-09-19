import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkOrders,
  completeWorkOrder,
} from "../../slices/workOrderSlice";
import { logout } from "../../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function TechnicianDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    list: workOrders,
    loading,
    error,
  } = useSelector((state) => state.workOrders);

  const myWorkOrders =
    workOrders?.filter((w) => w.assignedTo?._id === user?._id) || [];

  const stats = {
    total: myWorkOrders.length,
    inProgress: myWorkOrders.filter(
      (w) =>
        w.status.toLowerCase() === "in progress" ||
        w.status.toLowerCase() === "in-progress"
    ).length,
    completed: myWorkOrders.filter(
      (w) => w.status.toLowerCase() === "completed"
    ).length,
  };

  useEffect(() => {
    dispatch(fetchWorkOrders());
  }, [dispatch]);

  const handleComplete = async (id) => {
    try {
      await dispatch(completeWorkOrder(id)).unwrap();
      alert("Work order marked as completed. Waiting for supervisor approval.");
    } catch (err) {
      console.error(err);
      alert("Failed to complete work order. Please try again.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success";
      case "in progress":
      case "in-progress":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  if (loading)
    return <div className="container mt-4">Loading work orders...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Technician Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <h4>Welcome, {user?.name}</h4>
        <Link to="/profile" className="btn btn-outline-secondary btn-sm">
          View Profile
        </Link>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h4>{stats.total}</h4>
              <p>Total Assigned</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h4>{stats.inProgress}</h4>
              <p>In Progress</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h4>{stats.completed}</h4>
              <p>Completed</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">My Work Orders</div>
        <div className="card-body">
          {myWorkOrders.length === 0 ? (
            <p className="text-muted">No work orders assigned.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Equipment</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myWorkOrders.map((w) => (
                  <tr key={w._id}>
                    <td>{w.title}</td>
                    <td>{w.equipment?.name || "N/A"}</td>
                    <td>
                      <span
                        className={`badge ${getStatusBadgeClass(w.status)}`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td>{new Date(w.dueDate).toLocaleDateString()}</td>
                    <td>
                      {w.status.toLowerCase() !== "completed" ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleComplete(w._id)}
                        >
                          Complete
                        </button>
                      ) : (
                        <span className="text-muted">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
