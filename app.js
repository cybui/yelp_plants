//=======================================
// IMPORTS 
//=======================================

// NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

// Config Import 
try{
	var config = require("./config.js");
} catch (e){
	console.log("Could not import config!")
	console.log(e)
	
}

// Route Imports
const plantRoutes = require("./routes/plants");
const commentRoutes = require("./routes/comments");
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");

// Model Imports
const Plant = require("./models/plant");
const Comment = require("./models/comment");
const User = require("./models/user");


//=======================================
// DEVELOPMENT 
//=======================================
// Morgan
app.use(morgan('tiny'));

// Seed the DB
const seed = require('./utils/seed');
// seed();


//=======================================
// CONFIG 
//=======================================

// Body parser config
app.use(bodyParser.urlencoded({extended: true}));

// Connect to DB
try{
	mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
} catch(e){
	console.log("Could not connect using config.")
	console.log(e)
	console.log("end of error msg")
	mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
	console.log("Connected to db")
}

// Express config
app.set("view engine", "ejs");
app.use(express.static("public"));


// Express Session Config
app.use(expressSession({
	secret: process.env.ES_SECRET || config.expressSession.secret,
	resave: false,
	saveUninitalized: false
}));

// Method override config
app.use(methodOverride("_method"));

// Connect Flash 
app.use(flash());

// Passport config
app.use(passport.initialize());
app.use(passport.session()); // Allows persistent sessions 
passport.serializeUser(User.serializeUser()); // What data should be stored in session 
passport.deserializeUser(User.deserializeUser()); // Gets the user data from the stored session
passport.use(new LocalStrategy(User.authenticate()));  // Use the lcoal strategy

// State config
app.use((req, res, next) =>{
	res.locals.user = req.user;
	res.locals.errorMessage = req.flash("error");
	res.locals.successMessage = req.flash("success");
	next();
})

// Route config 
app.use("/",mainRoutes);
app.use("/", authRoutes);
app.use("/plants",plantRoutes);
app.use("/plants/:id/comments", commentRoutes);

//=======================================
// LISTEN 
//=======================================
app.listen(process.env.PORT || 3000, () => {
	console.log("yelp_plants is running...")
})
