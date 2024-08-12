require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log("Database connected successfully");
        const port = process.env.PORT || 8080;
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        })
    })
    .catch((err) => {
        console.error("Error while connecting to database", err);
        process.exit(1);
    })

const authRoutes = require("./routes/authRoutes");
const urlRoutes = require("./routes/urlRoutes")

app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);