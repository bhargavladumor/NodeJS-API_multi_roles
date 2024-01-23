const express = require("express");
const routes = express.Router();
const userController = require("../../../../controller/API/V1/User/userController");
const User = require("../../../../model/User");

// Register 
routes.post("/register", User.uploadImage,userController.register);

// Login User
routes.post("/login",userController.login);

// Profile
routes.get("/profile/:id",userController.profile);

// Update Profile
routes.put("/updateData/:id",userController.updateData);

module.exports = routes;