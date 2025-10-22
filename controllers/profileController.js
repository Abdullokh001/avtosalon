import User from '../models/User.js';
import Category from '../models/Category.js';
import Mashina from '../models/Mashina.js';
import logger from '../utils/logger.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken');

    if (!user) {
      logger.warn('Foydalanuvchi topilmadi', { userId: req.user._id });
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    const profile = {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    };

    // Agar admin bo'lsa, uning yaratgan category va mashinalarini ko'rsatish
    if (user.role === 'admin') {
      const categories = await Category.find({ createdBy: user._id })
        .select('name description createdAt')
        .sort({ createdAt: -1 });

      const mashinas = await Mashina.find({ createdBy: user._id })
        .populate('category', 'name')
        .select('name model year price category createdAt')
        .sort({ createdAt: -1 });

      profile.statistics = {
        totalCategories: categories.length,
        totalMashinas: mashinas.length
      };

      profile.categories = categories;
      profile.mashinas = mashinas;

      logger.info('Admin profil olindi', { userId: user._id });
    } else {
      logger.info('User profil olindi', { userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    logger.error('Get profile xatosi', { error: error.message });
    next(error);
  }
};
