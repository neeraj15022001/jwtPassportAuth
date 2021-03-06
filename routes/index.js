const express = require("express");
const router = express.Router();
const passport = require("passport");
const mainController = require("../controllers/mainController");
router.get("/", passport.authenticate("jwt", {session: false}), mainController.root);
router.post("/register",  mainController.createUser);
router.get("/profile", passport.authenticate("jwt", {session: false}), mainController.profile);
router.post("/login", passport.authenticate("local", {session: false}), mainController.login);
router.post("/token", mainController.token);
router.delete("/logout", mainController.logout);
module.exports = router;