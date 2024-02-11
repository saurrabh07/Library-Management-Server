import express from 'express';
import authRoutes from './routes/loginRoute.js';
import bookRoutes from './routes/bookRoute.js';
import dotenv from "dotenv" 

const app = express();
app.use(express.json());

dotenv.config();

// Routes middleware
app.use('/login', authRoutes);
app.use('/', bookRoutes);

const PORT = process.env.PORT || 8000;

// Port listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  