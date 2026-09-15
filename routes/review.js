const express=require("express");
const router = express.Router({ mergeParams: true });
const listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const review=require("../models/review.js");
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");


//review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;