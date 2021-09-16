const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentication')

// MODEL
const User = require('../models/user');


// ------------ USER CRUD -------------------------------
router.post('/users',async (req,res)=> {// sending request to path /user via POST method

	const user = new User(req.body);
	
	try {
		const token = await user.generateAuthToken()
		//await user.save()
		res.status(201).send({ user,token })
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

// ------ the users profile -------------------
router.get('/users/me', auth, (req,res) =>{
	res.send(req.user)
})

router.get('/users/:id', auth, async (req,res) =>{

	try {
		const _id = req.params.id
		const user = await User.findById(_id)
		if (!user) {
			return res.status(404).send('ERROR: any user found')
		}
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

	// ---- updates field validation ----------------
	const updates = Object.keys(req.body) // toma el body y devuelve todas sus propiedades en un array
	const allowedUpdates = ['name','age','email','password']
	const validOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!validOperation) {
		return res.status(400).send('ERROR: invalid updated field' )
	}
	
	// ------ field by field updating --------------------
	try {
		const id = req.params.id
		// ---- updating CON middleware function --------------
		const user = await User.findById(id)
		
		updates.forEach((update) => user[update] = req.body[update])
		await user.save()
		
		// ---- updating SIN middleware function --------------
		// const user = await User.findByIdAndUpdate(id, req.body, {
		// 	new: true, 
		// 	runValidators:true
		//  })

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

// -----------LOGIN/LOGOUT  USER -------------------
router.post('/users/login', async (req,res) =>{
	try {
		// crearemos una funcion reutilizable que tomará el email, encontrará al usuario por dicho email
		// comparará su password hasheado con el password que se tiene en la base de datos y permitirá el logueo
		const user = await User.findbyCredentials(req.body.email,req.body.password)
		const token = await user.generateAuthToken()
		res.send({user, token})
	} catch (e) {
		console.log(e)
		res.status(400).send(e.message)

	}
})

router.post('/users/logout', auth, async (req,res) =>{
	 // logout es lo mismo que eliminar el token de acceso de la lista de tokens del usuario,
	 // firltramos la lista de tokens del usuario, eliminando el token guardado en el request
	 // salvamos los cambios en el usuario y enivamos cualquier mensaje de confirmación si necesario
	 
	 try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token} )
		await req.user.save()
		res.send()

	 }catch (e) {
		 res.status(500).send()
	 }

})

router.post('/users/logoutAll', auth, async(req,res) =>{

	try {
		req.user.tokens = []
		await req.user.save()
		res.send(req.user)
	} catch (e) {
		res.status(500).send(e.message)
	}
})	 
module.exports = router