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

router.get('/wish-list', studentController.getWishlistView);

router.get('/my-courses', studentController.getMyCoursesView);

router.get('/lesson', studentController.getLessonView);
router.get('/profile', studentController.getProfileView);

router.route('/edit-profile').post(studentController.updateInformation);

router.post(
  '/upload-profile-image',
  upload.single('image'),
  studentController.uploadProfileImage
);

router.post('/add-wish-list', studentController.addWishList);

export default router;
