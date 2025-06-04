import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import userRoutes from './modules/user/user.routes';
import taskRoutes from './modules/task/task.routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/user', userRoutes);
app.use('/task', taskRoutes);

app.get('/', (req, res) => {
  res.send('API está rodando!');
});

export default app;