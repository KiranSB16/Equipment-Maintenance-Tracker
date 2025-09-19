import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";

export default function SupervisorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Supervisor Dashboard</h2>
      </div>

      <div className="d-flex gap-3 justify-content-between align-items-center mb-4">
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
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">Equipment Management</div>
        <div className="card-body">
          <Link to="/equipment/add" className="btn btn-success btn-sm me-2">
            + Add Equipment
          </Link>
          <Link to="/equipment/list" className="btn btn-outline-primary btn-sm">
            View All Equipments
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Work Orders</div>
        <div className="card-body">
          <Link to="/workorders/add" className="btn btn-primary btn-sm me-2">
            + Create Work Order
          </Link>
          <Link
            to="/workorders/list"
            className="btn btn-outline-primary btn-sm"
          >
            View Work Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
