import { Route, Routes } from "react-router-dom";
import { paths } from "../hooks/path";
import { lazy, Suspense } from "react";
import { LoginHome } from "../pages";
import Loading from "../components/LazyLoading";
const Login = lazy(() => import("../pages/auth/Login"));

const AuthRoute = () => {
  return (
    <Routes>
      <Route path={paths.home} element={<LoginHome />} />
      <Route
        path={paths.login}
        element={
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default AuthRoute;
