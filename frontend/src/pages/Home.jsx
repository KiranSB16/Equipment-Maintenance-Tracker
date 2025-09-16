import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="container text-center">
      <h1 className="mb-4">Equipment Management Tracker</h1>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn btn-success">
          Register
        </Link>
      </div>
    </div>
  );
}
