import express, { type Request, type Response } from 'express';
import type { Book, RouterDeps, User } from '../types';

type FavoritesRouterDeps = Pick<RouterDeps, 'usersFile' | 'booksFile' | 'readJSON' | 'writeJSON' | 'authenticateToken'>;

function createFavoritesRouter({ usersFile, booksFile, readJSON, writeJSON, authenticateToken }: FavoritesRouterDeps): express.Router {
  const router = express.Router();

  router.get('/', authenticateToken, (req: Request, res: Response) => {
    const username = req.user?.username;
    if (!username) {
      return res.sendStatus(401);
    }
    const users = readJSON<User[]>(usersFile);
    const user = users.find(candidate => candidate.username === username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const books = readJSON<Book[]>(booksFile);
    const favorites = books.filter(book => user.favorites.includes(book.id));
    res.json(favorites);
  });

  router.post('/', authenticateToken, (req: Request, res: Response) => {
    const username = req.user?.username;
    if (!username) {
      return res.sendStatus(401);
    }
    const { bookId } = req.body as { bookId?: string };
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID required' });
    }
    const users = readJSON<User[]>(usersFile);
    const user = users.find(candidate => candidate.username === username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.favorites.includes(bookId)) {
      user.favorites.push(bookId);
      writeJSON(usersFile, users);
    }
    res.status(200).json({ message: 'Book added to favorites' });
  });

  return router;
}

export default createFavoritesRouter;
