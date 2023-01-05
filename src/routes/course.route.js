import express from 'express';

import CourseController from '../controllers/course.controller.js';

const router = express.Router();

router.get('/:id', CourseController.getCourseDetailView);

export default router;
