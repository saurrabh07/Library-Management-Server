import express from 'express';
import { getBooks, addBook, deleteBook } from '../controller/bookController.js';
import verifyToken, { isAdmin } from '../middlewares/verifyToken.js';

const router = express.Router();

// Routes
router.get('/home', verifyToken, getBooks);
router.post('/addBook', verifyToken, isAdmin, addBook);
router.post('/deleteBook', verifyToken , isAdmin , deleteBook);

export default router;
