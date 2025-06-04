import { Router } from 'express';
import { TaskController } from './task.controller';
import { ensureAuth } from '../../middlewares/ensureAuth';

const router = Router();
const controller = new TaskController();

router.use(ensureAuth);

router.post('/create', async (req, res) => {
  try {
    await controller.create(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar task.' });
  }
});

router.get('/listAll', async (req, res) => {
  try {
    await controller.listAll(req, res);
  } catch (error) {
    res.status(401).json({ message: 'Erro ao fazer task.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await controller.getById(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar task.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await controller.getById(req, res);
  } catch (error) {
    res.status(404).json({ message: 'Erro ao buscar task.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await controller.update(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar task.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await controller.delete(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao deletar task.' });
  }
});

export default router;
