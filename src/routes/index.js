import express from 'express';

import adminRoute from './admin.route.js';
import authRoute from './auth.route.js';
import errorRoute from './error.route.js';
import studentRoute from './student.route.js';

const router = express.Router();

router.use(studentRoute);
router.use(authRoute);
router.use(errorRoute);
router.use('/admin', adminRoute);

export default router;
