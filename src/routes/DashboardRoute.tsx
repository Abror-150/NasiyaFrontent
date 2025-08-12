import { Routes, Route } from "react-router-dom";
import type { DashboarRouteType } from "../types/DashboardRouteType";
import { DashboardLists } from "../hooks/path";
const DashboardRoute = () => {
  return (
    <Routes>
      {DashboardLists.map((item: DashboarRouteType) => (
        <Route key={item.id} path={item.path} element={item.element} />
      ))}
    </Routes>
  );
};

export default DashboardRoute;
