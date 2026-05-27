const { Resend } = require("resend");

const resend = new Resend(
    process.env.RESEND_API_KEY
);

const sendLoginMail = async (email) => {

    try {

        await resend.emails.send({

            from: "CreatoKite <onboarding@resend.dev>",
            to: email,

            subject: "Welcome back to CreatoKite",

            html: `
                <h2>Welcome Back!</h2>
                <p>You logged in successfully to CreatoKite.</p>
            `

        });

    } catch(error) {

        console.log(error);

    }

};

module.exports = sendLoginMail;