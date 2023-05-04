const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

// User Model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res)=> {
    res.render('Login');
});

// Register Page
router.get('/register', (req, res)=> {
    res.render('Register')
});

// Register
router.post('/register', (req, res)=> {
    const {name, email, password} = req.body;
    let errors = [];

    if(!name || !email || !password){
        errors.push({
            msg: 'Please enter all the fields'
        })
    };

    if(password.length < 6){
        errors.push({
            msg: 'Password length must be at least 6 characters'
        })
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password
        })
    }else {
        User.findOne({ email: email})
            .then(user=> {
                if(user){
                    errors.push({msg: 'User already exist'});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password
                    })
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt)=> {
                        bcrypt.hash(newUser.password, salt, (err, hash)=> {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user=> {
                                    req.flash('success_msg', 'You are now registered');
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }
            })
    }
});

// Login Handler
router.post('/login', (req, res, next)=> {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res, next)=> {
    req.logout(err=> {
        if(err){
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
})

module.exports = router;