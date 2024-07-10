const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride = require("method-override");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

mongoUrl="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongoUrl);
};

app.get("/",(req,res)=>{
    res.send("connected");
});

// app.get("/testListing", async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"banty",
//         description:"hey there",
//         price:6000,
//         location:"Balsore",
//         country:"India"
//     });

//     await sampleListing.save();
//     await console.log("sample is saved");
//     res.send("successfull");   
// });

//index route
app.get("/listings",async (req,res)=>{
        const alllistings = await Listing.find({});
        res.render("listings/index.ejs",{alllistings});
});

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});

//newdata save route
app.post("/listings", async (req,res)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//show route
app.get("/listings/:id", async (req,res)=>{
      let {id}=req.params;
      const listing= await Listing.findById(id);
      res.render("listings/show.ejs",{listing});

});

//edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update route
app.put("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


app.listen(8080,()=>{
   console.log("app is listening");
});
