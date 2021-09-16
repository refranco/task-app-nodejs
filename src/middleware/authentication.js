const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next)=> {

	try { // leo token the header, decodifico y compruebo que hay un usuario con ese token
		const token = req.header('Authorization').replace('Bearer ','')
		const decoded = jwt.verify(token, 'unafrasealeatoria.cualquiera')
		const user = await User.findOne({ _id: decoded._id, 'tokens.token':token})
		if (!user) {
			throw new Error  //this will trigger the catch (e)
		}
		req.token = token // token used for authentication
		req.user = user  // passing the user found to the request
		next() // ensuring route handler will go on
	} catch (e) {
		res.status(400).send({error:'Please authenticated.'})
	}
}


module.exports = auth