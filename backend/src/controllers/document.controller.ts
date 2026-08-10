import { Request, Response } from 'express';
import { ragService } from '../services/rag.service.js';

export const uploadDocument = async (req: Request, res: Response) => {
  const filename = req.file?.originalname || req.body.filename || 'Uploaded_Financial_Report.pdf';
  const textContent = req.body.text || 'Sample financial annual report content with operational highlights and risk disclosures.';

  const docId = await ragService.saveDocument(filename, textContent);
  res.status(201).json({
    documentId: docId,
    filename,
    message: 'Document successfully parsed, chunked, and embedded into vector storage.'
  });
};

export const queryDocument = async (req: Request, res: Response) => {
  const { query } = req.body;
  const { id } = req.params;

  const chunks = await ragService.searchDocument(query || '', id);
  res.json({
    query,
    chunks
  });
};
