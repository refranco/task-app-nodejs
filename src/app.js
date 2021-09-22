const express = require('express'); // libreria para crear el servidors
require('./db/mongoose.js') //cargar el archivo mongoose el cual conecta  a la base de datos.

// cargando routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();

app.use(express.json()) // line to parse incoming jason request as objects 
//setting up the router
app.use(userRouter)
app.use(taskRouter)

module.exports = app


// HEROKU WEBSITE: https://refranco-task-app.herokuapp.com/