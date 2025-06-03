import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'; // Ideal: usar variável de ambiente segura
const EXPIRES_IN = '7d';

interface Payload {
  userId: number;
}

export function generateToken(payload: Payload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): Payload {
  return jwt.verify(token, JWT_SECRET) as Payload;
}
