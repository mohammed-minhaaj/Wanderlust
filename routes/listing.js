const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const {listingSchema}=require("../schema.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage });


router.route("/search")
.get(wrapAsync(listingController.searchListing)) 

router.route("/listings")
    .get(wrapAsync(listingController.index))

 

router.route("/")
.get(wrapAsync(listingController.categoryListing))
.post(isLoggedIn,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.createListing));

//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



// app.get("/testListing",async(req,res)=>{ 
//     let sampleListing = new listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"hyderabad",
//         country:"India",
//     })

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful");
// })

module.exports=router;