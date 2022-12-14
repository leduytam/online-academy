import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.middleware.js';
import layout from '../middlewares/layout.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import authValidation from '../validations/auth.validation.js';

const router = Router();

router
  .route('/login')
  .get(authController.getLogInView)
  .post(validate(authValidation.login), authController.login);

router
  .route('/register')
  .get(authController.getRegisterView)
  .post(validate(authValidation.register), authController.register);

router.post('/logout', authController.logout);

router
  .route('/verify')
  .get(auth.protect, layout.emptyLayout, authController.getVerifyView)
  .post(auth.protect, layout.emptyLayout, authController.verify);

router
  .route('/resend-verify-otp')
  .post(auth.protect, layout.emptyLayout, authController.resendVerifyOtp);

export default router;
