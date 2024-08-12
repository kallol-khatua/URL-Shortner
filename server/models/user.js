const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// generating jwt token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: "30d" });
    return token;
}

const User = mongoose.model('User', userSchema);


module.exports = User;