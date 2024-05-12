const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bccrypt=require("bcrypt");
const passport = require("../config/passport");


router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));




router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
 
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "All fields required" });
    }
    if (password !== password2) {
        errors.push({ msg: "Passwords do not match" });
    }
    if (password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters" });
    }
    
    if (errors.length > 0) {
        console.log(errors);
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: "Email is already registered" });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                // Create new user
                const newUser = new User({
                    name,
                    email,
                    password
                });
                // HAsg PAssword
                bccrypt.genSalt(10,(err,salt)=>
                {
                    bccrypt.hash(newUser.password,salt,(err,hash)=>
                    {
                        if(err) throw err;
                        // set password to hashed
                        newUser.password=hash
                        // save the new user to the mongodb
                        newUser.save().then(user => {
                            // Redirect to login page or do something else
                            req.flash('success_msg',"You are now registered and can login")
                            res.redirect('/users/login');
                        }).catch(err => {
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                        });
                    })
                })
                // Save the new user
                
            }
        }).catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
    }
});
 

router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard', // Redirect to dashboard upon successful login
        failureRedirect: '/users/login', // Redirect back to login page if authentication fails
        failureFlash: true // Enable flash messages for authentication failures
    })(req, res, next);
});  

module.exports = router;
