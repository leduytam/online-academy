import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
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

export default router;
