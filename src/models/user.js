const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
		unique: true, // the user is has to be unique in all database
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
	},
	tokens: [{
		token: {
			type:String,
			required: true
		}
	}]
})


// ---------------------MIDDLEWARE FUNCTIONS ------------------------------------

// Hash the plain text password BEFORE saving user
userSchema.pre('save', async function (next) { //standard function as we need to use the binding 'this'
	const user = this
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})
// ----- FUNCTIONS FOR MODEL AND ISNTANCES -----------------------
userSchema.statics.findbyCredentials = async (email, password) => {
	const user = await User.findOne({email})

	if (!user) {
		throw new Error('Unable to log in, not email or password found or password incorrect')
	}

	const isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		throw new Error('Unable to log in')
	}

	return user
}

userSchema.methods.generateAuthToken = async function() {// standard function as we need to use the binding 'this'
	const user = this

	const token = jwt.sign({'_id':user._id.toString()},'unafrasealeatoria.cualquiera')
	user.tokens = user.tokens.concat({ token })
	await user.save()

	return token
}

const User = mongoose.model('User',userSchema)


module.exports = User;