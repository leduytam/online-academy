import express from 'express';

import AdminController from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/', AdminController.getDashboardView);
router.get('/users', AdminController.getUsersView);
router.get('/create-user', AdminController.getCreateUserView);
router.get('/edit-user/:id', AdminController.getEditUserView);
router.get('/management-courses', AdminController.getCoursesView);

export default router;
