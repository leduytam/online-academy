import express from 'express';

import adminApi from '../api/admin.api.js';
import courseApi from '../api/course.api.js';
import configs from '../configs/index.js';
import adminRoute from './admin.route.js';
import authRoute from './auth.route.js';
import courseRoute from './course.route.js';
import errorRoute from './error.route.js';
import instructorRoute from './instructor.route.js';
import studentRoute from './student.route.js';

const router = express.Router();

// web
router.use(studentRoute);
router.use(authRoute);
router.use(errorRoute);
router.use('/courses', courseRoute);
router.use('/admin', adminRoute);
router.use('/instructor', instructorRoute);

// api
router.use(`${configs.apiUrl}/admin`, adminApi);
router.use(`${configs.apiUrl}/courses`, courseApi);

export default router;
