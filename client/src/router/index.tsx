

import {createBrowserRouter} from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AuthLayout from "../components/AuthLayout";
import Profile from "../pages/Profile/Profile";
import TermsOfService from "../pages/Terms/Terms";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";


const router = createBrowserRouter([


{
path: "/",
element: ""
},
    {
    element: <AuthLayout/>,
    children: [
    
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
    {
      path:"/profile",
      element: <Profile />
    },
    {
      path: "/terms",
      element: <TermsOfService />
    },
    {
      path:"/forgotPassword",
      element: <ForgotPassword />
    },

    {
    path:"/reset-password/:token",
    element:<ResetPassword />
    }


])

export default router