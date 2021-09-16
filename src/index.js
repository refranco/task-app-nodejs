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

// creating middleware functions --------------------------
// functions here will run in every single route and url the cliente requests

// app.use( (req, res, next) => { // a small example
// 	console.log(req.method, req.path)
// 	next() // without next thes function will never end and will go to another function.
// })


// app.use( (req, res, next) => { 
// 	if (req.method === 'GET') {
// 		res.send('GET requests are disable')
// 	} else {
// 		next()
// 	}
// })
// ----------------------------------------------------------
// ----------     maintenance mode     ---------------
// app.use( (req, res, next)=>{
// 	res.status(503).send('Website is on maintenance')
// }) // ----------------------------------------------------------


app.use(express.json()) // line to parse incoming jason request as objects 

//setting up the router
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=> {
	console.log('Server is up on port '+ port)
})
