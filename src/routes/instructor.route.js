import express from 'express';

import IntructorController from '../controllers/instructor.controller.js';

const router = express.Router();

router.get('/', IntructorController.get);

router.get('/profile', IntructorController.getInfo);

export default router;
