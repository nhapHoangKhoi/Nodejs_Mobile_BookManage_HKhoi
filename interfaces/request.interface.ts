import { Request } from 'express';

export interface UserRequest extends Request {
  user?: any;
}

export interface BookRequest extends Request {
  user?: any;
}