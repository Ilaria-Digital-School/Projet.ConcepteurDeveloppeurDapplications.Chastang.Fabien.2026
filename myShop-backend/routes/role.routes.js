import express from 'express';
import { verifyToken } from '../middlewares/verify.token.js';
import { transformRole } from '../middlewares/transform.middleware.js';
import { validateAddRole, validateUpdRole } from '../middlewares/role.validation.js';
import {
  getAllRoles,
  addRole,
  updateRole,
  deleteRole,
} from '../controllers/role.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/roles
router.get('/roles', getAllRoles);
router.post('/roles', verifyToken, transformRole, validateAddRole, addRole);
router.put('/roles/:id', verifyToken, transformRole, validateUpdRole, updateRole);
router.delete('/roles/:id', verifyToken, deleteRole);

export default router;
