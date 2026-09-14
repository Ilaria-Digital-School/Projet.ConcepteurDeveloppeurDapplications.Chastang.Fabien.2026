import express from 'express';
import { transformCategory } from '../middlewares/transform.middleware.js';
import { validateAddCategory, validateUpdCategory } from '../middlewares/category.validation.js';
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/categories
router.get('/categories', getAllCategories);
router.post('/categories', validateAddCategory, addCategory);
router.put('/categories/:id', transformCategory, validateUpdCategory, updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
