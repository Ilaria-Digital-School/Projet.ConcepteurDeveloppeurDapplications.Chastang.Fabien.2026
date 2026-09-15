import express from 'express';
import { verifyToken } from '../middlewares/verify.token.js';
import { transformInterest } from '../middlewares/transform.middleware.js';
import { validateAddInterest, validateUpdInterest } from '../middlewares/interest.validation.js';
import {
  getAllInterests,
  addInterest,
  updateInterest,
  deleteInterest,
} from '../controllers/interest.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/interests
router.get('/interests', getAllInterests); // No token verification
router.post('/interests', verifyToken, transformInterest, validateAddInterest, addInterest);
router.put('/interests/:id', verifyToken, transformInterest, validateUpdInterest, updateInterest);
router.delete('/interests/:id', verifyToken, deleteInterest);

export default router;
