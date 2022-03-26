const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
passport.use(new LocalStrategy({usernameField: "email"},
    function (email, password, done) {
    console.log("Using Local Strategy" , email, password)
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: "Incorrect Email/Password"});
            }
            if (!user.password === password) {
                return done(null, false);
            }
            return done(null, user, {message: "Logged in Successfully"});
        });
    }
));
module.exports = passport;