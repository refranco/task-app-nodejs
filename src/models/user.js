const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const userSchema= mongoose.Schema({
	name:{
		type: String,
		required: true,
		trim: true,
		minLength : 3
	},
	email: {
		type:String,
		required: true,
		trim : true,
		lowercase: true,
		validate(value){
			if (!validator.isEmail(value)){
				throw new Error(value+' is not a valid email')
			}
		}
	},
	age:{
		type: Number,
		default: 0,
		required: false,
		validate(value){
			if (value < 0) {
				throw new Error('Age must be a positive number')
			}
		}
	},
	password:{
		type:String,
		required: true,
		trim: true,
		minLength: [7,'password lenght must be at least 7'],
		validate(value){
			if (validator.contains(value.toLowerCase(),'password')){
				throw new Error("Your password can't contains the word: 'password' ")
			}
		}
	}
})
// funcion middleware para ejecutar código ANTES de guardar el usuario
userSchema.pre('save', async function (next) {
	const user = this
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})

const User = mongoose.model('User',userSchema)


module.exports = User;