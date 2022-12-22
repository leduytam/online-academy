import express from 'express';

import AdminAPI from '../api/admin.api.js';
import AdminController from '../controllers/admin.controller.js';
import m from '../middlewares/auth.middleware.js';

const router = express.Router();

// View

router.get('/users-list', AdminController.getUsersView);
router.get('/create-user', AdminController.createUserView);
router.get('/management-courses', AdminController.getCourses);

//API
router.get('/api/v1/admin/users', m.protect, AdminAPI.getUsersList);

export default router;
