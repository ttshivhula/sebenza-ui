import { useState } from "react";
import { Eye } from "react-feather";
import { Link, Redirect } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "components/Input";
import Button from "components/Button";
import { Client, DEFAULT_SERVER_ERROR_MESSAGE, ApiError } from "api";
import { sessionState } from "store/session";
import { useSetRecoilState } from "recoil";

const signupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  first_name: Yup.string().required("Required").min(3),
  last_name: Yup.string().required("Required").min(3),
  password: Yup.string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum."),
});

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setSessionState = useSetRecoilState(sessionState);
  const [successfulSignUp, setSuccessfulSignUp] = useState(false);

  const handleSignup = async (values) => {
    try {
      const { message } = await Client.signUpUser(values);

      setSessionState((old) => {
        return {
          toast: {
            heading: "Success!",
            message,
          },
        };
      });
      setSuccessfulSignUp(true);
    } catch (err) {
      let message = DEFAULT_SERVER_ERROR_MESSAGE;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setSessionState((old) => {
        return {
          toast: {
            heading: "Error!",
            message,
          },
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (successfulSignUp) {
    return (
      <Redirect
        to={{
          pathname: "/login",
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              login to your account
            </Link>
          </p>
        </div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <Field
                    as={Input}
                    name="first_name"
                    placeholder="John"
                    id="first_name"
                    label="First Name"
                    labelFor="first_name"
                    type="text"
                    errors={touched.first_name && errors.first_name}
                  />
                </div>
                <div>
                  <Field
                    as={Input}
                    name="last_name"
                    placeholder="John"
                    id="last_name"
                    label="Last Name"
                    labelFor="last_name"
                    type="text"
                    errors={touched.last_name && errors.last_name}
                  />
                </div>
                <div>
                  <Field
                    as={Input}
                    name="email"
                    placeholder="your@email.com"
                    id="email"
                    label="Email"
                    labelFor="email"
                    type="email"
                    autoComplete="email"
                    errors={touched.email && errors.email}
                  />
                </div>
                <div>
                  <Field
                    as={Input}
                    name="password"
                    label="Password"
                    id="password"
                    labelFor="password"
                    placeholder="Your secret password"
                    type={showPassword ? "text" : "password"}
                    icon={
                      <button
                        type="button"
                        className="cursor-pointer z-20"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Eye size={24} />
                      </button>
                    }
                    errors={touched.password && errors.password}
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  text="Register"
                  className="bg-primary text-white text-md h-12 rounded text-dark-grey font-bold w-full hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-50 focus:ring-offset-2 bg-indigo-600"
                  disabled={isLoading}
                  loading={isLoading}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
