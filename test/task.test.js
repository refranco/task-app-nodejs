const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {userOneId, userOne, setupDatabase, closeDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () =>{
	const response = await 	request(app)
		.post('/tasks')
		.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
		.send({
			description:"Create my first test task"
		})
		.expect(201)
	//Advance Assertion: finding the task in the Database
	const task = await Task.findById(response.body._id)
	expect(task).not.toBeNull();
	console.log(task)
	expect(task.completed).toEqual(false)
})

afterAll(closeDatabase)