import express from 'express';

import AdminController from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/', AdminController.getDashboardView);

// USER
router.get('/users', AdminController.getUsersView);
router.get('/create-user', AdminController.getCreateUserView);
router.get('/edit-user/:id', AdminController.getEditUserView);

// COURSE
router.get('/courses', AdminController.getCoursesView);

// CATEGORY
router.get('/categories', AdminController.getCategoriesView);

export default router;
