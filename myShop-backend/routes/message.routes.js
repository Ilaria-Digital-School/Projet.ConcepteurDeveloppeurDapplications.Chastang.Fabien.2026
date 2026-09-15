import express from 'express';
import { verifyToken } from '../middlewares/verify.token.js';
import { transformMessage } from '../middlewares/transform.middleware.js';
import { validateAddMessage, validateUpdMessage } from '../middlewares/message.validation.js';
import {
  getMessagesByEmail,
  getMessageById,
  addMessage,
  updateMessage,
  patchDateRep,
  patchVisible,
  deleteMessage,
} from '../controllers/message.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/messages
router.get('/messages/:email/email', verifyToken, getMessagesByEmail);
router.get('/messages/:id', verifyToken, getMessageById);
router.post('/messages', verifyToken, transformMessage, validateAddMessage, addMessage);
router.put('/messages/:id', verifyToken, transformMessage, validateUpdMessage, updateMessage);
router.patch('/messages/:id/daterep', verifyToken, transformMessage, validateUpdMessage, patchDateRep);
router.patch('/messages/:id/visible', verifyToken, transformMessage, validateUpdMessage, patchVisible);
router.delete('/messages/:id', verifyToken, deleteMessage);

export default router;
