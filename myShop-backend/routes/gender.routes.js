import express from 'express';
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
router.get('/genders', getAllGenders);
router.post('/genders', transformGender, validateAddGender, addGender);
router.put('/genders/:id', transformGender, validateUpdGender, updateGender);
router.delete('/genders/:id', deleteGender);

export default router;
