import express from 'express';

import courseController from '../controllers/course.controller.js';

const router = express.Router();

// admin - users

router.get('/:id', courseController.getCourseDetailApi);

export default router;
