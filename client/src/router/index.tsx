import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AuthLayout from "../components/AuthLayout";
import Profile from "../pages/Profile/Profile";
import TermsOfService from "../pages/Terms/Terms";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import PrivacyPolicy from "../pages/Privacy/Privacy";
import TripPlanner from "../pages/PagesPlanner/TripPlanner";
import CreateTrip from "../pages/CreateTrip/CreateTrip";
import OtpVerification from "../pages/OtpVerification/OtpVerification";
import TripDetails from "../pages/TripDetails/TripDetails";
import MyTrips from "../pages/MyTrips/MyTrips";
import Destinations from "../pages/Destinations/Destinations";
import HowItWorks from "../pages/HowItWorks/HowItWorks";
import EditProfile from "../pages/EditProfile/EditProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: "",
  },
  {
    element: <AuthLayout />,
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
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/terms",
    element: <TermsOfService />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/trip-planner",
    element: <TripPlanner />,
  },
  {
    path: "/create-trip",
    element: <CreateTrip />,
  },
  {
    path: "/otp-verification",
    element: <OtpVerification />,
  },

  {
    path: "/trip-palnner",
    element: <TripPlanner />
  },
  {
    path: "/trip/:id",
    element: <TripDetails />
  },
  {
    path:"/my-trips",
    element: <MyTrips/>
  },
  {
    path:"/destinations",
    element: <Destinations />
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />
  },
 {
   path: "/edit-profile",
  element: <EditProfile />
 }
]);

export default router;