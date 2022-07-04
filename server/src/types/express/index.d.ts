import express from "express";
import { ITodo } from "../../models/todo";
import { IUser } from '../../models/user';

declare global {
  namespace Express {
    interface Request {
      user: IUser
      // todo: ITodo
    }
  }
}