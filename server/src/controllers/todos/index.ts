import Todo, { ITodo } from '../../models/todo'
import { Request, Response } from 'express'

const getTodos = async (req: Request, res: Response) => {
    // TODO: use query params to filter todos where {status: true}
    
    // does not use auth, gets all todos wrt "status"
    const status = req.query.status === "true";
    try {
        const todos = await Todo.find( { status: status } );
        res.status(200).json({todos})
    } catch (error) {
        throw error
    }
}

const addTodo = async (req: Request, res: Response) => {

    try {
        const body: ITodo = req.body // as Pick<ITodo, "name" | "description" | "status" | "user">
        console.log("BODY: ", body);

        const todo = new Todo({
            name: body.name,
            description: body.description,
            status: body.status,
            user: req.user._id
        })

        const newTodo = await todo.save()

        res.status(201).json({message: 'Todo added', todo: newTodo})
    } catch (error) {
        throw error
    }
}

const updateTodo = async (req: Request, res: Response) => {
    //TODO: make sure users can't update other users todos.
    try {
        const {
            params: { id },
            body    // type of body is implicitly ANY
        } = req

        // check whether user updates his/her todo
        const todo  = await Todo.findById(id);
        // console.log("USER ID: ", req.user._id.toString());
        // console.log("TODO USER: ", todo?.user.toString());
        if (todo !== null && req.user._id.toString() !== todo.user.toString())
            return res.status(422).json({ error: "Invalid id!" });

        const updateTodo = await Todo.findByIdAndUpdate(
            {_id: id},
            body
        )

        res.status(200).json({
            message: 'Todo updated',
            todo: updateTodo
        })
    } catch (error) {
        throw error
    }
}

const deleteTodo = async (req: Request, res: Response) => {
    // console.log("HERE!");
    //TODO: make sure users can't delete other users todos.
    const id = req.params.id;

    // check whether user updates his/her todo
    const todo = await Todo.findById(id);
    // console.log("USER ID: ", req.user._id.toString());
    // console.log("TODO USER: ", todo?.user.toString());
    if (todo !== null && req.user._id.toString() !== todo.user.toString())
        return res.status(422).json({ error: "Invalid id!" });

    try {
        const deletedTodo = await Todo.findByIdAndRemove(
            req.params.id
        )
        res.status(200).json({
            message: 'Todo deleted',
            todo: deletedTodo
        })
    } catch (error) {
        throw error
    }
}

export { getTodos, addTodo, updateTodo, deleteTodo };