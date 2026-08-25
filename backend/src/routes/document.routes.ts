import { Router } from 'express';
import multer from 'multer';
import { uploadDocument, queryDocument } from '../controllers/document.controller.js';

import os from 'os';
const upload = multer({ dest: os.tmpdir() });
const router = Router();

router.post('/upload', upload.single('file'), uploadDocument);
router.post('/:id/query', queryDocument);

export default router;
