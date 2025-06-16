const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          // Fix by dens: Add TLS/SSL bypass for development (remove in production)
          tls: {
            rejectUnauthorized: false,
          },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
            html: html, 
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.error('Email not sent:', error);
        return false;
    }
};

module.exports = sendEmail;