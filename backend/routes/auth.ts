import express, { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import type { RouterDeps, User } from '../types';

function createAuthRouter({ usersFile, readJSON, writeJSON, SECRET_KEY }: RouterDeps): express.Router {
  const router = express.Router();

  router.post('/register', (req: Request, res: Response) => {
    const { username, password } = req.body as Partial<Pick<User, 'username' | 'password'>>;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    const users = readJSON<User[]>(usersFile);
    if (users.find(user => user.username === username)) {
      return res.status(409).json({ message: 'User already exists' });
    }
    users.push({ username, password, favorites: [] });
    writeJSON(usersFile, users);
    res.status(201).json({ message: 'User registered' });
  });

  router.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body as Partial<Pick<User, 'username' | 'password'>>;
    const users = readJSON<User[]>(usersFile);
    const user = users.find(candidate => candidate.username === username && candidate.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });

  return router;
}

export default createAuthRouter;
