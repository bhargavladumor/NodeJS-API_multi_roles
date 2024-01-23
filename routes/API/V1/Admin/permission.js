const express = require("express");
const routes = express.Router();
const adminController = require("../../../../controller/API/V1/Admin/adminController");
const Admin = require("../../../../model/Admin");
const passport = require("passport");
const Manager = require("../../../../model/Manager");

// Profile
routes.get("/profile", adminController.profile);

// Login Fail
routes.get("/loginFail",adminController.loginFail);

// Update Profile
routes.put("/updateData/:id",adminController.updateData);

// Get All Admin Data
routes.get("/allAdminData",adminController.allAdminData);

// Get All Manager Data
routes.get("/allManagerData",adminController.allManagerData);

// Get All User Data
routes.get("/allUserData",adminController.allUserData);

// Add Manager
routes.post("/addManager",Manager.uploadImage , adminController.addManager); 


module.exports = routes;