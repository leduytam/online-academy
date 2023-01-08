import express from 'express';
import multer from 'multer';

import ERole from '../constant/role.js';
import InstructorController from '../controllers/instructor.controller.js';
import auth from '../middlewares/auth.middleware.js';
import gcsService from '../services/gcs.service.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

const router = express.Router();

router.get('/', InstructorController.get);

router.get('/profile', InstructorController.getInfo);

router.route('/edit-profile').post(InstructorController.updateInformation);

router.post(
  '/upload-profile-image',
  upload.single('image'),
  async (req, res, next) => {
    InstructorController.uploadProfileImage(req, res, next, gcsService);
  }
);
//  course
router.get(
  '/courses',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  InstructorController.getCoursesView
);
router.get(
  '/courses/:courseSlug',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  InstructorController.getCourseView
);

// section
router.get(
  'courses/:courseSlug/sections',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  InstructorController.getSectionsView
);

router.get(
  '/courses/:courseSlug/:sectionId',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  InstructorController.getSectionView
);

// lesson
router.get(
  '/courses/:courseSlug/:sectionId/:lessonSlug',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  InstructorController.getLessonView
);

export default router;
