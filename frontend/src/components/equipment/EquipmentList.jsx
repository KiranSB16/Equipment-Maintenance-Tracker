import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEquipments,
  setEditingEquipment,
  clearEditingEquipment,
  updateEquipment,
} from "../../slices/equipmentSlice";

export default function EquipmentList() {
  const dispatch = useDispatch();
  const { list, loading, error, editingEquipment } = useSelector((state) => state.equipments);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "Operational",
    lastMaintenanceDate: "",
    nextMaintenanceDate: "",
  });

  useEffect(() => {
    dispatch(fetchEquipments());
  }, [dispatch]);

  useEffect(() => {
    if (editingEquipment) {
      setFormData({
        name: editingEquipment.name || "",
        type: editingEquipment.type || "",
        status: editingEquipment.status || "Operational",
        lastMaintenanceDate: editingEquipment.lastMaintenanceDate
          ? editingEquipment.lastMaintenanceDate.slice(0, 10)
          : "",
        nextMaintenanceDate: editingEquipment.nextMaintenanceDate
          ? editingEquipment.nextMaintenanceDate.slice(0, 10)
          : "",
      });
    } else {
      setFormData({
        name: "",
        type: "",
        status: "Operational",
        lastMaintenanceDate: "",
        nextMaintenanceDate: "",
      });
    }
  }, [editingEquipment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEquipment) {
      dispatch(updateEquipment({ id: editingEquipment._id, updates: formData }));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Operational":
        return "badge bg-success";
      case "Under maintenance":
        return "badge bg-warning";
      case "Out of service":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  if (loading) return <p className="text-center mt-4">Loading equipments...</p>;
  if (error) return <p className="text-danger mt-4">Error: {error}</p>;

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Equipments</h2>
        <span className="badge bg-info">{list.length} Equipment(s)</span>
      </div>

      {editingEquipment && (
        <div className="card p-3 mb-4">
          <h4>Edit Equipment</h4>
          <form onSubmit={handleSubmit}>
            <div className="row mb-2">
              <div className="col">
                <label>Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <label>Type</label>
                <input
                  className="form-control"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <label>Status</label>
                <select
                  className="form-control"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>Operational</option>
                  <option>Under maintenance</option>
                  <option>Out of service</option>
                </select>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col">
                <label>Last Maintenance</label>
                <input
                  type="date"
                  className="form-control"
                  name="lastMaintenanceDate"
                  value={formData.lastMaintenanceDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label>Next Maintenance</label>
                <input
                  type="date"
                  className="form-control"
                  name="nextMaintenanceDate"
                  value={formData.nextMaintenanceDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary me-2">
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(clearEditingEquipment())}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {list.length === 0 ? (
        <div className="alert alert-info">No equipment found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered p-2 mb-2">
            <thead className="table-light">
              <tr>
                <th>Equipment Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Maintenance</th>
                <th>Next Maintenance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((eq) => (
                <tr key={eq._id}>
                  <td>
                    <strong>{eq.name}</strong>
                  </td>
                  <td>{eq.type}</td>
                  <td>
                    <span className={getStatusBadgeClass(eq.status)}>{eq.status}</span>
                  </td>
                  <td>
                    {eq.lastMaintenanceDate
                      ? new Date(eq.lastMaintenanceDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {eq.nextMaintenanceDate
                      ? new Date(eq.nextMaintenanceDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => dispatch(setEditingEquipment(eq))}
                    >
                      {editingEquipment?._id === eq._id ? "Close" : "Edit"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
