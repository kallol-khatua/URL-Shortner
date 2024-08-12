const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const viewSchema = new mongoose.Schema({
    os: {
        type: String,
    },
    ip: {
        type: String,
    },
    country: {
        type: String,
    },
    region: {
        type: String,
    },
    city: {
        type: String,
    },
    coord: {
        type: String,
    },
    org: {
        type: String,
    },
    postal: {
        type: String,
    },
    timezone: {
        type: String,
    },
    onUrl: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url",
        required: true
    }
}, { timestamps: true });

const View = mongoose.model('View', viewSchema);

module.exports = View;