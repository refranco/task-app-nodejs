const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const testUserID = mongoose.Types.ObjectId()
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

const userTwoId = mongoose.Types.ObjectId()
const userTwo= {
	_id: userTwoId,
	name: 'User 2',
	email:'user2.email@example.com',
	password:'newUser99@',
	tokens:[{
		token: jwt.sign({_id:userTwoId}, process.env.JWT_SECRET)
	}]
}

const testTaskID = mongoose.Types.ObjectId()

const task1User1 = {
	_id: new mongoose.Types.ObjectId(),
	description:"task de ejemplo User 1",
	completed:false,
	owner: userOneId
}

const task2User1 = {
	_id: new mongoose.Types.ObjectId(),
	description:"task 2 User 1",
	completed:true,
	owner: userOneId
}

const task1User2= {
	_id: new mongoose.Types.ObjectId(),
	description:"task de ejemplo User 2",
	completed:true,
	owner: userTwoId
}

const setupDatabase = async () =>{
	await User.deleteMany()
	await Task.deleteMany()
	await new User(userOne).save()
	await new User(userTwo).save()
	await new Task(task1User1).save()
	await new Task(task2User1).save()
	await new Task(task1User2).save()
}

const closeDatabase = () => {
	mongoose.connection.close()
}

module.exports = {
	testUserID,
	userOneId,
	userOne,
	userTwo,
	testTaskID,
	task1User1,
	task2User1,
	task1User2,
	setupDatabase,
	closeDatabase
}