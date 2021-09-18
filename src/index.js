const express = require('express');
//cargar el archivo mongoose el cual conecta  a la base de datos.
require('./db/mongoose.js')

// cargando routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT  || 3000

const multer = require('multer')

const upl = multer({
	dest: './images', // destination folder to upload files
	limits: { // limitar toda clase de aspecto en el dispositivo
		fileSize: 1000000 // limit file size in bytes
	},
	fileFilter(req,file,cb) {
		if (!file.originalname.match(/\.(doc|docx)$/)){
		//if (!file.originalname.endsWith('.pdf')){
			return cb(new Error('File must be a word document')) 
		}
		cb(undefined, true)
	}
})
// set up and endpoint where we will upload files, then, using a function midleware in the middle of the endpoint
// to send the file: something_to_upload
app.post('/upload',upl.single('keyValue'), (req,res) =>{
	try{
		res.send('sent')
	}catch (e){
		res.send(e)
	}
})



app.use(express.json()) // line to parse incoming jason request as objects 

//setting up the router
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=> {
	console.log('Server is up on port '+ port)
})
