import express from 'express';
import multer from 'multer';

import ERole from '../constant/role.js';
import InstructorController from '../controllers/instructor.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

// course
router.post(
  '/create-course',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  upload.single('coverPhoto'),
  InstructorController.createCourse
);

router.post(
  '/:courseSlug/delete-course',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  InstructorController.deleteCourse
);

router.post(
  '/:courseSlug/update-course',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  upload.single('coverPhoto'),
  InstructorController.updateCourse
);

// section
router.post(
  '/:courseSlug/create-section',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  InstructorController.createSection
);

// lesson
router.post(
  '/:courseSlug/:sectionId/create-lesson',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  upload.single('video'),
  InstructorController.createLesson
);

export default router;
