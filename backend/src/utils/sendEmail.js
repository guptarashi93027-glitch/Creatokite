const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendLoginMail = async (email) => {
    try {
        await resend.emails.send({
            from: "CreatoKite <onboarding@resend.dev>",
            to: email,
            subject: "Welcome back to CreatoKite",
            html: "<h2>Welcome Back!</h2><p>You logged in successfully.</p>"
        });
    } catch(error) { console.log("❌ Email error:", error); }
};

const sendVerificationMail = async (email, token) => {
    try {
        const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        await resend.emails.send({
            from: "CreatoKite <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email - CreatoKite",
            html: `
                <h2>Welcome to CreatoKite!</h2>
                <p>Click the button below to verify your email:</p>
                <a href="${link}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">Verify Email</a>
                <p>Or copy this link: ${link}</p>
            `
        });
    } catch(error) { console.log("❌ Verify email error:", error); }
};

module.exports = { sendLoginMail, sendVerificationMail };