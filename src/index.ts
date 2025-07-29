import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import roomRoutes from './routes/Room';
import userRoutes from './routes/User';
import { setupSwagger } from './swagger';

import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
setupSwagger(app);

app.use(cors({
  origin: '*',
  credentials: false,
}));

app.use('/rooms', roomRoutes);
app.use('/session', userRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || '').then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
