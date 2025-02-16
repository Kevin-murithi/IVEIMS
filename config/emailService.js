const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Configure mail transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Send Email Function
const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: `"IvE IMS" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendEmail;
