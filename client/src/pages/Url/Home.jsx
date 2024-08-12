import { useEffect, useState } from "react";
import ShortUrlForm from "../../components/Url/ShortUrlForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import UrlCard from "../../components/Url/UrlCard";
import { Box, Grid } from "@mui/material";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIN, setIsLoggedIn] = useState(true);

  const [isNewurl, setIsNewUrl] = useState(false);
  const [shortUrls, SetShortUrls] = useState([]);

  useEffect(() => {
    if (!isLoggedIN) {
      navigate("/auth/login");
    }
  }, [isLoggedIN, navigate]);

  const getShortUrls = async () => {
    try {
      const response = await axiosInstance.get("/api/url/home");
      if (response?.status === 200) {
        SetShortUrls(response.data.urls);
      }
    } catch (err) {
      if (err?.response?.status) {
        if (err.response.status === 401 || err.response.status === 403) {
          toast.error(err.response.data.message);
          toast.error("Please login first!");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      }
    }
  };

  useEffect(() => {
    if (isNewurl) {
      getShortUrls();
      setIsNewUrl(false);
    }
  }, [isNewurl]);

  useEffect(() => {
    getShortUrls();
  }, []);

  const handleIsNewUrl = () => {
    setIsNewUrl((prev) => !prev);
  };

  return (
    <Box sx={{ backgroundColor: "#111827", minHeight: "100vh" }}>
      <ShortUrlForm handleIsNewUrl={handleIsNewUrl} />

      {shortUrls && shortUrls.length > 0 && (
        <Grid
          container
          // rowSpacing={2}
          // columnSpacing={2.75}
          spacing={2}
          sx={{
            backgroundColor: "#1F2937",
            py: 1,
            borderRadius: "1rem",
            maxWidth: "70rem",
            mx: "auto",
          }}
        >
          {shortUrls.map((urlInfo) => (
            <Grid key={urlInfo._id} item xs={12} sm={6} md={4}>
              <UrlCard urlInfo={urlInfo} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default <Home />;
