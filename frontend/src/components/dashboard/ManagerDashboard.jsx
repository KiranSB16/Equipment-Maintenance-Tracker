import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipments } from "../../slices/equipmentSlice";
import { fetchWorkOrders } from "../../slices/workOrderSlice";
import { fetchTechnicians } from "../../slices/userSlice";
import { logout } from "../../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function ManagerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showWorkload, setShowWorkload] = useState(false);

  const { list: equipments, loading: eqLoading } = useSelector(
    (state) => state.equipments || {}
  );
  const { list: workOrders, loading: woLoading } = useSelector(
    (state) => state.workOrders || {}
  );
  const { technicians, loading: techLoading } = useSelector(
    (state) => state.users || {}
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEquipments());
    dispatch(fetchWorkOrders());
    dispatch(fetchTechnicians());
  }, [dispatch]);

  const workload =
    technicians?.map((t) => ({
      technician: t.name,
      count: workOrders?.filter((w) => w.assignedTo?._id === t._id).length,
    })) || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (eqLoading || woLoading || techLoading) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manager Dashboard</h2>
      </div>

      <div className="d-flex gap-3 align-items-center mb-4">
        <h4 className="mb-0">Welcome, {user?.name}</h4>
        <div className="d-flex gap-2">
          <Link to="/profile" className="btn btn-outline-secondary btn-sm">
            View Profile
          </Link>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
          <Link
            to="/reports"
            className="btn btn-success btn-sm d-flex align-items-center gap-1"
          >
            <i className="bi bi-file-earmark-bar-graph"></i>
            Generate Reports
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-center border rounded-0 h-100">
            <div className="card-body d-flex flex-column justify-content-center">
              <h4 className="fw-bold mb-1">{equipments?.length || 0}</h4>
              <p className="mb-2 text-muted">Total Equipment</p>
              <Link
                to="/equipment/list"
                className="btn btn-sm btn-outline-dark"
              >
                View
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center border rounded-0 h-100">
            <div className="card-body d-flex flex-column justify-content-center">
              <h4 className="fw-bold mb-1">{workOrders?.length || 0}</h4>
              <p className="mb-2 text-muted">Work Orders</p>
              <Link
                to="/workorders/list"
                className="btn btn-sm btn-outline-dark"
              >
                View
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center border rounded-0 h-100">
            <div className="card-body d-flex flex-column justify-content-center">
              <h4 className="fw-bold mb-1">{technicians?.length || 0}</h4>
              <p className="mb-2 text-muted">Technicians</p>
              <button
                className="btn btn-sm btn-outline-dark"
                onClick={() => setShowWorkload(!showWorkload)}
              >
                {showWorkload ? "Hide" : "View"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showWorkload && (
        <div className="card">
          <div className="card-header">Technician Workload</div>
          <div className="card-body">
            {workload.length === 0 ? (
              <p className="text-muted mb-0">No technicians available</p>
            ) : (
              <table className="table table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Technician</th>
                    <th>Work Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {workload.map((w, idx) => (
                    <tr key={idx}>
                      <td>{w.technician}</td>
                      <td>{w.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
