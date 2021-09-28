const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {testUserID,userOneId, userOne, 
	setupDatabase, closeDatabase, userTwo} = require('./fixtures/db')

beforeEach(setupDatabase)

//CREATE
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

test('Should not signup user with invalid name/email/password', async () =>{
	var response = await request(app).post('/users').send({
			_id:testUserID,
			name: '',  // ********** wrong name field
			email:'correctemail@example.com',
			password: 'mysuperpassw22'
		})
		.expect(400)
		//Advance assertion
		expect(await User.findById(testUserID)).toBeNull()
	
	var response = await request(app).post('/users').send({
		_id:testUserID,
		name: 'Gerardo M.',
		email: userTwo.email, // ************ no unique email
		password: 'mysuperpassw22'
		})
		.expect(400)
		//Advance assertion
		expect(await User.findById(testUserID)).toBeNull()

	var response = await request(app).post('/users').send({
		_id:testUserID,
		name: 'Gerardo M.',
		email: 'correctemail@example.com', 
		password: 'myPassword42!' // ****** invalid word 'password'
		})
		.expect(400)
		//Advance assertion
		expect(await User.findById(testUserID)).toBeNull()


})

// LOG IN
test('Existing user should log in', async () =>{
	 const response = await request(app).post('/users/login').send({
		email:userOne.email,
		password:userOne.password
	  }).expect(200)
	  
	  //Advance Asser: expect the creation of a second token
	//   const loggedUser = await User.findById(userOneId)
	  const loggedUser = await User.findOne({_id:userOneId})
	  expect(loggedUser).not.toBeNull()
	  expect(response.body.token).toBe(loggedUser.tokens[1].token)

  })

  test('should fail for login', async () =>{
	  await request(app).post('/users/login').send({
		  email:'emmanuel@gmial.com',
		  password:'noesElPasswdss'
	  }).expect('Unable to log in, not email or password found or password incorrect')
  })
// READ
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

  // DELETE
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


// Funcionalidad para testear la carga/descarga de archivos
test('should upload avatar image', async () =>{
	await request(app)
	.post('/users/me/avatar')
	.set('Authorization',`Bearer ${userOne.tokens[0].token}`) //testeando autenticacion
	.attach('avatar', 'test/fixtures/profile-pic.jpg')
	.expect(200)
	
	//Advace Assertion: 
	const user = await User.findById(userOneId)
	expect(user.avatar).toEqual(expect.any(Buffer)) // chequeamos si la propiedad avatar guardada es del tipo binary data buffer
})

// UPDATE
test('Not update for no authenticated user', async ()=>{
	await request(app)
		.patch('/users/me')
		.send({
			name: 'User updated',
			email: 'secondnotemail@gmail.com'
		})
		.expect(400)
})

test('Not update invalid user fields', async ()=>{
	await request(app)
		.patch('/users/me')
		.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
		.send({
			location: 'atlanta'
		})
		.expect(400)
})

test ('not updates invalid name/email/password fields', async () =>{
	var response = await request(app).patch('users/me')
	.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
	.send({
		name: ' Esteban F.',
		email:'wrongemail'
	})
	.expect(405)

	var user = await User.findById(userOneId)
	expect(user.name).toBe('User 1')
})

test('updates valid user fields', async () =>{
	await request(app)
		.patch('/users/me')
		.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
		.send({
			name: 'User updated',
			email: 'secondnotemail@gmail.com'
		})
		.expect(200)
	
	const user = await User.findById(userOneId)
	expect(user.name).toEqual('User updated')
	expect(user.email).toEqual('secondnotemail@gmail.com')
	

})
afterAll(closeDatabase) // quitar mensaje en amarillo sobre working process...
