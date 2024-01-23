const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const imagePath = "/uploads/user";

const userSchema = mongoose.Schema({
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
    userImage : {
        type : String,
        required : true
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

userSchema.statics.uploadImage = multer({ storage : imageStorage }).single("userImage");
userSchema.statics.imagePath = imagePath;

const User = mongoose.model("User",userSchema);

module.exports = User;