

import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AuthLayout from "../components/AuthLayout";


const router = createBrowserRouter([
    {
    element: <AuthLayout/>,
    children: [
      {
        path: "/",
        element: <Navigate to="/register" replace />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
    },

])

export default router