import axiosInstance from "../../axiosInstance";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import VisitLog from "../../components/Url/VisitLog";
import { Box } from "@mui/material";

function Details() {
  const navigate = useNavigate();
  const [isLoggedIN, setIsLoggedIn] = useState(true);
  const response = useLoaderData();
  const [data, setData] = useState();

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
      if (response.status === 200) {
        setData(response.data);
      }
    }
  }, [response]);

  return (
    <Box sx={{backgroundColor: "#111827", minHeight: "100vh", px: 2}}>
      <VisitLog views={data?.viewDetails} />
    </Box>
  );
}

export async function loader({ params }) {
  try {
    const { shortUrl } = params;
    const response = await axiosInstance.get(`/api/url/${shortUrl}`);
    return response;
  } catch (err) {
    return err.response || err;
  }
}

export default <Details />;
