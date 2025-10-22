import User from '../models/User.js';
import logger from '../utils/logger.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  generateVerificationCode,
  generateResetToken 
} from '../utils/token.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js';
import crypto from 'crypto';

export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Email allaqachon ro\'yxatdan o\'tgan', { email });
      return res.status(400).json({
        success: false,
        message: 'Bu email allaqachon ro\'yxatdan o\'tgan'
      });
    }

    const verificationCode = generateVerificationCode();

    const user = await User.create({
      fullName,
      email,
      password,
      verificationCode
    });

    await sendVerificationEmail(email, verificationCode);

    logger.info('Foydalanuvchi ro\'yxatdan o\'tdi', { userId: user._id, email });

    res.status(201).json({
      success: true,
      message: 'Ro\'yxatdan o\'tish muvaffaqiyatli. Emailingizga tasdiqlash kodi yuborildi',
      data: {
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    logger.error('Register xatosi', { error: error.message });
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email }).select('+verificationCode');

    if (!user) {
      logger.warn('Foydalanuvchi topilmadi', { email });
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email allaqachon tasdiqlangan'
      });
    }

    if (user.verificationCode !== code) {
      logger.warn('Noto\'g\'ri tasdiqlash kodi', { email });
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri tasdiqlash kodi'
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    logger.info('Email tasdiqlandi', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Email muvaffaqiyatli tasdiqlandi'
    });
  } catch (error) {
    logger.error('Verify xatosi', { error: error.message });
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      logger.warn('Noto\'g\'ri email yoki parol', { email });
      return res.status(401).json({
        success: false,
        message: 'Email yoki parol noto\'g\'ri'
      });
    }

    if (!user.isVerified) {
      logger.warn('Email tasdiqlanmagan', { email });
      return res.status(401).json({
        success: false,
        message: 'Emailingizni tasdiqlang'
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    logger.info('Foydalanuvchi tizimga kirdi', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Tizimga kirish muvaffaqiyatli',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    logger.error('Login xatosi', { error: error.message });
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token majburiy'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      logger.warn('Yaroqsiz refresh token', { userId: decoded.id });
      return res.status(401).json({
        success: false,
        message: 'Yaroqsiz refresh token'
      });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    logger.info('Token yangilandi', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Token muvaffaqiyatli yangilandi',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    logger.error('Refresh token xatosi', { error: error.message });
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.refreshToken = undefined;
    await user.save();

    logger.info('Foydalanuvchi tizimdan chiqdi', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Tizimdan chiqish muvaffaqiyatli'
    });
  } catch (error) {
    logger.error('Logout xatosi', { error: error.message });
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('Foydalanuvchi topilmadi', { email });
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 soat
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    logger.info('Parolni tiklash emaili yuborildi', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Parolni tiklash havolasi emailingizga yuborildi'
    });
  } catch (error) {
    logger.error('Forgot password xatosi', { error: error.message });
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      logger.warn('Yaroqsiz yoki muddati o\'tgan token');
      return res.status(400).json({
        success: false,
        message: 'Yaroqsiz yoki muddati o\'tgan token'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info('Parol tiklandi', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Parol muvaffaqiyatli tiklandi'
    });
  } catch (error) {
    logger.error('Reset password xatosi', { error: error.message });
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      logger.warn('Noto\'g\'ri joriy parol', { userId: user._id });
      return res.status(400).json({
        success: false,
        message: 'Joriy parol noto\'g\'ri'
      });
    }

    user.password = newPassword;
    await user.save();

    logger.info('Parol o\'zgartirildi', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Parol muvaffaqiyatli o\'zgartirildi'
    });
  } catch (error) {
    logger.error('Change password xatosi', { error: error.message });
    next(error);
  }
};
