import { Router } from 'express';

import studentController from '../controllers/student.controller.js';

const router = Router();

router.get('/', studentController.getHomeView);

router.get('/profile', studentController.getProfileView);

export default router;
