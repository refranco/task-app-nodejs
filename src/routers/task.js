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
// GET /task?completed=true || false
router.get('/tasks',auth, async (req,res) =>{ //READ
	const match = {}
	if (req.query.completed==='true'){
		match.completed = true
	} else if (req.query.completed == 'false'){
		match.completed = false
	}
	console.log(match)
	try {
		await req.user.populate({
			path:'tasks',
			match:match
		}).execPopulate()

		//console.log(req.user.tasks)
		res.send(req.user.tasks)
	} catch (e) {
		res.status(500).send(e)
	}
	
})

router.get('/tasks/:id', auth, async (req,res) =>{ //DETAIL
	const _id = req.params.id
	try {
		const task = await Task.findOne({ _id, owner:req.user._id})

		if (!task) {
			return res.status(404).send('ERROR: not task found')
		}
		res.send(task)
	} catch (e) {
		res.status(500).send('Error in the server '+ res.statusCode)
	}
	
})


router.patch('/tasks/:id', auth, async (req,res) =>{

	// ------------------- update field validation -------------------
	

	const allowedUpdates = ['completed']
	const updates = Object.keys(req.body) // toma el body y devuelve todas sus propiedades en un array
	const validOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!validOperation){
		return res.status(400).send('invalid update field')
	}
	try {
		// ------------------- field x field update -------------------
		const _id = req.params.id
		const task = await Task.findOne({  _id, owner:req.user._id})
		//const task = await Task.findById(req.params.id)
		
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

router.delete('/tasks/:id', auth, async (req,res)=>{// DELETE 
	try {
		const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
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