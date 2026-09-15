const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    }
})

console.log(typeof passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);


module.exports=mongoose.model("user",userSchema);