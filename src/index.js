const express = require('express');
//cargar el archivo mongoose el cual conecta  a la base de datos.
require('./db/mongoose.js')

// cargando routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT  || 3000

app.use(express.json()) // line to parse incoming jason request as objects 

//setting up the router
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=> {
	console.log('Server is up on port '+ port)
})

const Task = require('./models/task')
const User = require('./models/user');

const main = async () =>{
	// ---- finding the owner info from a particular task --------------
	
	const task = await Task.findById('61437a0621e8b50e91e8e142')
	//console.log(task)

	// without USER/TASK relationship
	// const user = await User.findById(task.owner)
	// console.log(user)

	// with USER/TASK relationship marked in task.owner.ref
	const userPopulated = await task.populate('owner').execPopulate()
	console.log(userPopulated)


	// ------------ finding tasks for a particular user ---------------
	const userTask = await User.findById('614378904ce05508b41d6c64')
	console.log('before populatioan',userTask.tasks)

	await userTask.populate('tasks').execPopulate()
	console.log('after population', userTask.tasks)
}

main()