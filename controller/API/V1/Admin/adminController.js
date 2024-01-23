const Admin = require("../../../../model/Admin");
const Manager = require("../../../../model/Manager");
const User = require("../../../../model/User");
const jwtAdmin = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Register
module.exports.register = async (req,res) => {
    
    try {

        if(req.body){
            let imgPath = "";
            if(req.file){
                imgPath = Admin.imagePath +"/"+ req.file.filename;
            }
            req.body.adminImage = imgPath;
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            
            let checkMail = await Admin.findOne({email:req.body.email});
            if(!checkMail){
                if(req.body.password == req.body.cmpass){
                    req.body.password = await bcrypt.hash(req.body.password,10);
                    let addData = await Admin.create(req.body);
                    if(addData){
                        return res.status(200).json({msg : "Admin inserted",status : 1, data : addData});
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
        return res.status(400).json({msg : "Something wrong",status : 0});
    }

}

// Login

module.exports.login = async (req,res) => {

    try {
        
        let checkMail = await Admin.findOne({email : req.body.email});
        if(checkMail){
            if(await bcrypt.compare(req.body.password,checkMail.password)){
                let token = await jwtAdmin.sign({admin : checkMail},'adminToken',{expiresIn : '1h'});
                if(token){
                    return res.status(200).json({msg : "Admin logged in",token : token,status:1});
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

// Profile
module.exports.profile = async (req,res) => {
    
    try {
        let adminProfile = await Admin.findById(req.user.id).populate('managerIds').exec();
        return res.status(200).json({msg : "Admin profile", data : adminProfile,status:1});

    } catch (error) {
        return res.status(400).json({msg : "Something wrong"+error,status:0});
    }

}

// Update Profile
module.exports.updateData = async (req,res) => {
    try {
        
        if(req.params.id){
            if(req.body){

                let adData = await Admin.findByIdAndUpdate(req.params.id,req.body);
                console.log(adData)
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

// Login Fail
module.exports.loginFail = async (req,res) => {
    return res.status(400).json({msg : "Login failed",status : 0});
}

// All Admin Data
module.exports.allAdminData = async (req,res) => {
    try {

        let allData = await Admin.find({});
        if(allData){
            return res.status(200).json({msg : "All Admin data",data : allData,status : 1});
        }
        else{
            return res.status(400).json({msg : "Data not found",status : 0});
        }
        
    } catch (error) {
        return res.status(400).json({msg : "Something wrong",status : 0});
    }
}

// All Manager Data
module.exports.allManagerData = async (req,res) => {
    try {

        let allData = await Manager.find({});
        if(allData){
            return res.status(200).json({msg : "All Manager data",data : allData,status : 1});
        }
        else{
            return res.status(400).json({msg : "Data not found",status : 0});
        }
        
    } catch (error) {
        return res.status(400).json({msg : "Something wrong",status : 0});
    }
}

// All User Data
module.exports.allUserData = async (req,res) => {
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

// Add Manager
module.exports.addManager = async (req,res) => {
    
    try {

        if(req.body){
            let imgPath = "";
            if(req.file){
                imgPath = Manager.imagePath +"/"+ req.file.filename;
            }
            req.body.manImage = imgPath;
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            
            let checkMail = await Manager.findOne({email:req.body.email});
            if(!checkMail){
                if(req.body.password == req.body.cmpass){

                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                          user: "bkladumor7@gmail.com",
                          pass: "ywdqcteljkeunfrq",
                        },
                      });

                      const info = await transporter.sendMail({
                        from: 'bkladumor7@gmail.com', // sender address
                        to: req.body.email, // list of receivers
                        subject: "Password", // Subject line
                        text: "password : ", // plain text body
                        html: `<b>Your email : ${req.body.email}</b><br><b>Your Password : ${req.body.password}</b>`, // html body
                      });

                    req.body.password = await bcrypt.hash(req.body.password,10);
                    req.body.adminId = req.user.id;
                    let addData = await Manager.create(req.body);
                    let adminData = await Admin.findById(req.user.id);
                    if(adminData){
                        adminData.managerIds.push(addData.id);
                        await Admin.findByIdAndUpdate(req.user.id,adminData);
                        if(addData){
                            return res.status(200).json({msg : "Manager inserted",status : 1, data : addData});
                        }
                    }
                    else{
                        return res.status(400).json({msg : "Admin not found",status : 0, data : addData});
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