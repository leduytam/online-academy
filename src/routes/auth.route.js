import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.middleware.js';
import {
  validate,
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
  .route('/change-password')
  .post(
    auth.protect,
    validate(authValidation.changePassword),
    authController.changePassword
  );

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

router.post(
  '/send-change-email-otp',
  auth.protect,
  validateReJson(authValidation.sendChangeEmailOtp),
  authController.sendChangeEmailOtp
);

router.post(
  '/change-email',
  auth.protect,
  validate(authValidation.changeEmail),
  authController.changeEmail
);

export default router;
