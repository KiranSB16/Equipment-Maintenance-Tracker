import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = role ? (Array.isArray(role) ? role : [role]) : null;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    let redirectPath = "/";
    switch (user.role) {
      case "Manager":
        redirectPath = "/manager";
        break;
      case "Supervisor":
        redirectPath = "/supervisor";
        break;
      case "Technician":
        redirectPath = "/technician";
        break;
      default:
        redirectPath = "/";
    }
    return <Navigate to={redirectPath} replace />;
  }
  return children;
}
