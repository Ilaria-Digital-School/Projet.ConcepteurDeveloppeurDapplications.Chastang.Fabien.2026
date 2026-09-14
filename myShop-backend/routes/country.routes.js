import express from 'express';
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
router.get('/countries', getAllCountries);
router.post('/countries', transformCountry, validateAddCountry, addCountry);
router.put('/countries/:id', transformCountry, validateUpdCountry, updateCountry);
router.delete('/countries/:id', deleteCountry);

export default router;
