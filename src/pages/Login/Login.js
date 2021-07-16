import { useState } from "react";
import { Eye } from "react-feather";
import { Link, Redirect } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "components/Input";
import Button from "components/Button";
import { Client, DEFAULT_SERVER_ERROR_MESSAGE, ApiError } from "api";
import { userState } from "store/user";
import { sessionState } from "store/session";
import { useSetRecoilState } from "recoil";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum."),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setUserState = useSetRecoilState(userState);
  const setSessionState = useSetRecoilState(sessionState);
  const [successfulSignIn, setSuccessfulSignIn] = useState(false);

  const handleLogin = async (values) => {
    try {
      const { user, token } = await Client.signInUser({
        email: values.email,
        password: values.password,
      });

      setUserState((oldUser) => {
        return {
          user,
          token,
        };
      });
      setSessionState((old) => {
        return {
          toast: {
            heading: "Success!",
            message: "Welcome back!",
          },
        };
      });
      setSuccessfulSignIn(true);
      Client.setToken(token);
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

  if (successfulSignIn) {
    return (
      <Redirect
        to={{
          pathname: "/home",
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create your account
            </Link>
          </p>
        </div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm -space-y-px">
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
                  text="Sigin in"
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
