// pages/LoginPage.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="container mt-5">
      <h3>Equipment Maintenance Tracker</h3>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log("Login data:", values);
          // later: call backend API
          navigate("/dashboard");
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mt-3">
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

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              Login
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-3">
        Don’t have an account?{" "}
        <Link to="/register" className="text-primary">
          Register here
        </Link>
      </p>
    </div>
  );
}
