import express from 'express';
import auth from '../middlewares/auth.middleware.js';

import studentController from "../controllers/student.controller.js";

const router = express.Router();

router.post('/wishlist', auth.protect, studentController.toggleWishList);

export default router;