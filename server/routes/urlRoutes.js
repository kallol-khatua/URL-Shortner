const express = require("express");
const router = express.Router();
const urlControllers = require("../controllers/urlControllers");
const jwt = require("jsonwebtoken");
const User = require("../models/user")

// Middleware to verify JWT
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    // console.log(token);

    if (!token) return res.status(401).send({ success: false, message: "Access Denied: No token provided!", error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        let user = await User.findOne({ _id: decoded._id });
        if (!user) {
            return res.status(403).send({ message: "You are not a registered user.", error: "Forbidden" });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid Token!', error: "Unauthorized" });
    }
};

router.get("/", verifyToken, urlControllers.getUserDetails);
router.get("/home", verifyToken, urlControllers.getHomePageDetails);
router.post("/create", verifyToken, urlControllers.createNewShortUrl);
router.post("/:shortUrl", urlControllers.saveRedirect);
router.get("/:shortUrl", urlControllers.urlDetails);

module.exports = router;