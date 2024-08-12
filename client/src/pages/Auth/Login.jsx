import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    captchaValue: "",
  });
  const recaptcha = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // getting captcha value and adding to the formvalue
    const captchaValue = recaptcha.current.getValue();
    formValues.captchaValue = captchaValue;

    if (!captchaValue) {
      toast.error("Please verify the reCAPTCHA!");
    } else {
      // console.log(formValues);

      let url = `${import.meta.env.VITE_BACKEND_API_URL}/api/auth/login`;
      try {
        let response = await axios.post(url, formValues);
        if (response?.status === 200) {
          toast.success(response.data.message);
          localStorage.setItem("token", response.data.token);
          navigate(-1);
        }
      } catch (err) {
        console.error(err);
        if (err?.response?.data?.message) {
          toast.error(err?.response?.data.message.replace(/"/g, ""));
        }

        if (err?.response?.status === 401) {
          navigate("/auth/verify-email");
        }
        recaptcha.current.reset();
      }
    }
  };

  const handleReCaptchaValidationExpired = () => {
    toast.error("Verification expired! Check the checkbox again!");
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Login to URL Shortner
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
          Welcome back! Please login to continue.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                autoFocus
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formValues.email}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl required fullWidth variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <ReCAPTCHA
                ref={recaptcha}
                onExpired={handleReCaptchaValidationExpired}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                component={RouterLink}
                variant="body2"
                to={"/auth/forgot-password"}
                sx={{ textDecoration: "none" }}
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                component={RouterLink}
                variant="body2"
                to={"/auth/signup"}
                sx={{ textDecoration: "none" }}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default <Login />;
