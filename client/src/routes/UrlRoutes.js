import { lazy } from "react";

const Home = lazy(() => import("../pages/Url/Home"));
import NavBar from "../components/NavBar";
const Details = lazy(() => import("../pages/Url/Details"))

import { loader as NavBarLoader } from "../components/NavBar";
import { loader as UrlDetailsLoader } from "../pages/Url/Details"


const UrlRoutes = {
    path: "",
    element: NavBar,
    loader: NavBarLoader,
    children: [
        {
            path: "",
            element: Home,
        },
        {
            path: "url",
            element: Home,
        },
        {
            path: "url/:shortUrl",
            element: Details,
            loader: UrlDetailsLoader
        }
    ]
}

export default UrlRoutes;