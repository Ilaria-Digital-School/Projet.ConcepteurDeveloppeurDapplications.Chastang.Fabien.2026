import express from 'express';
import { verifyToken } from '../middlewares/verify.token.js';
import { transformCountry } from '../middlewares/transform.middleware.js';
import { validateAddCountry, validateUpdCountry } from '../middlewares/country.validation.js';
import {
  getAllCountries,
  addCountry,
  updateCountry,
  deleteCountry,
} from '../controllers/country.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/countries
router.get('/countries', getAllCountries); // No token verification
router.post('/countries', verifyToken, transformCountry, validateAddCountry, addCountry);
router.put('/countries/:id', verifyToken, transformCountry, validateUpdCountry, updateCountry);
router.delete('/countries/:id', verifyToken, deleteCountry);

export default router;
