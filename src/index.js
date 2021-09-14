const express = require('express');
//cargar el archivo mongoose el cual conecta  a la base de datos.
require('./db/mongoose.js')

//cargando modelos
const User = require('./models/user');
const Task = require('./models/task');
const app = express();
const port = process.env.PORT  || 3000


app.use(express.json()) // line to parse incoming jason request as objects 

// ------------ USER CRUD -------------------------------
app.post('/users',async (req,res)=> {// sending request to path /user via POST method
	//console.log(req.body) // req example with postman body set up.

	const user = new User(req.body);

	try {
		await user.save()
		res.status(201).send(user)
	} catch (e) {
		res.status(400).send(e)
	}
	// ------ traditional method with no async function ------------
	// user.save().then(() =>{
	// 	res.status(201).send(user)
	// }).catch((error) => {
	// 	res.status(400).send(error)
	// })
})

app.get('/users', async (req,res)=>{

	try {
		const users = await User.find({})
		console.log('users retrieved')
		res.send(users)
	} catch (e) {
		res.status(500).send()
	}
	// ------ traditional method with no async function ------------
	//  User.find({}).then((users)=>{
	// 	res.send(users)
	//  }).catch((e) =>{
	// 	res.status(500).send()
	//  })
})

app.get('/users/:id', async (req,res) =>{

	try {
		const _id = req.params.id
		const user = await User.findById(_id)
		if (!user) {
			return res.status(404).send('ERROR: any user found')
		}
		console.log(user)
		res.send(user)
	} catch (e) {
		res.status(500).send()
	}

	//const _id = req.params.id //req.params recoge en un objeto todos los parámetros pasado a la url
	
	// User.findById(_id).then((user)=>{
	// 	console.log(user)
	// 	if (!user) { // cuando no se encuentra un usuario con ese ID
	// 		return res.status(404).send('ERROR: any user found')
	// 	}
	// 	res.send(user)
	// }).catch((e) =>{
	// 	res.status(500).send('Error in the server '+ res.statusCode)
	// })
})

app.patch('/users/:id', async (req,res) =>{// UPDATE

	const updates = Object.keys(req.body) // toma el body y devuelve todas sus propiedades en un array
	const allowedUpdates = ['name','age','email','password']
	const validOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!validOperation) {
		return res.status(400).send('ERROR: invalid updated field' )
	}
	
	try {
		const id = req.params.id
		const user = await User.findByIdAndUpdate(id, req.body, {
			new: true, 
			runValidators:true
		 })
		if (!user) {
			return res.status(404).send('User not found')	
		}
		console.log('user '+user.name+' updated')
		res.send(user)
	} catch (e) {
		res.status(400).send(e)
	}
})
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


app.listen(port, ()=> {
	console.log('Server is up on port '+ port)
})

