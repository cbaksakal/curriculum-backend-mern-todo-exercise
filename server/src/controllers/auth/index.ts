import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import User, { IUser } from "../../models/user";
import keys from "../../config/keys";
import { Request, Response } from 'express'

//TODO: replace all "any" in all endpoints.
const signup = async (req: Request, res: Response) => {

    const { email, password, fullName } = req.body as Pick<IUser, "_id" | "fullName" | "email" | "password">;

    if (!email || !password || !fullName) {
        return res
            .status(400)
            .json({error: `all fields are required`, status: 'error'});
    }

    const user = await User.findOne({email: email});
    if (user) {
        return res
            .status(400)
            .json({error: `${email}: email already used`, status: 'error'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        email,
        password: hashedPassword,
        fullName: fullName
    });

    const payload = { email: req.body.email as Pick<IUser, "email"> };
    const token = jwt.sign(payload, keys.SECRET_KEY);

    res.json({token});
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as Pick<IUser, "_id" | "fullName" | "email" | "password">;

    if (!email || !password) {
        return res
            .status(400)
            .json({error: `email and password are required`, status: 'error'});
    }

    const user = await User.findOne({email});
    if (!user) {
        return res
            .status(400)
            .json({error: `no such an email`, status: 'error'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res
            .status(400)
            .json({error: `password is wrong`, status: 'error'});
    }

    const payload = { email: req.body.email as Pick<IUser, "email"> };
    const token = jwt.sign(payload, keys.SECRET_KEY);

    res.json({token});
}

export interface IToken {
    email: string;
}

export {signup, login}
