import express from 'express';

import ERole from '../constant/role.js';
import AdminController from '../controllers/admin.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', AdminController.getDashboardView);

// USER
router.get(
  '/users',
  auth.protect,
  auth.restrictTo(ERole.ADMIN),
  AdminController.getUsersView
);
router.get(
  '/create-user',
  auth.protect,
  auth.restrictTo(ERole.ADMIN),
  AdminController.getCreateUserView
);
router.get(
  '/edit-user/:id',
  auth.protect,
  auth.restrictTo(ERole.ADMIN),
  AdminController.getEditUserView
);

// COURSE
router.get(
  '/courses',
  auth.protect,
  auth.restrictTo(ERole.ADMIN),
  AdminController.getCoursesView
);

// CATEGORY
router.get(
  '/categories',
  auth.protect,
  auth.restrictTo(ERole.ADMIN),
  AdminController.getCategoriesView
);
router.get(
  '/categories/add-category',
  auth.protect,
  auth.restrictTo(ERole.ADMIN),
  AdminController.getAddCategoryView
);

export default router;
