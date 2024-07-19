import { verify } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getUserByUsername, addUser } from './db';

export const verifyUser = async (username: string, password: string): Promise<string | null> => {
  const user = await getUserByUsername(username);
  if (user && await compare(password, user.password)) {
    return user.id;
  }
  return null;
};

export const createUser = async (username: string, password: string) => {
  const hashedPassword = await hash(password, 10);
  return await addUser(username, hashedPassword);
};

export const generateToken = (username: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return sign({ username }, secret, { expiresIn: '1h' });
};

export const getCurrentUser = async (token: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    // Decodifica o token JWT para obter o username
    const decoded = verify(token, secret) as { username: string };

    // Busca o usuário na base de dados com o username decodificado
    const user = await getUserByUsername(decoded.username);

    if (user) {
      return {
        username: user.username,
        id: user.id
      };
    }

    throw new Error('User not found');
  } catch (error) {
    throw new Error('Invalid token or user not found');
  }
};