/* eslint-disable react/prop-types */
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import validator from "validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";

function ShortUrlForm({ handleIsNewUrl }) {
  const navigate = useNavigate();
  const [isLoggedIN, setIsLoggedIn] = useState(true);
  const [formData, setFormData] = useState({
    url: "",
  });
  const [newShortUrl, setNewShortUrl] = useState();

  useEffect(() => {
    if (!isLoggedIN) {
      navigate("/auth/login");
    }
  }, [isLoggedIN, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenerateShortURL = async () => {
    // check for valid url
    const isValidUrl = validator.isURL(formData.url);

    if (!isValidUrl) {
      toast.error("Please enter a valid URL!");
      setFormData({ url: "" });
      return;
    }

    try {
      const response = await axiosInstance.post("/api/url/create", formData);
      if (response?.status === 201) {
        toast.success(response.data.message);
        setNewShortUrl(response.data.savedUrl);
        setFormData({ url: "" });
        handleIsNewUrl();
      }
    } catch (err) {
      if (err?.response?.status) {
        if (err.response.status === 401 || err.response.status === 403) {
          toast.error(err.response.data.message);
          toast.error("Please login first!");
          localStorage.removeItem("token");
          setFormData({ url: "" });
          setIsLoggedIn(false);
        }
      }
    }
  };
  return (
    <Box sx={{ backgroundColor: "#111827", pt: 5, pb: 5 }}>
      <Typography variant="h4" sx={{ color: "white", textAlign: "center", mb: 5 }}>
        Welcome to URL Shortner
      </Typography>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "#1F2937",
            p: 2,
            width: "60rem",
            borderRadius: "0.5rem",
          }}
        >
          <Box
            sx={{ backgroundColor: "#374151", mb: 2, borderRadius: "0.5rem" }}
          >
            <TextField
              required
              fullWidth
              id="url"
              placeholder="Enter URL here"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              sx={{ input: { color: "white", p: 1.5, borderRadius: "0.5rem" } }}
            />
          </Box>
          <Button
            sx={{
              backgroundColor: "#374151",
              color: "white",
              minWidth: "100%",
              textTransform: "none",
              fontSize: "1rem",
              p: 1,
              borderRadius: "0.5rem",
            }}
            onClick={handleGenerateShortURL}
          >
            Generate Short URL
          </Button>
        </Box>
      </Box>

      {newShortUrl && (
        <Box
          sx={{
            backgroundColor: "#1F2937",
            p: 2,
            mt: 3,
            maxWidth: "25rem",
            borderRadius: "0.5rem",
            mx: "auto",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            <a
              href={newShortUrl.originalUrl}
              target="_blank"
              style={{
                color: "#e8e3e3",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {newShortUrl.shortUrl}
            </a>
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ShortUrlForm;
