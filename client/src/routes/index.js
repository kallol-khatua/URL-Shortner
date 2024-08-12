import { lazy } from "react";

import { createBrowserRouter } from "react-router-dom";
const Redirect = lazy(() => import("../components/Url/Redirect"))
import AuthRoutes from "./AuthRoutes";
import UrlRoutes from "./UrlRoutes";

const router = createBrowserRouter([
    AuthRoutes,
    UrlRoutes,
    {
        path: ":shortUrl",
        element: Redirect,
    },
]);

export default router;
