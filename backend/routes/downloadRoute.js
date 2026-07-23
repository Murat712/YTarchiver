import express from 'express';
import * as authMiddleware from '../middlewares/authMiddleware.js';
import * as downloadController from '../controllers/downloadController.js';
import validate from '../middlewares/validateFields.js';

const router = express.Router();

//router.use(authMiddleware.authenticateUser);

router.route('/get-info').get(downloadController.getInfo);
router.route('/download').post(downloadController.downloadMedia);

export default router;
