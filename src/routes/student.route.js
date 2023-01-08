import { Router } from 'express';
import multer from 'multer';
import auth from '../middlewares/auth.middleware.js';

import studentController from '../controllers/student.controller.js';
import homeController from '../controllers/home.controller.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

router.get('/', homeController.getHomeView);

router.get('/wish-list',auth.protect, studentController.getWishlistView);

router.get('/my-courses',auth.protect, studentController.getMyCoursesView);

router.get('/profile',auth.protect, studentController.getProfileView);

router.route('/edit-profile').post(studentController.updateInformation);

router.post(
  '/upload-profile-image',
  upload.single('image'),
  studentController.uploadProfileImage
);


export default router;
