const mongoose = require('mongoose')

databaseName = 'task-manager-api'
mongoose.connect(process.env.MONGODB_URL+databaseName,{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true, // me lo pide la terminal por desactualizacion del server discovery
	useFindAndModify: false
})
