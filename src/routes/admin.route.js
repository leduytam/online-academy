import express from 'express';

import AdminController from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/users-list', AdminController.getUsersView);
router.get('/create-user', AdminController.createUserView);
router.get('/management-courses', AdminController.getCoursesView);

export default router;
