const express = require('express');
//cargar el archivo mongoose el cual conecta  a la base de datos.
require('./db/mongoose.js')

// cargando routers
const userRouter = require('./routers/user')

//cargando modelos
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT  || 3000

app.use(express.json()) // line to parse incoming jason request as objects 

//setting up the router
app.use(userRouter)


// ------------ TASK CRUD -------------------------------
app.post('/tasks', async (req,res)=>{ //CREATE

	try {
		const task = new Task(req.body);
		await task.save()
		res.status(201).send('New task created\n'+task)
	} catch (e) {
		res.status(400).send(e)
	}
	
})

app.get('/tasks',async (req,res) =>{ //READ

	try {
		const tasks = await Task.find({})
		console.log('Tasks retrieved')
		res.send(tasks)
	} catch (e) {
		res.status(500).send(e)
	}
	
})

app.get('/tasks/:id', async (req,res) =>{ //DETAIL

	try {
		const _id = req.params.id
		const task = await Task.findById(_id)
		if (!task) {
			return res.status(404).send('ERROR: any task found')
		}
		res.send(task)
	} catch (e) {
		res.status(500).send('Error in the server '+ res.statusCode)
	}
	
})


app.patch('/tasks/:id', async (req,res) =>{
	const allowedUpdates = ['completed']
	const updates = Object.keys(req.body) // toma el body y devuelve todas sus propiedades en un array
	const validOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!validOperation){
		return res.status(400).send('invalid update field')
	}
	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body,{
			new: true, 
			runValidators:true
		})
		if (!task) {
			return res.status(404).send('Task did not found')
		}
		console.log('Task: '+task.description+', updated')
		res.send(task)
	} catch (e) {
		console.log(e)
		res.status(500).send('Sever Error')
	}
})

app.delete('/tasks/:id', async (req,res)=>{// DELETE 
	try {
		const task = await Task.findByIdAndDelete(req.params.id)
		if (!task) {
			return res.status(404).send('Not task found')
		}

		console.log('Task deleted :'+ task.description)
		res.send(task)
	} catch (e) {
		res.status(500).send()
	}
})

app.listen(port, ()=> {
	console.log('Server is up on port '+ port)
})

