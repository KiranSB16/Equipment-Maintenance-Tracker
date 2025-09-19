import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignWorkOrder } from "../slices/workOrderSlice";
import { fetchTechnicians } from "../slices/userSlice";

export default function AssignTechnician({ workOrderId, currentAssignedTo }) {
  const dispatch = useDispatch();
  const { technicians } = useSelector((state) => state.users);
  const [selectedTech, setSelectedTech] = useState(currentAssignedTo || "");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    dispatch(fetchTechnicians());
  }, [dispatch]);

  const handleAssign = async () => {
    if (!selectedTech) {
      alert("select a technician");
      return;
    }

    setIsAssigning(true);
    try {
      await dispatch(
        assignWorkOrder({
          id: workOrderId,
          updates: { assignedTo: selectedTech },
        })
      ).unwrap();
      alert("Technician assigned successfully!");
      setSelectedTech("");
    } catch (err) {
      alert(`Failed to assign technician: ${err.message || err}`);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="border rounded p-2 bg-light">
      <small className="text-muted d-block mb-1">Assign Technician:</small>
      <div className="d-flex gap-1">
        <select
          className="form-select form-select-sm"
          value={selectedTech}
          onChange={(e) => setSelectedTech(e.target.value)}
          disabled={isAssigning}
        >
          <option value="">-- Select Technician --</option>
          {technicians.map((tech) => (
            <option key={tech._id} value={tech._id}>
              {tech.name}
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleAssign}
          disabled={isAssigning || !selectedTech}
        >
          {isAssigning ? "..." : "Assign"}
        </button>
      </div>
    </div>
  );
}
