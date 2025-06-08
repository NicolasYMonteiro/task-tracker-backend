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
  origin: [
    'https://task-tracker-frontend-nine.vercel.app',
    'https://task-tracker-frontend-nicolas-yans-projects.vercel.app',
    'https://task-tracker-frontend-git-main-nicolas-yans-projects.vercel.app'
  ],  
  credentials: true               
}));

app.use(helmet());

app.use('/user', userRoutes);
app.use('/task', taskRoutes);

app.get('/', (req, res) => {
  res.send('API está rodando!');
});

export default app;