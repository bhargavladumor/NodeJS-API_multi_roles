const express = require("express");
const routes = express.Router();
const adminController = require("../../../../controller/API/V1/Admin/adminController");
const Admin = require("../../../../model/Admin");
const passport = require("passport");
const Manager = require("../../../../model/Manager");

// Register
routes.post("/register" ,Admin.uploadImage, adminController.register);

// Login
routes.post("/login",adminController.login);

routes.use("/",passport.authenticate("jwt", { failureRedirect: "/admin/loginFail" }),require("./permission"));

module.exports = routes;