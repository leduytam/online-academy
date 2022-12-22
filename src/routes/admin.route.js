import express from 'express';

import AdminAPI from '../api/admin.api.js';
import AdminController from '../controllers/admin.controller.js';
import m from '../middlewares/auth.middleware.js';

const router = express.Router();

// View
router.get('/', AdminController.get);

router.get('/management-users', AdminController.getUsers);

router.get('/management-courses', AdminController.getCourses);

//API
router.get('/api/v1/admin/users', m.protect, AdminAPI.getUsersList);

export default router;
