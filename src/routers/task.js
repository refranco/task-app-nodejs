const express = require('express');
const auth = require('../middleware/authentication')

const router = new express.Router();
// CARGANDO MODEL
const Task = require('../models/task')

// ------------ TASK CRUD -------------------------------
router.post('/tasks', auth, async (req,res)=>{ //CREATE

	const task = new Task({
		...req.body,  // estamos copiando todas las propiedades que tiene req.body
		owner: req.user._id
	});
	try {
		
		await task.save()	
		res.status(201).send('New task created\n'+task)
	} catch (e) {
		res.status(400).send(e)
	}
	
})

router.get('/tasks',async (req,res) =>{ //READ

	try {
		const tasks = await Task.find({})
		console.log(tasks.length+' Tasks retrieved')
		res.send(tasks)
	} catch (e) {
		res.status(500).send(e)
	}
	
})

router.get('/tasks/:id', async (req,res) =>{ //DETAIL

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


router.patch('/tasks/:id', async (req,res) =>{

	// ------------------- update field validation -------------------
	const allowedUpdates = ['completed']
	const updates = Object.keys(req.body) // toma el body y devuelve todas sus propiedades en un array
	const validOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!validOperation){
		return res.status(400).send('invalid update field')
	}
	try {
		// ------------------- field x field update -------------------
		const task = await Task.findById(req.params.id)
		
		if (!task) {
			return res.status(404).send('Task did not found')
		}

		updates.forEach((update) => task[update] = req.body[update])
		await task.save()
		
		res.send(task)
	} catch (e) {
		console.log(e)
		res.status(500).send('Sever Error')
	}
})

router.delete('/tasks/:id', async (req,res)=>{// DELETE 
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

module.exports = router