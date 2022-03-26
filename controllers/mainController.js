const User = require('../models/User');
const jwt = require("jsonwebtoken");
const Token = require("../models/Token")

module.exports.root = (req, res, next) => {
    res.send("respond with a resource");
}

module.exports.profile = (req, res, next) => {
    res.send(req.user);
}
module.exports.createUser = async (req, res) => {
//Check if user already exist && if exist login user else create user and redirect to login page
    console.log(req.body)
    try {
        const userFromDb = await User.findOne(req.body);
        if (userFromDb) {
            return res.sendStatus(200);
        } else {
            //    User do not exist already
            const createdUser = await User.create(req.body);
            console.log(createdUser)
            if (createdUser) {
                console.log(createdUser)
            }
            return res.sendStatus(200);
        }
    } catch (e) {
        //Error while finding user or creating it
        console.log(e)
        return res.sendStatus(500);
    }
}
module.exports.token = async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    try {
        let tokenFromDb = await Token.findOne({token: refreshToken});
        //verify token
        if (tokenFromDb) {
            // extract details from token and issue a new token
            let newAccessToken = await jwt.verify(refreshToken, "NeerajRefreshJWT", (err, user) => {
                const newTokenUser = {
                    email: user.email,
                    password: user.password
                }
                const accessToken = jwt.sign(newTokenUser, 'NeerajJWT', {expiresIn: "30s"});
                return accessToken;
            })
            console.log("new access token ", newAccessToken)
            return res.json({accessToken: newAccessToken})
        } else {
            return res.sendStatus(401);
        }
    } catch (e) {
        return res.sendStatus(500);
    }
}
module.exports.login = async (req, res) => {
    console.log(req.user)
    const token = jwt.sign({email: req.user.email, password: req.user.password}, 'NeerajJWT', {expiresIn: "30s"});
    const refreshToken = jwt.sign({email: req.user.email, password: req.user.password}, 'NeerajRefreshJWT');
    try {
        let tokenCreated = await Token.create({token: refreshToken})
        if (tokenCreated) {
            return res.json({token: token, refreshToken: refreshToken})
        }
        return res.sendStatus(500);
    } catch (e) {
        return res.sendStatus(500);
    }
}

module.exports.logout = async (req, res) => {
    const refreshToken = req.body.token;
    try {
        let tokenFromDb = await Token.findOne({token: refreshToken});
        if(tokenFromDb) {
            await tokenFromDb.remove();
            return res.json(200);
        } else {
            return res.json(401);
        }
    } catch (e) {
        return res.json(500);
    }

}