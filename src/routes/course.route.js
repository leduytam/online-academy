import { Router } from 'express';

import courseController from '../controllers/course.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:slug', CourseController.getCourseDetailView);

router.get(
  '/:courseSlug/lessons/:lessonSlug',
  auth.protect,
  courseController.getLessonView
);

router.get('/:courseSlug/reviews', courseController.getReviews);

export default router;

