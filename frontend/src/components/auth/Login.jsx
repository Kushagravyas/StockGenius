import { loginUser } from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

const Login = ({ switchToRegister }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.log("Login Failed: ", error);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Welcome back</h2>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <Label htmlFor="loginEmail" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Field
                as={Input}
                name="email"
                type="email"
                id="loginEmail"
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
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="loginPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Field
                as={Input}
                name="password"
                type="password"
                id="loginPassword"
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
              {isSubmitting || loading ? "Logging in..." : "Sign in"}
            </Button>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-fg">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={switchToRegister}
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
