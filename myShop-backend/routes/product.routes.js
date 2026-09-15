import express from 'express';
import { verifyToken } from '../middlewares/verify.token.js';
import { transformProduct } from '../middlewares/transform.middleware.js';
import { validateAddProduct, validateUpdProduct } from '../middlewares/product.validation.js';
import {
  getAllProducts,
  getFirstProducts,
  getProductsByUserId,
  getProductsByIDs,
  getProductById,
  addProduct,
  updateProduct,
  patchPrice,
  patchStock,
  patchFavorite,
  patchVisible,
  deleteProduct,
} from '../controllers/product.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/products
router.get('/products', getAllProducts); // No token verification
router.get('/products/:maxCount/first', getFirstProducts); // No token verification
router.get('/products/:IDs/list', getProductsByIDs); // No token verification
router.get('/products/:id', getProductById); // No token verification
router.get('/products/:userId/user', verifyToken, getProductsByUserId);
router.post('/products', verifyToken, transformProduct, validateAddProduct, addProduct);
router.put('/products/:id', verifyToken, transformProduct, validateUpdProduct, updateProduct);
router.patch('/products/:id/price', verifyToken, transformProduct, validateUpdProduct, patchPrice);
router.patch('/products/:id/stock', verifyToken, transformProduct, validateUpdProduct, patchStock);
router.patch('/products/:id/favorite', verifyToken, transformProduct, validateUpdProduct, patchFavorite);
router.patch('/products/:id/visible', verifyToken, transformProduct, validateUpdProduct, patchVisible);
router.delete('/products/:id', verifyToken, deleteProduct);

export default router;
