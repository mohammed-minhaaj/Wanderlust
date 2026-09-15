const  mongoose = require("mongoose");
const review=require("./review.js");

const categories = [
    "Trending",
    "Rooms",
    "Iconic cities",
    "Mountains",
    "Castles",
    "Amazing pools",
    "Beaches",
    "Forests",
    "Camping",
    "Lakefront",
    "Tropical",
    "Skiing",
    "Cabins",
    "Country homes",
    "Homestays",
    "Hotels",
    "Luxury",
    "Hot tubs",
    "Waterfront",
    "Boats",
    "Caravans",
    "Historic",
    "Religious sites",
    "Scenic views",
    "Glamping",
    "Ski resorts",
    "Hiking",
    "Adventure",
    "Cozy stays",
    "Vineyards",
    "City stays",
    "Volcanoes",
    "Nature views"
]


const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },

    description:String,

    image: {
    url: {
        type: String,
    },
    filename:String,
},
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review",
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    geometry: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    },
    category:{
        type:String,
        enum : categories,
    }
})


// gets triggered when findbyidanddelete is called

listingSchema.post("findOneAndDelete",async(listing)=>{

    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}})
    }
    
})


let listing = mongoose.model("listing",listingSchema);
module.exports=listing;
module.exports.categories = categories;

