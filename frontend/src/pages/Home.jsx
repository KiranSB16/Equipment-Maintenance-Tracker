import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="mb-4 fw-bold">Equipment Maintenance Tracker</h1>
        <p className="text-muted mb-4">
          Manage your equipment, work orders, and technicians seamlessly.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/login" className="btn btn-outline-dark px-4 py-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-outline-dark px-4 py-2">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
