import { Request } from 'express';

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
export interface SignInUser extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface VerifyUser extends Request {
  body: {
    token: string;
    userId: string;
  };
}
