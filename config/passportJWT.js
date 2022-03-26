const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../models/User");
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'NeerajJWT';
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("jwt payload", jwt_payload)
    User.findOne({email: jwt_payload.email}, function (err, user) {
        console.log("in JWT Strategy ", user)
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));
module.exports = passport;