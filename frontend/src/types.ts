export interface Book {
  id: string;
  title: string;
  author: string;
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface UserState {
  token: string | null;
  username: string | null;
}

export interface CollectionState<T> {
  items: T[];
  status: RequestStatus;
}