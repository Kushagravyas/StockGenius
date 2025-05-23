import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

const Register = ({ switchToLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Validation schema for register
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
  });

  // Form submission handler for register
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(registerUser(values)).unwrap();
      navigate("/profile");
    } catch (err) {
      console.error("Registration failed:", err);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Create an account</h2>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <Field
                as={Input}
                name="name"
                type="text"
                id="name"
                placeholder="John Doe"
                className={`mt-1 w-full ${
                  errors.name && touched.name
                    ? "border-destructive ring-destructive/50"
                    : ""
                }`}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-destructive text-sm mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="registerEmail"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </Label>
              <Field
                as={Input}
                name="email"
                type="email"
                id="registerEmail"
                placeholder="you@example.com"
                className={`mt-1 w-full ${
                  errors.email && touched.email
                    ? "border-destructive ring-destructive/50"
                    : ""
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-destructive text-sm mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="registerPassword"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <Field
                as={Input}
                name="password"
                type="password"
                id="registerPassword"
                className={`mt-1 w-full ${
                  errors.password && touched.password
                    ? "border-destructive ring-destructive/50"
                    : ""
                }`}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-destructive text-sm mt-1"
              />
            </div>

            <Button type="submit" disabled={isSubmitting || loading} className="w-full">
              {isSubmitting || loading ? "Creating account..." : "Sign up"}
            </Button>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-fg">
          Already have an account?{" "}
          <button
            type="button"
            onClick={switchToLogin}
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
