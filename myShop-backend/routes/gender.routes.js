import express from 'express';
import { verifyToken } from '../middlewares/verify.token.js';
import { transformGender } from '../middlewares/transform.middleware.js';
import { validateAddGender, validateUpdGender } from '../middlewares/gender.validation.js';
import {
  getAllGenders,
  addGender,
  updateGender,
  deleteGender,
} from '../controllers/gender.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/genders
router.get('/genders', getAllGenders); // No token verification
router.post('/genders', verifyToken, transformGender, validateAddGender, addGender);
router.put('/genders/:id', verifyToken, transformGender, validateUpdGender, updateGender);
router.delete('/genders/:id', verifyToken, deleteGender);

export default router;
