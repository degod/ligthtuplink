const mongoose = require ('mongoose');
const config = require ('./config/index.js'); 
const User = require("./models/user")

const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

mongoose.connection.on('connected', () => {
  console.log('Mongo has connected successfully')
})
mongoose.connection.on('reconnected', () => {
  console.log('Mongo has reconnected')
})
mongoose.connection.on('error', error => {
  console.log('Mongo connection has an error', error)
  mongoose.disconnect()
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongo connection is disconnected')
})

const u = new User({
	email:"foo@email.com",
	username:"kojo williams",
	password:"password"	
})

u.save()
	.then( u => {
	console.log(u)
})
.catch( e => {
	console.log(e)
})