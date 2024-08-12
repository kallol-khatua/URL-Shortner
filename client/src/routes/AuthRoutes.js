import Login from "../pages/Auth/Login"
import Signup from "../pages/Auth/Signup"
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ResetPassword from "../pages/Auth/ResetPassword"

const AuthRoutes = {
    path: "auth",
    children: [
        {
            path: "signup",
            element: Signup
        },
        {
            path: "verify-email",
            element: VerifyEmail,
        },
        {
            path: "login",
            element: Login
        },
        {
            path: "forgot-password",
            element: ForgotPassword
        },
        {
            path: "new-password",
            element: ResetPassword
        }
    ]
}

export default AuthRoutes;