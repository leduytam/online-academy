import express from 'express';

import HomeController from '../controllers/home.controller.js';

const router = express.Router();

router.get('/my-courses', HomeController.getMyCourses);
router.get('/', HomeController.get);
export default router;
