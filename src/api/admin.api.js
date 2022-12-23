import express from 'express';

import ERole from '../constant/role.js';
import AdminController from '../controllers/admin.controller.js';
import auth from '../middlewares/auth.middleware.js';
import { validateRedirect } from '../middlewares/validate.middleware.js';
import AdminSchema from '../validations/admin.validation.js';

const router = express.Router();

router.get('/users', AdminController.getUsersList);
router.get('/users/:id', AdminController.getUserById);
router.post(
  '/create-user',
  auth.restrictTo(ERole.ADMIN),
  validateRedirect(AdminSchema.createUserBody),
  AdminController.createUser
);

router.post(
  '/delete-user/:id',
  auth.restrictTo(ERole.ADMIN),
  AdminController.deleteUser
);

router.post(
  '/edit-user/:id',
  auth.restrictTo(ERole.ADMIN),
  validateRedirect(AdminSchema.editUserBody),
  AdminController.editUser
);

export default router;
