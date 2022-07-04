import jwt from 'jsonwebtoken';
import keys from "../config/keys";
import User from "../models/user";
import { Request, Response, NextFunction } from 'express'
import { IToken } from '../controllers/auth';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("HEADER: ", req.headers);
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log("TOKEN: ", token);
        if (!token) return res.status(401).send('no token provided');

        //TODO: FIX "any" here too.
        const decoded = jwt.verify(token, keys.SECRET_KEY) as IToken;

        const user = await User.findOne({email: decoded.email});
        if (!user) return res.status(401).send('no such a user');

        req.user = user;

        next();
    } catch (err) {
        res.status(401).send('authentication failed!');
    }
};