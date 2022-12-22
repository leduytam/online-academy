import express from 'express';

import adminApi from '../api/admin.api.js';
import configs from '../configs/index.js';
import adminRoute from './admin.route.js';
import authRoute from './auth.route.js';
import errorRoute from './error.route.js';
import instructorRoute from './instructor.route.js';
import studentRoute from './student.route.js';

const router = express.Router();

router.use(studentRoute);
router.use(authRoute);
router.use(errorRoute);
router.use('/admin', adminRoute);
router.use('/instructor', instructorRoute);

// api
router.use(`${configs.apiUrl}/admin`, adminApi);

export default router;
