import express from 'express';

import courseController from '../controllers/course.controller.js';

const router = express.Router();

// admin - users

router.get('/:slug', courseController.getCourseDetail);
router.get('/:slug/related', courseController.getRelatedCourses);

export default router;
