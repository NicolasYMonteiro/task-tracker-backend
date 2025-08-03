import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';

import userRoutes from './modules/user/user.routes';
import taskRoutes from './modules/task/task.routes';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
  origin: `${process.env.CORS_ORIGIN}`, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposedHeaders: ['Set-Cookie'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet());

app.use('/user', userRoutes);
app.use('/task', taskRoutes);

app.get('/', (req, res) => {
  res.send('API está rodando!');
});

export default app;