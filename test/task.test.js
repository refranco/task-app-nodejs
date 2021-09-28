const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {userOneId, userOne, userTwo, 
	testTaskID, task1User1, task2User1,task1User2, 
	setupDatabase, closeDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

// CREATE
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
	expect(task.completed).toEqual(false)
	
})

test('shoult not create task with invalid description complete', async ()=>{
	const response = await request(app)
		.post('/tasks')
		.set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
		.send({
			_id: testTaskID,
			description:'',
			owner: userTwo._id
		}).expect(400)

	//Advanced assertions: 
	const task = await Task.findById(testTaskID)
	expect(task).toBeNull();
})


// READ or GET
test('should get all task for authenticated user', async () =>{
	const response = await request(app).get('/tasks')
		.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)

		//Advance assertions
		expect(response.body.length).toEqual(2)
		
})

// DELETE
test('Shold not delete Task1User1 for User 2', async () =>{
	const task1Id = task1User1._id.toString()
	const response = await request(app)
		.delete('/tasks:'+task1Id)
		.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(404)

	const task = await Task.findById(task1Id)
	expect(task).not.toBeNull()
})

test('should delete user task1User1 for User 1', async () =>{
	const response = await request(app)
		.delete('/tasks/'+task1User1._id)
		.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
		.expect(200)

	//Advance assertion
	const task = await Task.findById(task1User1._id)
	expect(task).toBeNull()
	
})

// UPDATE
test('should update task for correct user', async () =>{
	const response = await request(app)
		.patch(`/tasks/${task1User1._id}`)
		.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
		.send({
			completed:true
		})
		.expect(200)

		//Advance assertions:
		const task = await Task.findById(task1User1._id)
		expect(task.completed).toBe(true)

})

test('should not update for unauthenticated user', async () =>{
	const response = await request(app)
		.patch(`/tasks/${task1User1._id}`)
		.send({
			completed:true
		})
		.expect(400)
		
	const task = await Task.findById(task1User1._id)
	expect(task.completed).toBe(false)
})

test('should not update task with invalid field', async () =>{
	const response = await request(app)
		.patch(`/tasks/${task1User1._id}`)
		.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
		.send({
			completed:'completo'
		})
		.expect(500)	
})


afterAll(closeDatabase)

