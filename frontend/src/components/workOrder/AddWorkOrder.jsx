import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createWorkOrder } from "../../slices/workOrderSlice";
import { fetchEquipments } from "../../slices/equipmentSlice";
import { fetchTechnicians } from "../../slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function WorkOrderForm() {
  const dispatch = useDispatch();
  const { list: equipments } = useSelector((state) => state.equipments);
  const { technicians } = useSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchEquipments());
    dispatch(fetchTechnicians());
  }, [dispatch]);

  const initialValues = {
    title: "",
    equipment: "",
    priority: "Low",
    description: "",
    dueDate: "",
    assignedTo: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    equipment: Yup.string().required("Select equipment"),
    priority: Yup.string().oneOf(["Low", "Medium", "High"]).required(),
    description: Yup.string(),
    dueDate: Yup.date().required("Due date is required"),
    assignedTo: Yup.string(),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const cleanValues = { ...values };
      if (!cleanValues.assignedTo) {
        delete cleanValues.assignedTo;
      }

      const result = await dispatch(createWorkOrder(cleanValues)).unwrap();
      console.log("Work order created successfully:", result);

      alert("Work Order created successfully!");
      resetForm();
      navigate("/supervisor");
    } catch (err) {
      console.error("Work order creation failed:", err);
      const errorMessage =
        err?.message || err?.error || err || "Failed to create work order";
      alert(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Work Order</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="mt-3">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <Field name="title" className="form-control" />
              <ErrorMessage
                name="title"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Equipment</label>
              <Field as="select" name="equipment" className="form-select">
                <option value="">-- Select Equipment --</option>
                {equipments.map((eq) => (
                  <option key={eq._id} value={eq._id}>
                    {eq.name} ({eq.type})
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="equipment"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Priority</label>
              <Field as="select" name="priority" className="form-select">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Field>
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <Field
                as="textarea"
                name="description"
                className="form-control"
                rows="3"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <Field type="date" name="dueDate" className="form-control" />
              <ErrorMessage
                name="dueDate"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Assign Technician (Optional)</label>
              <Field as="select" name="assignedTo" className="form-select">
                <option value="">-- Assign Later --</option>
                {technicians.map((tech) => (
                  <option key={tech._id} value={tech._id}>
                    {tech.name} ({tech.email})
                  </option>
                ))}
              </Field>
              <small className="form-text text-muted">
                {values.assignedTo
                  ? "Work order will be created with 'In Progress' status"
                  : "Work order will be created with 'Open' status"}
              </small>
              <ErrorMessage
                name="assignedTo"
                component="div"
                className="text-danger"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Work Order"}
            </button>

            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate("/supervisor")}
            >
              Cancel
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
