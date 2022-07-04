import express, { Express } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser';

import todoRoutes from './routes/todos'
import authRoutes from './routes/auth'

const app = express()

const PORT = process.env.PORT || 4000

app.use(bodyParser.json());
app.use(cors());

app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);

const uri = `mongodb://localhost:27017/TodosDemo`
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.set('useFindAndModify', false)

mongoose
    .connect(uri, options)
    .then(() =>
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        )
    )
    .catch((error: Error) => {
        throw error
    })
