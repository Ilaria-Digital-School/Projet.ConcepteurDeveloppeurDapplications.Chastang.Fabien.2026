import express from 'express';
import { verifyToken } from '../middlewares/verify.token.js';
import { transformUser } from '../middlewares/transform.middleware.js';
import { validateAddUser, validateUpdUser } from '../middlewares/user.validation.js';
import {
  getAllUsers,
  getUserById,
  login,
  addUser,
  addUsers,
  updateUser,
  patchEmail,
  patchPassword,
  patchRole,
  patchVisible,
  deleteUser,
} from '../controllers/user.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/users
router.get('/users', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getUserById);
router.post('/users/login', login); // No verification
router.post('/users/signup', transformUser, validateAddUser, addUser); // No token verification
router.post('/users/mutiple', addUsers); // Add multiple users, useful for a back-office application, no verification
router.put('/users/:id', verifyToken, transformUser, validateUpdUser, updateUser);
router.patch('/users/:id/email', verifyToken, transformUser, validateUpdUser, patchEmail);
router.patch('/users/:id/password', verifyToken, transformUser, validateUpdUser, patchPassword);
router.patch('/users/:id/role', verifyToken, transformUser, validateUpdUser, patchRole);
router.patch('/users/:id/visible', verifyToken, transformUser, validateUpdUser, patchVisible);
router.delete('/users/:id', verifyToken, deleteUser);

export default router;
