import express from 'express';

import AdminController from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/users', AdminController.getUsersList);

export default router;
