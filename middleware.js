const listing=require("./models/listing.js");
const review=require("./models/review.js");
const expressError=require("./utils/expressError.js");
const {reviewSchema,listingSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    //console.log(req.user);
    req.session.redirectUrl=req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in to create Listing");
        return res.redirect("/login");

    }
    next();
    
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listings=await listing.findById(id);
    if(! (res.locals.currUser && listings.owner._id.equals(res.locals.currUser._id))){
        req.flash("error","You are not the Owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=((req,res,next)=>{
    let {error}=listingSchema.validate(req.body);

    
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
})

module.exports.validateReview=((req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
})

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let reviews=await review.findById(reviewId);
    if(! (res.locals.currUser && reviews.author._id.equals(res.locals.currUser._id))){
        req.flash("error","You are not the Author of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();

}