import Category from '../models/Category.js';
import Mashina from '../models/Mashina.js';
import logger from '../utils/logger.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    logger.info('Categorylar olindi', { count: categories.length });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    logger.error('Get categories xatosi', { error: error.message });
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('createdBy', 'fullName email');

    if (!category) {
      logger.warn('Category topilmadi', { categoryId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Category topilmadi'
      });
    }

    logger.info('Category olindi', { categoryId: category._id });

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    logger.error('Get category xatosi', { error: error.message });
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      logger.warn('Category allaqachon mavjud', { name });
      return res.status(400).json({
        success: false,
        message: 'Bu nomdagi category allaqachon mavjud'
      });
    }

    const category = await Category.create({
      name,
      description,
      createdBy: req.user._id
    });

    await category.populate('createdBy', 'fullName email');

    logger.info('Category yaratildi', { categoryId: category._id, userId: req.user._id });

    res.status(201).json({
      success: true,
      message: 'Category muvaffaqiyatli yaratildi',
      data: category
    });
  } catch (error) {
    logger.error('Create category xatosi', { error: error.message });
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      logger.warn('Category topilmadi', { categoryId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Category topilmadi'
      });
    }

    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        logger.warn('Category nomi band', { name });
        return res.status(400).json({
          success: false,
          message: 'Bu nomdagi category allaqachon mavjud'
        });
      }
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName email');

    logger.info('Category yangilandi', { categoryId: category._id, userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Category muvaffaqiyatli yangilandi',
      data: category
    });
  } catch (error) {
    logger.error('Update category xatosi', { error: error.message });
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      logger.warn('Category topilmadi', { categoryId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Category topilmadi'
      });
    }

    // Categoryga tegishli mashinalarni tekshirish
    const mashinaCount = await Mashina.countDocuments({ category: req.params.id });
    
    if (mashinaCount > 0) {
      logger.warn('Category o\'chirishda xato - mashinalar mavjud', { 
        categoryId: req.params.id,
        mashinaCount 
      });
      return res.status(400).json({
        success: false,
        message: `Bu categoryga ${mashinaCount} ta mashina tegishli. Avval mashinalarni o'chiring`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    logger.info('Category o\'chirildi', { categoryId: req.params.id, userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Category muvaffaqiyatli o\'chirildi'
    });
  } catch (error) {
    logger.error('Delete category xatosi', { error: error.message });
    next(error);
  }
};
