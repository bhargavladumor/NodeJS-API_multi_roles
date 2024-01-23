const express = require("express");
const routes = express.Router();
const managerController = require("../../../../controller/API/V1/Manager/managerController");
const Manager = require("../../../../model/Manager");
const passport = require("passport");

// Login Manager
routes.post("/login",managerController.login);

// Profile
routes.get("/profile",passport.authenticate('manager',{ failureRedirect: "/manager/loginFail" }),managerController.profile);

// Login Fail
routes.get("/loginFail",managerController.loginFail);

// Update Profile
routes.put("/updateData",passport.authenticate('manager',{ failureRedirect: "/manager/loginFail" }),managerController.updateData);

// All Users
routes.get("/viewAllUser",passport.authenticate('manager',{ failureRedirect: "/manager/loginFail" }),managerController.viewAllUser);

module.exports = routes;