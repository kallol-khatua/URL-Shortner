const validator = require("validator");
const Url = require("../models/url");
const ShortUniqueId = require("short-unique-id");
const View = require("../models/view");

module.exports.getUserDetails = async (req, res) => {
    try {
        return res.status(200).send({ success: true, user: req.user });
    } catch (error) {
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}

module.exports.getHomePageDetails = async (req, res) => {
    try {
        const urls = await Url.find({ createdBy: req.user._id });
        return res.status(200).send({ success: true, message: "found", urls });
    } catch (error) {
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}

module.exports.createNewShortUrl = async (req, res) => {
    try {
        const { url } = req.body;

        const isValidUrl = validator.isURL(url);
        if (!isValidUrl) {
            return res.status(400).send({ success: false, message: "Please enter a valid URL!" })
        }

        function generateShortId() {
            const { randomUUID } = new ShortUniqueId({ length: 10 });
            const timestamp = Date.now().toString(36);
            const randomPart = randomUUID();
            return `${randomPart}${timestamp}`;
        }

        const shortId = generateShortId();
        const shortUrl = `${process.env.FRONTEND_BASE_URL}/${shortId}`

        const newUrl = new Url({
            shortUrl,
            originalUrl: url,
            createdBy: req.user._id,
            shortId
        })

        const savedUrl = await newUrl.save();

        return res.status(201).send({ success: true, message: "Short URL generated!", savedUrl: savedUrl })
    } catch (error) {
        console.log("Error while creating new short url", error);
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}

module.exports.saveRedirect = async (req, res) => {
    try {

        const { shortUrl } = req.params

        const url = await Url.findOne({ shortId: shortUrl });
        if (!url) {
            return res.status(400).send({ success: false, message: "Invalid URL!" })
        }

        const newView = new View({ ...req.body, onUrl: url._id });
        await newView.save();

        return res.status(200).send({ success: true, message: "Redirecting to the original URL", url });

    } catch (error) {
        console.log("Error while redirecting to url", error);
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}

module.exports.urlDetails = async (req, res) => {
    try {
        const { shortUrl } = req.params;

        const url = await Url.findOne({ shortId: shortUrl });
        if (!url) {
            return res.status(400).send({ success: false, message: "Invalid URL!" })
        }

        const viewDetails = await View.find({ onUrl: url._id })

        return res.status(200).send({ success: true, message: "Result found", url, viewDetails });
    } catch (error) {
        console.log("Error while generating url details", error);
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}