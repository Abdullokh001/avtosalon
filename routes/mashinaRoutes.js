import express from 'express';
import { 
  getAllMashinas, 
  getMashina, 
  getMashinasByCategory,
  createMashina, 
  updateMashina, 
  deleteMashina 
} from '../controllers/mashinaController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, mashinaSchema } from '../middleware/validation.js';

const router = express.Router();

// Barcha foydalanuvchilar uchun
router.get('/', authenticate, getAllMashinas);
router.get('/:id', authenticate, getMashina);
router.get('/category/:categoryId', authenticate, getMashinasByCategory);

// Faqat adminlar uchun
router.post('/', authenticate, authorize('admin'), validate(mashinaSchema), createMashina);
router.put('/:id', authenticate, authorize('admin'), validate(mashinaSchema), updateMashina);
router.delete('/:id', authenticate, authorize('admin'), deleteMashina);

export default router;
