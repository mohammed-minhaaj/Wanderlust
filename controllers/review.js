const listing=require("../models/listing")
const review=require("../models/review")

module.exports.createReview = async(req,res)=>{
    let listings=await listing.findById(req.params.id);
    
    let newReview=new review (req.body.review);
    console.log(req.body.review);
    newReview.author=req.user._id;
   
    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    //console.log("new review saved");
    //res.send("new review saved");
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listings.id}`);
}


module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}