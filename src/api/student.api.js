import express from 'express';

import studentController from "../controllers/student.controller.js";

const router = express.Router();

router.post('/wishlist', studentController.toggleWishList);

export default router;