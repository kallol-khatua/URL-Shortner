import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ToastContainer position="bottom-right" />
    <App />
  </ThemeProvider>
);
