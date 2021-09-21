const express = require('express'); // libreria para crear el servidors
require('./db/mongoose.js') //cargar el archivo mongoose el cual conecta  a la base de datos.

// cargando routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT

app.use(express.json()) // line to parse incoming jason request as objects 

//setting up the router
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=> {
	console.log('Server is up on port '+ port)
})


// HEROKU WEBSITE: https://refranco-task-app.herokuapp.com/