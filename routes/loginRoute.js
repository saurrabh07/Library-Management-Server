import express from 'express';
import { login } from '../controller/authController.js';

const router = express.Router();

// login route
router.post('/', login);

export default router;
