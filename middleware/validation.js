import Joi from 'joi';
import logger from '../utils/logger.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errors = error.details.map(detail => detail.message).join(', ');
      logger.warn('Validation xatosi', { errors, body: req.body });
      
      return res.status(400).json({
        success: false,
        message: 'Validatsiya xatosi',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    next();
  };
};

// Auth Validations
export const registerSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'Ism familiya kamida 3 ta belgidan iborat bo\'lishi kerak',
      'string.max': 'Ism familiya 50 ta belgidan oshmasligi kerak',
      'any.required': 'Ism familiya majburiy'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email formati noto\'g\'ri',
      'any.required': 'Email majburiy'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
      'any.required': 'Parol majburiy'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email formati noto\'g\'ri',
      'any.required': 'Email majburiy'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Parol majburiy'
    })
});

export const verifySchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email formati noto\'g\'ri',
      'any.required': 'Email majburiy'
    }),
  code: Joi.string()
    .length(6)
    .required()
    .messages({
      'string.length': 'Kod 6 ta raqamdan iborat bo\'lishi kerak',
      'any.required': 'Kod majburiy'
    })
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email formati noto\'g\'ri',
      'any.required': 'Email majburiy'
    })
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Joriy parol majburiy'
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak',
      'any.required': 'Yangi parol majburiy'
    })
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token majburiy'
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak',
      'any.required': 'Yangi parol majburiy'
    })
});

// Category Validation
export const categorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Category nomi kamida 2 ta belgidan iborat bo\'lishi kerak',
      'string.max': 'Category nomi 100 ta belgidan oshmasligi kerak',
      'any.required': 'Category nomi majburiy'
    }),
  description: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Tavsif 500 ta belgidan oshmasligi kerak'
    })
});

// Mashina Validation
export const mashinaSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Mashina nomi kamida 2 ta belgidan iborat bo\'lishi kerak',
      'string.max': 'Mashina nomi 100 ta belgidan oshmasligi kerak',
      'any.required': 'Mashina nomi majburiy'
    }),
  model: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.min': 'Model kamida 1 ta belgidan iborat bo\'lishi kerak',
      'string.max': 'Model 50 ta belgidan oshmasligi kerak',
      'any.required': 'Model majburiy'
    }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      'number.min': 'Yil 1900 dan katta bo\'lishi kerak',
      'number.max': 'Yil kelgusi yildan oshmasligi kerak',
      'any.required': 'Yil majburiy'
    }),
  price: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Narx musbat son bo\'lishi kerak',
      'any.required': 'Narx majburiy'
    }),
  color: Joi.string()
    .max(30)
    .allow('')
    .messages({
      'string.max': 'Rang 30 ta belgidan oshmasligi kerak'
    }),
  mileage: Joi.number()
    .min(0)
    .messages({
      'number.min': 'Probeg manfiy bo\'lishi mumkin emas'
    }),
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Tavsif 1000 ta belgidan oshmasligi kerak'
    }),
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Category ID formati noto\'g\'ri',
      'any.required': 'Category majburiy'
    })
});
