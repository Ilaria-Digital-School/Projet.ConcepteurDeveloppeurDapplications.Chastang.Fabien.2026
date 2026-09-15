import express from 'express';
import { verifyToken } from '../middlewares/verify.token.js';
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
router.get('/categories', getAllCategories); // No token verification
router.post('/categories', verifyToken, validateAddCategory, addCategory);
router.put('/categories/:id', verifyToken, transformCategory, validateUpdCategory, updateCategory);
router.delete('/categories/:id', verifyToken, deleteCategory);

export default router;
