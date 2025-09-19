import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addEquipment } from "../../slices/equipmentSlice";
import { useNavigate } from "react-router-dom";

export default function AddEquipment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.equipments);

  const initialValues = {
    name: "",
    type: "",
    status: "Operational",
    lastMaintenanceDate: "",
    nextMaintenanceDate: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    type: Yup.string().required("Type is required"),
    status: Yup.string()
      .oneOf(["Operational", "Under maintenance", "Out of service"])
      .required("Status is required"),
    lastMaintenanceDate: Yup.date().required("Last maintenance date required"),
    nextMaintenanceDate: Yup.date()
      .required("Next maintenance date required")
      .when("lastMaintenanceDate", (last, schema) => {
        return schema.test({
          test: (next) => !last || new Date(next) > new Date(last),
          message: "Next maintenance date must be after last maintenance date",
        });
      }),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const result = await dispatch(addEquipment(values));
    if (addEquipment.fulfilled.match(result)) {
      resetForm();
      navigate(-1);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Equipment</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="mt-3">
          <div className="mb-3">
            <label>Name</label>
            <Field name="name" className="form-control" />
            <ErrorMessage name="name" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label>Type</label>
            <Field name="type" className="form-control" />
            <ErrorMessage name="type" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label>Status</label>
            <Field as="select" name="status" className="form-control">
              <option value="Operational">Operational</option>
              <option value="Under maintenance">Under maintenance</option>
              <option value="Out of service">Out of service</option>
            </Field>
            <ErrorMessage
              name="status"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="mb-3">
            <label>Last Maintenance Date</label>
            <Field
              name="lastMaintenanceDate"
              type="date"
              className="form-control"
            />
            <ErrorMessage
              name="lastMaintenanceDate"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="mb-3">
            <label>Next Maintenance Date</label>
            <Field
              name="nextMaintenanceDate"
              type="date"
              className="form-control"
            />
            <ErrorMessage
              name="nextMaintenanceDate"
              component="div"
              className="text-danger"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>

          {error && <div className="text-danger mt-2">{error}</div>}
        </Form>
      </Formik>
    </div>
  );
}
