const passport = require("passport");
const User = require("../models/user");
const bcrypt = require('bcrypt');

module.exports = {
    
	 getRegister:  (req, res) => {
		res.render("register");
	},
	
	//handle sign up
	onCreateUser: async (req, res) => {
		const {password,username,email} = req.body;
		const hash = await bcrypt.hash(password, 12);
		User.findOne({email}).exec((err, user) => {
			if(user)
				{
					req.flash('fail', 'User with this email already exit!!!');
				return res.redirect('/register');
				}
		let newUser = new User({username,email,password:hash})
		 newUser.save((err, success)=>{
			if(err){
				console.log("Error in signup: ", err);
			} else {
				return res.redirect('/dashboard')
			}
		   
			});
		});
	},
	getLogin:  (req, res) => {
		res.render("login")
	},
	onGetUserByUsername: async (req, res) => {
	 const {username, password} = req.body;
		const foundUser = await User.findAndValidate(username, password);
		if(foundUser){
			req.session.user_id = foundUser._id
			req.flash('success','Login successfully as:')
			res.redirect("/dashboard")
		} 
		else {
			res.redirect("/login")	
		}
	},
	
}