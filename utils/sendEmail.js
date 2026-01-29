const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io', // Default or env
        port: process.env.SMTP_PORT || 2525,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // Define email options
    const message = {
        from: `${process.env.FROM_NAME || 'AK Design'} <${process.env.FROM_EMAIL || 'noreply@akdesign.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // Optional: Add HTML support later
    };

    // Send email
    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
