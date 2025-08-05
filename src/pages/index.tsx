import LoginHome from "./auth/Home";
import Home from "./dashboard/Home";
import { lazy } from "react";

const Login = lazy(
  () =>
    new Promise((resolve: any) => {
      return setTimeout(() => resolve(import("./auth/Login")), 1500);
    })
);

export { Login, Home, LoginHome };
