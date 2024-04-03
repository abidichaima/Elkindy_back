const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Set to false because we are using TLS
            requireTLS: true, // Force TLS
            auth: {
                user: 'chaimaabidi1406@gmail.com',
                pass: 'alfz uyju btme lofm'
            }
        });


        await transporter.sendMail({
            from: 'chaimaabidi1406@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent successfully");
    } catch (error) {
        console.log("email not sent!");
        console.log(error);
        return error;
    }
};
