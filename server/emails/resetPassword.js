const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});


async function sendResetPasswordEmail(email, token) {
    try {
        const info = await transporter.sendMail({
            from: `"BookMyPass" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Change your password.",
            html: `<p><a href='${process.env.FRONTEND_BASE_URL}/auth/new-password?token=${token}'>Click here</a> to change your password <p/>
            
            <p>or paste this link in your browser</p>

            <p><a href='${process.env.FRONTEND_BASE_URL}/auth/new-password?token=${token}'>${process.env.FRONTEND_BASE_URL}/auth/new-password?token=${token}</a></p>
            
            <p>or enter the token</p>

            <p>${token}</p>`,
        });
        return;
    } catch (error) {
        console.log("Error while sending passwrod reset email", error);
        return;
    }
}

module.exports = sendResetPasswordEmail;