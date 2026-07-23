import express from 'express';
import * as authMiddleware from '../middlewares/authMiddleware.js';
import * as mediaController from '../controllers/mediaController.js';
import validate from '../middlewares/validateFields.js';

const router = express.Router();

router.use(authMiddleware.authenticateUser);

router.route('/info').get(mediaController.getInfo);
router.route('/download').post(mediaController.downloadMedia);

export default router;
