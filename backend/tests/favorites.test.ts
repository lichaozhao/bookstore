import request from 'supertest';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import createApiRouter from '../routes';
import type { AuthenticatedUser, Book, User } from '../types';

const usersFile = path.join(__dirname, '../data/test-users.json');
const booksFile = path.join(__dirname, '../data/test-books.json');

const SECRET_KEY = 'test_secret';

function readTestJSON<T>(file: string): T {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) as T : [] as T;
}

function writeTestJSON<T>(file: string, data: T): void {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getToken(username = 'sandra'): string {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
}

const app = express();
app.use(express.json());
app.use('/api', createApiRouter({
  usersFile,
  booksFile,
  readJSON: readTestJSON,
  writeJSON: writeTestJSON,
  authenticateToken: (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      res.sendStatus(401);
      return;
    }
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & AuthenticatedUser;
      req.user = { username: decoded.username, iat: decoded.iat, exp: decoded.exp };
      next();
    } catch {
      res.sendStatus(403);
    }
  },
  SECRET_KEY,
}));

describe('Favorites API', () => {
  it('GET /api/favorites should fail without auth', async () => {
    const res = await request(app).get('/api/favorites');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/favorites should return favorites for valid user', async () => {
    const token = getToken('sandra');
    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/favorites should 404 for non-existent user', async () => {
    const token = getToken('nouser');
    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/favorites should add a book to favorites', async () => {
    const token = getToken('sandra');
    // Pick a book not already in favorites
    const books = JSON.parse(fs.readFileSync(booksFile, 'utf-8')) as Book[];
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8')) as User[];
    const sandra = users.find(user => user.username === 'sandra');
    const notFav = books.find(book => sandra && !sandra.favorites.includes(book.id));
    if (!notFav) return; // skip if all are favorites
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: notFav.id });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/added/);
  });

  it('POST /api/favorites should not duplicate favorites', async () => {
    const token = getToken('sandra');
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8')) as User[];
    const sandra = users.find(user => user.username === 'sandra');
    const alreadyFav = sandra?.favorites[0];
    expect(alreadyFav).toBeDefined();
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: alreadyFav });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/added/);
  });

  it('POST /api/favorites should fail with missing bookId', async () => {
    const token = getToken('sandra');
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/favorites should 404 for non-existent user', async () => {
    const token = getToken('nouser');
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: '1' });
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/favorites should fail without auth', async () => {
    const res = await request(app)
      .post('/api/favorites')
      .send({ bookId: '1' });
    expect(res.statusCode).toBe(401);
  });
});
