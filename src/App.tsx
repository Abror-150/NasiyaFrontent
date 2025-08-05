import { AuthRoute, DashboardRoute } from "./routes";
import { useCookies } from "react-cookie";
function App() {
  const [cookies] = useCookies(["token"]);
  return cookies.token ? <DashboardRoute /> : <AuthRoute />;
}

export default App;
