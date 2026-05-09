import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'node:path';
import createApiRouter from './routes';
import type { AuthenticatedUser } from './types';

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const SECRET_KEY = 'your_jwt_secret';

app.use(cors());
app.use(bodyParser.json());


const isTest = process.env.TEST_MODE === '1';
const dataDir = path.join(__dirname, '..', 'data');
const defaultBooksFile = path.join(dataDir, 'books.json');
const defaultUsersFile = path.join(dataDir, 'users.json');
const testBooksFile = path.join(dataDir, 'test-books.json');
const testUsersFile = path.join(dataDir, 'test-users.json');

if (isTest) {
  if (!fs.existsSync(testBooksFile)) {
    fs.copyFileSync(defaultBooksFile, testBooksFile);
  }

  if (!fs.existsSync(testUsersFile)) {
    fs.copyFileSync(defaultUsersFile, testUsersFile);
  }
}

const booksFile = isTest ? testBooksFile : defaultBooksFile;
const usersFile = isTest ? testUsersFile : defaultUsersFile;

function readJSON<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}
function writeJSON<T>(file: string, data: T): void {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err || !decoded || typeof decoded === 'string') {
      res.sendStatus(403);
      return;
    }

    const payload = decoded as JwtPayload & AuthenticatedUser;
    if (!payload.username) {
      res.sendStatus(403);
      return;
    }

    req.user = { username: payload.username, iat: payload.iat, exp: payload.exp };
    next();
  });
}



app.use('/api', createApiRouter({
  usersFile,
  booksFile,
  readJSON,
  writeJSON,
  authenticateToken,
  SECRET_KEY
}));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
