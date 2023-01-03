import { Router } from 'express';

import studentController from '../controllers/student.controller.js';

const router = Router();

router.get('/', studentController.getHomeView);

router.get('/my-courses', studentController.getMyCoursesView);

router.get('/wish-list', studentController.getWishlistView);

router.get('/lesson', studentController.getLessonView);

export default router;
