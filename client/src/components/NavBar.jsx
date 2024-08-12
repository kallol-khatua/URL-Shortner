import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import axiosInstance from "../axiosInstance";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

function NavBar() {
  const navigate = useNavigate();
  const [isLoggedIN, setIsLoggedIn] = useState(true);
  const response = useLoaderData();

  useEffect(() => {
    if (!isLoggedIN) {
      navigate("/auth/login");
    }
  }, [isLoggedIN, navigate]);

  useEffect(() => {
    if (response?.status) {
      if (response.status === 401 || response.status === 403) {
        toast.error(response.data.message);
        toast.error("Please login first!");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  }, [response]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.error("Logout successfully!");
    setIsLoggedIn(false);
  };

  return (
    <>
      {/* TODO: make a suspence fallback */}
      <Suspense fallback={<h1>loading</h1>}>
        <nav>
          <Box
            sx={{
              backgroundColor: "#1F2937",
              p: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                maxWidth: "70rem",
                mx: "auto",
              }}
            >
              <Box sx={{ color: "white", cursor: "pointer" }}>URL Shortner</Box>
              <Box sx={{ color: "white", cursor: "pointer" }}>
                {isLoggedIN && <LogoutIcon onClick={handleLogout} />}
              </Box>
            </Box>
          </Box>
        </nav>
        <Outlet />
      </Suspense>
    </>
  );
}

export async function loader() {
  try {
    const response = await axiosInstance.get("/api/url/");
    return response;
  } catch (err) {
    return err.response || err;
  }
}

export default <NavBar />;
