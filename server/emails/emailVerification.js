const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});


async function sendVerifyEmail(email, token) {
    try {
        const info = await transporter.sendMail({
            from: `"BookMyPass" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Please verify your email address",
            html: `<p><a href='${process.env.FRONTEND_BASE_URL}/auth/verify-email?token=${token}'>Click here</a> to verify your email<p/>
            
            <p>or paste this link in your browser</p>

            <p><a href='${process.env.FRONTEND_BASE_URL}/auth/verify-email?token=${token}'>${process.env.FRONTEND_BASE_URL}/auth/verify-email?token=${token}</a></p>
            
            <p>or enter the token</p>

            <p>${token}</p>`,
        });
        return;
    } catch (error) {
        console.log("Error while sending email verification email", error);
        return;
    }
}

module.exports = sendVerifyEmail;