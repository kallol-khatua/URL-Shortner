/* eslint-disable react/prop-types */
import { Grid, Box, Typography } from "@mui/material";

function VisitLog({ views }) {
  const getDate = (date) => {
    const utcDate = new Date(date);

    // const istOffset = 5.5 * 60 * 60 * 1000;
    // const istDate = new Date(utcDate.getTime() + istOffset);
    const istDate = new Date(utcDate.getTime());

    const formattedDate = istDate
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");

    return formattedDate;
  };
  return (
    <Grid container spacing={2}>
      {views &&
        views.length > 0 &&
        views.reverse().map((view) => (
          <Grid key={view._id} item xs={12} sm={6} md={4}>
            <Box
              sx={{ backgroundColor: "#1F2937", p: 2, borderRadius: "1rem" }}
            >
              <Typography sx={{ color: "white", mb: 1 }} variant="h5">
                Visit Log
              </Typography>
              <Typography sx={{ color: "white" }}>OS: {view.os}</Typography>
              <Typography sx={{ color: "white" }}>IP: {view.ip}</Typography>
              <Typography sx={{ color: "white" }}>
                Country: {view.country}
              </Typography>
              <Typography sx={{ color: "white" }}>
                Region: {view.region}
              </Typography>
              <Typography sx={{ color: "white" }}>City: {view.city}</Typography>
              <Typography sx={{ color: "white" }}>
                Coordinates: {view.coord}
              </Typography>
              <Typography sx={{ color: "white" }}>
                Provider: {view.org}
              </Typography>
              <Typography sx={{ color: "white" }}>
                Postal: {view.postal}
              </Typography>
              <Typography sx={{ color: "white" }}>
                Timezone: {view.timezone}
              </Typography>
              <Typography sx={{ color: "white" }}>
                Visited at: {getDate(view.createdAt)}
              </Typography>
            </Box>
          </Grid>
        ))}
    </Grid>
  );
}

export default VisitLog;
