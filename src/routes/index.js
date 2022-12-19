import express from 'express';

import auth from '../middlewares/auth.middleware.js';
import adminRoute from './admin.route.js';
import authRoute from './auth.route.js';
import errorRoute from './error.route.js';
import homeRoute from './home.route.js';

const router = express.Router();

router.use(homeRoute);
router.use(authRoute);
router.use(errorRoute);
router.use('/admin', adminRoute);

router.get('/profile', auth.protect, async (req, res, next) => {
  res.render('students/profile', {
    title: 'Profile',
  });
});

export default router;
