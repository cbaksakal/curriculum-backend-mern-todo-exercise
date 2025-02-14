"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = __importDefault(require("../config/keys"));
const user_1 = __importDefault(require("../models/user"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("HEADER: ", req.headers);
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        console.log("TOKEN: ", token);
        if (!token)
            return res.status(401).send('no token provided');
        //TODO: FIX "any" here too.
        const decoded = jsonwebtoken_1.default.verify(token, keys_1.default.SECRET_KEY);
        const user = yield user_1.default.findOne({ email: decoded.email });
        if (!user)
            return res.status(401).send('no such a user');
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).send('authentication failed!');
    }
});
exports.auth = auth;
