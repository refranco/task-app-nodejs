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
	await request(app).post('/users').send({
	    name: 'Esteban',
	    email: 'estebanfrancobedoya@gmail.com',
	    password: 'MyPass777!'
	}).expect(201)
  })


  test('Existing user should log in', async () =>{
	  await request(app).post('/users/login').send({
		email:userOne.email,
		password:userOne.password
	  }).expect(200)
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
  })

  test('fail delete account for unauthenticated user', async () =>{
	await request(app)
		.delete('/users/me')
	    .send()
	    .expect(400)
})

// afterAll(() => {
//     mongoose.connection.close();
// })