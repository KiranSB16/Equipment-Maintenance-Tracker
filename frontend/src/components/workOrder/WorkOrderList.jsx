import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchWorkOrders, closeWorkOrder } from "../../slices/workOrderSlice";
import AssignTechnician from "../../pages/AssignTechnician";

export default function WorkOrderList() {
  const dispatch = useDispatch();
  const {
    list: workOrders,
    loading,
    error,
  } = useSelector((state) => state.workOrders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchWorkOrders());
  }, [dispatch]);

  const handleCloseWorkOrder = async (id) => {
    try {
      if (user?.role !== "Supervisor" && user?.role !== "Manager") {
        alert(
          "You don't have permission to close work orders. Your role: " +
            user?.role
        );
        return;
      }
      await dispatch(closeWorkOrder(id)).unwrap();
      alert("Work order closed successfully!");
    } catch (err) {
      alert(`Failed to close work order: ${err.message || err}`);
    }
  };

  if (loading)
    return <p className="text-center mt-4">Loading work orders...</p>;
  if (error) return <p className="text-danger mt-4">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Work Orders</h2>
        {(user?.role === "Supervisor" || user?.role === "Manager") && (
          <Link to="/workorders/add" className="btn btn-primary btn-sm">
            + Create Work Order
          </Link>
        )}
      </div>

      {workOrders.length === 0 ? (
        <p className="mt-3">No work orders found.</p>
      ) : (
        <table className="table table-bordered p-2 mb-2 mt-3">
          <thead>
            <tr>
              <th>Title</th>
              <th>Equipment</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Due Date</th>
              {(user?.role === "Supervisor" || user?.role === "Manager") && (
                <th>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {workOrders.map((w) => (
              <tr key={w._id}>
                <td>
                  <strong>{w.title}</strong>
                  {w.description && (
                    <small className="d-block text-muted">
                      {w.description.length > 50
                        ? `${w.description.substring(0, 50)}...`
                        : w.description}
                    </small>
                  )}
                </td>
                <td>
                  {w.equipment ? (
                    <div>
                      <strong>{w.equipment.name}</strong>
                      <small className="d-block text-muted">
                        {w.equipment.type}
                      </small>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <span
                    className={`badge ${
                      w.priority === "High"
                        ? "bg-danger"
                        : w.priority === "Medium"
                        ? "bg-warning"
                        : "bg-info"
                    }`}
                  >
                    {w.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      w.status === "Open"
                        ? "bg-secondary"
                        : w.status === "In Progress"
                        ? "bg-primary"
                        : w.status === "Completed"
                        ? "bg-success"
                        : w.status === "Closed"
                        ? "bg-dark"
                        : "bg-light text-dark"
                    }`}
                  >
                    {w.status}
                  </span>
                </td>
                <td>
                  {w.assignedTo ? (
                    <div>
                      <strong>{w.assignedTo.name}</strong>
                      <small className="d-block text-muted">
                        {w.assignedTo.email}
                      </small>
                    </div>
                  ) : (
                    <span className="text-muted">Unassigned</span>
                  )}
                </td>
                <td>{new Date(w.dueDate).toLocaleDateString()}</td>
                {(user?.role === "Supervisor" || user?.role === "Manager") && (
                  <td>
                    <div className="d-flex flex-column gap-1">
                      {w.status === "Open" && !w.assignedTo && (
                        <AssignTechnician
                          workOrderId={w._id}
                          currentAssignedTo={w.assignedTo?._id}
                        />
                      )}

                      {w.status === "Completed" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleCloseWorkOrder(w._id)}
                          title="Close work order and set equipment to Operational"
                        >
                          Close (Debug: {user?.role})
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
