const mongoose = require('mongoose')

databaseName = 'task-manager-api'
mongoose.connect('mongodb://127.0.0.1:27017/'+databaseName,{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true, // me lo pide la terminal por desactualizacion del server discovery
	useFindAndModify: false
})
