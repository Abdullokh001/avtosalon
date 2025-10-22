import nodemailer from 'nodemailer';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendVerificationEmail = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email tasdiqlash kodi',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email tasdiqlash</h2>
          <p>Assalomu alaykum!</p>
          <p>Emailingizni tasdiqlash uchun quyidagi kodni kiriting:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666;">Agar siz bu so'rovni yubormasangiz, ushbu xabarni e'tiborsiz qoldiring.</p>
          <p style="color: #666;">Kod 10 daqiqa davomida amal qiladi.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info('Verification email yuborildi', { email });
  } catch (error) {
    logger.error('Email yuborishda xato', { email, error: error.message });
    throw new Error('Email yuborishda xato');
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Parolni tiklash',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Parolni tiklash</h2>
          <p>Assalomu alaykum!</p>
          <p>Parolingizni tiklash uchun quyidagi havolani bosing:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Parolni tiklash
            </a>
          </div>
          <p style="color: #666;">Yoki quyidagi havolani brauzerga nusxa oling:</p>
          <p style="background-color: #f5f5f5; padding: 10px; word-break: break-all; font-size: 12px;">${resetUrl}</p>
          <p style="color: #666;">Agar siz parolni tiklashni so'ramasangiz, ushbu xabarni e'tiborsiz qoldiring.</p>
          <p style="color: #666;">Havola 1 soat davomida amal qiladi.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info('Password reset email yuborildi', { email });
  } catch (error) {
    logger.error('Email yuborishda xato', { email, error: error.message });
    throw new Error('Email yuborishda xato');
  }
};
