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
exports.deleteTodo = exports.updateTodo = exports.addTodo = exports.getTodos = void 0;
const todo_1 = __importDefault(require("../../models/todo"));
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: use query params to filter todos where {status: true}
    const status = req.query.status === "true";
    try {
        const todos = yield todo_1.default.find({ status: status });
        res.status(200).json({ todos });
    }
    catch (error) {
        throw error;
    }
});
exports.getTodos = getTodos;
const addTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body; // as Pick<ITodo, "name" | "description" | "status" | "user">
        console.log("BODY: ", body);
        const todo = new todo_1.default({
            name: body.name,
            description: body.description,
            status: body.status,
            user: req.user._id
        });
        const newTodo = yield todo.save();
        res.status(201).json({ message: 'Todo added', todo: newTodo });
    }
    catch (error) {
        throw error;
    }
});
exports.addTodo = addTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO: make sure users can't update other users todos.
    try {
        const { params: { id }, body // type of body is implicitly ANY
         } = req;
        // check whether user updates his/her todo
        const todo = yield todo_1.default.findById(id);
        // console.log("USER ID: ", req.user._id.toString());
        // console.log("TODO USER: ", todo?.user.toString());
        if (todo !== null && req.user._id.toString() !== todo.user.toString())
            return res.status(422).json({ error: "Invalid id!" });
        const updateTodo = yield todo_1.default.findByIdAndUpdate({ _id: id }, body);
        res.status(200).json({
            message: 'Todo updated',
            todo: updateTodo
        });
    }
    catch (error) {
        throw error;
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("HERE!");
    //TODO: make sure users can't delete other users todos.
    const id = req.params.id;
    // check whether user updates his/her todo
    const todo = yield todo_1.default.findById(id);
    // console.log("USER ID: ", req.user._id.toString());
    // console.log("TODO USER: ", todo?.user.toString());
    if (todo !== null && req.user._id.toString() !== todo.user.toString())
        return res.status(422).json({ error: "Invalid id!" });
    try {
        const deletedTodo = yield todo_1.default.findByIdAndRemove(req.params.id);
        res.status(200).json({
            message: 'Todo deleted',
            todo: deletedTodo
        });
    }
    catch (error) {
        throw error;
    }
});
exports.deleteTodo = deleteTodo;
