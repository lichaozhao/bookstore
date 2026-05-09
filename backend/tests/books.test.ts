import request from 'supertest';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import createApiRouter from '../routes';

function readTestJSON<T>(file: string): T {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) as T : [] as T;
}

function writeTestJSON<T>(file: string, data: T): void {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const app = express();
app.use(express.json());
app.use('/api', createApiRouter({
  usersFile: path.join(__dirname, '../data/test-users.json'),
  booksFile: path.join(__dirname, '../data/test-books.json'),
  readJSON: readTestJSON,
  writeJSON: writeTestJSON,
  authenticateToken: (_req: Request, _res: Response, next: NextFunction) => { next(); },
  SECRET_KEY: 'test_secret',
}));

describe('Books API', () => {
  it('GET /api/books should return a list of books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/books should not be allowed', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: 'Test Book', author: 'Test Author' });
    expect([404, 405]).toContain(res.statusCode);
  });
});
