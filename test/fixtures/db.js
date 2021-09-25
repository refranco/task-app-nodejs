const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const userOneId = mongoose.Types.ObjectId()

const userOne = {
	_id: userOneId,
	name: 'User 1',
	email:'user1.email@example.com',
	password:'564What!',
	tokens:[{
		token: jwt.sign({_id:userOneId}, process.env.JWT_SECRET)
	}]
}

const setupDatabase = async () =>{
	await User.deleteMany()
	await new User(userOne).save()
}

const closeDatabase = () => {
	mongoose.connection.close()
}

module.exports = {
	userOneId,
	userOne,
	setupDatabase,
	closeDatabase
}