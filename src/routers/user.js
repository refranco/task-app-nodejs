const express = require('express');
const router = express.Router();

// MODEL
const User = require('../models/user');


// ------------ USER CRUD -------------------------------
router.post('/users',async (req,res)=> {// sending request to path /user via POST method
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

router.get('/users', async (req,res)=>{

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

router.get('/users/:id', async (req,res) =>{

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

router.patch('/users/:id', async (req,res) =>{// UPDATE

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

router.delete('/users/:id', async (req,res) =>{ //DELETE
	try {
		const user = await User.findByIdAndDelete(req.params.id)

		if (!user) {
			return res.status(404).send()
		}
		console.log('Deleted user: '+user.name)
		res.send(user)
	} catch (e) {
		res.status(500).send()
	}

})

module.exports = router