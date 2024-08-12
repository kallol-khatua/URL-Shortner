/* eslint-disable react/prop-types */
import { Box, Button, Typography, Stack } from "@mui/material";
import { FaClipboard, FaInfoCircle, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UrlCard({ urlInfo }) {
  const handleCopyLink = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl).then(
      () => {
        toast.success("Link Copied!");
      },
      () => {
        toast.error("Failed to copy Link!");
      }
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#111827",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        borderRadius: "0.5rem",
        height: "10rem",
        alignItems: "center",
      }}
    >
      <Typography sx={{ color: "white", textAlign: "center" }}>
        <a
          href={urlInfo.originalUrl}
          target="_blank"
          style={{
            color: "#e8e3e3",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {urlInfo.shortUrl}
        </a>
      </Typography>
      <Typography sx={{ color: "white", textAlign: "center" }}>
        <FaEye /> Views: {0}
      </Typography>
      {/* <Box> */}
      <Stack direction="row" spacing={2} sx={{ textAlign: "center" }}>
        <Button
          sx={{ color: "white" }}
          variant="outlined"
          startIcon={<FaClipboard />}
          onClick={() => handleCopyLink(urlInfo.shortUrl)}
        >
          Copy
        </Button>
        <Link to={`/url/${urlInfo.shortId}`}>
          <Button
            sx={{ color: "white" }}
            variant="contained"
            startIcon={<FaInfoCircle />}
          >
            Details
          </Button>
        </Link>
      </Stack>
      {/* </Box> */}
    </Box>
  );
}

export default UrlCard;
