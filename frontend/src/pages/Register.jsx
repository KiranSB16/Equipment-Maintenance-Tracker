// pages/RegisterPage.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  // Validation schema with Yup
  const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password too short")
      .required("Password is required"),
    role: Yup.string().oneOf(["technician", "supervisor", "manager"]).required(),
  });

  return (
    <div className="container mt-5">
      <h3 className="mb-3">Create an Account</h3>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          role: "technician",
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          console.log("Register data:", values);
          // later: call backend API
          navigate("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-2">
              <Field
                name="name"
                type="text"
                className="form-control"
                placeholder="Full Name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger small"
              />
            </div>

            <div className="mb-2">
              <Field
                name="email"
                type="email"
                className="form-control"
                placeholder="Email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger small"
              />
            </div>

            <div className="mb-2">
              <Field
                name="password"
                type="password"
                className="form-control"
                placeholder="Password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger small"
              />
            </div>

            <div className="mb-3">
              <Field as="select" name="role" className="form-select">
                <option value="technician">Technician</option>
                <option value="supervisor">Supervisor</option>
                <option value="manager">Manager</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-danger small"
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={isSubmitting}
            >
              Register
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-3">
        Already have an account?{" "}
        <Link to="/login" className="text-primary">
          Login here
        </Link>
      </p>
    </div>
  );
}
