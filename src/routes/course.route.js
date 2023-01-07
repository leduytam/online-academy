import { Router } from 'express';

import courseController from '../controllers/course.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:slug', courseController.getCourseDetailView);
router.get('/:slug/checkout', auth.protect, courseController.getCheckoutPage);

router.get(
  '/:courseSlug/lessons',
  auth.protect,
  courseController.getLessonView
);

router.get(
  '/:courseSlug/lessons/:lessonSlug',
  auth.protect,
  courseController.getLessonView
);

router.get('/:courseSlug/reviews', courseController.getReviews);

router.post('/:courseSlug/reviews', auth.protect, courseController.cudReview);

export default router;
