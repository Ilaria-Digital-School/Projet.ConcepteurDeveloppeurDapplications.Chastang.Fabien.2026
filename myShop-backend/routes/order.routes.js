import express from 'express';
import { verifyToken } from '../middlewares/verify.token.js';
import { transformOrder } from '../middlewares/transform.middleware.js';
import { validateAddOrder, validateUpdOrder } from '../middlewares/order.validation.js';
import {
  getAllOrders,
  getOrdersByUserId,
  getOrdersByIDs,
  getOrderById,
  addOrder,
  updateOrder,
  patchStatus,
  patchVisible,
  deleteOrder,
} from '../controllers/order.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/orders
router.get('/orders', verifyToken, getAllOrders);
router.get('/orders/:userId/user', verifyToken, getOrdersByUserId);
router.get('/orders/:IDs/list', verifyToken, getOrdersByIDs);
router.get('/orders/:id', verifyToken, getOrderById);
router.post('/orders', verifyToken, transformOrder, validateAddOrder, addOrder);
router.put('/orders/:id', verifyToken, transformOrder, validateUpdOrder, updateOrder);
router.patch('/orders/:id/status', verifyToken, transformOrder, validateUpdOrder, patchStatus);
router.patch('/orders/:id/visible', verifyToken, transformOrder, validateUpdOrder, patchVisible);
router.delete('/orders/:id', verifyToken, deleteOrder);

export default router;
