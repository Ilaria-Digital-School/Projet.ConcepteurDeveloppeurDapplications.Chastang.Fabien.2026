import express from 'express';
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
router.get('/interests', getAllInterests);
router.post('/interests', transformInterest, validateAddInterest, addInterest);
router.put('/interests/:id', transformInterest, validateUpdInterest, updateInterest);
router.delete('/interests/:id', deleteInterest);

export default router;
