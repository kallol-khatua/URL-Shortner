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
  Box,
  Modal,
  Typography,
  Container,
  CssBaseline,
  Button,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";

// function RequestAnotherVerificationEmail({ isOpen, onClose }) {
//   if (!isOpen) return null;
//   return <div>Another verification email</div>;
// }

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recaptcha = useRef();
  const requestAnotherVerificationEmailRecaptcha = useRef();

  const [formValues, setFormValues] = useState({
    token: "",
    captchaValue: "",
  });
  const [anotherVerificationEmail, setAnotherVerificationEmail] =
    useState(false);

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

    // getting captcha value and adding to the formvalue
    const captchaValue = recaptcha.current.getValue();
    formValues.captchaValue = captchaValue;

    if (!captchaValue) {
      toast.error("Please verify the reCAPTCHA!");
    } else {
      // console.log(formValues);

      let url = `${import.meta.env.VITE_BACKEND_API_URL}/api/auth/verify-email`;
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
        recaptcha.current.reset();
      }
    }
  };

  const onCloseRequestAnotherVerificationEmail = () => {
    setAnotherVerificationEmail(false);
  };

  const [requestAnotherEmailData, setRequestAnotherEmailData] = useState({
    email: "",
    captchaValue: "",
  });

  const handleAnotherEmailDataChange = (e) => {
    const { name, value } = e.target;
    setRequestAnotherEmailData({
      ...requestAnotherEmailData,
      [name]: value,
    });
  };

  const handleRequestAnotherVerficationEmail = async (event) => {
    event.preventDefault();

    // getting captcha value and adding to the formvalue
    const captchaValue =
      requestAnotherVerificationEmailRecaptcha.current.getValue();
    requestAnotherEmailData.captchaValue = captchaValue;

    if (!captchaValue) {
      toast.error("Please verify the reCAPTCHA!");
    } else {
      let url = `${
        import.meta.env.VITE_BACKEND_API_URL
      }/api/auth/new-verification-email`;
      try {
        let response = await axios.get(url, {
          params: {
            requestAnotherEmailData,
          },
        });
        if (response?.status === 200) {
          toast.success(response.data.message);
          setAnotherVerificationEmail(false);
          setRequestAnotherEmailData({
            email: "",
            captchaValue: "",
          });
        }
      } catch (err) {
        console.error(err);
        if (err?.response?.data?.message) {
          toast.error(err?.response?.data.message.replace(/"/g, ""));
        }
        requestAnotherVerificationEmailRecaptcha.current.reset();
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
          Verify your email address
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
            Verify
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                component={RouterLink}
                variant="body2"
                sx={{ textDecoration: "none" }}
                onClick={() => setAnotherVerificationEmail((value) => !value)}
              >
                {"Request another verification email?"}
              </Link>
            </Grid>
          </Grid>
        </Box>

        <Modal
          open={anotherVerificationEmail}
          onClose={onCloseRequestAnotherVerificationEmail}
          aria-labelledby="resend-verification-email"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              id="resend-verification-modal-title"
              variant="h6"
              component="h2"
            >
              Request for another verification email
            </Typography>
            <Box
              component="form"
              onSubmit={handleRequestAnotherVerficationEmail}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    autoFocus
                    id="email"
                    label="Enter Email"
                    name="email"
                    value={requestAnotherEmailData.email}
                    onChange={handleAnotherEmailDataChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ReCAPTCHA
                    ref={requestAnotherVerificationEmailRecaptcha}
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
                Send request
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
}

export default <VerifyEmail />;
