import express from 'express';
import { 
  register, 
  verify, 
  login, 
  refreshToken, 
  logout, 
  forgotPassword, 
  resetPassword,
  changePassword 
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { 
  validate, 
  registerSchema, 
  loginSchema, 
  verifySchema, 
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema 
} from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify', validate(verifySchema), verify);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
