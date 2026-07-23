import express from 'express';
import * as authMiddleware from '../middlewares/authMiddleware.js';
import * as mediaController from '../controllers/mediaController.js';
import validate from '../middlewares/validateFields.js';
import {
  mediaUrlSchema,
  downloadMediaSchema,
} from '../validations/downloadValidation.js';

const router = express.Router();

router.use(authMiddleware.authenticateUser);

router
  .route('/info')
  .get(validate(mediaUrlSchema, 'query'), mediaController.getInfo);
router
  .route('/download')
  .post(validate(downloadMediaSchema), mediaController.downloadMedia);

export default router;
