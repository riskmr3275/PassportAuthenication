const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const flash=require('connect-flash')
const session=require("express-session")
const passport=require("passport")
const app = express();



const { connectToMongoDB } = require('./config/connect');

const PORT = process.env.PORT || 5000
app.use(express.urlencoded({ extended: false }));

require('./config/passport')(passport)

connectToMongoDB("mongodb://localhost:27017/passport").then(() => console.log("MongoDB Connected")).catch(err => console.log("Error While connecting MongoDB", err));

// express session middleware
app.use(session({
    secret: 'secret', // Change this to a secret key
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Enable session support

// cpnnect flash
app.use(flash())

// Global vars
app.use((req,res,next)=>
{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash("error_msg")
    next()
})


app.use("/", require("./Routes/index"))
// app.use(expressLayouts)
app.set("view engine", "ejs")

app.use("/users", require("./Routes/users"))






app.listen(PORT, () => console.log("Server Started in port number: ", PORT))