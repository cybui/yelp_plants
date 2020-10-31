const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// Sign up - New
router.get('/signup', (req,res)=>{
	res.render('signup');
});

// Sign up - Create
router.post('/signup', async (req, res)=>{
	try{
		const newUser = await User.register(new User({
			username: req.body.username, 
			email: req.body.email}
		), req.body.password);
		
		req.flash("success", `Signed up as ${newUser.username}`);
				  
		passport.authenticate('local')(req,res,() =>{
			res.redirect('/plants');
		})
	}
	catch(err){
		console.log(err);
		res.send(err);
	}
	 
});

// Login - Show Form
router.get("/login", (req, res)=>{
	res.render('login');
});

// Login
router.post("/login", passport.authenticate('local', {
	successRedirect: '/plants',
	failureRedirect: '/login',
	failureFlash: true,
	successFlash: "Logged in successfully"
}));

// Logout
router.get('/logout', (req,res) =>{
	req.logout();
	req.flash("success", "You have been logged out");
	res.redirect('/plants');
});
module.exports = router;