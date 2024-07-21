const express= require("express");
const router =express.Router();
const User= require("../models/user.js");
const passport= require("passport");

router.get("/signup",(req,res)=>{
    res.render("../views/users/signup.ejs");
});

router.post("/signup", async (req,res)=>{
    try{
        let{username,email,password} = req.body;
    const newUser= new User ({email,username});
    const registerdUser = await User.register(newUser,password);
    console.log(registerdUser);
    req.login(registerdUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderust");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
     passport.authenticate("local", {
        failureRedirect:"/login",
        failureFlash: true
    }),
        async (req,res)=>{
            let {username}=req.body;
            req.flash("success",`Welcome back ${username} :)`);
            res.redirect("/listings");
});

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out now");
        res.redirect("/listings");
    })
});

module.exports=router;