const express = require ('express');
const path = require('path');
const http = require('http');
const mongoose = require ('mongoose');
const passport = require ('passport');
const LocalStrategy = require ('passport-local');
const passportLocalMongoose = require ('passport-local-mongoose');
const bodyParser = require ('body-parser');
const flash = require ('connect-flash');
const nodemailer = require ('nodemailer');
const session = require('express-session');
const expressValidator = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const crypto = require ('crypto');
const async = require('async');
const bcrypt = require('bcrypt');

require('dotenv').config();


const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));


const databaseDb = require ("./config/mongo");

const userRouter = require ("./routes/user"); 

const User = require("./models/user")


const port = process.env.PORT || '3000';

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());

app.use(session({
	secret:'saveforme',
	resave:false,
	saveUninitialized: true
}));

	app.use(passport.initialize());
	app.use(passport.session());
	passport.use(new LocalStrategy(User.authenticate()));
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());


	app.use(flash());

	
	app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.messages = req.flash("fail");
	next();
});

app.use("/", userRouter);


app.set("port", port);

app.get('/', function(req, res){
	res.render("index");
});
app.get('/pay-bills', function(req, res){
	res.render("pay-bills");
});
app.get('/about', function(req, res){
	res.render("about");
});
app.get('/contact', function(req, res){
	res.render("contact");
});
app.get('/indexTesting', function(req, res){
	res.render("page-starter");
});
app.get('/dataConfirmation/', function(req, res){
	let transactionId = uuidv4();
	let status = "initiated";
	res.render("dataConfirmation",{status:status,transId:transactionId});
});
app.get('/airtimeConfirmation', function(req, res){
	let transactionId = uuidv4();
	let status = "initiated";
	res.render("airtimeConfirmation", {status:status,transId:transactionId});
});
app.get('/tvSubConfirmation', function(req, res){
	let transactionId = uuidv4();
	let status = "initiated";
	res.render("tvSubConfirmation",{status:status,transId:transactionId});
});
app.get('/electricityBillConfirmation', function(req, res){
	let transactionId = uuidv4();
	let status = "initiated";
	res.render("electricityBillConfirmation",{status:status,transId:transactionId});
});
app.get('/airtel', function(req, res){
	res.render("airtel");
});
app.get('/9mobile', function(req, res){
	res.render("9mobile");
});
app.get('/mtn', function(req, res){
	res.render("mtn");
});
app.get('/glo', function(req, res){
	res.render("glo");
});
app.get('/airtelCredit', function(req, res){
	res.render("airtelCredit");
});
app.get('/mtnCredit', function(req, res){
	res.render("mtnCredit");
});
app.get('/gloCredit', function(req, res){
	res.render("gloCredit");
});
app.get('/9mobileCredit', function(req, res){
	res.render("9mobileCredit");
});
app.get('/dstv', function(req, res){
	res.render("dstv");
});
app.get('/gotv', function(req, res){
	res.render("gotv");
});
app.get('/startimes', function(req, res){
	res.render("startimes");
});
app.get('/ikedc', function(req, res){
	res.render("ikedc");
});
app.get('/ekedc', function(req, res){
	res.render("ekedc");
});
app.get('/aedc', function(req, res){
	res.render("aedc");
});
app.get('/kedco', function(req, res){
	res.render("kedco");
});
app.get('/jedc', function(req, res){
	res.render("jedc");
});
app.get('/ibedc', function(req, res){
	res.render("ibedc");
});
app.get('/kaedco', function(req, res){
	res.render("kaedco");
});
app.get('/phed', function(req, res){
	res.render("phed");
});
app.get('/dashboard', function(req, res){
	if(!req.session.user_id) {
	return	res.redirect('/login')
	}
	res.render("dashboard");
});
app.get('/FAQs-Testimonials', function(req, res){
	res.render("FAQs-Testimonials");
});

app.post('/logout', (req,res) => {
		req.session.user_id = null;
		res.redirect('/login');
	});
app.get('/forgotPassword', function(req, res){
	res.render("forgotPassword");
});
app.post('/forgotPassword', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
		  console.log(user.email);
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgotPassword');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
			console.log(user)
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'dondannyster2@gmail.com',
          pass: process.env.GMAIL_PW
        },
      });
      var mailOptions = {
        to: user.email,
        from: 'info@lightuplink.com',
        subject: 'NoReply Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgotPassword');
  });
});

app.get('/reset/:token', function(req, res) {
  User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgotPassword');
    }
    res.render('reset', {
      token: req.params.token
    });
  });
});

app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
       User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
		
        const password = req.body.password;
		const hash = bcrypt.hash(password, 12);
		user.password = {password:hash};
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'dondannyster2@gmail.com',
          pass: process.env.GMAIL_PW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'info@lightuplink.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});
/** Create HTTP server */
const server = http.createServer(app);
/** Listen on provided port, on all network interfaces */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${port}/`)
})