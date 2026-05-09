import express, { type Request, type Response } from 'express';
import type { Book, RouterDeps } from '../types';

type BooksRouterDeps = Pick<RouterDeps, 'booksFile' | 'readJSON'>;

function createBooksRouter({ booksFile, readJSON }: BooksRouterDeps): express.Router {
  const router = express.Router();

  router.get('/', (_req: Request, res: Response) => {
    const books = readJSON<Book[]>(booksFile);
    res.json(books);
  });

  return router;
}

export default createBooksRouter;
