import { Request, Response } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../../middlewares/ensureAuth';
import { registerUserSchema, loginUserSchema, updateUserSchema } from './user.schema';
import { ZodError } from 'zod';

export class UserController {
  constructor(private readonly userService = new UserService()) { }

  async register(req: Request, res: Response) {
    try {
      const data = registerUserSchema.parse(req.body);
      const user = await this.userService.register(data);
      return res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const messages = error.issues.map(issue => issue.message);
        return res.status(400).json({ message: 'Erro de validação', details: messages });
      }
      res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const data = loginUserSchema.parse(req.body);
      const result = await this.userService.login(data);
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: process.env.COOKIE_DOMAIN,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      return res.status(200).json(result);
    } catch (error: any) {
      1
      if (error instanceof ZodError) {
        const messages = error.issues.map(issue => issue.message);
        return res.status(400).json({ message: 'Erro de validação', details: messages });
      }
      res.status(500).json({ message: 'Erro ao fazer login.' });
    }
  }

  /*async getById(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.userId);
      const user = await this.userService.getById(id);
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }*/

  // user.controller.ts
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.userId);
      const userProfile = await this.userService.getProfileData(id);

      if (!userProfile) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      return res.json(userProfile);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.userId);
      await this.userService.deleteUser(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.userId);
      const data = updateUserSchema.parse(req.body);
      const updated = await this.userService.updateUser(id, data);
      return res.json(updated);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const messages = error.issues.map(issue => issue.message);
        return res.status(400).json({ message: 'Erro de validação', details: messages });
      }
      res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
  }
}
