import express from 'express';
import multer from 'multer';

import InstructorController from '../controllers/instructor.controller.js';
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

export default router;
