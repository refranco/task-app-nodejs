const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_APIKEY)

const sendWelcomeEmail = (name, email) =>{
	sgMail.send({
		to: email,
		from: 'estebanfrancobedoya@gmail.com',
		subject:`Welcome ${name}, thanks for joining in!`,
		text: ` Welcom to the app, ${name}. Let me know how you get alone with the app.`
	}).then(() => {
		console.log(`email sent to ${email}`)
	}).catch((err)=>{
		console.log('email sending error')
	})
}

const sendCancellationEmail = (name, email) =>{
	sgMail.send({
		to: email,
		from: 'estebanfrancobedoya@gmail.com',
		subject: `We are sad to see you leave ${name}`,
		text: `Dear ${name},\n\n It is sad to let you leave, we are interested to know`+
		 ' what we could improve to make your experience valued.\n\n Please let us know answering'+
		 " this email your recommendations.\n\n Esteban's Team."
	})
}

module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail
}