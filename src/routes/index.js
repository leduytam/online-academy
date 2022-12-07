import express from 'express';

import homeRoute from './home.route.js';

const router = express.Router();

const routes = [
  {
    path: '/home',
    route: homeRoute,
  },
];

router.get('/', (req, res, next) => {
  res.redirect('/home');
});

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
