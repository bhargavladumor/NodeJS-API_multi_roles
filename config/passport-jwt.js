const passport = require('passport');
const Admin = require("../model/Admin");
const Manager = require("../model/Manager");

const jwtStrategy = require('passport-jwt').Strategy;
const jwtExtract = require('passport-jwt').ExtractJwt;

let opts = {
    jwtFromRequest :jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'adminToken'
}

let opts_manager = {
    jwtFromRequest :jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'managerToken'
}

passport.use(new jwtStrategy(opts , async function(record , done){
    let checkAdmin = await Admin.findById(record.admin._id);
    if(checkAdmin){
        return done(null,checkAdmin)
    }
    else{
        return done(null,false);
    }
}));

passport.use('manager',new jwtStrategy(opts_manager , async function(record , done){
    let checkAdmin = await Manager.findById(record.manager._id);
    if(checkAdmin){
        return done(null,checkAdmin)
    }
    else{
        return done(null,false);
    }
}))

passport.serializeUser(function(user,done){
    return done(null,user.id)
})

passport.deserializeUser(async function(id,done){
    let recheck = await Admin.findById(id);

    if(recheck){
        return done(null,recheck);
    }
    else{
        return done(null,false);
    }
})

module.exports = passport;