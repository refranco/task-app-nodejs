const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const mongoose = require('mongoose')

const User = require('../src/models/user')

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
beforeEach( async () => {
	await User.deleteMany()
	await new User(userOne).save()
})

// afterEach(async() =>{
// 	await User.deleteMany()
// })

test('Should signup a new user', async () => {
	const response = await request(app).post('/users').send({
	    name: 'Esteban',
	    email: 'noemaila@gmail.com',
	    password: 'MyPass777!'
	}).expect(201)

	// Advance Assert: that de database was changed correctly
	const user = await User.findById(response.body.user._id)
	expect(user).not.toBeNull()

	//Advance Assert:Assertions about the response
	expect(response.body).toMatchObject({
		user:{
			name: 'Esteban',
	    		email: 'noemaila@gmail.com',
		},
		token: user.tokens[0].token
	
	})

	//Advance Assert: expect password not stored in plain text
	expect(user.password).not.toBe('MyPass777!')
  })


  test('Existing user should log in', async () =>{
	 const response = await request(app).post('/users/login').send({
		email:userOne.email,
		password:userOne.password
	  }).expect(200)
	  
	  //Advance Asser: expect the creation of a second token
	  const loggedUser = await User.findById(userOneId)
	//   const loggedUser = await User.find({_id:userOneId})
	  expect(loggedUser).not.toBeNull()
	  expect(response.body.token).toBe(loggedUser.tokens[1].token)

  })

  test('should fail for login', async () =>{
	  await request(app).post('/users/login').send({
		  email:'emmanuel@gmial.com',
		  password:'noesElPasswdss'
	  }).expect('Unable to log in, not email or password found or password incorrect')
  })

  test('should get profile for user', async () =>{
	  await request(app)
	  	.get('/users/me')
		.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
  })

  test('should fail getting the profile for unauthenticated user', async () =>{
	  await request(app)
	  	.get('/users/me')
		.send()
		.expect(400)
  })

  test('Should delete account for user', async () =>{
	  await request(app)
	  	.delete('/users/me')
		.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)

		//Advace assertion: Validate user is removed
		const user = await User.findById(userOneId)
		expect(user).toBeNull()
  })

  test('fail delete account for unauthenticated user', async () =>{
	await request(app)
		.delete('/users/me')
	    .send()
	    .expect(400)
})

afterAll(() => { // quitar mensaje en amarillo sore working process...
    mongoose.connection.close();
})