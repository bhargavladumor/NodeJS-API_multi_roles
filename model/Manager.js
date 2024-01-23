const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const imagePath = "/uploads/manager";

const managerSchema = mongoose.Schema({
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
    manImage : {
        type : String,
        required : true
    },
    adminId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Admin",
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

managerSchema.statics.uploadImage = multer({ storage : imageStorage }).single("manImage");
managerSchema.statics.imagePath = imagePath;

const Manager = mongoose.model("Manager",managerSchema);

module.exports = Manager;