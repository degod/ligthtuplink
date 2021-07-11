const mongoose = require('mongoose');
const passportLocalMongoose = require ('passport-local-mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	
	email: {type:String, unique:true, required:true},
	username: {type:String, unique:true, required:true},
	password: {type:String, required:true},
	// isVerified:{type:Boolean, default:false},
	passwordResetToken:String,
	passwordResetExpires:Date,
	isAdmin:{type:Boolean, default:false}
	
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.findAndValidate = async function (username, password) {
	const foundUser = await this.findOne({username});
	const isValid = await bcrypt.compare(password, foundUser.password);
	return isValid ? foundUser : false;
}

// const tokenSchema = new mongoose.Schema({
// 	_userId:{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
// 	token:{type: String, required: true},
// 	createdAt: {type: Date, required: true, dafault: Date.now, expires: 43200}
// });


const User = mongoose.model('User', UserSchema);
// const token = mongoose.model('token', tokenSchema);



module.exports = User;
// module.exports = token;