import express from 'express';
import rateLimit from 'express-rate-limit';
import * as authMiddleware from '../middlewares/authMiddleware.js';
import * as authController from '../controllers/authController.js';
import validate from '../middlewares/validateFields.js';
import {
  loginSchema,
  registerSchema,
  updateSchema,
} from '../validations/authValidation.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts, please try again in 15 minutes.',
  },
});

router.route('/register').post(validate(loginSchema), authController.register);
router
  .route('/login')
  .post(validate(registerSchema), loginLimiter, authController.login);
router
  .route('/update')
  .patch(
    authMiddleware.authenticateUser,
    validate(updateSchema),
    authController.updateUser,
  );

export default router;
