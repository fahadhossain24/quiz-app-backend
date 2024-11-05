/* eslint-disable no-unused-vars */
import nodemailer from 'nodemailer'
import config from '../config'
import CustomError from '../app/errors';

const sendMail = async ({ from, to, subject, text }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.gmail_app_user,
                pass: config.gmail_app_password,
            },
        });

        const mailOptions = {
            from,
            to,
            subject,
            text,
        };

        // Wait for the sendMail operation to complete
        let info = await transporter.sendMail(mailOptions);
        // console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        throw new CustomError.BadRequestError('Failed to send mail!')
        // console.error('Error sending mail: ', error);
        // return false;
    }
};

export default sendMail;