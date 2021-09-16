const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const taskSchema = mongoose.Schema({
	description:{
		type: String,
		required: true,
		trim: true
	},
	completed:{
		type: Boolean,
		required: false,
		default: false
	},
	owner: {
		type: mongoose.Schema.Types.ObjectID,
		required: true,
		ref: 'User'
	}
})

// ------ functions middleware --------------------------------
taskSchema.pre('save', async function(next){
	const task = this
	if (task.isModified('completed')){
		console.log('Task: '+task.description+', updated')}
	
	
	next()
} )
// ------------------------------------------------------------

const Task = mongoose.model('Task',taskSchema)

module.exports = Task;