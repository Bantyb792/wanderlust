const express = require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController= require("../controllers/listings.js");
const multer  = require('multer');
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage }); 


router.route("/")
.get( wrapAsync(listingController.index) )//index route
.post(isLoggedIn,
    upload.single("listing[image]"),validateListing,
    wrapAsync(listingController.createLisitng));//Create route

// //filters route
router.get("/filter/:type",async (req,res)=>{
    let {type}=req.params;
    const alllistings = await Listing.find({category:type});
    res.render("listings/filter.ejs",{alllistings});
});

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing) )  //show route
.put(isLoggedIn,isOwner, upload.single("listing[image]"), validateListing, 
    wrapAsync(listingController.updateListings))  //update route
.delete(isLoggedIn,isOwner,
    wrapAsync(listingController.destroyListing));  //delete route


//Edit route
router.get("/:id/edit",isLoggedIn,isOwner, 
    wrapAsync(listingController.renderEditForm) );

module.exports=router;