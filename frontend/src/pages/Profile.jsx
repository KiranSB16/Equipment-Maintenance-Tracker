import { useSelector } from "react-redux";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container mt-4">
      <h3>User Profile</h3>
      <ul className="list-group mt-3">
        <li className="list-group-item">
          <strong>Name:</strong> {user?.name}
        </li>
        <li className="list-group-item">
          <strong>Email:</strong> {user?.email}
        </li>
        <li className="list-group-item">
          <strong>Role:</strong> {user?.role}
        </li>
      </ul>
    </div>
  );
}
