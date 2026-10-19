

import {createBrowserRouter} from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AuthLayout from "../components/AuthLayout";
import Profile from "../pages/Profile/Profile";
import TermsOfService from "../pages/Terms/Terms";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import PrivacyPolicy from "../pages/Privacy/Privacy";
import CreateTrip from "../pages/CreateTrip/CreateTrip";


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
    },
    {
      path: "/privacy-policy",
      element: <PrivacyPolicy />
    },
    {
      path: "/create-trip",
      element: <CreateTrip/>
    }
    


])

export default router