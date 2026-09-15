import express from 'express';
import { verifyToken } from '../middlewares/verify.token.js';
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
router.get('/status', getAllStatus); // No token verification
router.post('/status', verifyToken, transformStatus, validateAddStatus, addStatus);
router.put('/status/:id', verifyToken, transformStatus, validateUpdStatus, updateStatus);
router.delete('/status/:id', verifyToken, deleteStatus);

export default router;
