import express from 'express';
import multer from 'multer';

import ERole from '../constant/role.js';
import instructorController from '../controllers/instructor.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

router.post(
  '/create-course',
  auth.protect,
  auth.restrictTo(ERole.INSTRUCTOR),
  upload.single('coverPhoto'),
  instructorController.createCourse
);

export default router;
