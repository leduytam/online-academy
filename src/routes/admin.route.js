import express from 'express';

import AdminController from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/', AdminController.get);

router.get('/management-users', AdminController.getUsers);

router.get('/management-courses', AdminController.getCourses);

export default router;
