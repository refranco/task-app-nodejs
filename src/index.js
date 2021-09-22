const app = require('./app');
const port = process.env.PORT

app.listen(port, ()=> {
	console.log('Server is up on port '+ port)
})


// HEROKU WEBSITE: https://refranco-task-app.herokuapp.com/