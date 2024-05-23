import express, { json } from 'express';
import connectDB from './config/db';
import passport, { initialize } from 'passport';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

require('dotenv').config();
require('./config/passport')(passport);

const app = express();
connectDB();

app.use(json());
app.use(initialize());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
