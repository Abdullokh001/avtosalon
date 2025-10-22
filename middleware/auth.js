import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Token mavjud emas', { ip: req.ip });
      return res.status(401).json({
        success: false,
        message: 'Token mavjud emas. Iltimos, tizimga kiring'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        logger.warn('Foydalanuvchi topilmadi', { userId: decoded.id });
        return res.status(401).json({
          success: false,
          message: 'Foydalanuvchi topilmadi'
        });
      }

      if (!user.isVerified) {
        logger.warn('Email tasdiqlanmagan', { userId: user._id });
        return res.status(401).json({
          success: false,
          message: 'Emailingizni tasdiqlang'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        logger.warn('Token muddati tugagan', { error: error.message });
        return res.status(401).json({
          success: false,
          message: 'Token muddati tugagan. Iltimos, qayta kiring'
        });
      }
      
      logger.error('Token yaroqsiz', { error: error.message });
      return res.status(401).json({
        success: false,
        message: 'Token yaroqsiz'
      });
    }
  } catch (error) {
    logger.error('Autentifikatsiya xatosi', { error: error.message });
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn('Ruxsat yo\'q', { 
        userId: req.user._id, 
        userRole: req.user.role,
        requiredRoles: roles 
      });
      return res.status(403).json({
        success: false,
        message: 'Sizda bu amalni bajarish uchun ruxsat yo\'q'
      });
    }
    next();
  };
};
