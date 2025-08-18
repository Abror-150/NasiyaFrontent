import Layout from "./providers/Layout";
import { AuthRoute } from "./routes";
import { useCookies } from "react-cookie";
function App() {
  const [cookies] = useCookies(["token"]);


  
  return cookies.token ? <Layout /> : <AuthRoute />;
}

export default App;
