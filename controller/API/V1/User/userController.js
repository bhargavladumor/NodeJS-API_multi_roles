const User = require("../../../../model/User");
const jwtUser = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register User
module.exports.register = async (req,res) => {
   
    try {
    
        if(req.body){
            let imgPath = "";
            if(req.file){
                imgPath = User.imagePath +"/"+ req.file.filename;
            }
            req.body.userImage = imgPath;
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            
            let checkMail = await User.findOne({email:req.body.email});
            if(!checkMail){
                if(req.body.password == req.body.cmpass){
                    req.body.password = await bcrypt.hash(req.body.password,10);
                    let addData = await User.create(req.body);
                    if(addData){
                        return res.status(200).json({msg : "User inserted",status : 1, data : addData});
                    }
                }
                else{
                    return res.status(400).json({msg : "Password does not matched",status : 0});
                }
            }
            else{
                return res.status(400).json({msg : "Email already exist",status : 0});
            }
    
        }
        else{
            return res.status(400).json({msg : "Data not found",status : 0});
        }
    
    
    } catch (error) {
        return res.status(400).json({msg : "Something wrong"+error,status : 0});
    }

}

// Login User
module.exports.login = async (req,res) => {
    try {
        
        let checkMail = await User.findOne({email : req.body.email});
        if(checkMail){
            if(await bcrypt.compare(req.body.password,checkMail.password)){
                let token = await jwtUser.sign({user : checkMail},'userToken',{expiresIn : '1h'});
                if(token){
                    return res.status(200).json({msg : "User logged in",token : token,status:1});
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

// User Profile

module.exports.profile = async (req,res) => {
    
    try {
        
        let userData = await User.findById(req.params.id);
        if(userData){
            return res.status(200).json({msg : "User profile", data : userData,status:1});
        }
        else{
            return res.status(400).json({msg : "Data not found",status:0});
        }

    } catch (error) {
        return res.status(400).json({msg : "Something wrong"+error,status:0});
    }

}

// Update User

module.exports.updateData = async (req,res) => {
    try {
        
        if(req.params.id){
            if(req.body){

                let adData = await User.findByIdAndUpdate(req.params.id,req.body);
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