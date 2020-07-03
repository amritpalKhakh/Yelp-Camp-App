require('dotenv').config();
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
	passport = require("passport"),
    mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	passportLocalMongoose = require("passport-local-mongoose"),
	methodOverride = require("method-override"),
	flash = require("connect-flash")
	

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")

// seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp_v10",{useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret:"Rusty is the cutest dog",
	resave: false,
	saveUninitialized:false 
}));

app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);


app.listen(3000, function(){
	console.log('Server listening on Port 3000');
});

