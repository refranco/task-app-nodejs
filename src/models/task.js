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
	}
})

taskSchema.pre('save', async function(next){
	const task = this
	if (task.isModified('completed')){
		console.log('Task: '+task.description+', updated')}
	
	
	next()
} )


const Task = mongoose.model('Task',taskSchema)

module.exports = Task;