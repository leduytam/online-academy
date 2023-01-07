import { Router } from 'express';
import multer from 'multer';

import studentController from '../controllers/student.controller.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

router.get('/', studentController.getHomeView);

router.get('/profile', studentController.getProfileView);

router.route('/edit-profile').post(studentController.updateInformation);

router.post(
  '/upload-profile-image',
  upload.single('image'),
  async (req, res, next) => {
    studentController.uploadProfileImage(req, res, next, gcsService);
  }
);
router.post(
  '/upload-image',
  upload.single('image'),
  studentController.uploadImage
);

export default router;
