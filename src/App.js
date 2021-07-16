import React, { Fragment, useEffect, useState } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import {
  Route,
  Redirect,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { userState } from "store/user";
import { sessionState } from "store/session";
import Home from "pages/Home/Home";
import Login from "pages/Login/Login";
import Signup from "pages/Signup/Signup";
import { Client } from "api";
import Toast from "components/Toast";

const App = () => {
  const userStore = useRecoilValue(userState);
  const sessionStore = useRecoilValue(sessionState);
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);

  useEffect(() => {
    if (userStore.token) Client.setToken(userStore.token);
    setTimeout(() => {
      setInitialLoadingComplete(true);
    }, 50);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const AuthenticatedRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          userStore.user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  };

  return (
    <Router>
      {!initialLoadingComplete ? (
        <div>Loading...</div>
      ) : (
        <Fragment>
          <Switch>
            <AuthenticatedRoute path="/home">
              <Home />
            </AuthenticatedRoute>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <AuthenticatedRoute path="/">
              <Home />
            </AuthenticatedRoute>
            <Redirect from="*" to="/login" />
          </Switch>
          {sessionStore.toast && (
            <Toast
              heading={sessionStore.toast.heading}
              message={sessionStore.toast.message}
            />
          )}
        </Fragment>
      )}
    </Router>
  );
};

const WrappedApp = () => {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
};

export default WrappedApp;
