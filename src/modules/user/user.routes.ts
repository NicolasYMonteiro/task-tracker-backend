import { Router } from 'express';
import { UserController } from './user.controller';
import { ensureAuth } from '../../middlewares/ensureAuth';

const router = Router();
const controller = new UserController();

router.post('/register', async (req, res) => {
  try {
    await controller.register(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    await controller.login(req, res);
  } catch (error) {
    res.status(401).json({ message: 'Erro ao fazer login.' });
  }
});

router.get('/', ensureAuth, async (req, res) => {
  try {
    await controller.getProfile(req, res);
  } catch (error) {
    res.status(404).json({ message: 'Erro ao buscar usuário.' });
  }
});

router.put('/', ensureAuth, async (req, res) => {
  try {
    await controller.update(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar usuário.' });
  }
});

router.delete('/', ensureAuth, async (req, res) => {
  try {
    await controller.delete(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao deletar usuário.' });
  }
});

export default router;
