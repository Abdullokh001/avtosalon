import Mashina from '../models/Mashina.js';
import Category from '../models/Category.js';
import logger from '../utils/logger.js';

export const getAllMashinas = async (req, res, next) => {
  try {
    const mashinas = await Mashina.find()
      .populate('category', 'name')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    logger.info('Mashinalar olindi', { count: mashinas.length });

    res.status(200).json({
      success: true,
      count: mashinas.length,
      data: mashinas
    });
  } catch (error) {
    logger.error('Get mashinas xatosi', { error: error.message });
    next(error);
  }
};

export const getMashina = async (req, res, next) => {
  try {
    const mashina = await Mashina.findById(req.params.id)
      .populate('category', 'name description')
      .populate('createdBy', 'fullName email');

    if (!mashina) {
      logger.warn('Mashina topilmadi', { mashinaId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Mashina topilmadi'
      });
    }

    logger.info('Mashina olindi', { mashinaId: mashina._id });

    res.status(200).json({
      success: true,
      data: mashina
    });
  } catch (error) {
    logger.error('Get mashina xatosi', { error: error.message });
    next(error);
  }
};

export const getMashinasByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      logger.warn('Category topilmadi', { categoryId });
      return res.status(404).json({
        success: false,
        message: 'Category topilmadi'
      });
    }

    const mashinas = await Mashina.find({ category: categoryId })
      .populate('category', 'name')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    logger.info('Category bo\'yicha mashinalar olindi', { 
      categoryId, 
      count: mashinas.length 
    });

    res.status(200).json({
      success: true,
      count: mashinas.length,
      category: {
        id: category._id,
        name: category.name
      },
      data: mashinas
    });
  } catch (error) {
    logger.error('Get mashinas by category xatosi', { error: error.message });
    next(error);
  }
};

export const createMashina = async (req, res, next) => {
  try {
    const { name, model, year, price, color, mileage, description, category } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      logger.warn('Category topilmadi', { categoryId: category });
      return res.status(404).json({
        success: false,
        message: 'Category topilmadi'
      });
    }

    const mashina = await Mashina.create({
      name,
      model,
      year,
      price,
      color,
      mileage,
      description,
      category,
      createdBy: req.user._id
    });

    await mashina.populate([
      { path: 'category', select: 'name' },
      { path: 'createdBy', select: 'fullName email' }
    ]);

    logger.info('Mashina yaratildi', { mashinaId: mashina._id, userId: req.user._id });

    res.status(201).json({
      success: true,
      message: 'Mashina muvaffaqiyatli yaratildi',
      data: mashina
    });
  } catch (error) {
    logger.error('Create mashina xatosi', { error: error.message });
    next(error);
  }
};

export const updateMashina = async (req, res, next) => {
  try {
    const { name, model, year, price, color, mileage, description, category } = req.body;

    let mashina = await Mashina.findById(req.params.id);

    if (!mashina) {
      logger.warn('Mashina topilmadi', { mashinaId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Mashina topilmadi'
      });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        logger.warn('Category topilmadi', { categoryId: category });
        return res.status(404).json({
          success: false,
          message: 'Category topilmadi'
        });
      }
    }

    mashina = await Mashina.findByIdAndUpdate(
      req.params.id,
      { name, model, year, price, color, mileage, description, category },
      { new: true, runValidators: true }
    ).populate([
      { path: 'category', select: 'name' },
      { path: 'createdBy', select: 'fullName email' }
    ]);

    logger.info('Mashina yangilandi', { mashinaId: mashina._id, userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Mashina muvaffaqiyatli yangilandi',
      data: mashina
    });
  } catch (error) {
    logger.error('Update mashina xatosi', { error: error.message });
    next(error);
  }
};

export const deleteMashina = async (req, res, next) => {
  try {
    const mashina = await Mashina.findById(req.params.id);

    if (!mashina) {
      logger.warn('Mashina topilmadi', { mashinaId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Mashina topilmadi'
      });
    }

    await Mashina.findByIdAndDelete(req.params.id);

    logger.info('Mashina o\'chirildi', { mashinaId: req.params.id, userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Mashina muvaffaqiyatli o\'chirildi'
    });
  } catch (error) {
    logger.error('Delete mashina xatosi', { error: error.message });
    next(error);
  }
};
