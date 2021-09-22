const request = require('supertest')
const app = require('../src/app')
//const mongoose = require('mongoose')

const User = require('../src/models/user')

const userOne = {
	name: 'User 1',
	email:'user1.email@example.com',
	password:'564What!'
}
beforeEach( async () => {
	await User.deleteMany()
	console.log('pase por aqui')
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

  test('should fail for logint', async () =>{
	  await request(app).post('/users/login').send({
		  email:'emmanuel@gmial.com',
		  password:'noesElPasswdss'
	  }).expect('Unable to log in, not email or password found or password incorrect')
  })

// afterAll(() => {
//     mongoose.connection.close();
// })