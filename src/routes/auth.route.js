import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.middleware.js';
import {
  validateReJson,
  validateRedirect,
} from '../middlewares/validate.middleware.js';
import authValidation from '../validations/auth.validation.js';

const router = Router();

router
  .route('/login')
  .get(auth.preventAuth, authController.getLogInView)
  .post(
    auth.preventAuth,
    validateRedirect(authValidation.login),
    authController.login
  );

router
  .route('/register')
  .get(auth.preventAuth, authController.getRegisterView)
  .post(
    auth.preventAuth,
    validateRedirect(authValidation.register),
    authController.register
  );

router.post('/logout', authController.logout);

router
  .route('/forgot-password')
  .get(auth.preventAuth, authController.getForgotPasswordView);

router
  .route('/reset-password')
  .post(
    auth.preventAuth,
    validateRedirect(authValidation.resetPassword, '/forgot-password'),
    authController.resetPassword
  );

router.post(
  '/send-verify-otp',
  auth.preventAuth,
  validateReJson(authValidation.sendVerifyOtp),
  authController.sendVerifyOtp
);

router.post(
  '/send-reset-password-otp',
  auth.preventAuth,
  validateReJson(authValidation.sendResetPasswordOtp),
  authController.sendResetPasswordOtp
);

export default router;
