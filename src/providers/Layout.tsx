import Navbar from "../modules/Navbar";
import { DashboardRoute } from "../routes";

const Layout = () => {
  return (
    <div>
      <DashboardRoute />
      <Navbar />
    </div>
  );
};

export default Layout;
