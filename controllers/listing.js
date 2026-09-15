const listing=require("../models/listing")


async function getCoordinates(location, country) {
    const address = `${location}, ${country}`;

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
            headers: {
                "User-Agent": "Wanderlust-College-Project/1.0"
            }
        }
    );

    const data = await response.json();

    if (data.length === 0) {
        return null;
    }

    return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
    };
}


module.exports.index = async(req,res)=>{
    let allListings= await listing.find({});
    res.render("./listings/index.ejs",{allListings})
}

module.exports.renderNewForm = async(req,res)=>{
    let categories = listing.categories;

    res.render("listings/new.ejs", { categories });
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    //NESTED POPULATE
    const listings = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listings){
        req.flash("error","Listing you've requested for, Doesn't exist!");
        return res.redirect("/listings");
    }
    
    res.render("./listings/show.ejs",{listings,googleMapsApiKey:process.env.GOOGLE_MAPS_API_KEY})
}

module.exports.createListing = async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new expressError(400,result.error);
    // }

    // if(!req.body.listing){
    //     throw new expressError(400,"send valid data");
    // }
    let newListing=new listing(req.body.listing); // diff way of writing 
    //console.log(listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    const coordinates = await getCoordinates(
        newListing.location,
        newListing.country
    );

    if (coordinates) {
        newListing.geometry = coordinates;
    }

    // if(!newListing.description){
    //     throw new expressError(400,"description is required");
    // }
    // if(!newListing.location){
    //     throw new expressError(400,"location is required");
    // }
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}



module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listings = await listing.findById(id);
    if(!listings){
        req.flash("error","Listing you've requested for, Doesn't exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl=listings.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_300");
    res.render("./listings/edit.ejs",{listings});
}



module.exports.updateListing = async(req,res)=>{
    let{id}=req.params;

    let listings=await listing.findByIdAndUpdate(
        id,
        {...req.body.listing},
        { runValidators: true, new: true }
    );

    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listings.image={url,filename}
        await listings.save()
    }

    // GEOCODING
    const coordinates = await getCoordinates(
        listings.location,
        listings.country
    );

    if(coordinates){
        listings.geometry = coordinates;
        await listings.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect("/listings");
}

module.exports.categoryListing = async (req, res) => {

    let { category } = req.query;

    let allListings;

    if (category) {
        allListings = await listing.find({ category });

        if (allListings.length === 0) {
            req.flash("error", "No such category listing exists!!");
            return res.redirect("/listings");
        }
    } else {
        allListings = await listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
};

module.exports.destroyListing = async(req,res)=>{
    let{id}=req.params;
    let deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}