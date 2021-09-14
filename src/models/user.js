const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User',{
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


module.exports = User;