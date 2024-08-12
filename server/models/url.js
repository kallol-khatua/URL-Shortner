const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const urlSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;