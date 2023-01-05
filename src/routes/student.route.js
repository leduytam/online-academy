import { Router } from 'express';

import studentController from '../controllers/student.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', studentController.getHomeView);

router.get('/courses/:courseSlug', (req, res) => {
  res.render('students/home');
});

router.get(
  '/courses/:courseSlug/lessons',
  auth.protect,
  studentController.getCourseLessonView
);

router.get(
  '/courses/:courseSlug/lessons/:lessonSlug',
  auth.protect,
  studentController.getCourseLessonView
);

router.get('/profile', studentController.getProfile);

export default router;
