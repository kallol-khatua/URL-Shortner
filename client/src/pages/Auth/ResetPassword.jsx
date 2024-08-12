/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  TextField,
  Link,
  Grid,
  OutlinedInput,
  Box,
  InputLabel,
  Typography,
  IconButton,
  Container,
  CssBaseline,
  Button,
  FormControl,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ReCAPTCHA from "react-google-recaptcha";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recaptcha = useRef();

  const [formValues, setFormValues] = useState({
    token: "",
    captchaValue: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // handle show password and show confitm password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  useEffect(() => {
    let token = searchParams.get("token");
    if (token) {
      setFormValues({ ...formValues, token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

      let url = `${import.meta.env.VITE_BACKEND_API_URL}/api/auth/new-password`;
      try {
        let response = await axios.post(url, formValues);
        if (response?.status === 200) {
          toast.success(response.data.message);
          toast.success("Login to your account!");
          navigate("/auth/login", { replace: true });
        }
      } catch (err) {
        console.error(err);
        if (err?.response?.data?.message) {
          toast.error(err?.response?.data.message.replace(/"/g, ""));
        }
        if (err?.response?.status === 401) {
          toast.error("Verify your email first!");
          navigate("/auth/verify-email");
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
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center", mb: 1 }}>
          Reset your account password
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
          Click on the link or enter the token that has been sent to your
          registered email address!
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                autoFocus
                id="token"
                label="Enter token"
                name="token"
                value={formValues.token}
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
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default <ResetPassword />;
