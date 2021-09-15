const express = require('express');
//cargar el archivo mongoose el cual conecta  a la base de datos.
require('./db/mongoose.js')

// cargando routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


// //cargando modelos
// const User = require('./models/user');
// const Task = require('./models/task');

const app = express();
const port = process.env.PORT  || 3000

app.use(express.json()) // line to parse incoming jason request as objects 

//setting up the router
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=> {
	console.log('Server is up on port '+ port)
})

const jwt = require('jsonwebtoken')

const myFunction = async () =>{
	const token = jwt.sign({_id:'abc123'},'this_is_a_random_message') // authentication token that will be provided to a client to perform privilege task
	console.log(token)
}

myFunction()