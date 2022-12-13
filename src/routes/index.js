import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';
import layoutMiddleware from '../middlewares/layout.middleware.js';
import localMiddleware from '../middlewares/local.middleware.js';
import authRoute from './auth.route.js';
import homeRoute from './home.route.js';

const router = express.Router();

router.all('*', layoutMiddleware.roleLayout, localMiddleware.user);
router.use(homeRoute);
router.use(authRoute);

router.get('/profile', authMiddleware.auth, async (req, res, next) => {
  res.locals.user = req.session.user;

  res.render('students/profile', {
    title: 'Profile',
  });
});

export default router;
