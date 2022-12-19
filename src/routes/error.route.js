import { Router } from 'express';

import errorController from '../controllers/error.controller.js';
import local from '../middlewares/local.middleware.js';

const router = Router();

router.get('/404', local.layout(true), errorController.getErrorNotFoundView);

router.get('/403', local.layout(true), errorController.getForbiddenErrorView);

router.get('/500', local.layout(true), errorController.getInternalErrorView);

export default router;
