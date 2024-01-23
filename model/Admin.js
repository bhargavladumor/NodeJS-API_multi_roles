const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const imagePath = "/uploads/admin";

const adminSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    hobby : {
        type : Array,
        required : true
    },
    adminImage : {
        type : String,
        required : true
    },
    managerIds : {
        type : Array,
        ref : "Manager"
    },
    isActive : {
        type : String,
        required : true
    },
    createdDate : {
        type : String,
        required : true
    },
    updatedDate : {
        type : String,
        required : true
    }
});

const imageStorage = multer.diskStorage({
    destination : async (req,file,cb) => {
        cb(null,path.join(__dirname,"..",imagePath));
    },
    filename : (req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }    
})

adminSchema.statics.uploadImage = multer({ storage : imageStorage }).single("adminImage");
adminSchema.statics.imagePath = imagePath;

const Admin = mongoose.model("Admin",adminSchema);

module.exports = Admin;