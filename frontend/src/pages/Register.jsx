import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password too short")
      .required("Password is required"),
    role: Yup.string()
      .oneOf(["Technician", "Supervisor", "Manager"])
      .required(),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setStatus(null);

      console.log("Submitting registration...");
      const resultAction = await dispatch(registerUser(values));

      if (registerUser.fulfilled.match(resultAction)) {
        console.log("Registration successful!");
        setStatus({
          type: "success",
          message:
            "Registration successful! Please login with your credentials.",
        });

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        const errorMessage = resultAction.payload;
        setStatus({
          type: "error",
          message: errorMessage || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-3">Create an Account</h3>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          role: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
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
              <Field as="select" name="role" className="form-control">
                <option value="" disabled>
                  -- Select Role --
                </option>
                <option value="Technician">Technician</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Manager">Manager</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-danger small"
              />
            </div>

            {status && (
              <div
                className={`mb-3 alert ${
                  status.type === "success" ? "alert-success" : "alert-danger"
                }`}
              >
                {status.message}
              </div>
            )}

            {error && !status && (
              <div className="alert alert-danger mb-3">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading || isSubmitting}
            >
              {loading ? "Creating Account..." : "Register"}
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
