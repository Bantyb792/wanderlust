const { model } = require("mongoose");
const Listing= require("../models/listing");

module.exports.index=(async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
});

module.exports.renderNewForm= (req,res)=>{
    res.render("listings/new.ejs")
};

module.exports.testing=(req,res)=>{
    res.send("helllo")
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },
     })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist! ");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

 module.exports.createLisitng = async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    
    const newListing= new Listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm= async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist! ");
        res.redirect("/listings");
        };
    let originalImageUrl= listing.image.url;
   originalImageUrl= originalImageUrl.replace ("/upload","/upload/h_300,w_250") ;  
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListings= async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Upadated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing= async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
};

