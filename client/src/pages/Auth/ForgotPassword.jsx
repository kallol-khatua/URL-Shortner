import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function ForgotPassword() {
  const navigate = useNavigate();
  const recaptcha = useRef();
  const [formValues, setFormValues] = useState({
    email: "",
    captchaValue: "",
  });

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

    // getting captcha value and adding to the formvalue
    const captchaValue = recaptcha.current.getValue();
    formValues.captchaValue = captchaValue;

    if (!captchaValue) {
      toast.error("Please verify the reCAPTCHA!");
    } else {
      // console.log(formValues);

      let url = `${
        import.meta.env.VITE_BACKEND_API_URL
      }/api/auth/forgot-password`;
      try {
        let response = await axios.post(url, formValues);
        if (response?.status === 200) {
          toast.success(response.data.message);
          navigate("/auth/new-password", { replace: true });
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
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Forgot your account password?
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
          Don&apos;t worry. Request for password reset email.
        </Typography>
        <Box
          component="form"
          // noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
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
            Send Request
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default <ForgotPassword />;
