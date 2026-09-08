import express from 'express';
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  patchStock,
  patchVisible,
  deleteProduct,
} from '../controllers/product.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/products
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.patch('/products/:id/stock', patchStock);
router.patch('/products/:id/visible', patchVisible);
router.delete('/products/:id', deleteProduct);

export default router;
