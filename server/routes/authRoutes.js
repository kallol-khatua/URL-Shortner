const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");

router.post("/signup", authControllers.signup);
router.post("/verify-email", authControllers.verifyEmail);
router.get("/new-verification-email", authControllers.newVerificationEmail);
router.post("/login", authControllers.login);
router.post("/forgot-password", authControllers.forgotPassword);
router.post("/new-password", authControllers.newPassword);


module.exports = router;