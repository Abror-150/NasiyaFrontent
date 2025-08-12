import { Route, Routes } from "react-router-dom";
import { paths } from "../hooks/path";
import { Suspense } from "react";
import { Login, LoginHome } from "../pages";
import Loading from "../components/LazyLoading";

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
