import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  OutlinedInput,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ReCAPTCHA from "react-google-recaptcha";

function Signup() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    captchaValue: "",
  });
  const recaptcha = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // handle show password and show confitm password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  // handle every input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleReCaptchaValidationExpired = () => {
    toast.error("Verification expired! Check the checkbox again!");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // checking password and confirm password matching
    if (formValues.password !== formValues.confirmPassword) {
      toast.error("Confirm password must match with Password!");
      return;
    }

    // getting captcha value and adding to the formvalue
    const captchaValue = recaptcha.current.getValue();
    formValues.captchaValue = captchaValue;

    if (!captchaValue) {
      toast.error("Please verify the reCAPTCHA!");
    } else {
      // console.log(formValues);

      let url = `${import.meta.env.VITE_BACKEND_API_URL}/api/auth/signup`;
      try {
        let response = await axios.post(url, formValues);
        if (response?.status === 201) {
          toast.success(response.data.message);
          toast.success("Verify email address");
          navigate("/auth/verify-email", { replace: true });
        }
      } catch (err) {
        console.error(err);
        if (err?.response?.data?.message) {
          toast.error(err?.response?.data.message.replace(/"/g, ""));
        }
        recaptcha.current.reset();
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Create your account</Typography>
        <Typography variant="subtitle1">
          Welcome! Please fill in the details to get started.
        </Typography>
        <Box
          component="form"
          // noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={formValues.firstName}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formValues.lastName}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
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
              <FormControl required fullWidth variant="outlined">
                <InputLabel htmlFor="confirmPassword">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleInputChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirmPassword visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
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
            Register
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                component={RouterLink}
                to={"/auth/login"}
                variant="body2"
                sx={{ textDecoration: "none" }}
              >
                Already have an account? Login here
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default <Signup />;
