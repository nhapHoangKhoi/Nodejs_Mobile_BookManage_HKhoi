import { Request } from 'express';

export interface AccountAdminRequest extends Request {
  user?: any;
}

export interface BookRequest extends Request {
  user?: any;
}