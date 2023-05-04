const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Local User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done)=> {
            // Match User
            User.findOne({email: email})
                .then(user=> {
                    if(!user){
                        return done(null, false, {message: 'User not registered'})
                    }

                    // Match Password
                    bcrypt.compare(password, user.password, (err, isMatch)=> {
                        if(err) throw err;
                        if(isMatch){
                            return done(null, user);
                        }else{
                            return done(null, false, {message: 'Password Incorrect'})
                        }
                    })
                })
        })
    );

    passport.serializeUser((user, done)=> {
        done(null, user.id)
    });

    passport.deserializeUser((userid, done)=> {
        User.findById(userid)
            .then(user=> {
                done(null, user)
            }).catch(err=> done(err, false))
    })
}