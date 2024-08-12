const axios = require("axios");
const User = require("../models/user");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendVerifyEmail = require("../emails/emailVerification");
const sendResetPasswordEmail = require("../emails/resetPassword")

module.exports.signup = async (req, res) => {
    try {
        // validating signup data
        const { error } = validateSignupData(req.body);
        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { firstName, lastName, email, password, confirmPassword, captchaValue } = req.body

        // reCatcha verification
        const { data } = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaValue}`,
        )
        if (!data.success) {
            return res.status(400).send({ success: false, message: "Please verify reCaptcha!" });
        }

        // checking email already taken or not
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).send({ success: false, message: "Email is already registered!" })
        }

        // matching password and confirm password
        if (password !== confirmPassword) {
            return res.status(400).send({ success: false, message: "Confirm password must match with Password!" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })

        await newUser.save();

        const token = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY, { expiresIn: "30m" });

        await sendVerifyEmail(email, token);

        return res.status(201).send({ success: true, message: "Account created successfully!" })
    } catch (error) {
        console.error("Error occurred while signning up user", error);
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}

const validateSignupData = (data) => {
    const schema = joi.object({
        firstName: joi.string()
            .required()
            .label('firstName')
            .messages({
                'any.required': 'First Name is required!'
            }),
        lastName: joi.string()
            .required()
            .label('lastName')
            .messages({
                'any.required': 'Last Name is required!'
            }),
        email: joi.string()
            .email()
            .required()
            .label('email')
            .messages({
                'string.email': 'Enter a valid email address!',
                'any.required': 'Email is required!'
            }),
        password: passwordComplexity()
            .required()
            .label("password"),
        confirmPassword: passwordComplexity()
            .required()
            .label("confirmPassword"),
        captchaValue: joi.string()
            .required()
            .label("captchaValue")
            .messages({
                'any.required': 'Please verify reCaptcha!'
            }),
    });

    return schema.validate(data);
}

module.exports.verifyEmail = async (req, res) => {
    try {
        // validating data
        const { error } = validateVerifyEmailData(req.body);
        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { token, captchaValue } = req.body;

        // reCatcha verification
        const { data } = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaValue}`,
        )
        if (!data.success) {
            return res.status(400).send({ success: false, message: "Please verify reCaptcha!" });
        }

        // validating jwt token and get the email address associated with the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY); // Verify the token

            const user = await User.findOne({ email: decoded.email });
            if (!user) {
                return res.status(400).send({ success: false, message: "Email is not registered!" })
            }

            if (user.isEmailVerified) {
                return res.status(200).send({ success: true, message: "Email already verified!" });
            }

            await User.findOneAndUpdate({ email: user.email }, { isEmailVerified: true });

            return res.status(200).send({ success: true, message: "Email verified successfully!" })

        } catch (error) {
            return res.status(400).send({ success: false, message: "Invalid Token!" })
        }
    } catch (error) {
        console.error("Error occurred while verifying email address", error);
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}

const validateVerifyEmailData = (data) => {
    const schema = joi.object({
        token: joi.string()
            .required()
            .label("token")
            .messages({
                'any.required': 'Please provide the token!'
            }),
        captchaValue: joi.string()
            .required()
            .label("captchaValue")
            .messages({
                'any.required': 'Please verify reCaptcha!'
            }),
    });

    return schema.validate(data);
}

module.exports.newVerificationEmail = async (req, res) => {
    try {
        // validating data
        const { error } = validateNewVerificationEmailData(req.query.requestAnotherEmailData);
        if (error) {
            return res.status(400).send({ success: false, message: error.details[0].message });
        }

        const { email, captchaValue } = req.query.requestAnotherEmailData;

        // reCatcha verification
        const { data } = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaValue}`,
        )
        if (!data.success) {
            return res.status(400).send({ success: false, message: "Please verify reCaptcha!" });
        }

        // finding user registered or not
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ success: false, message: "Email is not registered!" })
        }

        // if email already verified then do not send email again
        if (user.isEmailVerified) {
            return res.status(400).send({ success: false, message: "Email already verified!" });
        }

        // send new verification email
        const token = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY, { expiresIn: "30m" });

        await sendVerifyEmail(email, token);

        return res.status(200).send({ success: true, message: "New verificaton email send successfully!" })
    } catch (error) {
        console.log("Error while sending another verification email", error);
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}

const validateNewVerificationEmailData = (data) => {
    const schema = joi.object({
        email: joi.string()
            .email()
            .required()
            .label('email')
            .messages({
                'string.email': 'Enter a valid email address!',
                'any.required': 'Email is required!'
            }),
        captchaValue: joi.string()
            .required()
            .label("captchaValue")
            .messages({
                'any.required': 'Please verify reCaptcha!'
            }),
    });

    return schema.validate(data);
}

module.exports.login = async (req, res) => {
    try {
        // validating data
        const { error } = validateLoginData(req.body);
        if (error) {
            return res.status(400).send({ success: false, message: error.details[0].message });
        }

        const { email, captchaValue, password } = req.body;

        // reCatcha verification
        const { data } = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaValue}`,
        )
        if (!data.success) {
            return res.status(400).send({ success: false, message: "Please verify reCaptcha!" });
        }

        // finding user registered or not
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ success: false, message: "Email is not registered!" })
        }

        // if email s not verified then do not allow login
        if (!user.isEmailVerified) return res.status(401).send({ message: 'Email address not verified!' });

        // check for correct password
        const validPassword = await bcrypt.compare(
            password, user.password
        )
        if (!validPassword) return res.status(400).send({ message: 'Invalid password!' });

        // after successfull login creating jwt token
        const token = user.generateAuthToken();

        return res.status(200).send({ success: true, message: "Logged in successfully", token: token })
    } catch (error) {
        console.log("Error while login user", error);
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}

const validateLoginData = (data) => {
    const schema = joi.object({
        email: joi.string()
            .email()
            .required()
            .label('email')
            .messages({
                'string.email': 'Enter a valid email address!',
                'any.required': 'Email is required!'
            }),
        captchaValue: joi.string()
            .required()
            .label("captchaValue")
            .messages({
                'any.required': 'Please verify reCaptcha!'
            }),
        password: passwordComplexity()
            .required()
            .label("password"),
    });

    return schema.validate(data);
}

module.exports.forgotPassword = async (req, res) => {
    try {
        // validating data
        const { error } = validateForgotPasswordData(req.body);
        if (error) {
            return res.status(400).send({ success: false, message: error.details[0].message });
        }

        const { email, captchaValue } = req.body;

        // reCatcha verification
        const { data } = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaValue}`,
        )
        if (!data.success) {
            return res.status(400).send({ success: false, message: "Please verify reCaptcha!" });
        }

        // finding user registered or not
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ success: false, message: "Email is not registered!" })
        }

        // if email is not verified then do not allow forgot password change
        if (!user.isEmailVerified) return res.status(401).send({ message: 'Email address not verified!' });

        const token = jwt.sign({ email, type: "reset-password" }, process.env.JWT_PRIVATE_KEY, { expiresIn: "30m" });

        await sendResetPasswordEmail(email, token);

        return res.status(200).send({ success: true, message: "Reset password email send successfully!" });
    } catch (error) {
        console.log("Error while sending forgot password email", error);
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}

const validateForgotPasswordData = (data) => {
    const schema = joi.object({
        email: joi.string()
            .email()
            .required()
            .label('email')
            .messages({
                'string.email': 'Enter a valid email address!',
                'any.required': 'Email is required!'
            }),
        captchaValue: joi.string()
            .required()
            .label("captchaValue")
            .messages({
                'any.required': 'Please verify reCaptcha!'
            }),
    });

    return schema.validate(data);
}

module.exports.newPassword = async (req, res) => {
    try {

        // validating signup data
        const { error } = validateNewPasswordData(req.body);
        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { token, password, confirmPassword, captchaValue } = req.body

        // reCatcha verification
        const { data } = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaValue}`,
        )
        if (!data.success) {
            return res.status(400).send({ success: false, message: "Please verify reCaptcha!" });
        }

        // matching password and confirm password
        if (password !== confirmPassword) {
            return res.status(400).send({ success: false, message: "Confirm password must match with Password!" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY); // Verify the token

            if (decoded.type !== 'reset-password') {
                return res.status(400).send({ success: false, message: "Invalid Token!" })
            }

            const user = await User.findOne({ email: decoded.email });
            if (!user) {
                return res.status(400).send({ success: false, message: "Email is not registered!" })
            }

            // if email is not verified then do not allow forgot password change
            if (!user.isEmailVerified) return res.status(401).send({ message: 'Email address not verified!' });

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.findOneAndUpdate({ email: decoded.email }, { password: hashedPassword });

            return res.status(200).send({ success: true, message: "New password saved!" })
        } catch (error) {
            return res.status(400).send({ success: false, message: "Invalid Token!" })
        }
    } catch (error) {
        console.log("Error while change forgot password", error);
        return res.status(500).send({ success: false, message: "Internal server error!" });
    }
}

const validateNewPasswordData = (data) => {
    const schema = joi.object({
        token: joi.string()
            .required()
            .label("token")
            .messages({
                'any.required': 'Please provide the token!'
            }),
        password: passwordComplexity()
            .required()
            .label("password"),
        confirmPassword: passwordComplexity()
            .required()
            .label("confirmPassword"),
        captchaValue: joi.string()
            .required()
            .label("captchaValue")
            .messages({
                'any.required': 'Please verify reCaptcha!'
            }),
    });

    return schema.validate(data);
}