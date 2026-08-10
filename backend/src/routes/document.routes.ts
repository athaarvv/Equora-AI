import { Router } from 'express';
import multer from 'multer';
import { uploadDocument, queryDocument } from '../controllers/document.controller.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/upload', upload.single('file'), uploadDocument);
router.post('/:id/query', queryDocument);

export default router;
