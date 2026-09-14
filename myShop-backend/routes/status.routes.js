import express from 'express';
import { transformStatus } from '../middlewares/transform.middleware.js';
import { validateAddStatus, validateUpdStatus } from '../middlewares/status.validation.js';
import {
  getAllStatus,
  addStatus,
  updateStatus,
  deleteStatus,
} from '../controllers/status.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/status
router.get('/status', getAllStatus);
router.post('/status', transformStatus, validateAddStatus, addStatus);
router.put('/status/:id', transformStatus, validateUpdStatus, updateStatus);
router.delete('/status/:id', deleteStatus);

export default router;
