import express from 'express';
import { 
  getAllCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, categorySchema } from '../middleware/validation.js';

const router = express.Router();

// Barcha foydalanuvchilar uchun
router.get('/', authenticate, getAllCategories);
router.get('/:id', authenticate, getCategory);

// Faqat adminlar uchun
router.post('/', authenticate, authorize('admin'), validate(categorySchema), createCategory);
router.put('/:id', authenticate, authorize('admin'), validate(categorySchema), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

export default router;
