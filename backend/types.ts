import type { NextFunction, Request, Response } from 'express';

export interface Book {
  id: string;
  title: string;
  author: string;
}

export interface User {
  username: string;
  password: string;
  favorites: string[];
}

export interface AuthenticatedUser {
  username: string;
  iat?: number;
  exp?: number;
}

export type AuthenticateToken = (req: Request, res: Response, next: NextFunction) => void;

export interface RouterDeps {
  usersFile: string;
  booksFile: string;
  readJSON: <T>(file: string) => T;
  writeJSON: <T>(file: string, data: T) => void;
  authenticateToken: AuthenticateToken;
  SECRET_KEY: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}