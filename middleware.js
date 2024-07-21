module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be loggedin to perform this task!")
        return res.redirect("/login");
    }
    next();
}