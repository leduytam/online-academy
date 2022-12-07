import express from 'express';

import homeRoute from './home.route.js';

const router = express.Router();

const routes = [
  {
    path: '/',
    route: homeRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
