import express from 'express';
import createAuthRouter from './auth';
import createBooksRouter from './books';
import createFavoritesRouter from './favorites';
import type { RouterDeps } from '../types';

function createApiRouter(deps: RouterDeps): express.Router {
  const router = express.Router();

  router.use('/', createAuthRouter(deps));
  router.use('/books', createBooksRouter(deps));
  router.use('/favorites', createFavoritesRouter(deps));

  return router;
}

export default createApiRouter;
