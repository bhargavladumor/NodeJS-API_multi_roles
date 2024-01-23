const Manager = require("../../../../model/Manager");
const User = require("../../../../model/User");
const jwtManager = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Login Manager 
module.exports.login = async (req,res) => {
    try {
        
        let checkMail = await Manager.findOne({email : req.body.email});
        if(checkMail){
            if(await bcrypt.compare(req.body.password,checkMail.password)){
                let token = await jwtManager.sign({manager : checkMail},'managerToken',{expiresIn : '1h'});
                if(token){
                    return res.status(200).json({msg : "Manager logged in",token : token,status:1});
                }   
            }
            else{
                return res.status(400).json({msg : "Password does not match",status:0});
            }
        }
        else{
            return res.status(400).json({msg : "Email not exist",status:0});
        }

    } catch (error) {
        return res.status(400).json({msg : "Something wrong"+error,status:0});
    }
}

// Login Fail
module.exports.loginFail = async (req,res) => {
    return res.status(400).json({msg : "Login failed",status : 0});
}

// Manager Profile

module.exports.profile = async (req,res) => {
    
    try {
        let userProfile = await Manager.findById(req.user.id).populate('adminId').exec();
        return res.status(200).json({msg : "Admin profile", data : userProfile,status:1});

    } catch (error) {
        return res.status(400).json({msg : "Something wrong"+error,status:0});
    }

}

// Update Manager

module.exports.updateData = async (req,res) => {
    try {
        
        if(req.user.id){
            if(req.body){

                let adData = await Manager.findByIdAndUpdate(req.user.id,req.body);
                if(adData){
                    return res.status(200).json({msg:"Data updated successfully",status : 1});
                }
                else{
                    return res.status(400).json({msg:"Data not updated",status : 0});
                }
            }
            else{
                return res.status(400).json({msg:"Data not found",status : 0});
            }
        }
        else{
            return res.status(400).json({msg:"Invalid data",status : 0});
        }


    } catch (error) {
        return res.status(400).json({msg:"Something wrong",status : 0});
    }
}

// View All Users
module.exports.viewAllUser = async (req,res) => {
    try {

        let allData = await User.find({});
        if(allData){
            return res.status(200).json({msg : "All User data",data : allData,status : 1});
        }
        else{
            return res.status(400).json({msg : "Data not found",status : 0});
        }
        
    } catch (error) {
        return res.status(400).json({msg : "Something wrong",status : 0});
    }
}