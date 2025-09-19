import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    if (user) {
      if (user.role === "Technician") navigate("/technician");
      if (user.role === "Supervisor") navigate("/supervisor");
      if (user.role === "Manager") navigate("/manager");
      console.log("Navigating user:", user);
    }
  }, [user, navigate]);

  return (
    <div className="container mt-5">
      <h3>Login</h3>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          dispatch(loginUser(values));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
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

            {error && <div className="text-danger mb-2">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading || isSubmitting}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
