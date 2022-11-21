import { createBrowserRouter } from "react-router-dom";
import Balance from "./pages/Balance/Balance";
import Login from "./pages/Login";
import Signup from "./pages/Signup/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/balance",
    element: <Balance />,
  },
]);

export default router;
