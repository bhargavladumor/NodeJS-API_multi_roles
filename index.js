const express = require("express");
const app = express();
const port = 8080;
const path = require('path');
const db = require("./config/db");
const session = require("express-session");

app.use(express.urlencoded());

const passport = require("passport");
const passportjwt = require("./config/passport-jwt");

app.use(session({
    name : "bhargav",
    secret : "admin",
    resave : false,
    saveUninitialized : false,
    cookie : { maxAge : 1000*60*10 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/admin" , require("./routes/API/V1/Admin/admin"));
app.use("/manager" , require("./routes/API/V1/Manager/manager"));
app.use("/user" , require("./routes/API/V1/User/user"));

app.listen(port,(err)=>{
    if(err) console.log("Something wrong");
    console.log(`App listen on port ${port}`);
})